var logonText = "Welcome in Quoridor Cafe The big wall.";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var USERS_DIV_LIST = "loggedinusers";
var LISTEDGAMES_DIV_LIST = "listedGames";
var AVAILABLE_GAMES_ON_SERVERS_DIV = "availableGamesOnServer";
var CAFE_STATUS_DIV = "cafeStatus";

var GAME_CHECK_SERVER_INTERVAL = 2000;
var REFRESH_UPDATE_RATE = 2000; 
var NO_PLAYER_DUMMY_ID = 666;
var NO_GAME_ID_YET = 667;
var NO_LOGGED_IN_USER_DUMMY_ID= 668;



var GAME_STATUS_ERROR = 0;
var GAME_STATUS_PLAYING = 1;
var GAME_STATUS_INITIALIZING = 2;
var GAME_STATUS_NO_CHANGE = 3;
var GAME_REGISTER_LOCAL_PLAYER = 4;
var GAME_STATUS_NO_STATUS_YET = 5;
var GAME_STATUS_FINISHED = 6;
// var REMOTE_STATUS_ = 4;
// var REMOTE_STATUS_ = 5;
// var REMOTE_STATUS_ = 6;

var REMOTE_GAME_STATUS_ERROR = 0; 
var REMOTE_GAME_STATUS_INITIALIZING = 1; 
var REMOTE_GAME_STATUS_PLAYING = 2; 
var REMOTE_GAME_STATUS_FINISHED = 3; 
var REMOTE_GAME_STATUS_ALL = 4; //dont care about status 


document.addEventListener("DOMContentLoaded", function() {


	// if the url begins with this string
	if (window.location.href.indexOf('www.') !== -1) {
		// reload page without www (www.lode.ameije.com doesn't seem to work on iphone)
		console.log("reload page.");
		window.location.href = 'http://lode.ameije.com/QuoridorMultiPlayer/quoridorcafe.html';
		
	}

	cafe = new Cafe();
	
	
	// getAllUsers();	
});

document.onkeydown = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
	var charStr = String.fromCharCode(charCode);
//	console.log(event.keyCode === 13);//enter button
//	console.log(charStr + " " + event.keyCode);

	if (event.keyCode === 13){
		//enter pressed
		//call button. 
		document.getElementById("submitMoveDebug").click();
	}
	
};


class Cafe {
	constructor() {
		//users login and credentials stuff
		this.account = new Account();
		console.log(logonText);
		
		this.account.setLoggedInCallback(this.showPageAfterLogin.bind(this));
	}

	
	showPageAfterLogin(){
		
		this.account.listOfUsers();
		;
		this.remote = new RemoteContact();
		this.remote.setAccountInstance(this.account);
		
		//create html elements
		this.setupButtonField();
		
		//this.continuePollingForRemoteMove = false;
		this.remote.setRemoteMovedCallback(this.doRemoteMove.bind(this));
		this.remote.setStartLocalBoardCallback( this.startAndDisplayMultiPlayerGameQuoridor.bind(this));
		this.remote.setUpdateStatusFieldCallback(this.updateStatusField);
		
		this.showingGamesList = false;
		var listElement = document.getElementById(AVAILABLE_GAMES_ON_SERVERS_DIV);
		listElement.style.display = 'none';
		
		this.updateStatusField("Welcome to the quoridor cafe.");
		
		//chat controls
		this.chat = new Chatbox();
		var id = this.account.getLoggedInUserId();
		//this.chat.setUserData(id, this.account.getNameFromId(id));//this.account.getNameFromId(id): doesn'dt work, because the data for the name didn't come in yet. wait. a bit, or do it at post time.
		this.chat.setUserData(id, this.account.getLoggedInUserName());
		
		//this.remote.setStatusMessageCallback(this.chat.submitText.bind(this)); //
		this.chat.submitText("User "+ this.account.getLoggedInUserName() +" logged in.");
		
		//activate periodic refreshing.
		this.chat.startRefreshLoop();
		
		
	}
	
	// actionAfterLogout(){
		// this.chat.submitText("User "+ this.account.getLoggedInUserName() +" logged out.");
	// }
		
	remoteGameStart() {
		console.log("start remote game");
		
		if (this.account.getLoggedInUserId() == NO_LOGGED_IN_USER_DUMMY_ID){
			alert("Please log in or register first. ");
			return;
		}
		
		alert("Reminder: Do not forget to press the button submitLocalMove or press ENTER after each move you make! ");
		
		this.clearStatusField();
		
		this.updateStatusField("Reminder: Do not forget to press the button submitLocalMove or press ENTER after each move you make! ");
		
		this.setVisibilityControlsRemoteStarted();


		var localPlayerGoesUpwards = this.localPlayerMovesUpCheckbox.checked;
		this.remote.setGameProperties(localPlayerGoesUpwards);
		
		var localId = this.account.getLoggedInUserId();
		//var debugGameId = this.remoteGameIdTextBox.value;
		
		//alert("game start: player:" + localId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");
		
		var localPlayerStarts = this.player1StartsCheckbox.checked;
		this.remote.initNewGame(localId, NO_PLAYER_DUMMY_ID,localPlayerStarts );
	
	}

	
	joinRemoteGame(){

		if (this.account.getLoggedInUserId() == NO_LOGGED_IN_USER_DUMMY_ID){
			alert("Please log in or register first. ");
			return;
		}
		
		var radios = document.getElementsByName('gameIdSelection');
		// document.getEle
		var selectedGameId;
		if (radios.length == 0){
			alert("Select a game from the available games list [Toggle list of available games] button, if none available, start a new game with the [start remote game] button.");
			return false;
		}

		for (var i = 0; i < radios.length; i++) {
			if (radios[i].type === 'radio' && radios[i].checked) {
				// get value, set checked flag or do whatever you need to
				selectedGameId = radios[i].value;       
			}
		}

		this.clearStatusField();
		alert(" Selected game: "+ selectedGameId +"\nReminder: Do not forget to press the button submitLocalMove or press ENTER after each move you make! ");
		
		//get game id from field.
		//check for remote game with this id
		this.remote.setLocalPlayerId( this.account.getLoggedInUserId());
		//var joinGameId = this.remoteGameIdTextBox.value;
		var joinGameId = selectedGameId;

		this.remote.joinGame(joinGameId);	
		console.log("attempt to join game with id: " + joinGameId);
		var localPlayerGoesUpwards = this.localPlayerMovesUpCheckbox.checked;
		this.remote.setGameProperties(localPlayerGoesUpwards);
		
		this.setVisibilityControlsRemoteStarted();
	}

	setVisibilityControlsRemoteStarted(){

		this.localGameControlsDiv.style.display = 'none';
		

		this.stopRemoteGameButton.style.visibility = 'visible';
		this.listFreeSpotGamesButton.style.visibility = 'hidden';
		this.startRemoteGameButton.style.visibility = 'hidden';
		this.joinRemoteGameButton.style.visibility = 'hidden';
		this.remoteGameIdTextBox.style.visibility = 'hidden';

		this.player1StartsCheckbox.style.visibility = 'hidden';
		document.getElementById(this.player1StartsCheckbox.id+"_label").style.visibility = 'hidden';
		this.localPlayerMovesUpCheckbox.style.visibility = 'hidden';
		document.getElementById(this.localPlayerMovesUpCheckbox.id+"_label").style.visibility = 'hidden';
		this.submitLocalMoveButton.style.visibility = 'visible';
		this.setGamesListVisibility(false);

		this.localPlayerMovesUpCheckbox.style.visibility = 'hidden';
		

	}
	

	startAndDisplayMultiPlayerGameQuoridor(startingPlayer, localPlayerStarts, player1GoesUpwards, gameStateString ){
		
		this.quoridorManager = new Manager();

		console.log("starting board, gamestatstring: " + gameStateString);
		if (gameStateString == "notyetstarted"){
			gameStateString = "";
		}
		this.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts,player1GoesUpwards,gameStateString);
	}

	doRemoteMove( gameState){
		//console.log(this);  --> points to remote
		var success = this.quoridorManager.submitRemoteMove(gameState);
		if (!success){
			console.log("ASSERT ERROR Wrong move.  todo: deal with it.");
		}
		
	}

	

	listGamesWithFreeSpot(){
		//check all available games for joining...
		this.remote.listOfGames(REMOTE_GAME_STATUS_INITIALIZING, NO_PLAYER_DUMMY_ID);
		
		this.setGamesListVisibility(!this.showingGamesList);
			
	}

	listGamesWithPlayerId(){
		//check all available games for joining...
		this.remote.listOfGames(REMOTE_GAME_STATUS_ALL,this.account.getLoggedInUserId());
		
		this.setGamesListVisibility(!this.showingGamesList);
			
	}
	
	setGamesListVisibility(isVisible){
		var listElement = document.getElementById(AVAILABLE_GAMES_ON_SERVERS_DIV);
		if(!isVisible){
			listElement.style.display = 'none';
			this.showingGamesList = false;
		}else{
			listElement.style.display = 'block';
			this.showingGamesList = true;
		}
	}



	remoteGameStop() {
		console.log("stop remote game");
		this.localGameControlsDiv.style.display = 'block';
		// this.startLocalGameButton.style.visibility = 'visible';
		// this.stopLocalGameButton.style.visibility = 'hidden';
		// this.restartLocalGameButton.style.visibility = 'hidden';

		this.stopRemoteGameButton.style.visibility = 'hidden';
		this.listFreeSpotGamesButton.style.visibility = 'visible';
		this.startRemoteGameButton.style.visibility = 'visible';
		this.joinRemoteGameButton.style.visibility = 'visible';
		this.remoteGameIdTextBox.style.visibility = 'visible';
		this.player1StartsCheckbox.style.visibility = 'visible';
		this.localPlayerMovesUpCheckbox.style.visibility = 'visible';
		document.getElementById(this.player1StartsCheckbox.id+"_label").style.visibility = 'visible';
		this.localPlayerMovesUpCheckbox.style.visibility = 'visible';
		document.getElementById(this.localPlayerMovesUpCheckbox.id+"_label").style.visibility = 'visible';
		this.submitLocalMoveButton.style.visibility = 'hidden';

		
		this.remote.stopCheckDatabaseForRemoteMoveLoop();
		this.quoridorManager.stopMultiPlayerGame();
	}

	submitLocalMove() {
		//the local player presses this button when he wants to submit his move.
		this.debugCommandTextBox.value = this.quoridorManager.submitLocalMove();
		
		var status = this.quoridorManager.getMultiPlayerLocalGameStatus();
		var setGameStatusToArchive = false;
		if (status == FINISHED_BY_GIVING_UP_MULTIPLAYER_LOCAL){
			console.log("resigned, will archive the game")
			setGameStatusToArchive = true;
		}else if (status == FINISHED){
			console.log("game ended, will archive the game")
			setGameStatusToArchive = true;
		}
		
		//REMOTE_GAME_STATUS_FINISHED
		this.remote.sendGameStateToRemote(this.debugCommandTextBox.value, setGameStatusToArchive);

		//send out the request for periodically checking the database on the server for opponent move (wait a while until database is probably updated).
		
		window.setTimeout(function (){this.remote.startCheckDatabaseForRemoteMoveLoop();}.bind(this),REFRESH_UPDATE_RATE); 
	
		console.log("local move sent to server...");
		//check locally if remote has moved.		
	}

	clearStatusField(){
		document.getElementById(CAFE_STATUS_DIV).innerHTML = "";
	}
	updateStatusField(updateString){
		document.getElementById(CAFE_STATUS_DIV).innerHTML = document.getElementById(CAFE_STATUS_DIV).innerHTML +"<br>"+ updateString;
	}
	
	
	setRemoteGameStatus(gameStatus){
		this.remote.setGameStatus(gameStatus);
		
	}
	
	displayUsers(){
		//this.account.listOfUsers();
		this.account.listOfUsersToElement();
	}
	
	debugNewCommand() {
		this.remote.setLocalPlayerId( this.account.getLoggedInUserId());
		var joinGameId = this.remoteGameIdTextBox.value;
		this.remote.gameId = joinGameId;
		this.remote.startCheckDatabaseForRemoteMoveLoop();

		//this.quoridorManager.submitRemoteMove(this.debugCommandTextBox.value);
		
		//this.stopPollingForRemoteMove();
		//this.remote.debugImitateRemoteMoved(this.debugCommandTextBox.value);
		//this.remote.stopCheckDatabaseForRemoteMoveLoop();

	}

	localGameStart() {
		console.log("start local game");
		this.startLocalGameButton.style.visibility = 'hidden';
		this.stopLocalGameButton.style.visibility = 'visible';
		this.restartLocalGameButton.style.visibility = 'visible';
		this.startRemoteGameButton.style.visibility = 'visible';
		this.startRemoteGameButton.style.visibility = 'hidden';
		this.joinRemoteGameButton.style.visibility = 'hidden';

		this.remoteGameControlsDiv.style.display = 'none';
		//this.stopRemoteGameButton.style.visibility = 'visible';
		this.quoridorManager = new Manager();
		this.quoridorManager.startNewLocalGame();
	}
	
	localGameStop() {
		this.remoteGameControlsDiv.style.display = 'block';
		console.log("stop local game");
		this.startLocalGameButton.style.visibility = 'visible';
		this.stopLocalGameButton.style.visibility = 'hidden';
		this.restartLocalGameButton.style.visibility = 'hidden';
		this.startRemoteGameButton.style.visibility = 'visible';
		this.joinRemoteGameButton.style.visibility = 'visible';
		this.quoridorManager.stopAndDeleteLocalGame();
	}
	localGameRestart() {
		console.log("restart local game");
		this.quoridorManager.restartLocalGame();
	}
	


	setupButtonField() {
		//cafe controls (start stop game etc.)
		this.localGameControlsDiv = document.getElementById("localGameControls");
		this.startLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Start local game", "localGameStart", "localGameStart", this.localGameStart.bind(this), this);
		this.startLocalGameButton.style.visibility = 'visible';
		this.stopLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Stop local game", "localGameStop", "localGameStart", this.localGameStop.bind(this), this);
		this.stopLocalGameButton.style.visibility = 'hidden';
		this.restartLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Restart local game", "localGameRestart", "localGameStart", this.localGameRestart.bind(this), this);
		this.restartLocalGameButton.style.visibility = 'hidden';
		



		this.remoteGameControlsDiv = document.getElementById("remoteGameControls");
		
		this.stopRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Stop remote game", "remoteGameStop", "remoteGameStop", this.remoteGameStop.bind(this), this);
		this.stopRemoteGameButton.style.visibility = 'hidden';
		this.submitLocalMoveButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "SubmitLocalMove", "submitMoveDebug", "submitMoveDebug", this.submitLocalMove.bind(this), this);
		this.submitLocalMoveButton.style.visibility = 'hidden';
		
		
		addBr(this.remoteGameControlsDiv);
		
		this.startRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Start remote game", "remoteGameStart", "remoteGameStart", this.remoteGameStart.bind(this), this);
		this.startRemoteGameButton.style.visibility = 'visible';
		this.player1StartsCheckbox = addCheckBox(this.remoteGameControlsDiv, "PLAYER1 starts", "PLAYER1 starts", true, "I (who initiates the game) make the first move.");
		addBr(this.remoteGameControlsDiv);
		
		this.listFreeSpotGamesButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Toggle list of available games.", "getActiveGamesList", "getActiveGamesList", this.listGamesWithFreeSpot.bind(this), this);
		this.listFreeSpotGamesButton.style.visibility = 'visible';
		
		this.listPlayerIdGamesButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Toggle list of games where I play.", "getGamesListWithPlayerId", "getGamesListWithPlayerId", this.listGamesWithPlayerId.bind(this), this);
		this.listPlayerIdGamesButton.style.visibility = 'visible';
		
		
		this.joinRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Join Selected Game", "joinGame", "joinGame", this.joinRemoteGame.bind(this), this);
		this.joinRemoteGameButton.style.visibility = 'visible';

		
		
		//debug field
		addBr(this.remoteGameControlsDiv);
		var debugControlsDiv = document.getElementById("debugControls");
		this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv, "debug poll...", "sendDebug", "sendDebug", this.debugNewCommand.bind(this), this);
		
		this.debugSimulateRemoteCommandReceived.style.visibility = 'visible';
		
		this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv, "See registered players", "listUsers", "listUsers", this.displayUsers.bind(this));
		
		
		this.debugCommandTextBox = addTextBox(debugControlsDiv, "debug", "debugCmdText", "debugCmdText", 20);
		this.debugNoServerSetup = addCheckBox(debugControlsDiv, "debugNoServerUse", "debugNoServerUse", false, "debug without server");
		this.localPlayerMovesUpCheckbox = addCheckBox(debugControlsDiv, "localPlayerMovesUp", "localPlayerMovesUp", true, "Display Local Player moves up on the board.");
		this.remoteGameIdTextBox = addTextBox(debugControlsDiv, "gameId", "remoteGameIdTextBox", "remoteGameIdTextBox", 10);
		this.debugSetGameStatusButton = addButtonToExecuteGeneralFunction(debugControlsDiv, "Set game status to archive", "setRemoteGameStatus", "setRemoteGameStatus", this.setRemoteGameStatus.bind(this),REMOTE_GAME_STATUS_FINISHED);
		addBr(this.remoteGameControlsDiv);
	}
}


