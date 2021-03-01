var consts = require('./consts.ds');
var utils = require('./utils.js');
var utils. = requre('./shapes.js');


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


var sequence = {
	this.matrix = initMatrix(consts.ROW_COUNT, consts.COLUMN_COUNT); 
	this.minoList = [];
	this.currentMino = [];
	
	addMino: function(mino) {
		this.minoList.push (mino)
		this.updateMatrix();
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
	
	
};

var sequences = {
	this.sequenceList = [];
	this.currentMino = [];
	
	init(setSequenceList){
		this.sequnceList = setSequenceList;
	},
	addNewSequence: function(newsequence) {
		this.sequenceList.push(newsequence);
	},
	addMinoToCurrentSequence: function(mino) {
		this.currentSequnce.addMino(mino);
	},
	reset: function() {
		sequenceList = [];
	}
};

function getNextMino() {
	currentSequence.popMino();
};