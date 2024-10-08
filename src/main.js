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


var blopAudio = new Audio('./dist/sound/Blop2.ogg');
blopAudio.load();

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
            full = full && (row[j] !== 0 && row[j] != consts.ZONE_BLOCK_COLOR);
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

// Add garbage.
var addGarbage = function(matrix, garbage) {
    

	
	var garbageHeight = garbage.length;

	var previousMatrix = matrix;

	var bottomRow = consts.ROW_COUNT;
	var garbageTopRow = bottomRow - garbageHeight;
	
	//  Shift play matrix up
	for (var j = 0; j < consts.ROW_COUNT; j++) {
		for (var i = 0; i < consts.COLUMN_COUNT; i++) {
			// Bump up old matrix for incoming garbage
			if(j-garbageHeight>=0)
				matrix[j-garbageHeight][i] = previousMatrix[j][i];
		}
	}

	//	Insert garbage. Indices count up from top to bottom row
	for (var j = garbageTopRow; j < bottomRow ; j++) {
		var garbageLength = garbage[j-garbageTopRow].length;
		for (var i = 0; i < garbageLength; i++) {
			// Add incoming garbage
			matrix[j][i] = garbage[j-garbageTopRow][i];
			//console.log("matrix: " + matrix[j][i] + " garbage: " + garbage[0][i] + " prevmatrix: " + previousMatrix[j][i]);
		}
    }
	return matrix;
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

// ty tf2
/**
 * getIdealFinesse
 *   returns array ideal finesse instructions (may be multiple ways with different order / whatever)
 * piece - the letter of the piece
 * loc - the column of the piece (can be negative)
 * rot - the rotation of the piece (0 through 3)
 * spin - boolean of whether this piece spun
 */
var getIdealFinesse = function(shape, loc, rot, spin) {
	var piece = shape.flag;
	//TODO probably map rot to state and loc to x -- disregard, programs are the exact same
	if (piece == "I") {
		if (rot == 1) {
			loc += + 2;
		} else if (rot == 3) {
			loc += + 1;
			rot = 1;
		} else if (rot == 2) {
			rot = 0;
		}
	}
	if (piece == "O") {
		rot = 0;
	}
	if ("SZ".indexOf(piece) != -1) {
		if (rot == 2)
			rot = 0;
		if (rot == 0) {
			piece = "J";
		} else {
			piece = "S";
			if (rot == 1)
				loc += 1
			rot = 0;
		}
	}
	if ("JLT".indexOf(piece) != -1) {
		piece = "J";
		if (rot == 1)
			loc += 1;
	}

	if ("IJLOSTZ".indexOf(piece) == -1) {
		//error("Invalid piece: " + piece);
	}

	var guide = {
		i: [
			[
				["das left"],
				["das left", "right"],
				["left"],
				[],
				["right"],
				["das right", "left"],
				["das right"]
			], // 0 rotation
			[
				["ccw", "das left"],
				["das left", "ccw"],
				["das left", "cw"],
				["left", "ccw"],
				["ccw"],
				["cw"],
				["right", "cw"],
				["das right", "ccw"],
				["das right", "cw"],
				["ccw", "das right"],
			], // 1 rotation
		],
		j: [
			[
				["das left"],
				["left", "left"],
				["left"],
				[],
				["right"],
				["right", "right"],
				["das right", "left"],
				["das right"]
			], // 0
			[
				["cw", "das left"],
				["das left", "cw"],
				["left", "left", "cw"],
				["left", "cw"],
				["cw"],
				["right", "cw"],
				["right", "right", "cw"],
				["das right", "left", "cw"],
				["das right", "cw"]
			], // 1
			[
				["das left", "cw", "cw"],
				["left", "left", "cw", "cw"],
				["left", "cw", "cw"],
				["cw", "cw"],
				["right", "cw", "cw"],
				["right", "right", "cw", "cw"],
				["das right", "left", "cw", "cw"],
				["das right", "cw", "cw"]
			], // 2
			[
				["das left", "ccw"],
				["left", "left", "ccw"],
				["left", "ccw"],
				["ccw"],
				["right", "ccw"],
				["right", "right", "ccw"],
				["das right", "left", "ccw"],
				["das right", "ccw"],
				["ccw", "das right"]
			] // 3
		],
		o: [
			[
				["das left"],
				["das left", "right"],
				["left", "left"],
				["left"],
				[],
				["right"],
				["right", "right"],
				["das right", "left"],
				["das right"]
			]
		],
		s: [
			[
				["cw", "das left"],
				["das left", "cw"],
				["left", "ccw"],
				["ccw"],
				["cw"],
				["right", "cw"],
				["right", "right", "cw"],
				["das right", "ccw"],
				["cw", "das right"]
			],
		],
	}

	var v = guide[piece][rot][loc]
	//if (spin)   spin can be added to kickShape if needed
	//	v.push("spins");

	return v;
};
/*
testFinesse () 
{
		//var v = s.board.getIdealFinesse(p.piece, p.getLocation()[1], p.getRotation(), p.spin);
		var v = s.board.getIdealFinesse(this.piece.flag, this.piece.x, this.piece.state, false);
		var str = "";
		for (var i = 0; i < v.length; i++)
			str += v[i] + ", ";
		if (str.length > 0)
			str = str.substring(0, str.length - 2);
		else
			str = "drop"; // TODO put this in settings?
		if (count - v.length > 0) {
			s.finesse.add(count - v.length);
			s.finessePrintout.updateValue(str); // TODO add finesse error (tell user what they did that was wrong)
			if (s.board.settings.redoFinesseErrors)
				p.reset();
			else
				if (s.board.settings.showFinesseErrors)
					p.greyOut();
		}
}*/
Tetris.prototype = {
    init: function(options) {
		
		
		/*(async () => {
			var response = await fetch('https://harddrop.com/wiki/Category:T-Spin_Methods',
			{method: 'POST',
			mode: 'cors',
			cache: 'no-cache'});
			switch (response.status) {
				// status "OK"
				case 200:
					var template = await response.text();

					console.log(template);
					break;
				// status "Not Found"
				case 404:
					console.log('Not Found');
					break;
			}
		})();*/
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
	toggleDoQuiz: function()
	{
		if(this.gameState != consts.GAMESTATES[1] && this.gameState != consts.GAMESTATES[2]) return;
		
		
		if(this.gameState == consts.GAMESTATES[1]) {
			// set game state to do test
			document.getElementById("quiz").value = "Show Hints";
			
			this.gameState = consts.GAMESTATES[2];
		}
		else {
			document.getElementById("quiz").value = "Hide Hints";
			
			this.gameState = consts.GAMESTATES[1];
		}
		
		this._restartHandler();
	},
	// Gamestate 4
	setGameStateToSequenceEditor: function()
	{
		//document.getElementById("side").display = "none";
		
		// change to editor gamestate
		this.gameState = consts.GAMESTATES[3];
		this.shape = undefined;
		this.canPopFromHoldStack = true;
		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this.reset();
		this._restartHandler();
		this.currentOpener = 0;
		
		// Fill up hold stack with each mino
		this.pushHoldStack();
	},
	setGameStateToTSpinQuiz: function()
	{
		/*this.gameState = consts.GAMESTATES[5];
		this.shape = undefined;
		this.hintqueue = [];
		this.hintQueue = [];
		this.shapeQueue = [];
		this.hintMino = 0;
		this.reset();
		this._restartHandler();
		this.currentOpener = 0;*/
		
		var Variation1 = 
		[['#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080',0,'#808080','#808080']
		];
		var TSpinField = 
		[
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080'],
		['#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080']
		];
		
		if(true) {
		var Variation1 = 
			[

			[0,0,0,0,'#808080','#808080','#808080','#808080','#808080','#808080' ],
			[0,0,0,0,'#808080','#808080','#808080','#808080','#808080','#808080' ],
			[0,0,0,'#808080','#808080','#808080','#808080','#808080','#808080','#808080' ],
			[0,0,0,'#808080','#808080','#808080','#808080','#808080','#808080','#808080' ],
			[0,'#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080' ],
			[0,'#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080','#808080' ]
			];
			clearMatrix(this.matrix);
			addGarbage(this.matrix, Variation1);
			utils.fastEmptyArray(this.shapeQueue);
			this.shapeQueue.push(shapes.getShape(4));
			this.shapeQueue.push(shapes.getShape(4));
			this.shapeQueue.push(shapes.getShape(0));
			this.shapeQueue.push(shapes.getShape(0));
			this.shape = this.shapeQueue.shift();
		}
		else{
		//[['#808080'],['#808080'],['#808080'],['#808080'],['#808080'],['#808080'],['#808080'],['#808080'],['#808080'],['#808080']];
		// Add garbage to playfield
		addGarbage(this.matrix, Variation1);
		//addGarbage(this.matrix, TSpinField);
		
		/*
		// Push current piece to top of playfield
		if(shapes.canMoveTo(this.shape, this.matrix) == false) {
			// Set piece y to origin
			this.shape.y = shapes.getShape(this.shape.nType()).y;
			// Move piece to pushed up playfield
			this.shape.goBottom(this.matrix);
		}*/
		}
		this._draw();
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
		
		var hintShapes = [];
		this.hintQueue.slice().reverse().forEach( function(shape, idx) {  hintShapes.push(shape.x); hintShapes.push(shape.y); hintShapes.push(shape.state); } );
		// console.log("var hintDataList = [" + shapes.join(",") + "];");
		// console.log("this.createHintQueue(hintDataList);");
		
		var sequenceCode = [];
		
		var shapeArrayStr = [];
		this.shapeQueue.slice().reverse().forEach( function(shape, idx, arr) 
		{ shapeArrayStr += "shapes.getShape("+shape.nType() + ((idx === arr.length-1) ? "));" : "), ") } );
		
		sequenceCode += "case :\n\tthis.shapeQueue = new Array(" + shapeArrayStr + "\nbreak;" + "\n\n";
		
		var hintShapeArrayStr = [];
		this.hintQueue.slice().reverse().forEach( function(shape, idx, arr) 
		{ hintShapeArrayStr += "shapes.getShape("+shape.nType() + ((idx === arr.length-1) ? "));" : "), ") } );
		
		sequenceCode += "case :\n\tthis.hintQueue = new Array(" + hintShapeArrayStr;
		sequenceCode += "\n\nvar hintDataList = [" + hintShapes.join(",") + "];" + "\nthis.createHintQueue(hintDataList);" + "\nbreak;";
		
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
		this.isPieceFromHold = false;
        this.level = 1;
        this.score = 0;
		this.lines = 0;
		// beginning of frame
        this.startTime =  new Date().getTime();
        this.currentTime = this.startTime;
        this.prevTime = this.startTime;
		this.sequencePrevTime = this.startTime;
		this.resetTimer = this.startTime;
		//todo:get rid of extra
        this.levelTime = this.startTime;
		this.prevInputTime = this.startTime;
		// current tetrino index gets set to 0 at the end of opener sequence
		this.currentMinoInx = 0;
		this.shapeQueue = [];
		this.freeplayBagQueue = [];  // Always try to have two bags full
		this.hintQueue = [];
		this.holdStack = [];
		this.inputEventHistory = [];
		
		// gets set to false after mino has been popped from hold stack; set back to true on mino dropped
		this.canPopFromHoldStack = false;
		// manipulation counter for srs extended piece lockdown
		this.manipulationCounter = 0;
		// timer for srs extened piece lockdown
		this.lockDownTimer = 5000;
		this.isPCOActive = false;
		this.landed = false;
		this.isSequenceCompleted = false;
		this.traditionalHold = true;  // 1 piece hold if true. 4 if false
		this.isHolding = false;
		
		// Frame time logger todo: delete
		this.currentFrameTime = this.startTime;
		this.previousFrameTime = this.startTime;
		this.logInfo = [];
		
		// ARE timer
		this.entryDelayTimeStamp = this.startTime;
		
        clearMatrix(this.matrix);
        views.setLevel(this.level);
        views.setScore(this.score);
        views.setGameOver(this.gameState == consts.GAMESTATES[0] && this.isGameOver);
		openers.reset();
		this.ensureFreeplayBagsFull();
		//this.shape = shapes.getShape(0);
		
        this._draw();
    },
    //Start game
    start: function() {
        this.running = true;
		window.requestAnimationFrame(utils.proxy(this._refresh, this));

    },

	ensureFreeplayBagsFull() {
		while(this.freeplayBagQueue.length <= 4) {
			this.freeplayBagQueue.push(shapes.generateBag());
		}
	},
	getBagFromFreeplayBagQueue() {
		var bag = this.freeplayBagQueue.shift();
		this.ensureFreeplayBagsFull();
		return bag;
	},
	pushHoldStack: function()
	{
		if(this.gameState == consts.GAMESTATES[3]) {
			while(this.holdStack.length < 7)
				this.holdStack.unshift(shapes.getShape(this.currentMinoInx++%7));
			
			this.shape = this.holdStack.pop();
			this._check();
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
 	pushEditorHold: function()
	{	
		// Add piece shape queue and set to it being held(canPopFromHoldStack = true)
		if(this.canPopFromHoldStack == false) {			
			
			this.shapeQueue.unshift(utils.deepClone(this.shape));
			
			this.shape = this.holdStack.pop();
			this.canPopFromHoldStack = true;
			this._draw();
		}
	}, 
	popHoldStack: function()
	{
		// in editor mode popHoldStack cycles through mino shapes
		if(this.gameState == consts.GAMESTATES[3]) {
			// piece cannot be placed
			if(this.shape.canDown(this.matrix)) return;
			
			
			// If piece came from hold -- logic for editor
			if(this.isPieceFromHold == true) {
				
				this.shape.copyTo(this.matrix);
				
				this.hintQueue.unshift(utils.deepClone(this.shape));

				this.shape = this.holdStack.pop();
				this.isPieceFromHold = false;
				
				return;
			}
			
			// If a piece is being held
			if(this.canPopFromHoldStack == true) {
				
				//  Copy current shape to playfield
				this.shape.copyTo(this.matrix);
				
				this.hintQueue.unshift(utils.deepClone(this.shape));
				this.shapeQueue.unshift(utils.deepClone(this.shape));
				
				// set current piece to previous piece
				this.shape = shapes.getShape(this.shapeQueue[1].nType());

				this.isPieceFromHold = true;
				this.canPopFromHoldStack = false;
				
				return;
			}
			else { // insert piece
				this.shapeQueue.unshift(utils.deepClone(this.shape));
				this.hintQueue.unshift(utils.deepClone(this.shape));
				this.shape.copyTo(this.matrix);
				this.pushHoldStack();
				this._draw();
			}
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
		setInterval(() => {this._periodicLog();}, 1000);
		setInterval(() => {this._processInputTick();}, 1);
		setInterval(() => {this._processFrameTick();}, 16);
		//setInterval(() => {this.lockDownTimer++;}, 2 );
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },
	// Process freeplay queue TODO: possibly rename queue to mode
	_processFreeplayQueue: function() {
		
		/*if(this.shapeQueue.length < 7) {
			shapes.generateBag().map(newShape =>
			this.shapeQueue.push(newShape));
		}*/
		while(this.shapeQueue.length < 7) {
			var newbag = this.getBagFromFreeplayBagQueue();
			newbag.forEach(newShape => this.shapeQueue.push(newShape));
		}
		 this.shape = this.shapeQueue.shift();
		
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
					document.getElementById("ppm").value = (openers.getLength() / (parseFloat(document.getElementById("besttime").value))) * 60.0;
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
	// Process T-Spin quiz mode
	_processTSpinQuiz: function () {
		return;
	},
	// Fill next queue and set next shape
    _fireShape: function() {
		//todo:should be in shapes.js
		this.landed = false;
		this.manipulationCounter = 0;
	
		this._draw();
		
		// End wall charge window
        
    },
	_recurseGameState: function ()
	{
		switch(this.gameState) {
		// Free play
		case consts.GAMESTATES[0]:				
			this._processFreeplayQueue();
			this._fireShape();
			break;
		// Trainer
		case consts.GAMESTATES[1]:				
				this._processOpenerTrainerQueue();
				this._fireShape();
				break;
		// Quiz mode
		case consts.GAMESTATES[2]:				
			this._processOpenerTrainerQueue();
			this._fireShape();
		// Sequence Test
		case consts.GAMESTATES[3]:				
			this._processSequenceEditor();
			break;
		case consts.GAMESTATES[5]:
			this._processTSpinQuiz();
			this._fireShape();
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
				this.manipulationCounter++;		
	},
	// Return if the piece can be shifted or rotated
	isPieceLocked: function() {
		// lock down piece
		if(this.lockDownTimer >= parseInt(inputs.settingsMap.get("Lockdown Timer"))) {return true;}
		
		return false;
	},
    // Draw game data/view
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

	_periodicLog: async function() {
		if(this.logInfo.length > 0) {
			console.log("Info: " + this.logInfo[0]);
			utils.fastEmptyArray(this.logInfo);
			this.logInfo = [];
		}
	},

	// Process Frame todo: switch from _fireShape/_draw to _invalidate when neccessary
	_processFrameTick: async function() {
		this.currentFrameDelta = this.currentFrameTime - this.previousFrameTime
		//this.logInfo.push(this.currentFrameDelta);
		this.previousFrameTime = this.currentFrameTime;
		this.currentFrameTime = (new Date).getTime();
		
		// Check to see if we left entry delay
		var entryDelayCheck = (inputs.getGamepadButtonDownEventTimeStamp() - this.entryDelayTimeStamp) / 16;
		
		if(entryDelayCheck>0&&entryDelayCheck<=6)
			this.logInfo.push(parseInt(entryDelayCheck));
		
		//inputs.setEntryDelayTimeStamp(this.entryDelayTimeStamp);
		//if(entryDelayCheck >= 6)
		//	inputs.setIsCharged(false);
		//if(entryDelayCheck < 6) inputs.setIsCharged(false);
		
	},		
	
	// tick input data -- wont have better than 4-15ms resolution since javascript is single theaded and any ARR or DAS below 15ms could be broken
	_processInputTick: async function() {
		this.lockDownTimer++;
	
		if(this.isTimerOn) {
			var deltaPlayTime = new Date().getTime() - this.sequencePrevTime;
			document.getElementById("Time").value = (deltaPlayTime/1000).toString();
			
		}
		
		// Don't process game related events if game over
		if(this.isGameOver) return;
		
		inputs.processInputs();
		
		if(this.gamepadEnabled && inputs.gamepadEnabled()) {			
			while((inputs.gamepadQueue != undefined && inputs.gamepadQueue.length >= 1)){
				var curkey = inputs.gamepadQueue.shift();
				if(inputs.settingsMap.get("Gamepad Left").includes(curkey)) {
					
					/*if(inputs.isGamepadCharged() == true){
						var idx = this.shape.keysPressed.indexOf("left");
						if (idx !== -1) { this.shape.keysPressed[idx] = "das left"; }
					} else
						this.shape.keysPressed.unshift("left");
					*/

					this.shape.goLeft(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Right").includes(curkey)) {
					if(inputs.isGamepadCharged() == true){
						var idx = this.shape.keysPressed.indexOf("right");
						if (idx !== -1) { this.shape.keysPressed[idx] = "das right"; }
					} else
						this.shape.keysPressed.unshift("right");
					
					
					this.shape.goRight(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Rotateccw").includes(curkey)) {
					this.shape.keysPressed.unshift("ccw");
					this.shape.rotate(this.matrix);
					this.resetLockdown();
					this._draw();
				}
				else if(inputs.settingsMap.get("Gamepad Rotate").includes(curkey)) {
					this.shape.keysPressed.unshift("cw");
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
					this.shape.keysPressed.unshift("hd");
					this.shape.goBottom(this.matrix);
					this.lockDownTimer = 5000;  // Currently at 5 seconds
					this._update();
					}
				}
				else if(inputs.settingsMap.get("Gamepad Hold").includes(curkey)) {
					if(this.gameState == consts.GAMESTATES[3]) {
						this.pushHoldStack();
					}
					else {
						if(this.traditionalHold == true) {  // TODO: move logic to holdstack functions
							if(this.isHolding && this.canPopFromHoldStack) 
								this.popHoldStack();
							else if(this.holdStack.length < 1)
								this.pushHoldStack();
							this.isHolding = !this.isHolding;
						} else 
							this.pushHoldStack();
					}
					this._draw();
				}				
				else if(inputs.settingsMap.get("Gamepad Pophold").includes(curkey)) {
					// This pushes the piece on to the editor hold queue in editor mode b/c the other mode's hold queue is being used to cycle through pieces. 
					// it's confusing and bad.
					if(this.gameState == consts.GAMESTATES[3]) {
						this.pushEditorHold();
						this._draw();
					} else {
						this.popHoldStack();
						this._draw();
					}
				}
				else if(inputs.settingsMap.get("Gamepad Pause Toggle").includes(curkey)) {
					this.isPaused = !this.isPaused;
				}
				else if(inputs.settingsMap.get("Gamepad Reset").includes(curkey)) {
					if( ( (new Date().getTime()) - this.resetTimer) >= 1000){
						this.setGameStateToTSpinQuiz();
						//this._restartHandler();
						this.resetTimer = new Date().getTime();
					}
				}
			}
			inputs.saveButtons();
			inputs.gamepadClear();
		}
		
		
			// Do keyboard
			//inputs.processKeys();
			//inputs.processKeyShift();
			
			// Keyboard inputs
			while((inputs.inputQueue != undefined && inputs.inputQueue.length >= 1) && this.gamepadEnabled != true){
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
					if(this.gameState == consts.GAMESTATES[3]) {
						this.pushHoldStack();
					}
					else {
						if(this.traditionalHold == true) {  // TODO: move logic to holdstack functions
							if(this.isHolding && this.canPopFromHoldStack) 
								this.popHoldStack();
							else if(this.holdStack.length < 1)
								this.pushHoldStack();
							this.isHolding = !this.isHolding;
						} else 
							this.pushHoldStack();
					}
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Pophold").includes(curkey)) {
					// This pushes the piece on to the editor hold queue in editor mode b/c the other mode's hold queue is being used to cycle through pieces. 
					// it's confusing and bad.
					if(this.gameState == consts.GAMESTATES[3]) {
						this.pushEditorHold();
					} else {
						this.popHoldStack();
						this._draw();
					}
				}
				else if(inputs.settingsMap.get("Keyboard Hold").includes(curkey)) {//something got goofd here
					if(document.getElementById("divbg").style.display == "none")
						document.getElementById("divbg").style.display =  "initial";
					else
						document.getElementById("divbg").style.display="none";
				}
				
				else if(inputs.settingsMap.get("Keyboard Pause Toggle").includes(curkey)) {
					//setInterval(() => { this.isPaused = !this.isPaused; }, 300) ;
					this.isPaused = !this.isPaused;
				}
				
				if(inputs.settingsMap.get("Keyboard Reset").includes(curkey)) {
					if( ( (new Date().getTime()) - this.resetTimer) >= 1000){
						this._restartHandler();
						this.resetTimer = new Date().getTime();
					}
					
					return;
				}
					
			}
			//inputs.inputQueue = [];
			utils.fastEmptyArray(inputs.inputQueue);
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
    // Update game data/model
    _update: function() {
		if(this.isPaused)
			return;
		switch(this.gameState) {
			case consts.GAMESTATES[0]:
			case consts.GAMESTATES[1]:
			case consts.GAMESTATES[2]:  // Handle some piece logic TODO: get rid of some of these logic loops
				if(this.shape == undefined) break;
				if (this.shape.canDown(this.matrix)) {
					this.resetLockdown();
					this.shape.goDown(this.matrix);
				} else if(this.isPieceLocked()){
					// ARE window -- remove
					//inputs.setIsCharged(true);
					//isFinesseSucceeded = testFinesse(getIdealFinesse(this.piece.flag, this.piece.x, this.piece.state, false));
					
					this.entryDelayTimeStamp = (new Date()).getTime();
					
					this.canPopFromHoldStack = true;
					this.shape.copyTo(this.matrix);
					this._check();
					if(this._checkHint()) return;
					//this._fireShape();
					this._recurseGameState();
					blopAudio.play();
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
			case consts.GAMESTATES[4]:
			break;
			case consts.GAMESTATES[5]:
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
