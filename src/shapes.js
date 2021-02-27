var consts = require('./consts.js');
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
	this.originY = -2;
    this.flag = 'O';
}

function ShapeI() {
/*	// North
    var state1 = [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
    ];

	// East
    var state2 = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
		[1, 1, 1, 1],
        [0, 0, 0, 0]
    ];
	
	// South
    var state3 = [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
		[0, 0, 1, 0],
        [0, 0, 1, 0]
    ];
	
	// West
    var state4 = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
		[0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
	*/
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

	let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	
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
			new Audio('./dist/Click.ogg').play();
			this.x -= 1;
		}
	},
	//Move the shape to the right
	goRight: function(matrix) {
		if (isShapeCanMove(this, matrix, 'right')) {
			new Audio('./dist/Click.ogg').play();
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
			
		
		console.log("return bag: " + this.returnBag);

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
		returnBag = 0;
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
