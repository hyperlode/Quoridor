
document.addEventListener("DOMContentLoaded", function() {

	// var divTest = document.getElementById("test");
	//addTextWithClick(divTest, "yow<br>yeee" ,"namelode", "bla", test, "ijiee" );
	// test("ijij");
	// console.log("schip ahoy!");
	
	// var quoridorManager = new Manager();
	//quoridorManager.loadAndContinueMultiPlayerGame();
	
});

class Manager {
	constructor() {
		this.domElements = initQuoridorDOM();
		this.multiPlayerDiv = this.domElements["multiplayerDiv"];
	}
	stopMultiPlayerGame(remotePlayer) {
		this.multiPlayerGame.deleteGame();
	}
	startMultiPlayerGame(startPlayer, localPlayerStarts) {
		//startplayer is constant (see quoridor.js) PLAYER1 or PLAYER2
		//localplayerStarts is boolean.
		console.log("startPlayer:"+ startPlayer);
		console.log("localPlayerStarts:" + localPlayerStarts);
		this.multiPlayerGame = new Game(this.domElements["board"], this.domElements["stats"], startPlayer);
		this.multiPlayerGame.multiPlayerStartGame(localPlayerStarts);
		// 
		
		// this.multiPlayerGame.multiPlayerRemoteMove("START");
	}
	submitLocalMove() {
		return this.multiPlayerGame.multiPlayerSubmitLocalMove();
	}
	submitRemoteMove(text) {
		//total game state as text. i.e. "n,s,n,s,e3" 
		this.multiPlayerGame.multiPlayerRemoteMove(text);
	}
	
	getMultiPlayerLocalGameState(){
		return this.multiplayerGame.moveHistoryToString();
	}

	loadAndContinueMultiPlayerGame() {
		var qGame = new Game(this.domElements["board"], this.domElements["stats"]);
		qGame.multiplayerLoadBoard("d8,e8,7f,7c,n,7a,7h,e6,d6,d4,e4,d2,e2,1c,1e");
		// qGame.multiplayerLoadBoard("n,s,n,s");
	}
	loadAndContinueLocalGame(gameString) {
		var qGame = new Game(this.domElements["board"], this.domElements["stats"]);
		qGame.loadBoard(gameString);
	}
	startNewLocalGame() {
		//console.log("start");
		this.localGame = new Game(this.domElements["board"], this.domElements["stats"]);
	}
	restartLocalGame() {
		this.localGame.eraseBoard();
	}
	stopAndDeleteLocalGame() {
		this.localGame.deleteGame();
	}
}
	

	







// Manager.prototype.replayGameString = function (gameString){
	// this.startNewGame();
	// this.replayGame = new GameReplay (this.localGame, gameString);
// }
