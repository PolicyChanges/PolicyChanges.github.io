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
		//document.getElementById("pco").style.visibility = "hidden";
		
        var cfg = this.config = utils.extend(options, defaults);
        this.interval = consts.DEFAULT_INTERVAL;
		
        views.init(this.id, cfg.maxWidth, cfg.maxHeight);
        canvas.init(views.scene, views.preview, views.hold);
		inputs.init();
		this.createSettings();
		
		// if true no openers.  just random tetrinos
		this.gameState = consts.DEFAULT_GAMESTATE;

		this.isPaused = false;
		this.isTimerOn = false;
		this.currentOpener = 0;
        this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT);
		this.eventTimer = new Date();
		this.debugTimer = new Date();
		this.gamepadEnabled = false;
        this.reset();
        
		this._initEvents();
        //this._fireShape();
		// ewww
		this._recurseGameState();

    },
	toggleTimer: function() {
		document.getElementById("Timer").value = (this.isTimerOn = !this.isTimerOn) ? "Seconds:" : "Timer Off";
	},
	toggleGamepad: function(){
		document.getElementById("enablegamepad").value = ((this.gamepadEnabled = !this.gamepadEnabled) ? "Disable Gamepad" : "Enable Gamepad");
	},
	togglePCO: function (){
		this.isPCOActive = !this.isPCOActive;
		//document.getElementById("nonPCO").style.visibility = !this.isPCOActive ? "visible" : "hidden";
		//document.getElementById("pco").style.visibility = this.isPCOActive ? "visible" : "hidden";
		//document.getElementById("pco").style.display = ((this.isPCOActive = !this.isPCOActive) ? "none" : "");
	},
	// Gamestate 1
	setFreePlay: function()
	{
		
		this.gameState = consts.GAMESTATES[0];
		
		document.getElementById("Timer").value = "Timer Off";
		document.getElementById("Time").value = "";
		document.getElementById("besttime").value = "";
		this.isTimerOn = false;

		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this._restartHandler();
		this.currentOpener = 0;

	},
	// Gamestate 2
	setCurrentOpener(opener)
	{
		document.getElementById("besttime").value = "";
		
		this.gameState = consts.GAMESTATES[1];
		this.currentOpener = opener;
		this._restartHandler();

	},
	// Gamestate 3
	setDoTest: function()
	{

		if(this.gameState != consts.GAMESTATES[1]) return;
		
		// set game state to do test
		this.gameState = consts.GAMESTATES[2];
		
		this._restartHandler();
	},
	// Gamestate 4
	setGameStateSequenceEditor: function()
	{
		//document.getElementById("side").display = "none";
		
		// change to editor gamestate
		this.gameState = consts.GAMESTATES[3];
		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this._restartHandler();
		this.currentOpener = 0;
		this.pushHoldStack();
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
		// var setting = inputs.settingsList[document.getElementById("settings").selectedIndex-1];
		// var doKeyToAlpha = inputs.keyboardShiftEvents.included(setting) || inputs.keyboardKeyEvents.included(setting);
		
		// if(doKeyToAlpha) 
			// document.getElementById("setting_value").value = inputs.settingsMap.get(setting).fromCharCode();
		// else
			// document.getElementById("setting_value").value = inputs.settingsMap.get(setting);
		
		document.getElementById("setting_value").value = 
		inputs.settingsMap.get(inputs.settingsList[document.getElementById("settings").selectedIndex-1]);
		
		
	},
	addOpener: function() {

		var newOpener = document.createElement('li');
		//<li style="font-size:12px;padding-left:1em";><a href="#" id="setMrTSpinsSTDreversedVar">Mr. T-Spin's STD (reversed) </a></li>
		//newOpener.text = "New Sequence";
		//newOpener.id = this.currentMinoInx;
		newOpener.style="color:powderblue;text-decoration:underline;font-size:12px;padding-left:1em";
		
		
		newOpener.appendChild(document.createTextNode("New Sequence: " + this.currentMinoInx));
		document.getElementById("Openers").appendChild(newOpener);
		
		
		
		// Print Sequence Data to console
		// console.log("this.hintQueue = new Array(");
		// this.shapeQueue.slice().reverse().forEach( function(shape, idx, arr) { console.log("shapes.getShape("+shape.nType()+ ((idx === arr.length-1) ? "));" : "),") ); } );

		
		 var shapes = [];
		 this.shapeQueue.slice().reverse().forEach( function(shape, idx) {  shapes.push(shape.x); shapes.push(shape.y); shapes.push(shape.state); } );
		
		// console.log("var hintDataList = [" + shapes.join(",") + "];");
		// console.log("this.createHintQueue(hintDataList);");
		
		var sequenceCode = [];
		
		var shapeArrayStr = [];
		this.shapeQueue.slice().reverse().forEach( function(shape, idx, arr) { shapeArrayStr += "shapes.getShape("+shape.nType() + ((idx === arr.length-1) ? "));" : "), ") } );
		sequenceCode += "case :\n\tthis.shapeQueue = new Array(" + shapeArrayStr + "\nbreak;" + "\n\n";
		
		sequenceCode += "case :\n\tthis.hintQueue = new Array(" + shapeArrayStr;
		sequenceCode += "\n\nvar hintDataList = [" + shapes.join(",") + "];" + "\nthis.createHintQueue(hintDataList);" + "\nbreak;";
		
		prompt("Generated Code:", sequenceCode);
		
		
		//openers.addSequence(this.shapeQueue);
		//this.setFreePlay();
		 //this.gameState = consts.GAMESTATES[1];
		 this.currentMinoInx = 0;
		//this.setCurrentOpener(99999);//this.currentMinoInx);
		 clearMatrix(this.matrix);
		 this.currentOpener = 9999;
		 this.shapeQueue = [];
		 this.hintQueue = [];
		 //this._recurseGameState();
	},
	setSettings: function() {  // TODO rename to init
		var newVal = document.getElementById("setting_value").value;
		var key = inputs.settingsList[document.getElementById("settings").selectedIndex-1];
		utils.setCookie(key, newVal, 30);
		inputs.settingsMap.set(key, newVal);
	},
    //Reset game
    reset: function() {
		this.pause = false;
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
		this.shape = shapes.getShape(0);
		// gets set to false after mino has been popped from hold stack; set back to true on mino dropped
		this.canPopFromHoldStack = false;
		// manipulation counter for srs extended piece lockdown
		this.manipulationCounter = 0;
		// timer for srs extened piece lockdown
		this.lockdownTimer = 5000;
		this.isPCOActive = false;
		this.landed = false;
		this.isSequenceCompleted = false;
		this.traditionalHold = true;
		this.isHolding = false;
		
        clearMatrix(this.matrix);
        views.setLevel(this.level);
        views.setScore(this.score);
        views.setGameOver(this.gameState == consts.GAMESTATES[0] && this.isGameOver);
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
    /*pause: function() {
        this.running = false;
        this.currentTime =  new Date().getTime();
        this.prevTime = this.currentTime;
    },*/
	pushHoldStack: function()
	{
		if(this.gameState == consts.GAMESTATES[3]) {
			while(this.holdStack.length < 7)
				this.holdStack.unshift(utils.deepClone(shapes.getShape(this.currentMinoInx++%7)));
			this.shape = this.holdStack.pop();
			this._draw();
			return;
		}

		// 4 shape hold queue
		if(this.holdStack.length < 4) {
			this.holdStack.push(shapes.getShape(this.shape.nType()));
			this.shape = this.shapeQueue.shift();
			this.canPopFromHoldStack = false;
		}
	},
	popHoldStack: function()
	{
		if(this.gameState == consts.GAMESTATES[3]) {
			if(this.holdStack.length < 7)
				while(this.holdStack.length < 7)
					this.holdStack.unshift(utils.deepClone(shapes.getShape(this.currentMinoInx++%7)));
			// piece needs to be able to be placed
			if(this.shape.canDown(this.matrix)) return;
			this.shape.copyTo(this.matrix);
			this.shapeQueue.unshift(utils.deepClone(this.shape));
			this.shape = utils.deepClone(this.holdStack.pop());
			this._check();
			this._draw();
			return;
		}
		// todo: disable if 1 shape hold queue
		if(this.holdStack.length >= 1 && this.canPopFromHoldStack)
		{
			this.canPopFromHoldStack = false;
			this.shapeQueue.unshift(shapes.getShape(this.shape.nType()));//utils.deepClone(this.shape));
			this.shape = this.holdStack.pop();
		}
	},

    // Restart game
    _restartHandler: function() {
        this.reset();
        this.start();
		this._recurseGameState();
    },
    // Bind game events
    _initEvents: function() {
		setInterval(() => {this._processTick();}, 1);
		//setInterval(() => {this.lockDownTimer++;}, 2 );
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },
	// Process freeplay queue
	_processFreeplayQueue: function() {
		 while(this.shapeQueue.length <= 4)
		 {
			 this.preparedShape = shapes.randomShape();
			 this.shapeQueue.push(this.preparedShape);
		 }
		
		 this.shape = this.shapeQueue.shift(); //|| shapes.randomShape();
		
		//T S Z J I  O L
		//this.shapeMap = [3,5,2,4,6,1,0];
		
		//while(this.shapeQueue.length <= 7)
		//{
		//	this.prepareShape = shapes.getShape(this.shapeMap[this.currentMinoInx++%7]);
		//	this.shapeQueue.push(this.prepareShape);
		//}
		//this.shape = this.shapeQueue.shift();
		
		this.currentMinoInx++;
	},
	// Process opener trainer queue
	_processOpenerTrainerQueue: function() {
		while(this.shapeQueue.length <= 4)
		{
			this.preparedShape = utils.deepClone(openers.getNextMino(this.currentOpener));
			this.shapeQueue.push(this.preparedShape);
		}
		while(this.hintQueue.length <= 4)
		{
			this.preparedShape = utils.deepClone(openers.getNextHint(this.currentOpener));
			this.hintQueue.push(this.preparedShape);
		}
		
		this.hintMino = this.hintQueue.shift();
		this.shape = this.shapeQueue.shift();
	   
	   this.currentMinoInx++;
			
	   //  Opener sequence completed
		if(this.currentMinoInx > openers.getLength()) {
			//new Audio("./dist/sound/horse1.ogg").play();
			if(this.isTimerOn) {
				var besttime = document.getElementById("besttime").value;
				var deltaTime = new Date().getTime() - this.sequencePrevTime;
				if(besttime == "" || deltaTime/1000.0 < parseFloat(besttime)) {	
					document.getElementById("besttime").value = (deltaTime/1000.0).toString();
				}
			}	
		
			this.hintQueue = [];
			this.shapeQueue = [];

			this.isSequenceCompleted = true;
			
			// Recursion warning
			if(this.currentOpener < 1000/*magic num*/)			// getting real hacky
				this._restartHandler();
			else clearMatrix(this.matrix);

			return;
		}
	},
    // Process sequence editor
	_processSequenceEditor: function () {
		return;
	},
	
	// Fill next queue and set next shape
    _fireShape: function() {
		//todo:should be in shapes.js
		this.landed = false;
		this.manipulationCounter = 0;

		this._draw();
		
        
    },
	_recurseGameState: function (){
		switch(this.gameState) {
		case consts.GAMESTATES[0]:				// Free play
			this._processFreeplayQueue();
			this._fireShape();
			break;
		case consts.GAMESTATES[1]:				// Trainer
				this._processOpenerTrainerQueue();
				this._fireShape();
				break;
			
		case consts.GAMESTATES[2]:				// Test
			this._processOpenerTrainerQueue();
			this._fireShape();
		case consts.GAMESTATES[3]:				// Sequence Test
			this._processSequenceEditor();
			break;
		
		default:
			break;
		}
	},
	// lockdown timer with centisecond resolution
	resetLockdown: function() {

		if(this.landed == false && this.shape.canDown(this.matrix) == false) {	
			this.landed = true;
			this.manipulationCounter = 0;
		}
			
		if(this.manipulationCounter < 15)
			this.lockDownTimer = 0;
		
		if(this.landed)
			//if(UserInput.isPreDelayAutoShiftKeyboardKeyPressed() == false)
				this.manipulationCounter++;		
	},
	// Return if the piece can be shifted or rotated
	isPieceLocked: function() {
		// lock down after 3000 = 3 seconds
		if(this.lockDownTimer >= parseInt(inputs.settingsMap.get("Lockdown Timer"))) {return true;}
		
		return false;
	},
    // Draw game data
    _draw: function() {
		if(this.isPaused)
			return;
        canvas.drawScene();
        canvas.drawShape(this.shape);
		canvas.drawHoldShape(this.holdStack);
		canvas.drawPreviewShape(this.shapeQueue);
		if(this.gameState != consts.GAMESTATES[2]) // || this.gameState != consts.GAMESTATES[4] quiz mode
			canvas.drawHintShape(this.hintMino);
		
		if(this.shape != undefined) {
		let clone = Object.assign(Object.create(Object.getPrototypeOf(this.shape)), this.shape);
		
		var bottomY = clone.bottomAt(this.matrix);
		canvas.drawGhostShape(clone, bottomY);
		}
        canvas.drawMatrix(this.matrix);


    },
	
	// tick input data -- wont have better than 4-15ms resolution since javascript is single theaded and any ARR or DAS below 15ms will likely be broken
	_processTick: async function() {
		this.lockDownTimer++;
	
		if(this.isTimerOn) {
			var deltaPlayTime = new Date().getTime() - this.sequencePrevTime;
			document.getElementById("Time").value = (deltaPlayTime/1000).toString();
			
		}
		
		// Don't process game related events if game over
		if(this.isGameOver) return;
		
		
		
		if(this.gamepadEnabled && inputs.gamepadEnabled()) {
			inputs.updateGamepad();
			inputs.processGamepadDPad();
			inputs.processGamepadInput();
			
			while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
				var curkey = inputs.gamepadQueue.shift();
				if(inputs.settingsMap.get("Gamepad Left").includes(curkey)) {
					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Right").includes(curkey)) {
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Rotateccw").includes(curkey)) {
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Rotate").includes(curkey)) {
					this.shape.rotateClockwise(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Down").includes(curkey)) {
					 this.shape.goDown(this.matrix);
					 this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Harddrop").includes(curkey)) {
					// if editor
					if(this.gameState == consts.GAMESTATES[3]) {
						this.popHoldStack();
						this._draw();
					}else {
					this.shape.goBottom(this.matrix);
					this.lockDownTimer = 5000;  // Currently at 5 seconds
					this._update();
					}
				}
				else if(inputs.settingsMap.get("Gamepad Hold").includes(curkey)) {
					this.pushHoldStack();
					this._draw();
				}				
				else if(inputs.settingsMap.get("Gamepad Pophold").includes(curkey)) {
					//this.popHoldStack();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Reset").includes(curkey)) {
					this._restartHandler();
					return;
				}
			}
			inputs.saveButtons();
			inputs.gamepadClear();
		}
		
		
			// Do keyboard
			inputs.processKeys();
			inputs.processKeyShift();
			// Keyboard inputs
			while((inputs.inputQueue != undefined && inputs.inputQueue.length >= 1)){
				var curkey = inputs.inputQueue.shift();
				if(inputs.settingsMap.get("Keyboard Left").includes(curkey)) {
					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Right").includes(curkey)) {
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Down").includes(curkey)) {
					
					 this.shape.goDown(this.matrix);
					 this.resetLockdown();
					 this._draw();
				}
				else if(this.gameState == consts.GAMESTATES[3] && inputs.settingsMap.get("Keyboard Up").includes(curkey)) {
					
					 this.shape.goUp(this.matrix);
					 this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Rotateccw").includes(curkey)) {
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Rotate").includes(curkey)) {
					this.shape.rotateClockwise(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Harddrop").includes(curkey)) {
					// if editor
					if(this.gameState == consts.GAMESTATES[3]) {
						this.popHoldStack();
						this._draw();
					}else {
						this.shape.goBottom(this.matrix);
						this.lockDownTimer = 5000;
						this._update();
					}
				}
				else if(inputs.settingsMap.get("Keyboard Hold").includes(curkey)) {
					if(this.traditionalHold == true) {
						if(this.isHolding && this.canPopFromHoldStack) 
							this.popHoldStack();
						else if(this.holdStack.length < 1)
							this.pushHoldStack();
						this.isHolding = !this.isHolding;
					} else 
						this.pushHoldStack();
					
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Pophold").includes(curkey)) {
					this.popHoldStack();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Hold").includes(curkey)) {//something got goofd here
					if(document.getElementById("divbg").style.display == "none")
						document.getElementById("divbg").style.display =  "initial";
					else
						document.getElementById("divbg").style.display="none";
				}
				
				else if(inputs.settingsMap.get("Keyboard Background").includes(curkey)) {
					//setInterval(() => { this.isPaused = !this.isPaused; }, 300) ;
					this.isPaused = !this.isPaused;
				}
				
				if(inputs.settingsMap.get("Keyboard Reset").includes(curkey)) {
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
		
		if(this.gameState == consts.GAMESTATES[0])
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
		if(this.isPaused)
			return;
		switch(this.gameState) {
			case consts.GAMESTATES[0]:
			case consts.GAMESTATES[1]:
			case consts.GAMESTATES[2]:
				if(this.shape == undefined) break;
				if (this.shape.canDown(this.matrix)) {
					this.resetLockdown();
					this.shape.goDown(this.matrix);
				} else if(this.isPieceLocked()){
					this.canPopFromHoldStack = true;
					this.shape.copyTo(this.matrix);
					this._check();
					if(this._checkHint()) return;
					//this._fireShape();
					this._recurseGameState();
					 new Audio('./dist/sound/Blop2.ogg').play();
				}
				this._draw();
				this.isGameOver = checkGameOver(this.matrix);
				
				// if game over and gamestate is free play
				views.setGameOver(this.gameState == consts.GAMESTATES[0] && this.isGameOver);
				
				if (this.isGameOver) 
					views.setFinalScore(this.score);
			break;
			case consts.GAMESTATES[3]:
			break;
			default:
			break;
		}

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
		
		if(matrix[side4Y] != undefined && matrix[side3Y] != undefined) {
			if(matrix[side1Y][side1X] != 0)
				side1 = 1;
			if(matrix[side2Y][side2X] != 0)
				side2 = 1;
			// TODO: figure out why this occasionally  is undefined
			if(matrix[side3Y][side3X] != 0)
				side3 = 1;
			if(matrix[side4Y][side4X] != 0)
				side4 = 1;
		}
		
		console.log("sides: " + side1+side2+side3+side4);
		// if Sides A and B + (C or D) are touching a Surface
		//considered a T-Spin
		if((side1+side2+side3+side4) >= 3) {
			//new Audio("./dist/sound/horse1.ogg").play();
			return 2;
		}
		
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
		this.interval = parseInt(inputs.settingsMap.get("Default Interval"));
        if (currentTime - this.levelTime > consts.LEVEL_INTERVAL) {
			//this.resetLockdown
            //this.level += 1;
            //this.interval = calcIntervalByLevel(this.level);
            views.setLevel(this.level);
            this.levelTime = currentTime;
        }
    },

}


window.Tetris = Tetris;
// export {Tetris};