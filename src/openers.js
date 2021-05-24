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


