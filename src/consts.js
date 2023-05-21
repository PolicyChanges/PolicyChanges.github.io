
//colors for shapes  L, O, Z, T, J, S, I
var colors = ['#ef7a21','#f7d308','#ef2029','#ad4d9c','#5a658f','#42b642','#31c7ef'];
//['#ef7a21','#f7d308','#42b642','#ef2029','#ad4d9c','#5a658f','#31c7ef'];
//['#00af9d','#ffb652','#cd66cc','#66bc29','#0096db','#3a7dda','#ffe100'];
var zoneBlockColor = '#CCCCCC';
var garbageBlockColor = '#808080';

// Gamestates
var gameStates = ["freePlayState", "trainerState", "testTrainerStates", "sequenceEditorState", "quizState", "tspinQuizState", "testRNG"];
var defaultGameState = "freePlayState";

//sidebar width
var sideWidth = 120;


//scene column count
var columnCount = 10;

//scene row count;
var rowCount = 20;

//scene piece entry count;
var entryRowCount = 3;

//previewCount
var previewCount = 6;

//scene gradient start color 
var sceneBgStart = "#000000"
//'#8e9ba6';

//scene gradient end color 
var sceneBgEnd = '#000000'
//'#5c6975';

//preview background color
var previewBg = '#2f2f2f';

//grid line color
var gridLineColor = 'rgba(255,255,255,0.2)';

//box border color
var boxBorderColor = 'rgba(255,255,255,0.5)';


// Game speed
var defaultInterval = 600;


// Level update interval 
var levelInterval = 120 * 1000; 



var exports = module.exports = {};


exports.GAMESTATES = gameStates;
exports.DEFAULT_GAMESTATE = defaultGameState;
exports.COLORS =  colors;
exports.SIDE_WIDTH = sideWidth;
exports.ROW_COUNT = rowCount;
exports.COLUMN_COUNT = columnCount;
exports.SCENE_BG_START = sceneBgStart;
exports.SCENE_BG_END = sceneBgEnd;
exports.PREVIEW_BG = previewBg;
exports.PREVIEW_COUNT = previewCount;
exports.GRID_LINE_COLOR = gridLineColor;
exports.BOX_BORDER_COLOR = boxBorderColor;
exports.DEFAULT_INTERVAL = defaultInterval;
exports.LEVEL_INTERVAL = levelInterval;
exports.ZONE_BLOCK_COLOR = zoneBlockColor;
exports.GARBAGE_BLOCK_COLOR = garbageBlockColor;