var utils = require('./utils.js');
var consts = require('./consts.js');
var shapes = require('./shapes.js');
var views = require('./views.js');
var canvas = require('./canvas.js');
var inputs = require('./input.js');
var openers = require('./openers.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';
// import * as shapes from './shapes.js';
// import * as views from './views.js';
// import * as canvas from './canvas.js';
// import * as inputs from './input.js';
// import * as openers from './openers.js';
//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

/**
	Init game matrix
*/
var initMatrix = function(rowCount, columnCount) {
    var result = [];
    for (var i = 0; i < rowCount; i++) {
        var row = [];
        result.push(row);
        for (var j = 0; j < columnCount; j++) {
            row.push(0);
        }
    }
	
    return result;
};

/**
  Clear game matrix
*/
var clearMatrix = function(matrix) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = 0;
        }
    }
};


/**
	Check all full rows in game matrix
	return rows number array. eg: [18,19];
*/
var checkFullRows = function(matrix) {
    var rowNumbers = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = matrix[i];
        var full = true;
        for (var j = 0; j < row.length; j++) {
            full = full && row[j] !== 0;
        }
        if (full) {
            rowNumbers.push(i);
        }
    }

    return rowNumbers;
};

/**
	Remove one row from game matrix. 
	copy each previous row data to  next row  which row number less than row;
*/
var removeOneRow = function(matrix, row) {
    var colCount = matrix[0].length;
    for (var i = row; i >= 0; i--) {
        for (var j = 0; j < colCount; j++) {
            if (i > 0) {
                matrix[i][j] = matrix[i - 1][j];
            } else {
                matrix[i][j] = 0;
            }
        }
    }
};
/**
	Remove rows from game matrix by row numbers.
*/
var removeRows = function(matrix, rows) {
    for (var i in rows) {
        removeOneRow(matrix, rows[i]);
    }
};

/**
	Check game data to determin wether the  game is over
*/
var checkGameOver = function(matrix) {
    var firstRow = matrix[0];
    for (var i = 0; i < firstRow.length; i++) {
        if (firstRow[i] !== 0) {
            return true;
        };
    }
    return false;
};


/**
	Calculate  the extra rewards add to the score
*/
var calcRewards = function(rows, tspinType) {
	if(tspinType == 2)
		rows*=2+1;
    if (rows && rows.length > 1) {
        return Math.pow(2, rows.length - 1) * 100;
    }
    return 0;
};

/**
	Calculate game score
*/
var calcScore = function(rows) {
    if (rows && rows.length) {
        return rows.length * 100;
    }
    return 0;
};

/**
	Calculate time interval by level, the higher the level,the faster shape moves
*/
var calcIntervalByLevel = function(level) {
    return consts.DEFAULT_INTERVAL - (level - 1) * 60;
};


// Default max scene size
var defaults = {
    maxHeight: 700,
    maxWidth: 560
};

/**
	Tetris main object definition
*/
function Tetris(id) {
    this.id = id;
    this.init();
}

Tetris.prototype = {

    init: function(options) {
		
		// this gameStates = {"
		// this.state = 
        var cfg = this.config = utils.extend(options, defaults);
        this.interval = consts.DEFAULT_INTERVAL;


        views.init(this.id, cfg.maxWidth, cfg.maxHeight);
        canvas.init(views.scene, views.preview, views.hold);
		inputs.init();
		this.createSettings();
		// if true no openers.  just random tetrinos
		this.isFreePlay = true;
		this.isTimerOn = false;
		this.currentOpener = 0;
		this.doTest = false;
        this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT);
		this.eventTimer = new Date();
		this.debugTimer = new Date();
		this.gamepadEnabled = false;
        this.reset();
        
		this._initEvents();
        this._fireShape();

    },
	toggleTimer: function() {
		document.getElementById("Timer").value = (this.isTimerOn = !this.isTimerOn) ? "Seconds:" : "Timer Off";
	},
	toggleGamepad: function(){
		document.getElementById("enablegamepad").value = ((this.gamepadEnabled = !this.gamepadEnabled) ? "Disable Gamepad" : "Enable Gamepad");
	},
	setFreePlay: function()
	{
		document.getElementById("Timer").value = "Timer Off";
		document.getElementById("Time").value = "";
		document.getElementById("besttime").value = "";
		this.isTimerOn = false;
		this.isFreePlay = true;
		this.doTest = false;
		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this._restartHandler();
		this.currentOpener = 0;

	},
	setCurrentOpener(opener)
	{
		document.getElementById("besttime").value = "";
		this.isFreePlay = false;
		this.doTest = false;
		this.currentOpener = opener;
		this._restartHandler();

	},
	setDoTest: function()
	{
		if(this.isFreePlay) return;
		this.doTest = true;
		this._restartHandler();
	},
	createSettings: function () {
		var list = document.getElementById("settings");
		var settings = inputs.settingsList;
		
		settings.forEach(function(item) {
			var option = document.createElement('option');
	
			option.text = item;
			option.id = item;

			list.add(option);
		});
	},
	updateSettingTextBox: function() {
		document.getElementById("setting_value").value = 
		inputs.settingsMap.get(inputs.settingsList[document.getElementById("settings").selectedIndex-1]);
		
		//inputs.settingsDefault[document.getElementById("settings").selectedIndex-1];
		
	},
	setSettings: function() {
		var newVal = document.getElementById("setting_value").value;
		var key = inputs.settingsList[document.getElementById("settings").selectedIndex-1];
		utils.setCookie(key, newVal, 30);
		inputs.settingsMap.set(key, newVal);
	},
    //Reset game
    reset: function() {
		this.numlefts = 0;
        this.running = false;
        this.isGameOver = false;
        this.level = 1;
        this.score = 0;
		this.lines = 0;
		// beginning of frame
        this.startTime =  new Date().getTime();
        this.currentTime = this.startTime;
        this.prevTime = this.startTime;
		this.sequencePrevTime = this.startTime;
		//todo:get rid of extra
        this.levelTime = this.startTime;
		this.prevInputTime = this.startTime;
		// current tetrino index gets set to 0 at the end of opener sequence
		this.currentMinoInx = 0;
		this.shapeQueue = [];
		this.hintQueue = [];
		this.holdStack = [];
		// gets set to false after mino has been popped from hold stack; set back to true on mino dropped
		this.canPopFromHoldStack = false;
		// manipulation counter for srs extended piece lockdown
		this.manipulationCounter = 0;
		// timer for srs extened piece lockdown
		this.lockdownTimer = 0;
		this.landed = false;
		this.isSequenceCompleted = false;
		
        clearMatrix(this.matrix);
        views.setLevel(this.level);
        views.setScore(this.score);
        views.setGameOver(this.isGameOver);
		openers.reset();
		shapes.resetMinoRNG();
		
        this._draw();
    },
    //Start game
    start: function() {
        this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh, this));

    },
    //Pause game
    pause: function() {
        this.running = false;
        this.currentTime =  new Date().getTime();
        this.prevTime = this.currentTime;
    },
	pushHoldStack: function()
	{
		if(this.holdStack.length < 4) {
			this.holdStack.push(utils.deepClone(this.shape));
			this.shape = this.shapeQueue.shift();
			this.canPopFromHoldStack = false;
			this.shape.resetOrigin();
			this._draw(); 
		}
	},
	popHoldStack: function()
	{
		if(this.holdStack.length >= 1 && this.canPopFromHoldStack)
		{
			this.canPopFromHoldStack = false;
			this.shapeQueue.unshift(utils.deepClone(this.shape));
			this.shape = this.holdStack.pop();
			this.shape.resetOrigin();
			this._draw();
		}
	},

    // Restart game
    _restartHandler: function() {
        this.reset();
        this.start();
		this._fireShape();
    },
    // Bind game events
    _initEvents: function() {
		setInterval(() => {this._processTick();}, 1);
		setInterval(() => {this.lockDownTimer++;}, 100 );
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },

    // Fill next queue and set next shape
    _fireShape: function() {
		if(this.isFreePlay == false) {
			while(this.shapeQueue.length <= 4)
			{
				this.preparedShape = openers.getNextMino(this.currentOpener);
				this.shapeQueue.push(this.preparedShape);
			}
			while(this.hintQueue.length <= 4)
			{
				this.preparedShape = openers.getNextHint(this.currentOpener);
				this.hintQueue.push(this.preparedShape);
			}
			
			this.hintMino = this.hintQueue.shift();
			this.shape = this.shapeQueue.shift();
		   
		   this.currentMinoInx++;
				
		   //  Opener sequence completed
			if(this.currentMinoInx > openers.getLength()) {
				if(this.isTimerOn) {
					var besttime = document.getElementById("besttime").value;
					var deltaTime = new Date().getTime() - this.sequencePrevTime;
					if(besttime == "" || deltaTime/1000.0 < parseFloat(besttime)) {	
						document.getElementById("besttime").value = (deltaTime/1000.0).toString();
					}
					this.isSequenceCompleted = true;
					
				}				
				this.hintQueue = [];
				this.shapeQueue = [];

				// Recursion warning
				this._restartHandler();
			}
		} else {
			while(this.shapeQueue.length <= 4)
			{
				this.preparedShape = shapes.randomShape();
				this.shapeQueue.push(this.preparedShape);
			}
			
			this.shape = this.shapeQueue.shift();// || shapes.randomShape();
			this.currentMinoInx++;
		}
		
		//todo:should be in shapes.js
		this.landed = false;
		this.manipulationCounter = 0;
		// Reset matrix at successful end of opener
		//if(this.shapeQueue.length == openers.length) {
		//	this.matrix = [];
		//	new Audio("Tetris.ogg");
		//}
		
		this._draw();
        
    },
	// lockdown timer with centisecond resolution
	resetLockdown: function() {

		if(this.shape.canDown(this.matrix) == false)	
			this.landed = true;
			
		this.lockDownTimer = 0;
		
		if(this.landed)
			this.manipulationCounter++;		
	},
	// Return if the piece can be shifted or rotated
	isPieceLocked: function() {
		
		if(this.manipulationCounter > 15) return true;
		if(this.lockDownTimer >= 5) return true;
		
		return false;
	},
    // Draw game data
    _draw: function() {
        canvas.drawScene();
        canvas.drawShape(this.shape);
		canvas.drawHoldShape(this.holdStack);
		canvas.drawPreviewShape(this.shapeQueue);
		if(this.doTest != true)
			canvas.drawHintShape(this.hintMino);
		
		if(this.shape != undefined) {
		let clone = Object.assign(Object.create(Object.getPrototypeOf(this.shape)), this.shape);
		
		var bottomY = clone.bottomAt(this.matrix);
		canvas.drawGhostShape(clone, bottomY);
		}
        canvas.drawMatrix(this.matrix);


    },
	// tick input data -- wont have better than 4-15ms resolution since javascript is single theaded
	_processTick: async function() {
	
	
		//var deltaTime = (new Date()).getTime() - this.eventTimer.getTime();
		//console.log("desync time: " + deltaTime);	


		
		
		inputs.incDeciframes();
		inputs.incTickCounter();
	
		if(this.isTimerOn) {
			var deltaPlayTime = new Date().getTime() - this.sequencePrevTime;
			
			if(inputs.getTickCounter() >= 20) { // Set html element at a reasonble rate
				document.getElementById("Time").value = (deltaPlayTime/1000).toString();
			}
		}
		
		
		// Don't process game related events if game over
		if(this.isGameOver) return;
		
		
		
		if(this.gamepadEnabled && inputs.gamepadEnabled()) {
			var tenthOfFrame = 1.0  //1.6; // 1.6ms = 1 fram
			var halfFrame = 5.0		//8.0;
			var halfFramePlus = 10.0;
			
			if(inputs.getTickCounter() >= tenthOfFrame) {
				inputs.updateGamepad();
				inputs.processGamepadDPad();
				inputs.processGamepadInput();
			}
			// drain gamepad queue
			if( inputs.getTickCounter() > halfFrame)  // 8 millisecons
			{
				while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
					var curkey = inputs.gamepadQueue.shift();
					if(curkey == "DPad-Left") {
						this.shape.goLeft(this.matrix);
						this.resetLockdown();
						this._draw();
					}
					if(curkey == "DPad-Right") {
						this.shape.goRight(this.matrix);
						this.resetLockdown();
						this._draw();
					}
					if(curkey == "A") {
						this.rotationCounter++;
						this.shape.rotate(this.matrix);
						this.resetLockdown();
						this._draw();
					}
					if(curkey == "B") {
						this.rotationCounter++;
						this.shape.rotateClockwise(this.matrix);
						this.resetLockdown();
						this._draw();
					}
					if(curkey == "DPad-Down") {
						 this.shape.goDown(this.matrix);
						 this._draw();
					}
					if(curkey == "RB") {
						this.shape.goBottom(this.matrix);
						this.lockDownTimer = 5000;
						this._update();
					}
					if(curkey == "LB") {
						this.pushHoldStack();
						this._draw();
					}				
					if(curkey == "DPad-Up") {
						this.popHoldStack();
						this._draw();
					}
					if(curkey == "Back") {
						this._restartHandler();
						return;
					}
				}
				
				inputs.gamepadQueue = [];
			}
			//inputs.gamepadButtonClear();
		}
		
		
		// Do keyboard
		inputs.processKeys();
		
			inputs.processKeyShift();
			// Keyboard inputs
			while((inputs.inputQueue != undefined && inputs.inputQueue.length >= 1)){
				var curkey = inputs.inputQueue.shift();
				if(curkey == 37) {
					this.debugTimer = new Date();
					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 39){
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 40) {
					
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				if(curkey == 90) {
					this.rotationCounter++;
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 88){
					this.rotationCounter++;
					this.shape.rotateClockwise(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				if(curkey == 32) {
					this.shape.goBottom(this.matrix);
					this.lockDownTimer = 5000;
					this._update();
				}
				if(curkey == 16) {
					this.pushHoldStack();
					this._draw();
				}
				if(curkey == 17 || curkey == 67) {
					this.popHoldStack();
					this._draw();
				}
				if(curkey == 81) {
					if(document.getElementById("divbg").style.display == "none")
						document.getElementById("divbg").style.display =  "initial";
					else
						document.getElementById("divbg").style.display="none";
				}
				if(curkey == 82) {
					this._restartHandler();
					return;
				}
					
			}
			inputs.inputQueue = [];
		
		
			inputs.saveKeyboardKeys();

			inputs.saveButtons();
	},		
    // Refresh game canvas
    _refresh: function() {
		if (!this.running) 
            return;
        
		this.currentTime =  new Date().getTime();
		var deltaLevelTime = this.currentTime - this.prevTime;
        if (deltaLevelTime > this.interval) {  //  every .6 seconds?
            this._update();
            this._checkLevel(this.prevTime = this.currentTime);
        }
		
		// Draw Frame
        if (!this.isGameOver) {
            window.requestAnimationFrame(utils.proxy(this._refresh, this));
        }
    },
	// check if the current piece is in the same location as the hint piece
	_checkHint: function() {
		
		if(this.isFreePlay)
			return;
		if(!this.shape.isSameSRS(this.hintMino))
		{
			//new Audio('./dist/Failed.ogg').play();
			this._restartHandler();
			// Restart
			return 1;
		}
	},
    // Update game data
    _update: function() {
		
        if (this.shape.canDown(this.matrix)) {
            this.shape.goDown(this.matrix);
        } else if(this.isPieceLocked()){
			this.canPopFromHoldStack = true;
            this.shape.copyTo(this.matrix);
            this._check();
			if(this._checkHint()) return;
            this._fireShape();
			 new Audio('./dist/Blop2.ogg').play();
        }
        this._draw();
        this.isGameOver = checkGameOver(this.matrix);
        views.setGameOver(this.isGameOver);
		
        if (this.isGameOver) 
            views.setFinalScore(this.score);

    },
	// 0 - none, 1 - mini, 2 - tspin
	_tSpinType: function(tPiece, matrix) {
		
		var side1 = 0;
		var side2 = 0;
		var side3 = 0;
		var side4 = 0;
		
		side1X = tPiece.x;
		side1Y = tPiece.y;
		side2X = tPiece.x + 2;
		side2Y = tPiece.y;
		side3X = tPiece.x;
		side3Y = tPiece.y + 2;
		side4X = tPiece.x + 2;
		side4Y = tPiece.y + 2;
		
		if(matrix[side1Y][side1X] != 0)
			side1 = 1;
		if(matrix[side2Y][side2X] != 0)
			side2 = 1;
		// TODO: figure out why this occasionally  is undefined
		if(matrix[side3Y] != undefined && matrix[side3Y][side3X] != 0)
			side3 = 1;
		if(matrix[side4Y][side4X] != 0)
			side4 = 1;
		
		console.log("sides: " + side1+side2+side3+side4);
		// if Sides A and B + (C or D) are touching a Surface
		//considered a T-Spin
		if((side1+side2+side3+side4) >= 3)
			return 2;
		
		//if Sides C and D + (A or B) are touching a Surface
		//considered a Mini T-Spin
		if((side1 || side2) && (side3 && side4))
			return 1;
		
		return 0;
	},
    // Check and update game data
    _check: function() {
        var rows = checkFullRows(this.matrix);
        if (rows.length) {
			var tspinType;
			
			if(this.shape.flag === 'T')
				tspinType = this._tSpinType(this.shape, this.matrix);
			
            removeRows(this.matrix, rows);

			console.log("type: " + tspinType);
            var score = calcScore(rows);
            var reward = calcRewards(rows, tspinType);
            this.score += score + reward;
			this.lines += rows.length;
			
            views.setScore(this.score);
            views.setReward(reward);
			views.setLines(this.lines);

        }
    },
    // Check and update game level
    _checkLevel: function() {
        var currentTime = new Date().getTime();
        if (currentTime - this.levelTime > consts.LEVEL_INTERVAL) {
            this.level += 1;
            this.interval = calcIntervalByLevel(this.level);
            views.setLevel(this.level);
            this.levelTime = currentTime;
        }
    }
}


window.Tetris = Tetris;
// export {Tetris};