var gamepad = require('./gamepad.js');
var utils = require('./utils.js');
// import * as gamepad from './gamepad.js';

var UserInputs = {
	init() {
		
		// All game settings  TODO: put somwhere more appropriate
		this.settingsList = this.keyboardKeySettings.concat(this.keyboardShiftEvents.concat(this.keyboardKeyEvents.concat(this.gamepadSettings.concat(this.gamepadDASEvents.concat(this.gamepadOnDownButtonEvents)))));	
		
		// Initialization time stamp
		this.initTime = new Date();
		// Gamepad OnButtonDown event timer
		this.gamepadButtonTimer = this.initTime;
		// Gamepad Left and Right timer
		this.gamepadShiftTimer = this.initTime;
		// Gamepad Down ARR/DAS timer TODO: Switch to SDF(Softdrop factor)
		this.gamepadShiftDownDASTimer = this.initTime;
		// Gamepad Wall Charge  -- repurposed for das loaded detection
		this.gamepadIsCharged = false;
		// Gamepad button up time stamp
		this.gamepadButtonUpEventTimeStamp = (new Date()).getTime();
		this.gamepadButtonDownEventTimeStamp = (new Date()).getTime();
		
		// Keyboard OnKeyDown event timer
		this.keyboardKeyTimer = this.initTime;
		// Keyboard Left and Right ARR/DAS Timer
		this.keyboardShiftTimer  = this.initTime;
		// Keyboard Down ARR/DAS Timer TODO: Switch to SDF(Softdrop factor)
		this.keyboardShiftDownKeyTimer = this.initTime;
		// Keyboard Wall Charge
		this.keyboardIsCharged = false;
		// Keyboard key up event time stamp
		this.keyboardKeyUpEventTimeStamp = (new Date()).getTime();
		this.keyboardKeyDownEventTimeStamp = this.keyboardKeyUpEventTimeStamp 
		
		this.settingsMap = new Map();
		this.gamepadEventMap = new Map();
		
		// var init = utils.getCookie("init");
		// if(init == "") 
			for(var i in this.settingsList) 
				utils.setCookie(this.settingsList[i], this.settingsDefault[i], 30); //  cookies expire in 30 days
		// else
			// for(var i in this.settingsList)
				// this.settingsDefault[i] = utils.getCookie(this.settingsList[i]);
			
		 for(var i in this.settingsList)
			 this.settingsMap.set(this.settingsList[i], this.settingsDefault[i]);
		
		//this.gamepadEvents = this.gamepadDASEvents.concat(this.gamepadOnDownButtonEvents);
		
		var mapIdx = [14, 7, 13, 5, 4, 1, 2, 12, 8, 3];
		for(var i in mapIdx) 
			this.gamepadEventMap.set(this.gamepadDASEvents[i], gamepad.buttons[mapIdx[i]]); //TODO: incorrect
		
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    },
	// Pocess inputs.  To be called every game tick.
	processInputs() {
		if(this.gamepadEnabled) {
			this.updateGamepad();
			this.processGamepadOnDownEvents();
			this.processGamepadDASEvents();
		}
		this.processKeyboardOnDownEvents();
		this.processKeyboardDASEvents();
	},
	isGamepadCharged() {
		return this.gamepadIsCharged;
	},
	isGamepadCharged() {
		return this.gamepadIsCharged;
	},
	getGamepadButtonDownEventTimeStamp() {
		return this.gamepadButtonDownEventTimeStamp;
	},
	updateGamepad() {
		this.gpButtons = gamepad.update();
	},
	gamepadEnabled() {
		return gamepad.controller || false;
	},
	processGamepadOnDownEvents() {
		this.gamepadOnDownButtonEvents.forEach(gamepadButton => this.processGamepadOnDownButton(this.settingsMap.get(gamepadButton)));
	},
	processGamepadDASEvents()  {
		this.gamepadDASEvents.forEach(gamepadButton => this.processGamepadDASButtons(this.settingsMap.get(gamepadButton)));
	},
	// TODO * clean up naming conventions eesh
	processGamepadDASButtons(button) {
		if(button != this.settingsMap.get("Gamepad Down"))
			this.gamepadDASDown(button);
		else
			this.gamepadDownButtonEvent(button);
	},
	// Gamepad DAS Events
	gamepadDASDown(button) {
		var DAS = parseInt(this.settingsMap.get("Gamepad DAS"));	
		var ARR = parseInt(this.settingsMap.get("Gamepad ARR"));
		
		var isContained = this.gpButtons.includes(button);
		var isPrevContained = this.prevGpButtons.includes(button);
		
		if(isPrevContained != isContained ) {
			/*var isButtonUpEvent = isPrevContained == true && isContained == false;
			if(isButtonUpEvent){
				this.gamepadButtonUpEventTimeStamp = (new Date()).getTime();
				console.log("Entry delay delta:"  + (this.gamepadButtonUpEventTimeStamp - this.entryDelayTimeStamp));
			}
			var isButtonDownEvent = isContained == true && isPrevContained == false;
			if(isButtonDownEvent && isPrevContained != undefined) {
				this.gamepadButtonDownEventTimeStamp = (new Date()).getTime();
				//console.log("Entry delay: "  + ((this.gamepadButtonDownEventTimeStamp - this.entryDelayTimeStamp)/16.0));
			}*/
			this.gamepadIsCharged = false;
			// Not being held yet
			this.gamepadShiftTimer = new Date();
			this.isDelayedPassedGamepadShift = false;
			// Add button to queue on pressed input
			if(isContained)
				this.gamepadQueue.push(button);
		}
		
		var deltaTime = (new Date()).getTime() - this.gamepadShiftTimer.getTime();
		
		
		if (!this.isDelayedPassedGamepadShift && !this.gamepadIsCharged) {
			if (deltaTime >= DAS) {
				this.gamepadShiftTimer = new Date();
				this.isDelayedPassedGamepadShift = true;	
			}
		} 
		else {
			if (deltaTime >= ARR && isContained ) {
				this.gamepadIsCharged = true;
				this.gamepadQueue.push(button);
				this.gamepadShiftTimer = new Date();
			}
		}
		return;
	},
	// Down button DAS event
	gamepadDownButtonEvent(button) {
		var DAS = parseInt(this.settingsMap.get("Gamepad Down DAS"));	
		var ARR = parseInt(this.settingsMap.get("Gamepad Down ARR"));
		
		var isContained = this.gpButtons.includes(button);
		var isPrevContained = this.prevGpButtons.includes(button);
		
		if(isPrevContained != isContained ) {
			// Not being held yet
			this.gamepadShiftDownDASTimer = new Date();
			this.isDelayedPassedDASGamepadDown = false;
			// Add button to queue on pressed input
			if(isContained)
				this.gamepadQueue.push(button);
		}
		
		var deltaTime = (new Date()).getTime() - this.gamepadShiftDownDASTimer.getTime();

		
		if (!this.isDelayedPassedDASGamepadDown) {
			if (deltaTime >= DAS) {
				this.gamepadShiftDownDASTimer = new Date();
				this.isDelayedPassedDASGamepadDown = true;	
			}
		} 
		else {
			if (deltaTime >= ARR && isContained) {
				this.gamepadQueue.push(button);
				this.gamepadShiftDownDASTimer = new Date();
			}
		}
		return;
	},
	// gamepad on down events
	processGamepadOnDownButton(button) {
		var DAS = Infinity;  // Only single press aka. no arr or das
		var ARR = 300.0;
		
		var isContained = this.gpButtons.includes(button);
		var isPrevContained = this.prevGpButtons.includes(button);

		if(isPrevContained != isContained ) {
			// Not being held yet
			this.gamepadShiftDownDASTimer = new Date();
			this.isPassedDelayGamepadShift = false;
			// Add button to queue on pressed input
			if(isContained)
				this.gamepadQueue.push(button);
		}
		
		var deltaTime = (new Date()).getTime() - this.gamepadShiftDownDASTimer.getTime();
		
		if (!this.isPassedDelayGamepadShift) {
				if (deltaTime >= DAS) {
					this.gamepadShiftDownDASTimer = new Date();
					this.isPassedDelayGamepadShift = true;
				}
				
		} else {
			if (deltaTime >= ARR && isContained) {
				this.gamepadQueue.push(button);
				this.gamepadShiftDownDASTimer = new Date();
			}
		}
			
	},
	// On key down events
	processKeyboardOnDownEvents() {
		this.keyboardKeyEvents.forEach( key => this.settingsMap.get(key).split(',').forEach( idx => this.processKeyDown( parseInt(idx) ) ) );
	},

	// keyboard events rotate cc, ccw, and hard drop
	processKeyDown(key) {
		var DAS = 0;  // Effectively makes an only on key down event
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
	processKeyboardDASEvents() {
		this.keyboardShiftEvents.forEach(arrowKey => arrowKey.split(',').forEach(option => this.processDASKeyboardKeys(parseInt(this.settingsMap.get(option)))));
	
	},

	// Direction arrows
    processKeyboardArrowKeys(key) {
		var DAS = parseInt(this.settingsMap.get("Keyboard DAS"));
		var ARR = parseInt(this.settingsMap.get("Keyboard ARR"));
	
		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
		// keyboardKeys keys will be true or false depending on [key] state.
		// prevKeyboardKeys may be undefine initially
		/*var isKeyUpEvent = this.prevKeyboardKeys != undefined  && this.prevKeyboardKeys[key] == true && this.keyboardKeys[key] == false;
		if(isKeyUpEvent){
			this.keyboardKeyUpEventTimeStamp = (new Date()).getTime();
			console.log("Entry delay delta:"  + (this.keyboardKeyUpEventTimeStamp - this.entryDelayTimeStamp));
		}
		/*var isKeyDownEvent = this.keyboardKeys[key] = true && this.prevKeyboardKeys != true;
		if(isKeyDownEvent)
			this.keyboardKeyDownEventTimeStamp = (new Date()).getTime();*/
		
			// Not being held yet
			this.isDelayAutoShiftStarted = false;
			this.keyboardShiftTimer = new Date();
			
			// Do shift if key has been pushed down
			if(this.keyboardKeys[key] == true)
				this.inputQueue.push(key);
		}
		
		var deltaTime = (new Date()).getTime() - this.keyboardShiftTimer.getTime();
		
		//if(this.keyboardIsCharged == true)
			//this.isDelayAutoShiftStarted = true;
		
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
	// Process keyboard down
	processKeyboardDownKey(key) {
		var DAS = parseInt(this.settingsMap.get("Keyboard Down DAS"));
		var ARR = parseInt(this.settingsMap.get("Keyboard Down ARR"));

		if(this.prevKeyboardKeys[key] != this.keyboardKeys[key]) {
			// Not being held yet
			this.isDelayAutoShiftDownStarted = false;
			this.keyboardShiftDownKeyTimer = new Date();
			
			// Do shift if key has been pushed down
			if(this.keyboardKeys[key] == true)
				this.inputQueue.push(key);
		}
		
		var deltaTime = (new Date()).getTime() - this.keyboardShiftDownKeyTimer.getTime();
		
            if (!this.isDelayAutoShiftDownStarted) {
				
                if (deltaTime >= DAS) {
					this.keyboardShiftDownKeyTimer = new Date();
                    this.isDelayAutoShiftDownStarted = true;
                }
            } 
			else if(deltaTime >= ARR && this.keyboardKeys[key] == true) {
                    this.inputQueue.push(key);
					this.keyboardShiftDownKeyTimer  = new Date();
			}
	
	},	
	// Process all DAS/ARR controlled keys
	processDASKeyboardKeys(key) {
		if(key != this.settingsMap.get("Keyboard Down"))
			this.processKeyboardArrowKeys(key);
		else
			this.processKeyboardDownKey(key);


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
								// Keyboard settings TODO: switch Keyboard Down DAS/ARR to Keyboard SDF(Soft drop factor, which should default to 4 times gravity)
	keyboardKeySettings:		["Keyboard Down DAS", "Keyboard Down ARR", "Keyboard DAS", "Keyboard ARR"],
	keyboardShiftEvents:		["Keyboard Left", "Keyboard Right", "Keyboard Down", "Keyboard Up"],
	keyboardKeyEvents:			["Keyboard Harddrop", "Keyboard Hold", "Keyboard Rotateccw", "Keyboard Rotate", "Keyboard Pophold", "Keyboard Reset", "Keyboard Pause Toggle", "Default Interval", "Lockdown Timer"],
					
								// Gamepad settings names TODO: switch Gamepad Down DAS/ARR to Gamepad SDF(Soft drop factor, which should default to 4 times gravity)
	gamepadSettings:			["Gamepad Down DAS", "Gamepad Down ARR", "Gamepad DAS", "Gamepad ARR"],
	gamepadDASEvents:			["Gamepad Left", "Gamepad Right", "Gamepad Down"],
	gamepadOnDownButtonEvents:	["Gamepad Harddrop", "Gamepad Hold", "Gamepad Rotateccw", "Gamepad Rotate", "Gamepad Pophold", "Gamepad Reset", "Gamepad Pause Toggle"],
				
	settingsList: [],
					
							// Keyboard
	settingsDefault:		["0.0", "41.6", "160.0", "33.0", 
							"37", "39", "40", "38",
							//"74", "76", "75", "73",
							"32", "16", "90", "88", "17", "82", "80", "600", "1000",
							
							// Gamepad
							"0.0", "41.6", "160.0", "33.0", 
							"DPad-Left", "DPad-Right",	"DPad-Down",
							"RB", "LB", "A", "B", "DPad-Up", "Back", ""],
	settingsMap: []
};

module.exports = UserInputs;
// export UserInputs;
