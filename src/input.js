var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
		this.gamepadShiftTimer = new Date();
		this.gamepadButtonTimer = new Date();
		this.keyboardKeyTimer = new Date();
		this.keyboardShiftTimer  = new Date();
		this.settingsMap = new Map();		
		
		// var init = utils.getCookie("init");
		// if(init == "") 
			for(var i in this.settingsList) 
				utils.setCookie(this.settingsList[i], this.settingsDefault[i], 30); //  cookies expire in 30 days
		// else
			// for(var i in this.settingsList)
				// this.settingsDefault[i] = utils.getCookie(this.settingsList[i]);
			
		 for(var i in this.settingsList)
			 this.settingsMap.set(this.settingsList[i], this.settingsDefault[i]);
		
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
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Harddrop"));	// hard drop
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Hold"));	// hold
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Rotateccw"));	// rotate counter
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Rotate"));	// rotate cwise
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Pophold")); // Pop hold stack
		this.gamepadButtonsDown(this.settingsMap.get("Gamepad Reset"));	// reset

		
		return;
	},
	
	processGamepadDPad()  {
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Left"));	// shift left
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Right"));	// shift right
		this.gamepadDPadDown(this.settingsMap.get("Gamepad Down"));	// down
		
		return;
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
	// doing a lot of back and forth between strings and integers to represtent the same thing -- todo: fix
	processKeys() {
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Harddrop")));		 //32);  // Space	- hard drop
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Rotate")));		//88);  // X		- rotate
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Rotateccw")));		//90);  // Z		- rotateccw
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Hold")));		//16);  // shift	- push hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Pophold")));	// ctrl	- pop hold stack
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Background")));  // q		- turn off background
		this.processKeyDown(parseInt(this.settingsMap.get("Keyboard Reset"))); 		 // r		- reset
		//this.processKeyDown(this.settingsMap.get("Keyboard hold")));  // c		- pop hold stack
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
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Left")));		//39);  // right
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Right")));		//37);	// left
		this.processKeyboardArrowKeys(parseInt(this.settingsMap.get("Keyboard Down")));  // down
	},
	// Direction arrows
    processKeyboardArrowKeys(key) {		
		var DAS = parseInt(this.settingsMap.get("Keyboard DAS"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("Keyboard ARR"));	//20.0;

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
	gamepadButtonClear() {
		gpButtons = [];
		isGamepadDown = false;
		isGamepadButtonDown = false;
		gamepadQueue = [];
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

	settingsList: ["Soft Drop Rate [1 - 100]", 
					"Keyboard DAS", "Keyboard ARR", "Keyboard Harddrop", "Keyboard Hold", 
					"Keyboard Left", "Keyboard Right", "Keyboard Rotateccw", "Keyboard Rotate", 
					"Keyboard Down", "Keyboard Pophold", "Keyboard Reset", "Keyboard Background",
					
					"Gamepad DAS", "Gamepad ARR", "Gamepad Harddrop", "Gamepad Hold",
					"Gamepad Left", "Gamepad Right", "Gamepad Rotateccw", "Gamepad Rotate", 
					"Gamepad Down","Gamepad Pophold", "Gamepad Reset", "Gamepad Background", 
					"path", "High Score"],
	
	settingsDefault: ["70", 
						"167.0", "33.0", "32", "16",
						"37", "39", "90", "88",
						"40", "17", "82", "81",
						
						"167.0", "33.0", "RB", "LB",
						"DPad-Left", "DPad-Right", "A", "B",
						"DPad-Down", "DPad-Up", "Back", "", 
						"=/",""],
	settingsMap: []
};

module.exports = UserInputs;
// export UserInputs;