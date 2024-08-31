var consts = require('./consts.js');
var utils = require('./utils.js');
// import * as consts from './const.js';
var COLORS = consts.COLORS;
var COLUMN_COUNT = consts.COLUMN_COUNT;
var clickAudio = new Audio('./dist/sound/Click.ogg');
clickAudio.load();

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
    this.y = -3;

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

    this.flag = 'ZR';
	
}


/**
Is same on matrix
@param shape: tetris shape
@param currentPiece: currentPiece shape
@param matrix: game matrix
@param action:  'left','right','down','rotate'
*/
var isBoxesSame = function(shape, currentPiece) {	
    var isBoxSame = function(shapeBox, currentPieceBox) {

        var shapeX = shape.x + shapeBox.x;
        var shapeY = shape.y + shapeBox.y;
		var currentPieceX = currentPiece.x + currentPieceBox.x;
		var currentPieceY = currentPiece.y + currentPieceBox.y;

		if(shapeX == currentPieceX && shapeY == currentPieceY)
			return true;
		
		return false;
	};
	
	var boxes;
	var currentPieceBoxes;
	
	boxes = shape.getBoxes(shape.state);
	
	currentPieceBoxes = currentPiece.getBoxes(currentPiece.state);
	
	for (var i in boxes) {
        if (!isBoxSame(boxes[i], currentPieceBoxes[i])) {
            return false;
        }
    }
    return true;
};
/**
doesShapeOverlap
@param shape: tetris shape
@param matrix: game matrix
*/
var canMoveTo = function(shape, matrix) {	
    var rows = matrix.length;
    var cols = matrix[0].length;
	
	
    var canBoxMoveTo = function(box) {

        var x = shape.x + box.x;
        var y = shape.y + box.y;
		/*console.log("matrix X Y: " + " " + x + " "+ y + "\n"
					+"Shape X Y: " + " " + shape.x + " " + shape.y + "\n"
					+"Box X Y: " + " " + box.x + " " + box.y + "\n"
					+"Rows Cols: " + rows + " " + cols);*/
		if(isNaN(x))return false;
		if(isNaN(y))return false;
		if(x < 0) return false;
		if(x > cols)return false;
		if(y > rows) return false;
		
		if(matrix[y] == undefined) return false; //ghost piece
        
		return matrix[y][x]==0;
    };

	var canMove = true;
	var boxes = shape.getBoxes(shape.state);
	
    boxes.forEach(function (box){
		if (!canBoxMoveTo(box))
			canMove = false; 
		}
	);

    return canMove;
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
		this.keysPressed = [];
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
					if(canMoveTo(clone, matrix) == true) {
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
		let clone = utils.deepClone(this);
		clone.y++;
		return canMoveTo(clone, matrix);
	},
	//Move the shape down 
	goDown: function(matrix) {
		let clone = utils.deepClone(this);
		clone.y++;
		if (canMoveTo(clone, matrix)) 
			this.y++;
		
	},
	//Move the shape up 
	goUp: function(matrix) {
		let clone = utils.deepClone(this);
		clone.y--;
		if (canMoveTo(clone, matrix)){
			this.y--;
		
		}
	},
	//Move the shape to the Bottommost
	bottomAt: function(matrix) { // for ghost piece
		while (canMoveTo(this, matrix)) 
			this.y++;
		
		return this.y-1;
	},
	//Move the shape to the Bottommost
	goBottom: function(matrix) {
		//let clone = utils.deepClone(this);
		//clone.y+=1;
		while (canMoveTo(this, matrix)) {
			this.y++;
		}
		this.y--; //one too many need to unify when we do rows - 1
	},
	//Move the shape to the left
	goLeft: function(matrix) {
		let canGoLeft = false;
		let clone = utils.deepClone(this);
		clone.x--;
		if (canMoveTo(clone, matrix)){
			canGoLeft = true;
			//clickAudio.play();
			(new Audio('./dist/sound/Click.ogg')).play();
			this.x--;
		}
		return canGoLeft;
	},
	//Move the shape to the right
	goRight: function(matrix) {
		let canGoRight = false;
		let clone = utils.deepClone(this);
		clone.x++;
		if (canMoveTo(clone, matrix)) {
			canGoRight = true;
			(new Audio('./dist/sound/Click.ogg')).play();
			//clickAudio.play();
			this.x++;
		}
		return canGoRight;
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



// Fisher-Yates shuffle
function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
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

	/*
    getTetrimino() {
		if(this.returnBag.length == 0) // hmmm...dont think this is right.
			this.returnBag.push.apply(this.returnBag, this.generateNewBag());
		return parseInt(this.returnBag.shift());
    },
	*/
	onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	},
    generateNewBag() {
		var minoes = ['0','1','2','3','4','5','6'];
		
        var newBag = [];	
		var bagLength = 7;

		/*while(newBag.length < bagLength)
		{
			mino = getRandomInt(bagLength);
			newBag.push(minoes[mino]);
			newBag = newBag.filter(this.onlyUnique);
		}*/
		newBag = shuffle(minoes);
		
        return newBag;
    },
};

// Bag generator for freeplay
function generateBag() {
	var newBag = RandomGenerator.generateNewBag();
	var returnBag = [];// = newBag.forEach(function(item) {
	for(var i = 0; i < newBag.length; ++i) { 
		returnBag.push(getShape(parseInt(newBag[i]))); 
	} 
	//console.log("return bag: " + newBag.toString());
	return returnBag;
}

/* probably get rid of
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
*/
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


module.exports.getShape = getShape;
module.exports.generateBag = generateBag;

// export getShape;
