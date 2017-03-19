//docReady(function() { 
	// initQuoridorDOM();
	

// });
//http://www.javascripter.net/faq/colornam.htm

var BOARD_BACKGROUND_COLOR = "palegreen" ;
var BOARD_WIDTH = 1000;
var BOARD_HEIGHT = 1500;
var BOARD_SCALE = 0.4;
var BOARD_X_OFFSET = 50;
var BOARD_Y_OFFSET = 300;

var BOARD_X_OFFSET_SCALED = BOARD_X_OFFSET * BOARD_SCALE;
var BOARD_Y_OFFSET_SCALED = BOARD_Y_OFFSET * BOARD_SCALE;
var BOARD_SQUARE_SPACING = 100;
var BOARD_LINE_COLOR = "white";
var PAWN_RADIUS = 35;
var BOARD_PAWN_1_COLOR = "lightskyblue";
var BOARD_PAWN_2_COLOR = "lightsalmon";

var WALL_START_DISTANCE_FROM_BOARD_X = 80;
var WALL_START_DISTANCE_FROM_BOARD_Y = 20	;
var WALL_START_DISTANCE_FROM_EACH_OTHER = 93;
var WALL_LENGTH = 180;
var WALL_WIDTH = 14;
// var WALL_COLOR = "steelblue";
var WALL_COLOR = "teal";

var NORTH = 0;
var EAST = 1
var SOUTH = 2;
var WEST = 3;
var PLAYER1 = 0;
var PLAYER2 = 1;
GAME_REPLAY_TIME_BETWEEN_MOVES_MILLIS = 700;




document.addEventListener("DOMContentLoaded", function() {
  initQuoridorDOM();
  
});

function initQuoridorDOM(){
	var quoridorField = document.getElementById("quoridor-field");
	//addDiv(setShowField, "card");
	addSvg(quoridorField, "quoridorFieldSvg",BOARD_WIDTH*BOARD_SCALE, BOARD_HEIGHT*BOARD_SCALE,BOARD_BACKGROUND_COLOR,"black");
	var field = document.getElementById("quoridorFieldSvg");		
	
	//movePawnToPosition(PLAYER1,NORTH);
	//console.log( pawns[0]);
	//movePawn(PLAYER1);
	
	
	// movePawn(PLAYER1, EAST);
	// movePawn(PLAYER2, EAST);
	// movePawn(PLAYER1, EAST);
	
	//window.setTimeout(movePawn(PLAYER2, EAST),2000);
	
	var movesHistory = [NORTH,EAST,EAST,EAST,SOUTH,EAST,WEST,EAST];
	//recordedGame = [EAST];
	moveCounter = 0;
	//window.setTimeout(callback(PLAYER1, EAST),GAME_REPLAY_TIME_BETWEEN_MOVES_MILLIS); 
	var aGame = new Game(field);
	//aGame.testPlaceWall(PLAYER1, "q8");
	//aGame.testPlaceWall(PLAYER1, "8a");
	//aGame.testPlaceWall(PLAYER1, "a1");
	//aGame.testPlaceWall(PLAYER1, "h8");
	
	//aGame.testPlaceWall(PLAYER1, "1d");
	
	
	
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER1, NORTH);
	aGame.movePawn(PLAYER2, SOUTH);
	aGame.movePawn(PLAYER2, SOUTH);
	aGame.movePawn(PLAYER2, SOUTH);
	aGame.movePawn(PLAYER2, SOUTH);
	aGame.movePawn(PLAYER2, SOUTH);
	aGame.movePawn(PLAYER2, SOUTH);
	
	aGame.testPlaceWall(PLAYER1, "1h");
//	aGame.testPlaceWall(PLAYER1, "h1");
	
	aGame.outputWalls();
	//var replay = new GameReplay(aGame, movesHistory);
	//replay.replay(0);
	
	
	
}



function GameReplay (game, recordedMoves){
	//this.replayGame = new Game(); //init board
	this.qgame = game;
	this.recordedGame = recordedMoves;
	this.moveCounter = 0;
	console.log(this.qgame);
}

GameReplay.prototype.replay = function (moveCounter){

	if (moveCounter < this.recordedGame.length){
		console.log("player moving: %d",moveCounter%2 );
		// window.setTimeout(this.callback(moveCounter%2, this.recordedGame[moveCounter]),GAME_REPLAY_TIME_BETWEEN_MOVES_MILLIS); 
		window.setTimeout(function (){this.callback(moveCounter%2, this.recordedGame[moveCounter])}.bind(this),GAME_REPLAY_TIME_BETWEEN_MOVES_MILLIS); 
	}
}

GameReplay.prototype.callback = function(player, direction){
	// return function(){
			
       // this.qgame.movePawn(player, direction);
	   // this.moveCounter += 1;
	   
	   // this.replay(this.moveCounter);
    // }
	this.qgame.movePawn(player, direction);
	this.moveCounter += 1;
	this.replay(this.moveCounter);
}

/*
function callback(player, direction){
    return function(){
       movePawn(player, direction);
	   moveCounter += 1;
	   gameReplay(moveCounter);
    }
}
*/


function Game(svgField){
	
	this.walls_1 = [];
	this.walls_2 = [];
	
	
	this.pawns=[];
	//this.board;
	this.board = new Board();
	this.buildUpBoard(svgField);
	this.outputPawns();
	this.play_song();
}



Game.prototype.placeWallByVerboseNotation = function(player, wallPosNotation){
	
	console.log(wallPosNotation);
	
	//check if notation is correct.
	var wall = this.board.placeWallByVerboseCoordinate(player,wallPosNotation);
	
}
// Game.prototype.placePawnByVerboseNotation = function(player, pawnNotation ){
	
// }


Game.prototype.outputWalls = function(){
	/*
	var horiLineNumber = 4;
	var vertLineNumber = 3;
	//vertical wall
	
	this.walls_1[0].setAttribute("x1", BOARD_SQUARE_SPACING * vertLineNumber * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
	this.walls_1[0].setAttribute("x2", BOARD_SQUARE_SPACING * vertLineNumber * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
	this.walls_1[0].setAttribute("y1", BOARD_SQUARE_SPACING * (horiLineNumber - 1) * BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
	this.walls_1[0].setAttribute("y2", BOARD_SQUARE_SPACING * (horiLineNumber + 1)* BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
	
	horiLineNumber = 5;
	vertLineNumber = 7;
	//horizontal wall
	*/
	//console.log("fefeeeee");
	var wallElements = [this.walls_1, this.walls_2];
	var allWalls = this.board.getWalls();
	//console.log(allWalls);
	
	
	for (var player=0;player<2;player++){
	//	console.log(allWalls[player].length);
		
			
		for (var wallIndex = 0; wallIndex < allWalls[player].length ; wallIndex++){
			console.log(wallIndex);
			var wall = allWalls[player][wallIndex];
			if (wall[2]){
				wallElements[player][wallIndex].setAttribute("x1", BOARD_SQUARE_SPACING * allWalls[player][wallIndex][1] * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("x2", BOARD_SQUARE_SPACING * allWalls[player][wallIndex][1] * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("y1", BOARD_SQUARE_SPACING * (allWalls[player][wallIndex][0] - 1) * BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("y2", BOARD_SQUARE_SPACING * (allWalls[player][wallIndex][0] + 1)* BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
			}else{
				wallElements[player][wallIndex].setAttribute("x1", BOARD_SQUARE_SPACING * (allWalls[player][wallIndex][1] - 1) * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("x2", BOARD_SQUARE_SPACING * (allWalls[player][wallIndex][1] + 1) * BOARD_SCALE + BOARD_X_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("y1", BOARD_SQUARE_SPACING * allWalls[player][wallIndex][0] * BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
				wallElements[player][wallIndex].setAttribute("y2", BOARD_SQUARE_SPACING * allWalls[player][wallIndex][0] * BOARD_SCALE + BOARD_Y_OFFSET_SCALED) ;
			}
		}
		
	}	
}

Game.prototype.outputPawns = function(){
	this.outputPawn(PLAYER1);
	this.outputPawn(PLAYER2);
}

Game.prototype.outputPawn = function(player){
	var pawnCoords = (this.board.getPawnCoordinates(player));
	//console.log("player: %d : ", player);
	//console.log(pawnCoords);
	//svg 
	//var x,y;
	//x = parseInt(pawns[player].getAttribute("cx"));
	//y = parseInt(pawns[player].getAttribute("cy"));
	this.pawns[player].setAttribute("cx", (pawnCoords[1]+0.5) * BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_X_OFFSET_SCALED);
	this.pawns[player].setAttribute("cy", (pawnCoords[0]+0.5) * BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_Y_OFFSET_SCALED);

	//console.log("x:%d", x);
	//console.log("efwefwewww");
}


Game.prototype.movePawn = function(player, direction){
	
	this.board.movePawn(player, direction);
	this.outputPawn(player);
	//var x,y;
	//x = parseInt(pawns[player].getAttribute("cx"));
	//y = pawns[player].getAttribute("cy");
	//pawns[player].setAttribute("cx", x + BOARD_SQUARE_SPACING*BOARD_SCALE);
	//console.log("x:%d", x);
//	pawns[player].setAttribute("cy", y + 100);
	
}

Game.prototype.buildUpBoard = function(svgElement){
	
	//horizontal lines
	for (var i=0; i<10;i++){
		createLine(svgElement, 0*BOARD_SCALE + BOARD_X_OFFSET_SCALED, i*BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_Y_OFFSET_SCALED , BOARD_SQUARE_SPACING*9*BOARD_SCALE + BOARD_X_OFFSET_SCALED, i*BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, BOARD_LINE_COLOR, 10*BOARD_SCALE);	
	}
	//createLine(svgElement, x1, y1, x2, y2, color, width)
	
	//vertical lines
	for (var i=0; i<10;i++){
		createLine(svgElement, i*BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_X_OFFSET_SCALED ,0*BOARD_SCALE + BOARD_Y_OFFSET_SCALED,  i*BOARD_SQUARE_SPACING*BOARD_SCALE + BOARD_X_OFFSET_SCALED, BOARD_SQUARE_SPACING*9*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, BOARD_LINE_COLOR, 10*BOARD_SCALE);	
	}
	
	//players init --> set position to just somewhere on the board....
	//player 1
	//pawns.push(add_circle(svgElement, 450*BOARD_SCALE + BOARD_X_OFFSET_SCALED, 50*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, PAWN_RADIUS *BOARD_SCALE, "player_1_pawn", BOARD_PAWN_1_COLOR));
	this.pawns.push(add_circle(svgElement, 365*BOARD_SCALE + BOARD_X_OFFSET_SCALED,35*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, PAWN_RADIUS *BOARD_SCALE, "player_1_pawn", BOARD_PAWN_1_COLOR));
	//player 2
	//pawns.push( add_circle(svgElement, 450*BOARD_SCALE + BOARD_X_OFFSET_SCALED, 850*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, PAWN_RADIUS *BOARD_SCALE, "player_2_pawn", BOARD_PAWN_2_COLOR));
	this.pawns.push( add_circle(svgElement, 666*BOARD_SCALE + BOARD_X_OFFSET_SCALED, 142*BOARD_SCALE + BOARD_Y_OFFSET_SCALED, PAWN_RADIUS *BOARD_SCALE, "player_2_pawn", BOARD_PAWN_2_COLOR));
	
	
	//bottom walls unused placement.
	for (var i=0; i<10;i++){
		this.walls_1.push(createLine(svgElement, 
			(WALL_START_DISTANCE_FROM_BOARD_X + i * WALL_START_DISTANCE_FROM_EACH_OTHER) * BOARD_SCALE    ,
			900*BOARD_SCALE + BOARD_Y_OFFSET_SCALED + WALL_START_DISTANCE_FROM_BOARD_Y,  
			(WALL_START_DISTANCE_FROM_BOARD_X + i * WALL_START_DISTANCE_FROM_EACH_OTHER) * BOARD_SCALE,
			900*BOARD_SCALE + BOARD_Y_OFFSET_SCALED + WALL_START_DISTANCE_FROM_BOARD_Y + WALL_LENGTH * BOARD_SCALE, 
			WALL_COLOR,
			WALL_WIDTH * BOARD_SCALE));	
		
	}
	
	//top walls unused placement.
	for (var i=0; i<10;i++){
		this.walls_2.push(createLine(svgElement, 
			(WALL_START_DISTANCE_FROM_BOARD_X + i * WALL_START_DISTANCE_FROM_EACH_OTHER) * BOARD_SCALE    ,
			BOARD_Y_OFFSET_SCALED - WALL_START_DISTANCE_FROM_BOARD_Y,  
			(WALL_START_DISTANCE_FROM_BOARD_X + i * WALL_START_DISTANCE_FROM_EACH_OTHER) * BOARD_SCALE,
			BOARD_Y_OFFSET_SCALED - WALL_START_DISTANCE_FROM_BOARD_Y - WALL_LENGTH * BOARD_SCALE, 
			WALL_COLOR,
			WALL_WIDTH * BOARD_SCALE));	
	}
}
Game.prototype.beep = function() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
	snd.play();
}

Game.prototype.play_song = function(){
	//https://www.playonloop.com/2015-music-loops/cookie-island/
	var song = new Audio("POL-cookie-island-short.wav");
	song.play();
	
}

function Board(){
	this.cells =[];
	this.walls_1 = []; //store walls;
	this.walls_2 = []; //store walls;
	
	this.init();
}


Board.prototype.wallNotationToCellAndOrientation = function (verboseCoordinate){
	//returns startcellId and isNorthSouthOriented orientation as [id, orientation]
	//verboseCoordinate = string of two characters, one letters, one number. number from [1,8], letter [a,h]  i.e. b2 or 5C
	//verboseCoordinate :  i.e.   starting with a letter = vertical, starting with a number is horizontal. , letters and numbers indicate the wall lines on the board (between the cells), the crossing of the wall lines indicates the center point of the wall.
	//end result = four cells with each a direction.
	
	//get vertical wall line
	if (verboseCoordinate.length != 2){
		console.log("ASSERT ERROR  notation should be two characters");
		return false;
	}
	//var wallLines = verboseCoordinate.split('');
	var charVals = [verboseCoordinate.charCodeAt(0), verboseCoordinate.charCodeAt(1)];
	var isLetter =[];
	var values  = [];
	//convert chars to wall lines 
	//https://webserver2.tecgraf.puc-rio.br/cd/img/vectorfont_default.png
	for(var i=0;i<2;i++){
		if (charVals[i]>= 49 && charVals[i]<=56){
			isLetter[i] =false;
			values.push(charVals[i]-48);
		}else if (charVals[i]>= 65 && charVals[i]<=72){
			//capital
			isLetter[i] =true;
			values.push(charVals[i]-64);
		}else if (charVals[i]>= 97 && charVals[i]<=104){
			//small letter
			isLetter[i] =true;
			values.push(charVals[i]-96);
		}else{
			//assert error
			console.log("ASSERT ERROR invalid character in notation.");
			return false;
		}
	}
	var isNorthSouthOriented = false;
	//check validity
	if (isLetter[0] == isLetter[1]){
		//check if both are number or letter
		console.log("ASSERT ERROR: should be a letternumber or numberletter")
		return false;
	}else if (isLetter[0]){
		isNorthSouthOriented = true;
		startCellCol = (values[0]-1);
		startCellRow = (8-values[1]);
	}else{
		isNorthSouthOriented = false;
		startCellRow = (8-values[0]);
		startCellCol = (values[1]-1);
	}
	
	return [this.rowColToCellId(startCellRow,startCellCol) , isNorthSouthOriented];
	//get startcell row and col
}







Board.prototype.getWallCenterPointWithOrientationFromStartCellIdAndOrientation = function(startCellId, orientation){
	//wall = [ horizontalLine, verticalLine, isOrientationNorthSouth]
	var rowCol = this.cells[startCellId].getRowColFromId();
	return [rowCol[0]+1 , rowCol[1]+1, orientation];
}
Board.prototype.getWallCenterPointWithOrientationFromVerboseCoordinate = function(verboseCoordinate){
	return wallNotationToCellAndOrientation(verboseCoordinate);
	
}
Board.prototype.getWalls = function (){
	return [this.walls_1 , this.walls_2];
}

Board.prototype.getWallsCombined = function (){
	return this.walls_1.concat(this.walls_2);
}


Board.prototype.isCenterPointAvailableForWallPlacement = function(startCellId, orientation){
	//check if centerpoint is already occupied.
	var wallCenterPointAndOrientation = this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, orientation);
	var walls = this.getWallsCombined();
	var positionIsAvailable = true
	for (var i=0;i<walls.length;i++){	
		if (walls[i][0] == wallCenterPointAndOrientation[0] && walls[i][1] == wallCenterPointAndOrientation[1]){
			
			positionIsAvailable=false;
			return positionIsAvailable;
		}
	}
	return positionIsAvailable;
}




Board.prototype.isPositionAvailableForWallPlacement = function(startCellId, isNorthSouthOriented){
	
	return placeWall(PLAYER1,startCellId, isNorthSouthOriented, onlyCheckAvailabilityDontPlaceWall);
}
Board.prototype.isWallPositionAvailableByVerboseCoordinate= function (player,verboseCoordinate){
	var wallCoords = this.wallNotationToCellAndOrientation(verboseCoordinate);
	if(!wallCoords){
		//notation unvalid
		return false;
	}
	return this.placeWall(player, wallCoords[0],wallCoords[1],true );
}
Board.prototype.placeWallByVerboseCoordinate= function (player,verboseCoordinate){
	var wallCoords = this.wallNotationToCellAndOrientation(verboseCoordinate);
	if(!wallCoords){
		//notation unvalid
		return false;
	}
	return this.placeWall(player, wallCoords[0],wallCoords[1],false );
}
Board.prototype.placeWall = function (player, startCellId, isNorthSouthOriented, onlyCheckAvailabilityDontPlaceWall){
	//wall covers always two cells, 
	//if east west oriented: at South of startcell, and eastern neighbour cell
	// if north east : at East o fstartcell, and southern neighbour cell
	
	var startCell = this.cells[startCellId];
	
	//check if within board limits:
	if (!(startCell.row >=0 && startCell.row<=7 && startCell.col >=0 && startCell.col<=7)){
		console.log("ASSER ERROR WRONG CELL as wall start identifier");
	}
	
	//first check if centerpoint is available
	if (!this.isCenterPointAvailableForWallPlacement(startCellId, isNorthSouthOriented)){
		console.log("centerpoint wall occupied. wall cannot be placed.");
		return false;
	}	
	
	//check borders in cells.
	//assume neighbours existing.
	//for (var i=0; i<4;i++){
	
	var neighEastId = startCell.getNeighbourId(1);
	var neighSouthId = startCell.getNeighbourId(2);
	var neighSouthEastId = startCell.getNeighbourId(5);
	
	
	var allInvolvedCellsIds = [startCellId, neighEastId, neighSouthEastId, neighSouthId];
	//--> pattern for 4 cells: startcell, then east, then southeast, then south
	var sidesForNorthSouthOrientation = [1,3,3,1];
	var sidesForEastWestOrientation = [2,2,0,0];
	
	//decide which sides are affected.
	var sidesToChange = sidesForEastWestOrientation;
	if (isNorthSouthOriented){
		sidesToChange = sidesForNorthSouthOrientation;
	}
	
	var isAllAffectedSideOpen = true;
	
	//console.log(allInvolvedCellsIds);
	//console.log(sidesToChange);
	//check if sides are already occupied.
	for (var i=0;i<4;i++){
		//console.log(this.cells[allInvolvedCellsIds[i]].isSideOpen(sidesToChange[i]));
		if( !this.cells[allInvolvedCellsIds[i]].isSideOpen(sidesToChange[i])){
			isAllAffectedSideOpen=false;
		}
	}
	if (!isAllAffectedSideOpen){
		//wall cannot be placed because another wall is blocking its path somewhere.
		console.log("position not valid for wall placement");
		return false;
	}
	
	
	//check completed, return results if only simulation.
	if (onlyCheckAvailabilityDontPlaceWall){
		return true;
	
	}
	
	//place wall
	//check if sides are already occupied.
	for (var i=0;i<4;i++){
		this.cells[allInvolvedCellsIds[i]].closeSide(sidesToChange[i]) ;
	}
	
	
	//store wall as wall (cells is not enough, we have to know the exact wall, for the gaps...)
	if (player == PLAYER1){
		this.walls_1.push(this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, isNorthSouthOriented));
		
	}else{
		this.walls_2.push(this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, isNorthSouthOriented));
		
	}

	
}

Board.prototype.init = function (){
	var id=0;
	
	//cell numbering:
	//  0,0 ---> + col
	//  |
	//  |
	//  V +row
	
	//indication of sides and "wall" lines. Hx = horizontal, Vx= vertical, (x,x) =cell
	//    H0        H0
	//V0  (0,0)  V1  (0,1) V2  (0,2)  ....
	//    H1        H1 
	//V0  (1,0)  V1  (1,1) V2  (1,2)   ....
	//    H1        H1   ....
	//   ....      .... 
	for (var row=0; row<9;row++){
		for (var col=0; col<9;col++){
			
			this.cells.push(new Cell(row,col, row>0, col<8, row<8, col>0 ));
			//this.cells[this.cells.length - 1].printToConsole();
			//console.log(row);
		}
	}
	//define cells with pawns.
	this.pawnCellsIds = [this.rowColToCellId(8,4), this.rowColToCellId(0,4)];
	this.cells[this.pawnCellsIds[PLAYER1]].acquirePawn(PLAYER1);
	this.cells[this.pawnCellsIds[PLAYER2]].acquirePawn(PLAYER2);
	
	
};

Board.prototype.movePawn = function(player, direction){
	//player 0 or player 1
	//check for walls, sides and other pawn, notify event "win" 
	
	//side check
	//check if neighbour cell exists 
	var cell = this.cells[this.pawnCellsIds[player]];
	if (!cell.isThereAnExistingNeighbourOnThisSide(direction)){
		console.log("ASSERT ERROR: no neighbour cell existing");
		return false;
	}
	
	//check if direction not blocked by wall
	if (!cell.isSideOpen(direction)){
		console.log("wall in the way, can't move in direction %d (N=0, E=1, S=2, W=3)", direction);
		return false;
	}
	
	//check if direction not blocked by other pawn
	var neighbour = cell.getNeighbourId(direction); //get neighbour id
	
	if (this.cells[neighbour].getIsOccupied()){
		console.log("cant move, destination cell contains other pawn. Please perform a jump move.");
		return false
	}
	
	
	//make the move
	cell.releasePawn(player); //release pawn
	this.pawnCellsIds[player] = neighbour;
	cell = this.cells[this.pawnCellsIds[player]];
	cell.acquirePawn(player);//acquire pawn
	return true;
	
}
Board.prototype.rowColToCellId = function(row,col){
	//cell id is cell index in this.cells
	return row*9+col;
}

Board.prototype.getPawnCoordinates = function(player){
	//console.log("playercell: %d ", this.pawnCellsIds[player]);
	return  this.cells[this.pawnCellsIds[player]].getRowColFromId();
}


// function Cell (bool wallNorth, bool wallEast, bool wallSouth, bool wallWest, bool pawnPlayerA, bool pawnPlayerB){
function Cell (row, col, openToNorth, openToEast, openToSouth, openToWest){
	this.row = row;
	this.col = col;
	this.id = 9*row + col; //i.e. id 10  = cell 
	this.position = [row,col];
	this.openSides = [openToNorth, openToEast, openToSouth, openToWest]; //will change during the game
	this.sideHasExistingNeighbourCell = [openToNorth, openToEast, openToSouth, openToWest]; //never change this
	this.occupiedByPawn = 0;
	
	//console.log(this.row);
	
}
Cell.prototype.closeSide = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	this.openSides[direction] = false;
}

Cell.prototype.getId = function(){
	return this.id;
}
Cell.prototype.getRowColFromId = function(){
	return [parseInt(this.id/9), this.id%9];
}

Cell.prototype.getIsOccupied = function(){
	return this.occupiedByPawn > 0;
};
Cell.prototype.printToConsole = function(){
	console.log('----- row: %d -- col: %d -------',this.row, this.col);
	console.log(this.occupiedByPawn);
	console.log (this.openSides);
	
	
}
Cell.prototype.isSideOpen = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	
	return this.openSides[direction];
}

Cell.prototype.isThereAnExistingNeighbourOnThisSide = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	////4NE, 5SE, 6, SW, 7 NW
	
	var directionsToCheckForDiagonals_lookUpTable = [ [0,1],[1,2],[2,3],[3,0]];
	
	if (direction<4){
	
		return this.sideHasExistingNeighbourCell[direction];
	}else if (direction <8){
		//both diag neighbours have to exist to return true.
		return this.sideHasExistingNeighbourCell[directionsToCheckForDiagonals_lookUpTable [direction-4][0] ] &&
			   this.sideHasExistingNeighbourCell[directionsToCheckForDiagonals_lookUpTable [direction-4][1] ];
	}else{
		console.log("ASSERT ERROR DIRECITON NOT EXISTING");
	}
}

Cell.prototype.acquirePawn= function(player){
	if(this.occupiedByPawn >0){
		console.log("ASSERT ERROR: cell already contains pawn");
	}else{
		this.occupiedByPawn = player+1;
	}
}
Cell.prototype.releasePawn =function(player){
	if(this.occupiedByPawn <1){
		console.log("ASSERT ERROR: cell does not contain pawn");
	}else{
		this.occupiedByPawn = 0;
	}

}

Cell.prototype.getNeighbourId= function (direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	//4NE, 5SE, 6, SW, 7 NW
	if (!this.isThereAnExistingNeighbourOnThisSide(direction)){
		console.log("ASSERT ERROR neighbour not existing");
		return false;
	}
	//assert neighbour is existing. 
	switch (direction){
		case 0:
			//north
			return this.id -9;
			break;
		case 1:
			//east
			return this.id+1;
			break;
		case 2: //s
			return this.id+9;
			break;
		case 3://w
			return this.id-1;
		case 4: //ne
			return this.id-8;
		case 5: //se
			return this.id+10;
		case 6: //sw
			return this.id+8;
		case 7: //nw
			return this.id-10;
		
	}
}

