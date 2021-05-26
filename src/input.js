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
			this.isDelayAutoShiftStarted = false;
			this.keyboardShiftTimer = new Date();
			
			// Do shift if key has been pushed down
			if(this.keyboardKeys[key] == true)
				this.inputQueue.push(key);
		}
		
		var deltaTime = (new Date()).getTime() - this.keyboardShiftTimer.getTime();
		
            if (!this.isDelayAutoShiftStarted) {
				
                if (deltaTime >= DAS) {
					this.keyboardShiftTimer = new Date();
                    this.isDelayAutoShiftStarted = true;
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
    isDelayAutoShiftStarted: false,
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