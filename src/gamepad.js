
var gamepadAPI = {
    controller: {},
    turbo: false,
    connect: function(evt) {
        gamepadAPI.controller = evt.gamepad;
        gamepadAPI.turbo = false;
        console.log('Gamepad connected.');
    },
    disconnect: function(evt) {
        gamepadAPI.turbo = false;
		  console.log(
			"Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index,
			e.gamepad.id,
			e.gamepad.buttons.length,
			e.gamepad.axes.length,
		  );
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
             console.log(c.buttons[b]);
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
