
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
		this.gridSize = scene.height / consts.ROW_COUNT;
		//this.gridSize = scene.height / consts.ROW_COUNT;//consts.COLUMN_COUNT;
		//this.gridSize = Math.max(scene.width / consts.COLUMN_COUNT, scene.height.ROW_COUNT);
		//this.scene.width/=2;
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
 