var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
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

	incDeciframes() {
		this.keyboardButtonsDeciframes++;
		this.keyboardDirectionArrowsDeciframes++;
		this.gamepadButtonsDeciFrames++;
		this.gamepadDirectionPadDeciFrames++;
	},
	incTickCounter() {
		this.ticks++;
		if(this.ticks > 1200000)this.ticks = 0;  // set to 0 every 12 seconds?
	},
	getTickCounter() {
		return this.ticks;
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
	
	
	//  X, Y, A, B , RB, LB Buttons
	gamepadButtonsDown(finds) {
		var deciDAS = 50.0;
		var deciARR = 10.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);

		if(isPrevContained != isContained ) {
			this.isGamepadButtonDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		var gamepadDASFrames = this.gamepadButtonsDeciFrames;
		
		if (!this.isGamepadButtonDown) {

				if (gamepadDASFrames >= deciDAS) {
					this.gamepadButtonsDeciFrames = 0;
					this.isGamepadButtonDown = true;
				}
				
		} else {
			if (gamepadDASFrames >= deciARR && isContained) {
				//this.gamepadQueue.push(finds);
				this.gamepadButtonsDeciFrames = 0;
			}
		}
			
	},
	
	// Direction Pad
	gamepadDPadDown(finds) {
		var DAS = parseInt(this.settingsMap.get("Gamepad DAS"));	//65.0;
		var ARR = parseInt(this.settingsMap.get("Gamepad ARR"));	//20.0;
		var isContained = this.gpButtons.includes(finds);
		var isPrevContained = this.prevGpButtons.includes(finds);
		
		if(isPrevContained != isContained ) {
			this.isGamepadDown = false;
			// Do once
			if(isContained)
				this.gamepadQueue.push(finds);
		}
		var gamepadDirectionDasFrames = this.gamepadDirectionPadDeciFrames;
			if (!this.isGamepadDown) {
					if (gamepadDirectionDasFrames >= DAS) {
						this.gamepadDirectionPadDeciFrames = 0;
						this.isGamepadDown = true;
						
					}
			} 
			else 
		{
				if (gamepadDirectionDasFrames >= ARR && isContained) {
					this.gamepadQueue.push(finds);
					this.gamepadDirectionPadDeciFrames = 0;
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
		var deciDAS = 50.0;
		var deciARR = 50.0;
		

		// todo: fix this mess
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key] && this.isKeyBoardKeyDown == true) {
			this.isKeyboardKeyDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
				this.keyboardKeys[key] = false;
		}
		
		var keyboardDASFrames = this.keyboardButtonsDeciframes;

		if (!this.isKeyboardKeyDown) {
				if (keyboardDASFrames >= deciDAS) {
					this.keyboardButtonsDeciframes = 0;
					this.isKeyboardKeyDown = true;
				}
		} else {
			if (keyboardDASFrames >= deciARR && this.keyboardKeys[key] == true) {
				//this.inputqueue.push(key);
				this.keyboardButtonsDeciframes = 0;
			}
		}
		
		
		
	},
	
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
			this.isDirectionArrowDown = false;
			if(this.keyboardKeys[key] == true)
				this.inputqueue.push(key);
		}
		
		
		var keyboardDASFrames = this.keyboardDirectionArrowsDeciframes;
		
            if (!this.isDirectionArrowDown) {
				
                if (keyboardDASFrames >= DAS) {
                    this.keyboardDirectionArrowsDeciframes = 0;
                    this.isDirectionArrowDown = true;
                }
            } else {
                if (keyboardDASFrames >= ARR && this.keyboardKeys[key] == true) {
                    this.inputqueue.push(key);
                    this.keyboardDirectionArrowsDeciframes = 0;
                }
            }
        //}
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
		this.prevKeyboardKeys = {...this.keyboardKeys};
	},
	// button states
    isDirectionArrowDown: false,
	isKeyboardKeyDown: false,
	isGamepadDown: false,
	isGamepadButtonDown: false,
	
	// das frame counters 
	keyboardButtonsDeciframes: 0,				// DAS controlled frames/10 for non-shifted keys
	keyboardDirectionArrowsDeciframes: 0, 		// DAS controlled frames/10 for mino shifting keys
	gamepadButtonsDeciFrames: 0,				// DAS controlled frames/10 for non-shifted keys
	gamepadDirectionPadDeciFrames: 0,			// DAS controlled frames/10 for mino shifting keys
	
	// buttons state contatiners
	gpButtons: [],
	prevGpButtons:[],
	keyboardKeys: [],
	prevKeyboardKeys: [],
    
	// button pressed containers
	inputqueue: [],
	gamepadQueue: [],
	
	ticks: 0,
	
	settingsList: ["init", 
					"Keyboard DAS", "Keyboard ARR", "Keyboard Harddrop", "Keyboard Hold", 
					"Keyboard Left", "Keyboard Right", "Keyboard Rotateccw", "Keyboard Rotate", 
					"Keyboard Down", "Keyboard Pophold", "Keyboard Reset", "Keyboard Background",
					
					"Gamepad DAS", "Gamepad ARR", "Gamepad Harddrop", "Gamepad Hold",
					"Gamepad Left", "Gamepad Right", "Gamepad Rotateccw", "Gamepad Rotate", 
					"Gamepad Down","Gamepad Pophold", "Gamepad Reset", "Gamepad Background", 
					"path", "High Score"],
	
	settingsDefault: ["true", 
						"50.0", "16.0", "32", "16",
						"37", "39", "90", "88",
						"40", "17", "82", "81",
						
						"50.0", "16.0", "RB", "LB",
						"DPad-Left", "DPad-Right", "A", "B",
						"DPad-Down", "DPad-Up", "Back", "", 
						"=/"],
	settingsMap: []
};

module.exports = UserInputs;
// export UserInputs;