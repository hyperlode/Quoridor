
document.addEventListener("DOMContentLoaded", function() {

	// var divTest = document.getElementById("test");
	//addTextWithClick(divTest, "yow<br>yeee" ,"namelode", "bla", test, "ijiee" );
	// test("ijij");
	// console.log("schip ahoy!");
	
	// var quoridorManager = new Manager();
	//quoridorManager.loadAndContinueMultiPlayerGame();
	
});

function Manager(){
	this.domElements  = initQuoridorDOM();
	this.multiPlayerDiv = this.domElements["multiplayerDiv"];
}
	
Manager.prototype.stopMultiPlayerGame = function(remotePlayer){
	this.multiPlayerGame.deleteGame();
}

Manager.prototype.startMultiPlayerGame = function(remotePlayer){
	this.multiPlayerGame = new Game(this.domElements["board"],  this.domElements ["stats"] );
	// 
	this.multiPlayerGame.multiPlayerStartGame(PLAYER1);
	// this.multiPlayerGame.multiPlayerRemoteMove("START");
}	
	
Manager.prototype.submitLocalMove = function (){	
	 return this.multiPlayerGame.multiPlayerSubmitLocalMove();
	 
}

Manager.prototype.submitRemoteMove = function (text){	
	// alert("submit move (todo)");
	//console.log(text);
	this.multiPlayerGame.multiPlayerRemoteMove(text);
	
	
}

Manager.prototype.loadAndContinueMultiPlayerGame = function (){	
	var qGame = new Game(this.domElements["board"],  this.domElements ["stats"] );
	
	qGame.multiplayerLoadBoard("d8,e8,7f,7c,n,7a,7h,e6,d6,d4,e4,d2,e2,1c,1e");
	// qGame.multiplayerLoadBoard("n,s,n,s");
}

Manager.prototype.loadAndContinueLocalGame = function (gameString){	
	var qGame = new Game(this.domElements["board"],  this.domElements ["stats"] );
	qGame.loadBoard(gameString);
}

Manager.prototype.startNewLocalGame = function (){
	//console.log("start");
	this.localGame = new Game(this.domElements["board"],  this.domElements ["stats"] );
}

Manager.prototype.restartLocalGame = function (){
	this.localGame.eraseBoard();	
}
Manager.prototype.stopAndDeleteLocalGame = function (){
	this.localGame.deleteGame();	
}


// Manager.prototype.replayGameString = function (gameString){
	// this.startNewGame();
	// this.replayGame = new GameReplay (this.localGame, gameString);
// }
