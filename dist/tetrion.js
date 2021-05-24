(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var utils = require('./utils.js');
var consts = require('./consts.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';

var lineColor =  consts.GRID_LINE_COLOR;

var boxBorderColor = consts.BOX_BORDER_COLOR;

//Draw a single line in canvas context
var drawLine = function(ctx,p1,p2,color){
	  	    ctx.beginPath();
			ctx.moveTo(p1.x,p1.y);
			ctx.lineTo(p2.x,p2.y);
			
			ctx.lineWidth=1;
			ctx.strokeStyle= color;
			
			ctx.stroke();
			ctx.closePath();
};


//Draw game grids
var drawGrids = function(el,gridSize,colCount,rowCount,color1,color2){

	  

	  var ctx = el.getContext('2d');
	  var width = el.width;
	  var height = el.height;

	  ctx.rect(0, 0, width, height);

      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, color1);   
      grd.addColorStop(1, color2);
      ctx.fillStyle = grd;
      ctx.fill();
      

	  for (var i = 1; i < colCount; i++) {
	  		var x = gridSize*i+0.5;
			drawLine(ctx,{x:x,y:0},{x:x,y:height},lineColor);
	  };
	  for (var i = 1; i < rowCount; i++) {
			var y = gridSize*i+0.5;
			drawLine(ctx,{x:0,y:y},{x:width,y:y},lineColor);
	  };
};

//Draw box of shape (shape is the composition of boxes)
var drawBox = function(ctx,color,x,y,gridSize){
			if (y<0){
				return;
			}

			ctx.beginPath();
			ctx.rect(x,y,gridSize,gridSize);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.strokeStyle= boxBorderColor;
			ctx.lineWidth=1;
			ctx.stroke();
			ctx.closePath();
}

/*
	Canvas main object, use to draw all games data.
*/
var tetrisCanvas = {

	init:function(scene,preview,hold){
		this.scene = scene;
		this.preview = preview;
		this.hold = hold;
		this.sceneContext = scene.getContext('2d');
		this.previewContext = preview.getContext('2d');
		this.holdContext = hold.getContext('2d');
		this.gridSize = scene.width / consts.COLUMN_COUNT;

		this.previewGridSize = preview.width / 4;//consts.PREVIEW_COUNT;
		this.holdGridSize = preview.width / 4;//consts.PREVIEW_COUNT;
		
		this.drawScene();
		
	},

	//Clear game canvas
	clearScene:function(){
		this.sceneContext.clearRect(0, 0, this.scene.width, this.scene.height);
	},
	//Clear preview canvas
	clearPreview:function(){
		this.previewContext.clearRect(0,0,this.preview.width,this.preview.height);
	},	//Clear preview canvas
	clearHold:function(){
		this.holdContext.clearRect(0,0,this.hold.width,this.hold.height);
	},
	//Draw game scene, grids
	drawScene:function(){
		this.clearScene();
		drawGrids(this.scene,this.gridSize,
			consts.COLUMN_COUNT,consts.ROW_COUNT,
			consts.SCENE_BG_START,consts.SCENE_BG_END);
	},
	//Draw game data
	drawMatrix:function(matrix){
		for(var i = 0;i<matrix.length;i++){
			var row = matrix[i];
			for(var j = 0;j<row.length;j++){
				if (row[j]!==0){
					drawBox(this.sceneContext,row[j],j*this.gridSize,i*this.gridSize,this.gridSize);
				}
			}
		}	
	},
	//Draw preview data
	drawPreview:function(){
		drawGrids(this.preview,this.previewGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},
	//Draw hold data
	drawHold:function(){
		drawGrids(this.hold,this.holdGridSize,
			consts.PREVIEW_COUNT,consts.PREVIEW_COUNT,
			consts.PREVIEW_BG,consts.PREVIEW_BG);
	},
	//Draw acitve shape in game
	drawShape:function(shape){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext,shape.color,x,y,gsize);
				}
			}
		}
	},
	drawGhostShape:function(shape, bottomY){
		if (!shape){
			return;
		}
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(bottomY + i); //(shape.y + i);
					drawBox(this.sceneContext,"rgba(255, 255, 255, 0.2)",x,y,gsize);
				}
			}
		}
	},
	hexToRgb: function(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
		} : null;
	},
	drawHintShape:function(shape){
		if (!shape){
			return;
		}
		var colorRGB = this.hexToRgb(shape.color);
		var color = "rgba(" + colorRGB.r + "," + colorRGB.g + "," + colorRGB.b + "," + "0.2)";
		
		var matrix = shape.matrix();
		var gsize = this.gridSize;
		for(var i = 0;i<matrix.length;i++){
			for(var j = 0;j<matrix[i].length;j++){
				var value = matrix[i][j];
				if (value === 1){
					var x = gsize *(shape.x + j);
					var y = gsize *(shape.y + i);
					drawBox(this.sceneContext, color, x, y, gsize);
				}
			}
		}
	},
	//Draw preview shape in preview canvas
	drawPreviewShape:function(shapeQueue){
		if (!shapeQueue){
			return;
		}
		this.clearPreview();

		shapeQueue.forEach( (shape, index) => {
			if(shape != undefined)
			{
				var matrix = shape.matrix();
				var gsize = this.previewGridSize;
				var startX = (this.preview.width - gsize*shape.getColumnCount()) / 2;
				var startY = ((this.preview.height - gsize*shape.getRowCount()) / 2 / 4)*(index*2+1);
				for(var i = 0;i<matrix.length;i++){
					for(var j = 0;j<matrix[i].length;j++){
						var value = matrix[i][j];
						if (value === 1){
							var x = startX + gsize * j;
							var y = startY + gsize * i;
							drawBox(this.previewContext,shape.color,x,y,gsize);
						}
					}
				}
			}
		});
		
	},
			//Draw preview shape in preview canvas
	drawHoldShape:function(holdQueue){
		if (!holdQueue){
			return;
		}
		this.clearHold();
		q = holdQueue.reverse();
		q.forEach( (shape, index) => {
			if(shape != undefined)
			{
				var matrix = shape.matrix();
				var gsize = this.holdGridSize;
				var startX = (this.hold.width - gsize*shape.getColumnCount()) / 2;
				var startY = ((this.hold.height - gsize*shape.getRowCount()) / 2 / 4)*(index*2+1);
				for(var i = 0;i<matrix.length;i++){
					for(var j = 0;j<matrix[i].length;j++){
						var value = matrix[i][j];
						if (value === 1){
							var x = startX + gsize * j;
							var y = startY + gsize * i;
							drawBox(this.holdContext,shape.color,x,y,gsize);
						}
					}
				}
			}
		});
		holdQueue.reverse();
		
	}
	


};



module.exports = tetrisCanvas;
// export tetrisCanvas;
 
},{"./consts.js":2,"./utils.js":8}],2:[function(require,module,exports){

//colors for shapes  L, O, Z, T, J, S, I
var colors = ['#ef7a21','#f7d308','#ef2029','#ad4d9c','#5a658f','#42b642','#31c7ef'];
//['#ef7a21','#f7d308','#42b642','#ef2029','#ad4d9c','#5a658f','#31c7ef'];
//['#00af9d','#ffb652','#cd66cc','#66bc29','#0096db','#3a7dda','#ffe100'];


// Gamestates
var gameStates = ["freePlayState", "trainerState", "testTrainerStates", "sequenceEditorState", "quizState"];
var defaultGameState = "freePlayState";

//sidebar width
var sideWidth = 120;


//scene column count
var columnCount = 10;

//scene row count;
var rowCount = 20;

//scene piece entry count;
var entryRowCount = 3;

//previewCount
var previewCount = 6;

//scene gradient start color 
var sceneBgStart = "#000000"
//'#8e9ba6';

//scene gradient end color 
var sceneBgEnd = '#000000'
//'#5c6975';

//preview background color
var previewBg = '#2f2f2f';

//grid line color
var gridLineColor = 'rgba(255,255,255,0.2)';

//box border color
var boxBorderColor = 'rgba(255,255,255,0.5)';


// Game speed
var defaultInterval = 600;


// Level update interval 
var levelInterval = 120 * 1000; 



var exports = module.exports = {};

exports.GAMESTATES = gameStates;

exports.DEFAULT_GAMESTATE = defaultGameState;

exports.COLORS =  colors;

exports.SIDE_WIDTH = sideWidth;

exports.ROW_COUNT = rowCount;

exports.COLUMN_COUNT = columnCount;

exports.SCENE_BG_START = sceneBgStart;

exports.SCENE_BG_END = sceneBgEnd;

exports.PREVIEW_BG = previewBg;

exports.PREVIEW_COUNT = previewCount;

exports.GRID_LINE_COLOR = gridLineColor;

exports.BOX_BORDER_COLOR = boxBorderColor;

exports.DEFAULT_INTERVAL = defaultInterval;

exports.LEVEL_INTERVAL = levelInterval;

},{}],3:[function(require,module,exports){

var gamepadAPI = {
    controller: {},
    turbo: false,
    connect: function(evt) {
        gamepadAPI.controller = evt.gamepad;
        gamepadAPI.turbo = true;
        console.log('Gamepad connected.');
    },
    disconnect: function(evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
        console.log('Gamepad disconnected.');
    },
    update: function() {
		var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		if(!isFirefox) {
			for(var i = 0; i < 4; i++)
				if((gp = window.navigator.getGamepads()[i]) != undefined)				// dumb gamepad update. fix.
					gamepadAPI.controller = gp;
		}
		
        gamepadAPI.buttonsCache = [];
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        gamepadAPI.buttonsStatus = [];
        var c = gamepadAPI.controller || {};
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {
                if (c.buttons[b].pressed) {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {
                axes.push(c.axes[a].toFixed(2));
            }
        }
        gamepadAPI.axesStatus = axes;
        gamepadAPI.buttonsStatus = pressed;
        return pressed;
    },	

    buttonPressed: function(button, hold) {
        var newPress = false;
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {
			
            if (gamepadAPI.buttonsStatus[i] == button) {
                newPress = true;
                if (!hold) {
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {
                        if (gamepadAPI.buttonsCache[j] == button) {
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },

    buttons: [ // XBox360 layout 
   		'A', 'B', 'X', 'Y',
        'LB', 'RB', 'Axis-Left', 'DPad-Right',
        'Back', 'Start', 'Power', 'Axis-Right','DPad-Up', 'DPad-Down' ,  'DPad-Left','DPad-Right'
		],
   /*
		'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right',
        'Start', 'Back', 'Axis-Left', 'Axis-Right',
        'LB', 'RB', 'Power', 'A', 'B', 'X', 'Y',
    ],*/
	
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};
window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

module.exports = gamepadAPI;
// export gamepadAPI;
},{}],4:[function(require,module,exports){
var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
		
		this.settingsList = this.keyboardKeySettings.concat(this.keyboardShiftEvents.concat(this.keyboardKeyEvents.concat(this.gamepadSettings.concat(this.gamepadShiftEvents.concat(this.gamepadButtonEvents)))));
		//;["Soft Drop Rate [1 - 100]"].concat(this.keyboardSettings.concat(this.gamepadSettings));
		this.gamepadShiftTimer = new Date();
		this.gamepadButtonTimer = new Date();
		this.keyboardKeyTimer = new Date();
		this.keyboardShiftTimer  = new Date();
		this.settingsMap = new Map();
		this.gamepadEventMap = new Map();
		///this.gamepadEventMap = new Map();
		// var init = utils.getCookie("init");
		// if(init == "") 
			for(var i in this.settingsList) 
				utils.setCookie(this.settingsList[i], this.settingsDefault[i], 30); //  cookies expire in 30 days
		// else
			// for(var i in this.settingsList)
				// this.settingsDefault[i] = utils.getCookie(this.settingsList[i]);
			
		 for(var i in this.settingsList)
			 this.settingsMap.set(this.settingsList[i], this.settingsDefault[i]);
		
		
		this.gamepadEvents = this.gamepadShiftEvents.concat(this.gameButtonsEvents);
		
		var mapIdx = [14, 7, 13, 5, 4, 1, 2, 12, 8, 3];
		for(var i in mapIdx) {
			this.gamepadEventMap.set(this.gamepadEvents[i], gamepad.buttons[mapIdx[i]]);
		}

		
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    },

	updateGamepad() {
		this.gpButtons = gamepad.update();
	},
	gamepadEnabled() {
		return gamepad.controller || false;
	},
	processGamepadInput() {
		this.gamepadButtonEvents.forEach(gamepadButton => this.gamepadButtonsDown(this.settingsMap.get(gamepadButton)));
	},
	processGamepadDPad()  {
		this.gamepadShiftEvents.forEach(dpadButton => this.gamepadDPadDown(this.settingsMap.get(dpadButton)));
	},
	// Single press gamepad buttons
	gamepadButtonsDown(finds) {
		var DAS = 167.0;
		var ARR = 300.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);

		if(isPrevContained != isContained ) {
			// Not being held yet
			this.gamepadButtonTimer = new Date();
			this.isPassedDelayGamepadShift = false;
			// Add button to queue on pressed input
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		
		var deltaTime = (new Date()).getTime() - this.gamepadButtonTimer.getTime();
		
		if (!this.isPassedDelayGamepadShift) {
				if (deltaTime >= DAS) {
					this.gamepadButtonTimer = new Date();
					this.isPassedDelayGamepadShift = true;
				}
				
		} else {
			if (deltaTime >= ARR && isContained) {
				this.gamepadQueue.push(finds);
				this.gamepadButtonTimer = new Date();
			}
		}
			
	},
	
	// Direction Pad
	gamepadDPadDown(finds) {
		var DAS = parseInt(this.settingsMap.get("Gamepad DAS"));	
		var ARR = parseInt(this.settingsMap.get("Gamepad ARR"));
		
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);
		
		if(isPrevContained != isContained ) {
			// Not being held yet
			this.gamepadShiftTimer = new Date();
			this.isDelayedPassedGamepadShift = false;
			// Add button to queue on pressed input
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		
		var deltaTime = (new Date()).getTime() - this.gamepadShiftTimer.getTime();

		if (!this.isDelayedPassedGamepadShift) {
			if (deltaTime >= DAS) {
				this.gamepadShiftTimer = new Date();
				this.isDelayedPassedGamepadShift = true;	
			}
		} 
		else {
			if (deltaTime >= ARR && isContained) {
				this.gamepadQueue.push(finds);
				this.gamepadShiftTimer = new Date();
			}
		}
		return;
	},

	processKeys() {
		this.keyboardKeyEvents.forEach( key => this.settingsMap.get(key).split(',').forEach( idx => this.processKeyDown( parseInt(idx) ) ) );
	},

	// keyboard keys z,x,space
	processKeyDown(key)
	{
		var DAS = 167.0;
		var ARR = 300.0;
		
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			// Not being held yet
			this.keyboardKeyTimer = new Date();
			this.isPassedDelayKeyboardKey = false;
			// Add shift to queue on pressed input
			if(this.keyboardKeys[key] == true)
				this.inputQueue.push(key);
		}
		
		var deltaTime = (new Date()).getTime() - this.keyboardKeyTimer.getTime();

		if (!this.isPassedDelayKeyboardKey) {
				if (deltaTime >= DAS) {
					this.keyboardKeyTimer = new Date();
					this.keyboardButtonsDeciframes = 0;
					this.isPassedDelayKeyboardKey = true;
				}
		} else {
			if (deltaTime >= ARR && this.keyboardKeys[key] == true) {
				this.inputQueue.push(key);
				this.keyboardKeyTimer = new Date();
			}
		}
	},
	// Process applicable key inputs
	processKeyShift() {
		this.keyboardShiftEvents.forEach(arrowKey => arrowKey.split(',').forEach(option => this.processKeyboardArrowKeys(parseInt(this.settingsMap.get(option)))));	
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = parseInt(this.settingsMap.get("Keyboard DAS"));
		var ARR = parseInt(this.settingsMap.get("Keyboard ARR"));

		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			// Not being held yet
			this.isPassedDelayKeyboardShift = false;
			this.keyboardShiftTimer = new Date();
			
			// Do shift if key has been pushed down
			if(this.keyboardKeys[key] == true)
				this.inputQueue.push(key);
		}
		
		var deltaTime = (new Date()).getTime() - this.keyboardShiftTimer.getTime();
		
            if (!this.isPassedDelayKeyboardShift) {
				
                if (deltaTime >= DAS) {
					this.keyboardShiftTimer = new Date();
                    this.isPassedDelayKeyboardShift = true;
                }
            } 
			else if(deltaTime >= ARR && this.keyboardKeys[key] == true) {
                    this.inputQueue.push(key);
					this.keyboardShiftTimer  = new Date();
			}
	
		
    },
    keyDown(event) {
		if(event.keyCode != 38) 
		if (! ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8)) 
			event.preventDefault();
		
		this.keyboardKeys[event.keyCode] = true;
		this.isKeyBoardKeyDown = true;
    },
    keyUp(event) {
		this.isKeyDown = false;
		this.keyboardKeys[event.keyCode] = false;
		this.isKeyBoardKeyDown = false;
    },
	gamepadClear() {
		//this.gpButtons = [];
		//this.gamepadQueue = [];
	},
	saveButtons() {
	this.prevGpButtons = this.gpButtons;
	},
	saveKeyboardKeys() {
		//this.prevKeyboardKeys = utils.deepClone(this.keyboardKeys);
		this.prevKeyboardKeys = {...this.keyboardKeys};
	},
	// button states
    isPassedDelayKeyboardShift: false,
	isPassedDelayKeyboardKey: false,
	isPassedDelayGamepadShift: false,
	isPassedDelayGamepadButton: false,
	
	// buttons state contatiners
	gpButtons: [],
	prevGpButtons:[],
	keyboardKeys: [],
	prevKeyboardKeys: [],
    
	// button pressed containers
	inputQueue: [],
	gamepadQueue: [],
		
	keyboardKeySettings:	["Keyboard DAS", "Keyboard ARR"],
	keyboardShiftEvents:	["Keyboard Left", "Keyboard Right", "Keyboard Down", "Keyboard Up"],
	keyboardKeyEvents:		["Keyboard Harddrop", "Keyboard Hold", "Keyboard Rotateccw", "Keyboard Rotate", "Keyboard Pophold", "Keyboard Reset", "Keyboard Background"],
					
	gamepadSettings:		["Gamepad DAS", "Gamepad ARR"],
	gamepadShiftEvents:		["Gamepad Left", "Gamepad Right","Gamepad Down"],
	gamepadButtonEvents:	["Gamepad Harddrop", "Gamepad Hold", "Gamepad Rotateccw", "Gamepad Rotate", "Gamepad Pophold", "Gamepad Reset", "Gamepad Background"],
				
	settingsList: [],
					
	settingsDefault:	[	"167.0", "33.0", 
							"37", "39", "40", "38",
							"32", "16", "90", "88", "17", "82", "80",
							
							"167.0", "33.0", 
							"DPad-Left", "DPad-Right",	"DPad-Down",
							"RB", "LB", "A", "B", "DPad-Up", "Back", ""],
	settingsMap: []
};

module.exports = UserInputs;
// export UserInputs;
},{"./gamepad.js":3,"./utils.js":8}],5:[function(require,module,exports){
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
		document.getElementById("side").display = "none";
		
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
	setSettings: function() {
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
		this.lockdownTimer = 0;
		this.landed = false;
		this.isSequenceCompleted = false;
		
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
		// 1 shape hold queue
		if(this.holdStack.length > 0) {
			this.canPopFromHoldStack = false;
			this.shapeQueue.unshift(utils.deepClone(this.shape));
			this.shape = utils.deepClone(this.holdStack.pop());
			this.shape.resetOrigin();
			this._draw();
		}else if(this.holdStack.length < 4) {
			this.holdStack.push(utils.deepClone(this.shape));
			this.shape = this.shapeQueue.shift();
			this.canPopFromHoldStack = false;
			this.shape.resetOrigin();
			this._draw(); 
		}
		/* 4 shape hold queue
		if(this.holdStack.length < 4) {
			this.holdStack.push(utils.deepClone(this.shape));
			this.shape = this.shapeQueue.shift();
			this.canPopFromHoldStack = false;
			this.shape.resetOrigin();
			this._draw(); 
		}*/
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
		//this._fireShape();
		this._recurseGameState();
    },
    // Bind game events
    _initEvents: function() {
		setInterval(() => {this._processTick();}, 1);
		setInterval(() => {this.lockDownTimer++;}, 100 );
        views.btnRestart.addEventListener('click', utils.proxy(this._restartHandler, this), false);
    },
	// Process freeplay queue
	_processFreeplayQueue: function() {
		while(this.shapeQueue.length <= 4)
		{
			this.preparedShape = shapes.randomShape();
			this.shapeQueue.push(this.preparedShape);
		}
		
		this.shape = this.shapeQueue.shift();// || shapes.randomShape();
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
			//new Audio("./dist/sound/Affirm2.ogg").play();
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
			if(this.currentOpener < 1000) // getting real hacky
				this._restartHandler();
			else clearMatrix(this.matrix);
			// this.reset();
			// this.start();
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

		if(this.shape.canDown(this.matrix) == false) {	
			this.landed = true;
			this.manipulationCounter = 0;
		}
			
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
					this.lockDownTimer = 5000;
					this._update();
					}
				}
				else if(inputs.settingsMap.get("Gamepad Hold").includes(curkey)) {
					this.pushHoldStack();
					this._draw();
				}				
				else if(inputs.settingsMap.get("Gamepad Pophold").includes(curkey)) {
					this.popHoldStack();
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
					this.pushHoldStack();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Pophold").includes(curkey)) {
					this.popHoldStack();
					this._draw();
				}
				else if(inputs.settingsMap.get("Keyboard Hold").includes(curkey)) {
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
    },

}


window.Tetris = Tetris;
// export {Tetris};
},{"./canvas.js":1,"./consts.js":2,"./input.js":4,"./openers.js":6,"./shapes.js":7,"./utils.js":8,"./views.js":9}],6:[function(require,module,exports){
var shapes = require("./shapes.js");
var utils = require("./utils.js");
// import * as shapes from './shapes.js';

// https://harddrop.com/wiki/Opener
// https://four.lol/
var openerGenerator = {
	shapeQueue: [],
	hintQueue: [],
	idx: 0,
	hintIdx: 0,
	isInit: 0,
	isHintInit: 0,
	customShapeQueue: [],
	customHintQueue: [],
	// O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
	// Current Tetriminos
	init(opener) {
		if(!this.isInit || this.shapeQueue == undefined) {
			switch(opener) {
				case 0:
				case 1:
					// Fonzie Variation
					this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(5), shapes.getShape(2), shapes.getShape(4), shapes.getShape(3));
				break;
				case 2:
					// DTCannon
					this.shapeQueue = new Array(
					shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(5), shapes.getShape(4), shapes.getShape(2), shapes.getShape(3), shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(3), shapes.getShape(1), shapes.getShape(3));
				break;
				case 3:
					this.shapeQueue = new Array(
					shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(1), shapes.getShape(5), shapes.getShape(3), shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(3));
				break;
				case 4:
				//Pokemino's STD
				this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(4), shapes.getShape(2), shapes.getShape(5), shapes.getShape(3), shapes.getShape(1), shapes.getShape(5), shapes.getShape(2), shapes.getShape(0), shapes.getShape(6), shapes.getShape(2), shapes.getShape(4), shapes.getShape(3), shapes.getShape(0), shapes.getShape(3));
				break;
				case 5:
					// Mr TSpins STD reversed 
					this.shapeQueue = new Array(
					shapes.getShape(1), shapes.getShape(2), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(6), shapes.getShape(3), shapes.getShape(1), shapes.getShape(6), shapes.getShape(2), shapes.getShape(4), shapes.getShape(5), shapes.getShape(0), shapes.getShape(0), shapes.getShape(3), shapes.getShape(3));
				break;
				case 6:
					// Hachispin
					this.shapeQueue = new Array(
					shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(5), shapes.getShape(4), shapes.getShape(0), shapes.getShape(3), shapes.getShape(6), shapes.getShape(1), shapes.getShape(5), shapes.getShape(4), shapes.getShape(2), shapes.getShape(0), shapes.getShape(3));
				break;
				case 7: // Albatross
					this.shapeQueue = new Array(
					shapes.getShape(1), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(3));
				break;
				case 8:
					// Number One
					this.shapeQueue = new Array(
					shapes.getShape(1), shapes.getShape(4), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(5), shapes.getShape(3));
				break;
				case 9:
					// Pelican
					this.shapeQueue = new Array(
					shapes.getShape(5), shapes.getShape(2), shapes.getShape(4), shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(3));
				break;
				case 10: 
					// DT Cannon TSZ base
					this.shapeQueue = new Array(
					shapes.getShape(3), shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(4), shapes.getShape(0), shapes.getShape(3), shapes.getShape(3));
				break;
				case 11:
					this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(1), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(3), shapes.getShape(0), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(3), shapes.getShape(4), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(0), shapes.getShape(6));
				 break;
				 case 12:
					this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3));
				break;
				case 13:
					this.shapeQueue = new Array(
					shapes.getShape(4), shapes.getShape(6), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(5), shapes.getShape(0), shapes.getShape(1), shapes.getShape(0), shapes.getShape(6), shapes.getShape(0), shapes.getShape(5), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4));
				break;
				case 14:
					this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(6), shapes.getShape(0), shapes.getShape(0), shapes.getShape(3), shapes.getShape(5));
				break;
				case 15:
					this.shapeQueue = new Array(
					shapes.getShape(0), shapes.getShape(2), shapes.getShape(5), shapes.getShape(6), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(2), shapes.getShape(5), shapes.getShape(0), shapes.getShape(1), shapes.getShape(6), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(3));
				break;



				default:
					this.shapeQueue.unshift(utils.deepClone(shapes.randomShape()));
					return;
			}
		}
		this.isInit = 1;
		
		return;
	},
		
	getNextMino(opener) {
		if(this.customShapeQueue.length > 0) return this.customShapeQueue[this.idx++%this.customShapeQueue.length];
		this.init(opener);
		var mino = this.shapeQueue[this.idx];
		this.idx++;
		if(this.idx >= this.shapeQueue.length) {
			this.idx = 0;
			if(opener < 1000)
				this.isInit = 0;
			else this.isInit = 1;
		}

		return mino;
	},
	
	createHintQueue(hintDataList) {
		for(var i = 0; i < this.hintQueue.length; i++) {
			this.hintQueue[i].x = hintDataList[i * 3];
			this.hintQueue[i].y = hintDataList[i * 3 + 1];
			this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
		}
	},
	// Hint Tetrimions
	initHint(opener) {
		if(!this.isHintInit || this.hintQueue == undefined) {
			
			switch(opener) {
			case 0:
			this.hintQueue = [];
			break;
			case 1:
				// Fonzie Variation
				this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(5), shapes.getShape(2), shapes.getShape(4), shapes.getShape(3));
				
				// position x, position y, orientation, position x,...
				var hintDataList = [-1,17,1,  3,18,0,  6,18,0,  5,17,1,  3,17,0,  7,16,0,  1,17,2];
				
				this.createHintQueue(hintDataList);

			break;
			case 2:
				// DT Cannon
				this.hintQueue = new Array(
					shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(5), shapes.getShape(4), shapes.getShape(2), shapes.getShape(3), shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(3), shapes.getShape(1), shapes.getShape(3));
				
				// position x, position y, orientation, position x,...
				var hintDataList = [-2,18,0,  4,16,1,  6,17,1,  7,17,1,  4,17,-1,  3,17,3,  3,15,0, 5,15,0,  7,14,1,  2,13,-1,  -1,15,1,  1,16,2,  3,16,1,  1,17,-1];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 3:
				//MKO Stacking
				this.hintQueue = new Array(
					shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(1), shapes.getShape(5), shapes.getShape(3), shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(3));
					
				// position x, position y, orientation, position x,...
				var hintDataList = [0,18,0,  0,16,-1,  8,16,-1,  4,18,0,  4,16,1,  5,18,0,  1,15,-1,  2,17,2,  5,18,0,  3,17,1,  6,16,0,  0,15,2,  0,14,0,  2,16,2];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 4:
				//Pokemino's STD  
				this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(4), shapes.getShape(2), shapes.getShape(5), shapes.getShape(3), shapes.getShape(1), shapes.getShape(5), shapes.getShape(2), shapes.getShape(0), shapes.getShape(6), shapes.getShape(2), shapes.getShape(4), shapes.getShape(3), shapes.getShape(0), shapes.getShape(3));
				
				var hintDataList = [0,17,1,  -2,16,1,  4,18,0,  4,17,-1,  3,15,1,  8,17,-1,  2,17,2,  0,17,0,  0,15,-1,  
									1,15,0,  8,16,-2,  5,15,-1,  3,14,1,  6,12,-1,  6,16,1,  2,16,-1,  7,17,2 ];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 5:
				// Mr TSpins STD reversed    
				this.hintQueue = new Array(
					shapes.getShape(1), shapes.getShape(2), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(6), shapes.getShape(3), shapes.getShape(1), shapes.getShape(6), shapes.getShape(2), shapes.getShape(4), shapes.getShape(5), shapes.getShape(0), shapes.getShape(0), shapes.getShape(3), shapes.getShape(3));
				
				var hintDataList = [4,18,0,  0,18,0,  7,17,1,  0,15,1,  4,17,-1,  5,14,-1,  2,17,2,  1,17,0,  -1,16,-1,  2,15,-1,  
									0,14,0,  3,15,1,  8,16,-1,  5,13,2,  6,16,1,  7,17,2 ];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
				
			break;
			case 6:
				// Hachispin   
				this.hintQueue = new Array(
					shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(5), shapes.getShape(4), shapes.getShape(0), shapes.getShape(3), shapes.getShape(6), shapes.getShape(1), shapes.getShape(5), shapes.getShape(4), shapes.getShape(2), shapes.getShape(0), shapes.getShape(3));
				
				var hintDataList = [1,18,0,  0,18,0,  8,16,-1,  2,15,1,  6,17,2,  5,16,2,  1,16,2,  -1,16,-1,  -1,16,0,  5,16,0,  0,14,0,  3,15,0,  8,14,-1,  7,16,-1];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 7:  // Albatross
				this.hintQueue = new Array(
					shapes.getShape(1), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(4), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(1), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(3));

			var hintDataList = [1,18,0,0,17,3,8,16,3,5,17,2,6,16,2,3,16,0,1,16,2,-1,17,1,5,17,3,5,18,0,6,16,0,2,15,3,3,15,1,1,17,3];
			this.createHintQueue(hintDataList);
			break;
			case 8:
				// Number One
				this.hintQueue = new Array(
					shapes.getShape(1), shapes.getShape(4), shapes.getShape(6), shapes.getShape(0), shapes.getShape(2), shapes.getShape(5), shapes.getShape(3));
				
				var hintDataList = [3,18,0,  0,17,2,  0,16,0,  4,15,-1,  6,17,0,  8,16,-1,  3,17,-1];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 9:
				// Pelican
				this.hintQueue = new Array(
					shapes.getShape(5), shapes.getShape(2), shapes.getShape(4), shapes.getShape(0), shapes.getShape(6), shapes.getShape(1), shapes.getShape(3));
			
				var hintDataList = [0,17,-1,  1,16,2,  5,18,0,  5,16,-1,  8,16,-1,  5,17,0,  3,16,2];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 10:  // O - 1, I - 6, L - 0, S - 5, J - 4, Z - 2, T - 3
				// DT Cannon TSZ base
				this.hintQueue = new Array(
					shapes.getShape(3), shapes.getShape(1), shapes.getShape(2), shapes.getShape(6), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(4), shapes.getShape(0), shapes.getShape(3), shapes.getShape(3));
			
				var hintDataList = [4,18,0,  -2,18,0,  2,17,1,  8,16,-1,  6,17,-1,  7,17,-1,  3,15,2,  -1,15,1,  2,13,-1,  1,16,2,  1,17,3];
				
				for(var i = 0; i < this.hintQueue.length; i++) {
					this.hintQueue[i].x = hintDataList[i * 3];
					this.hintQueue[i].y = hintDataList[i * 3 + 1];
					this.hintQueue[i].state = this.hintQueue[i].nextState(hintDataList[i * 3 + 2]);
				}
			break;
			case 11:
				this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(1), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(3), shapes.getShape(0), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(3), shapes.getShape(4), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(0), shapes.getShape(6));
				var hintDataList = [3,17,1,6,18,0,1,17,3,5,17,3,2,16,3,-1,17,1,4,15,0,5,13,1,3,14,0,-1,14,3,8,15,3,-1,15,0,0,13,0,6,16,2,0,13,2,4,14,0,2,13,3,6,17,1,7,18,0,3,16,1,7,17,2,6,18,0,1,18,0,-1,17,1,2,16,2,5,17,0,0,15,2,3,15,2,6,15,2,8,16,3];
				this.createHintQueue(hintDataList);
			break
			 case 12:
				this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3));
				var hintDataList = [3,17,1,6,18,0,5,17,2,1,18,0];
				this.createHintQueue(hintDataList);
			break;
			case 13:
				this.hintQueue = new Array(
					shapes.getShape(4), shapes.getShape(6), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(5), shapes.getShape(0), shapes.getShape(1), shapes.getShape(0), shapes.getShape(6), shapes.getShape(0), shapes.getShape(5), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4));

			var hintDataList = [0,18,0,3,18,0,-1,17,0,7,18,0,3,17,0,8,16,3,0,15,2,-2,14,0,3,15,2,3,14,0,1,13,3,8,14,3,7,12,2,5,16,2,3,14,3,6,17,3,5,18,0];
			this.createHintQueue(hintDataList);
			break;
			case 14:
				this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(6), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(0), shapes.getShape(4), shapes.getShape(6), shapes.getShape(0), shapes.getShape(0), shapes.getShape(3), shapes.getShape(5));

				var hintDataList = [-1,17,1,3,18,0,3,17,0,7,18,0,6,16,3,8,16,3,0,16,3,0,14,0,8,13,3,4,15,1,6,14,2,1,17,1,2,17,2];
				
				this.createHintQueue(hintDataList);
			break;
			case 15:
					this.hintQueue = new Array(
					shapes.getShape(0), shapes.getShape(2), shapes.getShape(5), shapes.getShape(6), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(2), shapes.getShape(5), shapes.getShape(0), shapes.getShape(1), shapes.getShape(6), shapes.getShape(4), shapes.getShape(3), shapes.getShape(4), shapes.getShape(5), shapes.getShape(6), shapes.getShape(0), shapes.getShape(1), shapes.getShape(2), shapes.getShape(3), shapes.getShape(4), shapes.getShape(1), shapes.getShape(3), shapes.getShape(4), shapes.getShape(3));

				var hintDataList = [-1,17,1,2,18,0,4,17,3,6,18,0,6,17,0,2,15,2,-1,14,1,5,17,0,4,14,3,5,14,3,6,15,0,6,14,3,8,12,3,0,16,1,6,15,0,0,15,0,-1,12,3,6,13,1,2,15,0,3,13,0,1,17,2,5,14,1,6,15,0,2,17,3,3,15,2,1,17,2];
				
				this.createHintQueue(hintDataList);
				break;
			default:
				this.hintQueue.unshift(utils.deepClone(shapes.randomShape()));
					return;
			}
		
		}
		
		this.isHintInit = 1;
		
		return;
	},
	// End initHint

	getNextHint(opener) {
		if(this.customHintQueue.length > 0) return this.customHintQueue[this.hintIdx++%this.customHintQueue.length];
		this.initHint(opener);
		var mino = this.hintQueue[this.hintIdx];
		this.hintIdx++;
		if(this.hintIdx >= this.hintQueue.length) {
			this.hintIdx = 0;
			if(opener < 1000)
				this.isHintInit = 0;
			else this.isHintInit = 1;
		}
		return mino;
	},
	
	reset() {
		this.shapeQueue = [];
		this.hintQueue = [];
		this.idx = 0;
		this.hintIdx = 0;
		this.isInit = 0;
		this.isHintInit = 0;
	},
	getLength() {
		return this.customHintQueue.length || this.hintQueue.length;
	},
	addSequence(sequence) {
		//this.reset();
		//this.shapeQueue = utils.deepClone(sequence);
		//this.hintQueue = utils.deepClone(sequence);
		for(var i in sequence)
		{
			var shape;
			shape = sequence[i];
			shape.x = sequence[i].x;
			shape.y = sequence[i].y;
			shape.state = sequence[i].state;
			this.customHintQueue.unshift(utils.deepClone(shape));
			shape.x = shape.originX;
			shape.y = shape.originY;
			this.customShapeQueue.unshift(utils.deepClone(shape));
			this.isInit = 1;
			this.isHintInit = 1;
			this.idx = 0;
			this.hintIdx = 0;
		}
	}
};

function reset() {
	openerGenerator.reset();
}

function getNextMino(opener) {
	var mino = openerGenerator.getNextMino(opener);
	return mino;
}
function getNextHint(opener) {
	var mino = openerGenerator.getNextHint(opener);
	return mino;
}
function getLength() {
	return openerGenerator.getLength();
}

function addSequence(sequence) {
	openerGenerator.addSequence(sequence);
}

module.exports.addSequence = addSequence;
module.exports.getNextMino = getNextMino;
module.exports.getNextHint = getNextHint;
module.exports.getLength = getLength;
module.exports.reset = reset;
// export getNextMino;
// export getNextHint;
// export getLength;
// export reset;



},{"./shapes.js":7,"./utils.js":8}],7:[function(require,module,exports){
var consts = require('./consts.js');
var utils = require('./utils.js');
// import * as consts from './const.js';
var COLORS = consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;

/**
	Defined all shapes used in Tetris game. 
	You can add more shapes if you wish.
*/


function ShapeL() {
    var state1 = [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 1, 1, 0],
        [0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[1, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var state4 = [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 1, 0, 0],
        [0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		 0,  0,  0,  0,
		 -1,  0, -1,  0,
		 -1, -1, -1, -1,
		 0,  2,  0,  2,
		 -1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 3;
    this.y = -3;
	this.originX = 3;
	this.originY = -3;
    this.flag = 'L';
}

function ShapeLR() {
    var state1 = [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    var state2 = [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
		[0, 1, 0, 0],
        [0, 0, 0, 0]
    ];

    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 0, 0]
    ];

    var state4 = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
		[1, 1, 0, 0],
        [0, 0, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		 0,  0,  0,  0,
		 -1,  0, -1,  0,
		 -1, -1, -1, -1,
		 0,  2,  0,  2,
		 -1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 3;
    this.y = -3;
	this.originX = 3;
	this.originY = -3;
    this.flag = 'LR';
}

function ShapeO() {

    var state1 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state4 = [
        [0, 0, 1, 1],
        [0, 0, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0,
		0,  0,  0,  0
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 2;
    this.y = -2;
	this.originX = 2;
	this.originY = -2;
    this.flag = 'O';
}

function ShapeI() {

	// North
    var state1 = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

	// East
    var state2 = [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 1, 0]
    ];
	
	// South
    var state3 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
		[1, 1, 1, 1],
        [0, 0, 0, 0]
    ];
	
	// West
    var state4 = [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
		[0, 1, 0, 0],
        [0, 1, 0, 0]
    ];
	
	var state1RotationPointsOffset = [ 
		0, 0, 0, 0,
		-1, 0, -2,  0,
		2,  0,  1,  0,
		-1,  2, -2, -1,
		2, -1,  1,  2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		2,  0, -1,  0,
		-1,  0,  2,  0,
		2,  1, -1,  2,
		-1, -2,  2, -1

	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  2,  0,
		-2,  0, -1,  0,
		1, -2,  2,  1,
		-2,  1, -1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-2,  0,  1,  0,
		1,  0, -2,  0,
		-2, -1,  1, -2,
		1,  2, -2,  1
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];

    this.x = 3;
    this.y = -4;
	this.originX = 3;
	this.originY = -4;
    this.flag = 'I';
}

function ShapeT() {
    var state1 = [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    var state3 = [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
    var state4 = [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	
	// rotation points clockwise<point1, point2>, counterclockwise<point1, point2>
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,   
		1,  0, -1,  0,   
		1,  1, -1,  1,   
		NaN, NaN,  NaN,  NaN,   
		1, -2, -1, -2

	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,   
		1,  0,  1,  0,   
		1, -1,  1, -1,   
		0,  2,  0,  2,   
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,  
		-1,  0,  1,  0,   
		NaN,  NaN,  NaN,  NaN,   
		0, -2,  0, -2,  
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,  
		-1,  0, -1,  0,  
		-1, -1, -1, -1,   
		0,  2,  0,  2,  
		-1,  2, -1,  2
	];
	
	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
	this.states = [state1, state2, state3, state4];
	
    this.x = 3;
    this.y = -2;
	this.originX = 3;
	this.originY = -2;
    this.flag = 'T';
}

function ShapeZ() {
    var state1 = [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	var state3 = [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
    ];
	var state4 = [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
		[1, 0, 0, 0],
		[0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0, -1,  0,
		-1, -1, -1, -1,
		0,  2,  0,  2,
		-1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 3;
    this.y = -2;
	this.originX = 3;
	this.originY = -2;
    this.flag = 'Z';
}

function ShapeZR() {
    var state1 = [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
    ];
    var state2 = [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 0]
    ];
	var state3 = [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
		[1, 1, 0, 0],
		[0, 0, 0, 0]
    ];
	var state4 = [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0]
    ];

	// Rotation point offsets: clockwise<point1, point2>, counterclockwise<point3, point4>, <newline>
	// In guidline Tetris each piece has 5 possible rotation points with respect to each state/orientation. Iterate through all every rotation.
	var state1RotationPointsOffset = [ 
		0,  0,  0,  0,
		1,  0, -1,  0,
		1,  1, -1,  1,
		0, -2,  0, -2,
		1, -2, -1, -2
	];
	var state2RotationPointsOffset = [
		0,  0,  0,  0,
		1,  0,  1,  0,
		1, -1,  1, -1,
		0,  2,  0,  2,
		1,  2,  1,  2
	];
	var state3RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0,  1,  0,
		-1,  1,  1,  1,
		0, -2,  0, -2,
		-1, -2,  1, -2
	];
	var state4RotationPointsOffset = [
		0,  0,  0,  0,
		-1,  0, -1,  0,
		-1, -1, -1, -1,
		0,  2,  0,  2,
		-1,  2, -1,  2
	];

	this.rotationPoints = [state1RotationPointsOffset, state2RotationPointsOffset, state3RotationPointsOffset, state4RotationPointsOffset];
    this.states = [state1, state2, state3, state4];
    this.x = 3;
    this.y = -2
	this.originX = 3;
	this.originY = -2;
    this.flag = 'ZR';
}


/**
doesShapeOverlap
@param shape: tetris shape
@param matrix: game matrix
*/
var doesShapeOverlap = function(shape, matrix) {	
    var rows = matrix.length;
    var cols = matrix[0].length;
	var rotationDirection = 0;
	
    var isBoxInMatrix = function(box) {

		
        var x = shape.x + box.x;
        var y = shape.y + box.y;
		if(isNaN(x))return true;
		if(isNaN(y))return true;
		if(x < 0) return true;
		if(x > matrix.cols)return true;
		if(y > rows) return true;
		// todo: why is matrix not defined when piece popped from hold stack
		if(matrix[y] == undefined) return true;
        //console.log("matrix X Y: " + " " + x + " "+ y);
		return (matrix[y][x] != 0)
    };

	boxes = shape.getBoxes(shape.state);
	
	
	for (var i in boxes)
        if (isBoxInMatrix(boxes[i]))
            return true;
    
    return false;
};

/**
Is same on matrix
@param shape: tetris shape
@param hintPiece: hintPiece shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isBoxesSame = function(shape, hintPiece) {	
    var isBoxSame = function(shapeBox, hintPieceBox) {

        var shapeX = shape.x + shapeBox.x;
        var shapeY = shape.y + shapeBox.y;
		var hintPieceX = hintPiece.x + hintPieceBox.x;
		var hintPieceY = hintPiece.y + hintPieceBox.y;

		if(shapeX == hintPieceX && shapeY == hintPieceY)
			return true;
		
		return false;
	};
	
    //var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);
    
	var boxes;
	var hintPieceBoxes;
	

	boxes = shape.getBoxes(shape.state);
	
	hintPieceBoxes = hintPiece.getBoxes(hintPiece.state);
	
	for (var i in boxes) {
        if (!isBoxSame(boxes[i], hintPieceBoxes[i])) {
            return false;
        }
    }
    return true;
};

/**
Is shape can move
@param shape: tetris shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isShapeCanMove = function(shape, matrix, action) {
    var rows = matrix.length;
    var cols = matrix[0].length;
	var rotationDirection = 0;
	
    var isBoxCanMove = function(box) {

        var x = shape.x + box.x;
        var y = shape.y + box.y;
        if (y < 0) {
            return true;
        }
        if (action === 'left') {
            x -= 1;
            return x >= 0 && x < cols && matrix[y][x] == 0;
        } else if (action === 'right') {
            x += 1;
            return x >= 0 && x < cols && matrix[y][x] == 0;
        } else if (action === 'up') {
            y -= 1;
            return y >= 0 && matrix[y][x] == 0;
        } else if (action === 'down') {
            y += 1;
            return y < rows && matrix[y][x] == 0;
        } else if (action === 'rotate') {
			rotationDirection = 1;
            return y < rows && !matrix[y][x];
        } else if (action === 'rotateclockwise') {
			rotationDirection = -1;
            return y < rows && !matrix[y][x];
        }
    };
	
    //var boxes =  action === 'rotate'?shape.getBoxes(shape.nextState()) : shape.getBoxes(shape.state);
    
	var boxes;
	
	if(rotationDirection != 0)
		boxes = shape.getBoxes(shape.nextState(rotationDirection));
	else
		boxes = shape.getBoxes(shape.state);
	
	
	for (var i in boxes) {
        if (!isBoxCanMove(boxes[i])) {
            return false;
        }
    }
    return true;
};

/**
 All shapes shares the same method, use prototype for memory optimized
*/
ShapeL.prototype =
ShapeLR.prototype =
ShapeO.prototype =
ShapeI.prototype =
ShapeT.prototype =
ShapeZ.prototype =
ShapeZR.prototype = {

	init: function(result) {
		this.color = COLORS[result];
		this.state = 0;
		this.allBoxes = {};
		this.y = 0;
	},
	// Get boxes matrix which composite the shape
	getBoxes: function(state) {

		var boxes = this.allBoxes[state] || [];
		if (boxes.length) {
			return boxes;
		}

		var matrix = this.matrix(state);
		for (var i = 0; i < matrix.length; i++) {
			var row = matrix[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === 1) {
					boxes.push({
						x: j,
						y: i
					});
				}
			}
		}
		this.allBoxes[state] = boxes;
		return boxes;
	},
	//Get matrix for specified state
	matrix: function(state) {
		var st = state !== undefined ? state : this.state;
		return this.states[st];
	}, 

	canMoveTo: function(shape, matrix) {
		if(!doesShapeOverlap(shape, matrix))
			return true;
		return false;
	},
	// 0 - no, 1 - up,left, 2 - up,right, 3 - down,left, 4 - down, right
	kickShape: function(matrix, rotationDirection) {

	let clone = utils.deepClone(this);
	
	for(var j = 0; j < 4; j++) {
		if(this.state == j) {
			clone.state = this.nextState(rotationDirection);
			var i = 0;
			if(rotationDirection == 1)
				i = 2;
			for(; i < 5*4; i+=4)
			{
				var shiftX = this.rotationPoints[j][i];
				var shiftY = this.rotationPoints[j][i+1];
				if(!isNaN(shiftY) && !isNaN(shiftX)) {
					clone.x = this.x + shiftX;
					clone.y = this.y - shiftY;
					if(this.canMoveTo(clone, matrix) == true) {
						this.state = clone.state;
						this.x = clone.x;
						this.y = clone.y;
						return;
					}
				}
			}	
		}
	
	}

		
	},
	//Rotate shape
	rotate: function(matrix) {

			this.kickShape(matrix, -1);

	},
	//Rotate shape clockwise
	rotateClockwise: function(matrix) {
		
			this.kickShape(matrix, 1);

	},
	//Caculate the max column of the shape
	getColumnCount: function() {
		var mtx = this.matrix();
		var colCount = 0;
		for (var i = 0; i < mtx.length; i++) {
			colCount = Math.max(colCount, mtx[i].length);
		}
		return colCount;
	},
	//Caculate the max row of the shape
	getRowCount: function() {
		return this.matrix().length;
	},
	//Get the right pos of the shape
	getRight: function() {
		var boxes = this.getBoxes(this.state);
		var right = 0;

		for (var i in boxes) {
			right = Math.max(boxes[i].x, right);
		}
		return this.x + right;
	},

	//Return the next state of the shape
	nextState: function(direction) {
		if(direction == 0) return this.state;
		var rotate = this.state;
		rotate += direction;
		if(rotate < 0)
			return this.states.length - 1;
		
		return rotate % this.states.length;
	},

	//Check if the shape can move down
	canDown: function(matrix) {
		return isShapeCanMove(this, matrix, 'down');
	},
	//Move the shape down 
	goDown: function(matrix) {
		if (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
	},
	//Move the shape up 
	goUp: function(matrix) {
		if (isShapeCanMove(this, matrix, 'up')) {
			this.y -= 1;
		}
	},
	//Move the shape to the Bottommost
	bottomAt: function(matrix) {
		var save = this.y;
		var ret;
		while (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
		ret = this.y;
		this.y = save;
		return ret;
	},
	//Move the shape to the Bottommost
	goBottom: function(matrix) {
		while (isShapeCanMove(this, matrix, 'down')) {
			this.y += 1;
		}
	},
	//Move the shape to the left
	goLeft: function(matrix) {
		if (isShapeCanMove(this, matrix, 'left')) {
			new Audio('./dist/sound/Click.ogg').play();
			this.x -= 1;
		}
	},
	//Move the shape to the right
	goRight: function(matrix) {
		if (isShapeCanMove(this, matrix, 'right')) {
			new Audio('./dist/sound/Click.ogg').play();
			this.x += 1;
		}
	},
	//Copy the shape data to the game data
	copyTo: function(matrix) {
		var smatrix = this.matrix();
		for (var i = 0; i < smatrix.length; i++) {
			var row = smatrix[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === 1) {
					var x = this.x + j;
					var y = this.y + i;
					if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
						matrix[y][x] = this.color;
					}
				}
			}
		}
	},
	// check if piece is same on matrix
	isSameSRS: function(shape) {
		return isBoxesSame(this, shape)
	},
	resetOrigin: function() {
		this.y = this.originY + 1;
	},
	nType: function() {
		
		switch (this.flag) {
			case 'L':
				// shape = new ShapeL();
				return 0;
				break;
			case 'O':
				//shape = new ShapeO();
				return 1;
				break;
			case 'Z':
				// shape = new ShapeZ();
				return 2;
				break;
			case 'T':
				// shape = new ShapeT();
				return 3;
				break;
			case 'LR':
				// shape = new ShapeLR();
				return 4;
				break;
			case 'ZR':
				// shape = new ShapeZR();
				return 5;
				break;
			case 'I':
				// shape = new ShapeI();
				return 6;
				break;
		}
	}
}

/**
	Create  a random shape for game
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Handles randomly generating and returning a tetromino
var RandomGenerator = {
	returnBag: [],
    getTetrimino() {
		if(this.returnBag.length < 7) 
			this.returnBag.push.apply(this.returnBag, this.generateNewBag());
		return parseInt(this.returnBag.shift());
    },
	onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	},
    generateNewBag() {
		var minoes = ['0','1','2','3','4','5','6'];
		
        var newBag = [];	
		var bagLength = 7;

		while(newBag.length < bagLength)
		{
			mino = getRandomInt(bagLength);
			newBag.push(minoes[mino]);
			newBag = newBag.filter(this.onlyUnique);
		}
		
        return newBag;
    },
	reset() {
		if(this.returnBag != undefined)
			this.returnBag.splice(0, returnBag.length);
	}
		
};

function randomShape() {
	
	
    var result = RandomGenerator.getTetrimino();
    var shape;
	
	
    switch (result) {
        case 0:
            shape = new ShapeL();
            break;
        case 1:
            shape = new ShapeO();
            break;
        case 2:
            shape = new ShapeZ();
            break;
        case 3:
            shape = new ShapeT();
            break;
        case 4:
            shape = new ShapeLR();
            break;
        case 5:
            shape = new ShapeZR();
            break;
        case 6:
            shape = new ShapeI();
            break;
    }
    shape.init(result);
    return shape;
	
}

function getShape(shapei) {
    var result = shapei
    var shape;

    switch (result) {
        case 0:
            shape = new ShapeL();
            break;
        case 1:
            shape = new ShapeO();
            break;
        case 2:
            shape = new ShapeZ();
            break;
        case 3:
            shape = new ShapeT();
            break;
        case 4:
            shape = new ShapeLR();
            break;
        case 5:
            shape = new ShapeZR();
            break;
        case 6:
            shape = new ShapeI();
            break;
    }
    shape.init(result);
    return shape;
}

module.exports.resetMinoRNG = RandomGenerator.reset;
module.exports.randomShape = randomShape;
module.exports.getShape = getShape;
// export randomShape;
// export getShape;

},{"./consts.js":2,"./utils.js":8}],8:[function(require,module,exports){

var exports = module.exports = {};

var setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

var getCookie = function(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

var $ = function(id){
	return document.getElementById(id);
};



//if object is plain object
var _isPlainObject = function(obj) {

    if (typeof obj !== 'object') {
        return false;
    }


    if (obj.constructor &&
        !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
};

// Deeper clone
var deepClone = function(copyObject) {
	return Object.assign(Object.create(Object.getPrototypeOf(copyObject)), copyObject);
};

// this method source code is from jquery 2.0.x
// merge object's value and return
var extend = function() {
    var src, copyIsArray, copy, name, options, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        // skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && typeof obj !== 'function') {
        target = {};
    }


    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && _isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    //console.log('abc');

                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};


var proxy = function(fn,context){
    var args = [].slice.call( arguments, 2 );
    proxy = function() {
            return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
    };
    return proxy;
};

var aniFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = aniFrame;


exports.$ = $;
exports.extend = extend;
exports.proxy = proxy;
exports.deepClone = deepClone;
exports.setCookie = setCookie;
exports.getCookie = getCookie;
// export $;
// export extend;
// export proxy;

},{}],9:[function(require,module,exports){
/**
 All dom definitions and actions
*/
var utils = require('./utils.js');
var consts = require('./consts.js');
// import * as utils from './utils.js';
// import * as consts from './const.js';

var $ = utils.$;

//doms
var scene = $('scene');
var side = $('side');
var info = $('info');
var preview = $('preview');
var hold = $('hold');
var leftSide = $('leftSide');
var level = $('level');
var score = $('score');
var lines = $('lines');
var rewardInfo = $('rewardInfo');
var reward = $('reward');
var gameOver = $('gameOver');
var btnRestart = $('restart');
var finalScore = $('finalScore');


//defaults
var SIDE_WIDTH = consts.SIDE_WIDTH;


/**
	Caculate the game container size
*/
var getContainerSize = function(maxW,maxH){

	var dw = document.documentElement.clientWidth;
	var dh = document.documentElement.clientHeight;

	var size = {};
	if (dw>dh){
		size.height = Math.min(maxH,dh);
		size.width = Math.min(size.height /*/ 2*/ + SIDE_WIDTH,maxW);
	}else{
		size.width = Math.min(maxW,dw);
		size.height =  Math.min(maxH,dh);
	}
	return size;

};


/**
	Layout game elements
*/
var layoutView = function(container,maxW,maxH){

	var size = getContainerSize(maxW,maxH);
	var st = container.style;
	st.height = size.height + 'px';
	st.width = size.width + 'px';
	st.marginTop = (-(size.height/2)) + 'px';
	st.marginLeft = (-(size.width/2)) + 'px';

	//layout scene
	
	//hold.width = 80;
	//hold.height = 380;
	
	
	scene.height = size.height;
	
	scene.width = scene.height / 2;
	
	
	var sideW = size.width - scene.width + leftSide.width;
	side.style.width = sideW + 'px';
	if (sideW < SIDE_WIDTH ){
		info.style.width = side.style.width;
	}
	side.style.height = 500 + 'px';
	hold.style.top = 10+'px';//preview.top + 10px pad

	
	preview.width = 80;
	preview.height = 380;
	
	hold.width = 80;
	hold.height = 380;
		
	gameOver.style.width = scene.width +'px';


}

/**
	Main tetris game view
*/
var tetrisView = {


	init:function(id, maxW,maxH){
	  this.container = $(id);
	  this.scene = scene;
	  this.preview = preview;
	  this.hold = hold;
	  this.btnRestart = btnRestart;
	  layoutView(this.container,maxW,maxH);
	  this.scene.focus();

	  rewardInfo.addEventListener('animationEnd',function(e){
		 rewardInfo.className = 'invisible';
	  });
	},
	// Update the score 
	setScore:function(scoreNumber){
		score.innerHTML = scoreNumber;	
	},
	// Update the finnal score
	setFinalScore:function(scoreNumber){
		finalScore.innerHTML = scoreNumber;
	},
	// Update the level
	setLevel:function(levelNumber){
		level.innerHTML = levelNumber;
	},
	// Update the extra reward score
	setLines:function(setlines){
		//lines.innerHTML = setlines;
	
	},
	setReward:function(rewardScore){
		if (rewardScore>0){
			reward.innerHTML = rewardScore;
			rewardInfo.className = 'fadeOutUp animated';	
		}else{
			rewardInfo.className = 'invisible';
		}
	},
	// Set game over view
	setGameOver:function(isGameOver){
		gameOver.style.display = isGameOver?'block':'none';
	}
};

module.exports = tetrisView;
// export tetrisView;
},{"./consts.js":2,"./utils.js":8}]},{},[5]);
