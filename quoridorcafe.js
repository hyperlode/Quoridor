var logonText = "ifjefffff";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var LOGGEDINUSERS_DIV_LIST = "loggedinusers";
var LISTEDGAMES_DIV_LIST = "listedGames";
var GAME_CHECK_SERVER_INTERVAL = 3000;
var REFRESH_UPDATE_RATE = 3000; 
var NO_PLAYER_DUMMY_ID = 666;
var NO_GAME_ID_YET = 667;
var NO_LOGGED_IN_USER_DUMMY_ID= 668;



var GAME_STATUS_ERROR = 0;
var GAME_STATUS_PLAYING = 1;
var GAME_STATUS_INITIALIZING = 2;
var GAME_STATUS_NO_CHANGE = 3;
var GAME_REGISTER_LOCAL_PLAYER = 4;
var GAME_STATUS_NO_STATUS_YET = 5;
// var REMOTE_STATUS_ = 4;
// var REMOTE_STATUS_ = 5;
// var REMOTE_STATUS_ = 6;

var REMOTE_GAME_STATUS_ERROR = 0; 
var REMOTE_GAME_STATUS_INITIALIZING = 1; 
var REMOTE_GAME_STATUS_PLAYING = 2; 
var REMOTE_GAME_STATUS_ARCHIVED = 3; 


document.addEventListener("DOMContentLoaded", function() {

	cafe = new Cafe();
	
	
	// getAllUsers();	
});

class Cafe {
	constructor() {
		//users login and credentials stuff
		this.account = new Account();
		console.log(logonText);
		this.account.listOfLoggedInUsers();
		this.remote = new RemoteContact();
		//create html elements
		this.setupButtonField();
		//this.continuePollingForRemoteMove = false;
		this.remote.setRemoteMovedCallback(this, this.doRemoteMove);
		this.remote.setStartLocalBoardCallback(this, this.startAndDisplayMultiPlayerGameQuoridor);

	}
	remoteGameStart(instance) {
		console.log("start remote game");

		instance.startLocalGameButton.style.visibility = 'hidden';
		instance.stopLocalGameButton.style.visibility = 'hidden';
		instance.restartLocalGameButton.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'hidden';
		instance.stopRemoteGameButton.style.visibility = 'visible';


		instance.quoridorManager = new Manager();
	
		// var localPlayerStarts = instance.debugLocalPlayerStartsCheckBox.checked;

		// var startingPlayer = PLAYER1;
		// if (!instance.debugLocalPlayerMovesUpCheckBox.checked) {
		// 	startingPlayer = PLAYER2;
		// }
		
		var localPlayerStarts = true;
		var startingPlayer = PLAYER1;
		var player1GoesUpwards = true;
		
		instance.remote.setGameProperties(startingPlayer,localPlayerStarts,player1GoesUpwards);
		
		var localId = instance.account.getLoggedInUserId();
		//var debugGameId = instance.debugRemotePlayerIdTextBox.value;
		
		alert("game start: player:" + localId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");
		
		instance.remote.initNewGame(localId, NO_PLAYER_DUMMY_ID );
	
		instance.remote.startCheckDatabaseForRemoteMoveLoop();


		//console.log("game id at start:  "+instance.remote.gameId);
	}

	startAndDisplayMultiPlayerGameQuoridor(instance, startingPlayer, localPlayerStarts, player1GoesUpwards, gameStateString ){
		console.log("starting board, gamestatstring: " + gameStateString);
		instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts,player1GoesUpwards,gameStateString);
	}

	doRemoteMove(instance, gameState){
		//console.log(this);  --> points to remote
		//console.log(instance); --> points to this cafe
		var success = instance.quoridorManager.submitRemoteMove(gameState);
		if (!success){
			//instance.remote.startCheckDatabaseForRemoteMoveLoop();
			console.log("ASSERT ERROR Wrong move.  todo: deal with it.");
		}
		//console.log("schip");
	}

	debugJoinRemoteGame(instance){

			//get game id from field.

		//check for remote game with this id

		//add name to 


		instance.remote.setLocalPlayerId( instance.account.getLoggedInUserId());
		var joinGameId = instance.debugRemotePlayerIdTextBox.value;
		
		console.log("join game button clicked");
		instance.remote.joinGame(joinGameId);
		
		instance.quoridorManager = new Manager();
	
		// var localPlayerStarts = instance.debugLocalPlayerStartsCheckBox.checked;

		// var startingPlayer = PLAYER1;
		// if (!instance.debugLocalPlayerMovesUpCheckBox.checked) {
		// 	startingPlayer = PLAYER2;
		// }
		
		var localPlayerStarts = false;
		var startingPlayer = PLAYER1;
		var localPlayerGoesUpwards = true;
		
		instance.remote.setGameProperties(startingPlayer,localPlayerStarts,localPlayerGoesUpwards);
	
		//instance.quoridorManager = new Manager();
		

		//instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts,player1GoesUpwards);
	
		

	}

	debugInitMultiPlayerGame(instance){
		//alert ("nothing here, click the remote game start button.");
		instance.remote.listOfGames();
	}


	remoteGameStop(instance) {
		console.log("stop remote game");
		instance.startLocalGameButton.style.visibility = 'visible';
		instance.stopLocalGameButton.style.visibility = 'hidden';
		instance.restartLocalGameButton.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'visible';
		instance.stopRemoteGameButton.style.visibility = 'hidden';
		instance.quoridorManager.stopMultiPlayerGame();
	}

	debugSubmitMove(instance) {
		//the local player presses this button when he wants to submit his move.
		//debugger;
		instance.debugCommandTextBox.value = instance.quoridorManager.submitLocalMove();
		instance.remote.sendGameStateToRemote(instance.debugCommandTextBox.value);

		//send out the request for periodically checking the database on the server for opponent move
		instance.remote.startCheckDatabaseForRemoteMoveLoop();
		//instance.continuePollingForRemoteMove = true;
		console.log("debug sent move.....");
		//check locally if remote has moved.
		//instance.checkRemotePlayerUpdate();
		
	}


	



	debugNewCommand(instance) {
		instance.remote.setLocalPlayerId( instance.account.getLoggedInUserId());
		var joinGameId = instance.debugRemotePlayerIdTextBox.value;
		instance.remote.gameId = joinGameId;
		instance.remote.startCheckDatabaseForRemoteMoveLoop();

		//instance.quoridorManager.submitRemoteMove(instance.debugCommandTextBox.value);
		
		//instance.stopPollingForRemoteMove();
		//instance.remote.debugImitateRemoteMoved(instance.debugCommandTextBox.value);
		//instance.remote.stopCheckDatabaseForRemoteMoveLoop();

	}

	

	localGameStart(instance) {
		console.log("start local game");
		instance.startLocalGameButton.style.visibility = 'hidden';
		instance.stopLocalGameButton.style.visibility = 'visible';
		instance.restartLocalGameButton.style.visibility = 'visible';
		instance.startRemoteGameButton.style.visibility = 'visible';
		instance.startRemoteGameButton.style.visibility = 'hidden';
		//instance.stopRemoteGameButton.style.visibility = 'visible';
		instance.quoridorManager = new Manager();
		instance.quoridorManager.startNewLocalGame();
	}
	localGameStop(instance) {
		console.log("stop local game");
		instance.startLocalGameButton.style.visibility = 'visible';
		instance.stopLocalGameButton.style.visibility = 'hidden';
		instance.restartLocalGameButton.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'visible';
		instance.quoridorManager.stopAndDeleteLocalGame();
	}
	localGameRestart(instance) {
		console.log("restart local game");
		instance.quoridorManager.restartLocalGame();
	}
	setupButtonField() {
		//cafe controls (start stop game etc.)
		var cafeControlsDiv = document.getElementById("cafeControls");
		this.startLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv, "Start local game", "localGameStart", "localGameStart", this.localGameStart, this);
		this.startLocalGameButton.style.visibility = 'visible';
		this.stopLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv, "Stop local game", "localGameStop", "localGameStart", this.localGameStop, this);
		this.stopLocalGameButton.style.visibility = 'hidden';
		this.restartLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv, "Restart local game", "localGameRestart", "localGameStart", this.localGameRestart, this);
		this.restartLocalGameButton.style.visibility = 'hidden';
		this.startRemoteGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv, "Start remote game", "remoteGameStart", "remoteGameStart", this.remoteGameStart, this);
		this.startRemoteGameButton.style.visibility = 'visible';
		this.stopRemoteGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv, "Stop remote game", "remoteGameStop", "remoteGameStop", this.remoteGameStop, this);
		this.stopRemoteGameButton.style.visibility = 'hidden';
		//debug field
		var debugControlsDiv = document.getElementById("debugControls");
		this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv, "poll...", "sendDebug", "sendDebug", this.debugNewCommand, this);
		this.debugSimulateRemoteCommandReceived.style.visibility = 'visible';
		this.debugSendMove = addButtonToExecuteGeneralFunction(debugControlsDiv, "SubmitLocalMove", "submitMoveDebug", "submitMoveDebug", this.debugSubmitMove, this);
		this.debugJoinRemoteGame = addButtonToExecuteGeneralFunction(debugControlsDiv, "join Game", "joinGame", "joinGame", this.debugJoinRemoteGame, this);
		
		
		
		this.initializeMultiPlayerGameDebug = addButtonToExecuteGeneralFunction(debugControlsDiv, "getActiveGamesList", "getActiveGamesList", "getActiveGamesList", this.debugInitMultiPlayerGame, this);
		this.initializeMultiPlayerGameDebug.style.visibility = 'visible';

		this.debugCommandTextBox = addTextBox(debugControlsDiv, "de willem gaataddierallemaaloplossenzeg", "debugCmdText", "debugCmdText", 20);


		this.debugRemotePlayerIdTextBox = addTextBox(debugControlsDiv, "13", "debugRemotePlayerIdTextBox", "debugRemotePlayerIdTextBox", 10);

		this.debugLocalPlayerStartsCheckBox = addCheckBox(debugControlsDiv, "localPlayerStarts", "localPlayerStarts", true, "Local Player Starts");
		this.debugLocalPlayerMovesUpCheckBox = addCheckBox(debugControlsDiv, "localPlayerMovesUp", "localPlayerMovesUp", true, "Local Player is blue (move up)");
		this.debugNoServerSetup = addCheckBox(debugControlsDiv, "debugNoServerUse", "debugNoServerUse", false, "debug without server");
	}
}



class Account {
	constructor() {
		// var xmlhttp;
		//this.xmlhttp=new XMLHttpRequest();	
		this.setupLoginField();
		this.loggedIn = false;
		this.loggedInUserId = NO_LOGGED_IN_USER_DUMMY_ID;
		this.loggedInUserName = "noname";
	}

	getLoggedInUserId(){
		return this.loggedInUserId;
	}

	loadDoc(url, cFunction) {
		//cfunction is a call back function, called when response from url ready. set to null if no callbackfunction used.
		// call back function should accept xmlhttp, instance as argument.
		//https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
		// var that = this;
		var xmlhttp;
		xmlhttp = new XMLHttpRequest();
		var test = cFunction;
		var that = this;
		xmlhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				if (cFunction != null) {
					test(that, this);
				}
			}
		};
		xmlhttp.open("GET", url, true); //don't use false as third argument, apparently, synchronous is going to freeze stuff...
		xmlhttp.send();
		//this.listOfLoggedInUsers();
	}
	setupLoginField() {
		//create html elements (
		var elementToAttachTo = document.getElementById(ACCOUNT_DIV);
		//addBr(elementToAttachTo);
		this.logoutButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "logout", "logoutbutton", "logoutbutton", this.userLogout, this);
		this.usernameTextBox = addTextBox(elementToAttachTo, "u", "usernameTextBox", "usernameTextBox", 20);
		this.pwdTextBox = addTextBox(elementToAttachTo, "p", "pwdTextBox", "pwdTextBox", 20);
		this.loginButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "login", "loginbutton", "loginbutton", this.userLogin, this);
		this.registerButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "register", "registerbutton", "registerbutton", this.userRegister, this);
		this.loginName = "";
		this.password = "";
		this.loginStatus(this);
	}
	loginFieldElementsVisibility(instance, loginVisibleElseLogout) {
		if (loginVisibleElseLogout) {
			instance.loginButton.style.visibility = 'hidden';
			instance.pwdTextBox.style.visibility = 'hidden';
			instance.usernameTextBox.style.visibility = 'hidden';
			instance.registerButton.style.visibility = 'hidden';
			instance.logoutButton.style.visibility = 'visible';
		}
		else {
			instance.loginButton.style.visibility = 'visible';
			instance.registerButton.style.visibility = 'visible';
			instance.pwdTextBox.style.visibility = 'visible';
			instance.usernameTextBox.style.visibility = 'visible';
			instance.logoutButton.style.visibility = 'hidden';
		}
	}
	loginAreaStatusUpdateText(text) {
		document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = "<p>" + text + "</p>";
	}

	//ACTIONS 


	//STATUS
	//gets id and username of logged in user.
	loginStatus(instance) {
		var url = "quoridorGetLoggedInStatus.php";
		instance.loadDoc(url, instance.loginStatusCallBack);
	}
	loginStatusCallBack(instance, xmlhttp) {
		//console.log(xmlhttp.responseText);
		var loggedIn = true;
		if (xmlhttp.responseText == "false") {
			loggedIn = false;
		}

		//set visibility
		instance.loginFieldElementsVisibility(instance, loggedIn);
		if (!loggedIn) {
			// console.log("user not logged in ");
			instance.loginAreaStatusUpdateText("Please log in.");
		}
		else {
			// console.log("user logged in ");
			//instance.loginAreaStatusUpdateText(xmlhttp.responseText + " logged in.");

			var response = xmlhttp.responseText.split(",");
			instance.loggedInUserId = response[0];
			instance.loggedInUserName = response[1];
			instance.loginAreaStatusUpdateText("user: " + instance.loggedInUserName + " with id: " + instance.loggedInUserId  + " logged in.");
		}
		instance.loggedIn = loggedIn;
	
	}

	//LOG OUT
	userLogout(instance) {
		var url = "quoridorlogout.php";
		instance.loadDoc(url, instance.userLogoutCallBack);
	}
	userLogoutCallBack(instance, xlmhttp) {
		instance.loginFieldElementsVisibility(instance, false);
		instance.loginAreaStatusUpdateText(xlmhttp.responseText);
	}


	//LIST OF LOGGED IN USERS
	listOfLoggedInUsers() {
		var url = "quoridorloggedinusers.php";
		this.loadDoc(url, this.listOfLoggedInUsersCallBack);
		//console.log("all logged in players listed up");
	}
	listOfLoggedInUsersCallBack(instance, xlmhttp) {
		var responseArray = xlmhttp.responseText.split(",");
		var outputString = "";

		for (var i = 0; i < responseArray.length; i+=2) {
			// console.log(i); 
			outputString += responseArray[i] + " - id: " + responseArray[i+1] + "<br>";
		}
		document.getElementById(LOGGEDINUSERS_DIV_LIST).innerHTML = outputString;
	}


	//LIST OF GAMES
	//userLoginButtonClicked(instance){
		
	//

	//LOG IN
	userLogin(instance) {
		var url = "quoridorlogin.php?username=" + instance.usernameTextBox.value + "&password=" + instance.pwdTextBox.value + "";
		// console.log("user login button clicked");
		instance.loadDoc(url, instance.userLoginCallBack);
	}
	userLoginCallBack(instance, xlmhttp) {
		//returns error, or userId.

		if (xlmhttp.responseText == "Wrong username-password combination.") {
			loggedIn = false;
			console.log("Wrong username-password combination.");
		
		}else{
			
			//var userId = xlmhttp.responseText;
			
			//instance.loggedInUserId = userId;
			//instance.loginFieldElementsVisibility(instance, loggedIn);
			instance.loginStatus(instance); //sets all login info up.
		}
		//instance.loginAreaStatusUpdateText(xlmhttp.responseText);
		//console.log(instance.loggedInUserId);
		//instance.loggedIn = loggedIn;
	}

	//REGISTRATION 
	userRegister(instance) {
		var url = "quoridornewuser.php?username=" + instance.usernameTextBox.value + "&password=" + instance.pwdTextBox.value + "";
		// console.log("user login button clicked");
		instance.loadDoc(url, instance.userRegisterCallBack);
	}
	userRegisterCallBack(instance, xlmhttp) {
		var loggedIn = false;
		if (xlmhttp.responseText == "Registered successfully!") {
			loggedIn = true;
		}
		instance.loginFieldElementsVisibility(instance, loggedIn);
		instance.loginAreaStatusUpdateText(xlmhttp.responseText);
	}
}



//------------------------------------------------------

class RemoteContact {
	constructor() {
		this.localPlayerId = NO_PLAYER_DUMMY_ID; //very important.  --> identify player 
		this.remotePlayerId = NO_PLAYER_DUMMY_ID
		this.gameId = NO_GAME_ID_YET;//very important --> use this for polling.
		this.localPlayerIsPlayer1 = true;
		

		this.localPlayerStarts = false;
		this.startingPlayer = PLAYER1;
		this.localPlayerGoesUpwards = false;



		this.gameStatus = GAME_STATUS_NO_STATUS_YET;
		this.desiredRemotePlayerId = 124; //not yet important as of dec 2017, the idea could be here that if you want to start a newGame, you want to make sure you play against this opponent only.
		
		this.counter = 1;
		
		this.continuePollingForRemoteMove = false;
		this.currentLocalGameStateString = "";
		this.remoteMovedCallBackfunction;

		this.remoteGameData = {};
		
	}


	setGameProperties(startingPlayer,localPlayerStarts,localPlayerGoesUpwards ){

	


		//should be stored remotely, but this will do for now.
		this.localPlayerStarts = localPlayerStarts;
		this.startingPlayer = startingPlayer;
		this.localPlayerGoesUpwards = localPlayerGoesUpwards;
	}

	setLocalPlayerId(id){
		this.localPlayerId = id;
	}
	setRemoteMovedCallback(instance ,callbackFunction){
		this.storedInstance = instance;
		this.remoteMovedCallBackfunction = callbackFunction;
	}

	setStartLocalBoardCallback(instance ,callbackFunction){
		this.storedInstance2 = instance;
		this.startLocalBoardCallBackfunction = callbackFunction;
	}
	

	//---------------------------join existing game by gameId.

	joinGame(gameId){
		//step one: check if possible.
		console.log("checkit");
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+gameId;// No question mark needed
		this.callPhpWithAjax(url,this.joinGameFeedback.bind(this));
	


	}

	joinGameFeedback(responseJSON){
		
		console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		// var remoteStatus = this.processResponse(remoteDataArray);
		console.log(remoteDataArray);
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		if (remoteDataArray.length == 0){

			console.log("game not found... gameId provided: " + gameId);
			return false;
		}
		if (this.localPlayerId == remotePlayer1 && this.localPlayerId == remotePlayer2){
			console.log("ASSERT ERROR: game with id" +remoteDataArray["gameId"] +" has two will not join the game.");
			return false;
		}
		
		if (this.localPlayerId == remotePlayer1 ){
			this.joinGameExecute(gameId,1);
		}else if (this.localPlayerId == remotePlayer2){
			this.joinGameExecute(gameId,2);
		}else if (remotePlayer1 == NO_PLAYER_DUMMY_ID){
			this.joinGameExecute(gameId,1);
		}else if (remotePlayer2 == NO_PLAYER_DUMMY_ID){
			this.joinGameExecute(gameId,2);
		}else{
			console.log("ASSERT ERROR: this game is not available for this player. There must be a free spot, or it must be a continuation of a previous game. ids: " );
			
		}



	}

	joinGameExecute(gameId, playerNumber){
	//joinGame(gameId){
		//game can also be joined if it was made earlier on...
		//so first check if the game id exists, and if the player id's are both filled in. 

		//var playerNumber = 1; //1 or 2.

		//add localplayer as player2
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"joinGame"+"&playerId=" + this.localPlayerId + "&gameId=" + gameId+ "&playerNumber=" + playerNumber;// No question mark needed
		console.log("try to join game: " + gameId + ". By player: " + this.localPlayerId);
		this.callPhpWithAjax(url, this.joinGameExecuteFeedback.bind(this));
		
		//debug for now:
		this.gameId = gameId; 
		this.currentLocalGameStateString = "";
		
	}
	joinGameExecuteFeedback(remoteGameDataJSON){
		//response should be JSON
		console.log(remoteGameDataJSON);
		var remoteGameData =  JSON.parse(remoteGameDataJSON);
		this.initialSetLocalToMirrorRemoteGame(remoteGameData);

		//
		this.startCheckDatabaseForRemoteMoveLoop();	
		
	}







	//-------------------create a new game in the remote database 
	initNewGame(localPlayerId, desiredRemotePlayerId){
		
		this.localPlayerId = localPlayerId;
		this.desiredRemotePlayerId = desiredRemotePlayerId;

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"createGame"+"&player1=" + this.localPlayerId + "&player2=" + this.desiredRemotePlayerId ;// No question mark needed
		console.log("create new game");
		console.log(url);
		this.callPhpWithAjax(url, this.newGameCreatedFeedback.bind(this));	

		//debug.
	}

	newGameCreatedFeedback(response){
		this.gameId = response; 
		console.log("game created with id: " + response);
		
	}

	//---------------list all the available games from the database
	
	listOfGames(){
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"listOfGames";// No question mark needed
		console.log("list of games");
		this.callPhpWithAjax(url, this.listOfGamesCallBack.bind(this));	
	}

	listOfGamesCallBack(responseText){
		//console.log("list of games.ffff");
		//console.log(responseText);
		var responseArray = responseText.split(",");
		var outputString = "";

		for (var i = 0; i < responseArray.length; i+=1) {
		
			outputString +=  " game id: " + responseArray[i]   + "<br>";
		}
		document.getElementById(LISTEDGAMES_DIV_LIST).innerHTML = outputString;
	}
	

	//------------debug pretend a remote opponent moved.

	//post from this computer, but change in database, as if a remote player moved...
	debugImitateRemoteMoved(gameStateString) {
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ gameStateString+"&action="+"submit"+"&gameId="+this.gameId;// No question mark needed
		console.log("imitation move gamestring: " + gameStateString);
		this.callPhpWithAjax(url, this.debugRemoteMoveImitation.bind(this));	
	}
	debugRemoteMoveImitation(response){
		console.log("remoteImitatedMove");
	}

	//---------------post local move

	sendGameStateToRemote(gameStateString) {
		console.log(this);
		this.currentLocalGameStateString = gameStateString;

		//this.multiPlayerGame.deleteGame();
	// var url = "http://lode.ameije.com/sandbox.php?q=666&action=read";// No question mark needed
		//	var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php";// No question mark needed
		//	quoridorlogin.php?username="+ instance.usernameTextBox.value + "&password="+ instance.pwdTextBox.value + "";

		//var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState=n,s,n";// No question mark needed
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ this.currentLocalGameStateString+"&action="+"submit"+"&gameId="+this.gameId;// No question mark needed
		console.log(url);
		this.callPhpWithAjax(url, this.submitResponse.bind(this));	
		console.log("gamestate Sent");
	}

	submitResponse(instance,result){
		//feedback result from submitting the move to the database.
		document.getElementById("debugServerFeedback").innerHTML = result;
	}

	// checkIfGameIdExists(id){

	// }



	

	// ------------------check for remote move.


	startCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = true;
		this.callbackCheckForRemoteUpdate();
	}

	stopCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = false;
	}

	checkDatabaseForRemoteMoveLoop(){
	
		if (this.continuePollingForRemoteMove){
			var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+this.gameId;// No question mark needed
			this.callPhpWithAjax(url,this.pollResponse.bind(this));
			window.setTimeout(function (){this.callbackCheckForRemoteUpdate( this.counter)}.bind(this),GAME_CHECK_SERVER_INTERVAL); 	
		}
		//window.setTimeout(this.callbackCheckForRemoteUpdate,GAME_CHECK_SERVER_INTERVAL,this); 
		this.counter += 1;
	}
	callbackCheckForRemoteUpdate(){
		this.checkDatabaseForRemoteMoveLoop();
	}

	pollResponse(responseJSON){
		console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		var remoteStatus = this.processResponse(remoteDataArray);
		
		//local game action:
		if (remoteStatus == GAME_STATUS_PLAYING){

			//verify remote data
			if(!this.verifyRemoteGameData(remoteDataArray)){
				console.log("ASSERT ERROR");
				return false;
			};		

			//if local state is still "initializing, this is the time to display. the board."
			if (this.gameStatus == GAME_STATUS_INITIALIZING || this.gameStatus == GAME_STATUS_NO_STATUS_YET){
				//first feedback from "playing game". possible already with opponent move. 
				console.log("starting local game. ");

				//define rotation of board
				var player1GoesUpwards = false;
				if ( this.localPlayerIsPlayer1){
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = true;
						console.log("a");
					}else{
						player1GoesUpwards = false;
						console.log("b");
					}
				}else{
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = false;
						console.log("c");
					}else{
						player1GoesUpwards = true;
						console.log("d");
					}
				}
				
				var player1GoesUpwards = false;

				this.startLocalBoardCallBackfunction(this.storedInstance2,this.startingPlayer, this.localPlayerStarts, player1GoesUpwards, remoteDataArray["gameState"]);
				this.gameStatus = GAME_STATUS_PLAYING;
			}


			//check for remote move.

			
			var opponentMovedOneMove = this.compareGameStates(remoteDataArray)
			console.log("compare states status: " + opponentMovedOneMove);
			if (opponentMovedOneMove){
				// returnStatus
				// this.remoteMove
				this.stopCheckDatabaseForRemoteMoveLoop();
				this.remoteMovedCallBackfunction(this.storedInstance, remoteDataArray["gameState"]);
			}
		
			return true;
		}else if (remoteStatus == GAME_REGISTER_LOCAL_PLAYER){
			console.log("register local player");
			
			
		}else if (remoteStatus == GAME_STATUS_INITIALIZING){
			//give command to startup the boards 
			console.log("game init.... ");
			//--> not yet ok, this would imply that there must be a move first, while that's impossible if there is not yet a board visible. 
		}else if (remoteStatus == GAME_STATUS_ERROR){
			console.log("error in database response. The game seems not to be valid. " +remoteDataArray );
			
		}

		//startup of the local game board.


	}




	callPhpWithAjax(url,functionToCallWhenDone){
		//ajax is asynchronous, so give a function that should be called when a result is present (function must accept argument for the result text)
		var xmlhttp = new XMLHttpRequest();
		var returnText = "";
		var instance = this;
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//console.log(instance);
				functionToCallWhenDone( this.responseText);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		return
	}


	processResponse(remoteDataArray){



		//telegram with data;
		//gameId
		//gameState
		//startingPlayer
		//player1Id
		//player2Id
		//gamestate
		//timestampGameCreated
		//timestampPlayer1LastMove
		//timestampPlayer2LastMove
		
		//https://stackoverflow.com/questions/9740775/php-return-array-into-javascript
		
		// save the JSON encoded array
		// $jsonData = json_encode($response); 
		// In your script, use something like the following to merge that JSON into the JavaScript:

		// <script>
		// var data = <?= $jsonData ?>;
		// console.log(data); // or whatever you need to do with the object
		// </script>
	
		

		//return remoteDataArray.gameStarted + "   " + remoteDataArray["gameStarted"];
		//remoteDataArray = remoteDataArray;
		// console.log(remoteDataArray);
		console.log( remoteDataArray["gameId"]);
		console.log( remoteDataArray);
		var returnStatus = GAME_STATUS_ERROR;
		if (remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING){
			//console.log();
			//console.log(remoteDataArray["playerId2"]);
			console.log("wait for opponent to join game.");
			returnStatus = GAME_STATUS_INITIALIZING;

			// if (! this.localPlayerIsRemotelySet(remoteDataArray )){
			// 	//local player id needs to be remotely registered
			// 	if(remotePlayer1Id == NO_PLAYER_DUMMY_ID && remotePlayer2Id == NO_PLAYER_DUMMY_ID){
			// 		console.log("ASSERT ERROR: game initialized without a single playing playerid.");
			// 		returnStatus = GAME_STATUS_ERROR;
			// 	}else if(remotePlayer1Id == NO_PLAYER_DUMMY_ID || remotePlayer2Id == NO_PLAYER_DUMMY_ID){
			// 		returnStatus = GAME_REGISTER_LOCAL_PLAYER;
			// 	}else {
			// 		console.log("ASSERT ERROR: game initializing, but local player not registered, and no place for it. Invalid status. ");
			// 		returnStatus = GAME_STATUS_ERROR;
			// 	}
			// }else if (remotePlayer1Id == NO_PLAYER_DUMMY_ID || remotePlayer2Id == NO_PLAYER_DUMMY_ID) {
			// 	//local player registered but no opponent available, 
			// 	console.log("no opponent found. Wait for opponent to register.");
				
			// 	returnStatus = GAME_STATUS_INITIALIZING;

			// }else{
			// 	console.log("assert error. game status indicates initialization, but both players are set. ");
			// 	console.log( remoteDataArray["playerId2"] == NO_PLAYER_DUMMY_ID);

			// 	returnStatus = GAME_STATUS_ERROR;
			// }
			

		}else if(remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_PLAYING){
			returnStatus = GAME_STATUS_PLAYING;
		}else{
			var returnStatus = GAME_STATUS_ERROR;
			console.log("aiaiai probme");
		}

		// }else if (remoteDataArray["gameStatus"] == ){
		// 	//check game state.	REMOTE_GAME_STATUS_PLAYING
		// 	returnStatus = GAME_STATUS_PLAYING;
		// }

		


		//check game status

		// if (remoteDataArray["gameStatus" == 0]){
		// 	//game not yet started.
		// }else if (remoteDataArray["gameStatus" == 1]){
		// 	//game continuation.

		// }

		return returnStatus ;
		//return  remoteDataArray["gameId"];
	}


	initialSetLocalToMirrorRemoteGame(remoteGameData){
		var remotePlayer1Id  = parseInt(remoteGameData["playerId1"]); 
		var remotePlayer2Id  = parseInt(remoteGameData["playerId2"]); 
		if(remotePlayer1Id == remotePlayer2Id){
			console.log("error playing against yourself... id 1 and2 are equal. not allowed.");
			return false;
		}else if(this.localPlayerId == remotePlayer1Id){
			this.localPlayerIsPlayer1 = true;
			this.remotePlayerId = remotePlayer2Id;
		}else if (this.localPlayerId == remotePlayer2Id){
			this.localPlayerIsPlayer1 = false;
			this.remotePlayerId = remotePlayer1Id;
		}else {
			console.log("assert errro: local player ID not set in remote. ");
			return false;
		}
		
		if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING ){
			this.gameStatus = GAME_STATUS_INITIALIZING;
			if (this.remotePlayerId != NO_PLAYER_DUMMY_ID){
				console.log("ASSERT ERROR: game status is initialzing. yet, both players are defined.... remote player: " +this.remotePlayerId );
			}else{

				console.log("wait for opponent to join.");
			}

		}else if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_PLAYING ){
			if (remoteGameData["gameState"] != "" && remoteGameData["gameState"] != "notyetstarted"){
				//game already started. that means: recover!
				console.log("recover game");
			}else{
				//start new game.
				console.log("new game.");
			}
			

		}else{
			console.log("unhandled status: " + remoteGameData["gameStatus"]);
		}
		return true;

	}

	verifyRemoteGameData(remoteGameData){
		//if game is going, always verify every poll.
		console.log(remoteGameData);
		var remotePlayer1Id  = parseInt(remoteGameData["playerId1"]); 
		var remotePlayer2Id  = parseInt(remoteGameData["playerId2"]); 
	
		if(this.localPlayerIsPlayer1){
			if(this.localPlayerId != remotePlayer1Id && this.remotePlayerId != remotePlayer2Id ){
				console.log(this.remotePlayerId);
				console.log(this.localPlayerId);
				console.log(remotePlayer1Id);
				console.log(remotePlayer2Id);
				console.log("assert error incorrect player ");
				return false;
			}
		}else{
			if(this.localPlayerId != remotePlayer2Id && this.remotePlayerId != remotePlayer1Id ){
				console.log(this.remotePlayerId);
				console.log(this.localPlayerId);
				console.log(remoteGameData["playerId1"]);
				console.log(remotePlayer2Id);
				console.log("assert error incorrect player ");
				return false;
			}
		}
		
		if (remoteGameData["gameId"] != this.gameId){
			console.log("ASSERT error: incorrect game id");
			return false;
		}
		return true;
		

	}

	// localPlayerIsRemotelySet(remoteGameData){
	// 	//return local player id is set in remote game.

	// 	var returnStatus = false;
	// 		//check player ids.
	// 	if (remoteGameData["playerId1"] == remoteGameData["playerId2"]){
			
	// 		console.log("ASSERT ERROR: two times the same player. You make this too hard for me. Please chose another opponent then yourself. id:" + this.remoteGameData["playerId2"] );
	// 		returnStatus = false;
	// 	}else if(remoteGameData["playerId1"] == this.localPlayerId){
	// 		this.localPlayerIsPlayer1 = true;
	// 		returnStatus = true;
	// 	}else if(remoteGameData["playerId2"] == this.localPlayerId){
	// 		this.localPlayerIsPlayer1 = false;
	// 		returnStatus = true;
	// 	}else{
	// 		console.log("response from a game where this playerId is not one of the players. is it set up correctly? Is the right gameId provided?");
	// 		//returnStatus = GAME_STATUS_ERROR;

	// 		returnStatus = false;
	// 	}

		
		
	// 	return returnStatus;
		
	// }

	compareGameStates(remoteGameData) {
		var remoteGameState = remoteGameData["gameState"];
		var remote = remoteGameState.split(",");
		var local = this.currentLocalGameStateString.split(",");
		var remoteMoved = false;
		var remoteMove = "";

		//var returnStatus = GAME_STATUS_ERROR;
		var returnStatus = false;
		//first move is a bit of a hack, as even an empty gameStateString returns an array of length 1
		if (remote[0]!="" && remote[0]!="notyetstarted" &&  local [0]==""  ){
			local = [];
			console.log("first move opponent. remote: "+ remote  + " local: " + local);
			// returnStatus = GAME_STATUS_NO_MOVES_YET;

		}

		// if (remote[0]=="" || remote[0]=="notyetstarted" &&  local [0]==""  ){
		// 	local = [];
		// 	console.log("first move opponent. remote: "+ remote  + " local: " + local);
		// 	returnStatus = GAME_STATUS_NO_MOVES_YET;

		// }
		
		if (remote.length< local.length){
			console.log ("not yet updated");
			
		}else if(remote.length == local.length){
			console.log("waiting for opponent to make a move");
			console.log(utilities.arraysEqual(remote,local));
		
			console.log(remote);
			console.log(local);
		
			console.log(remote.length);
			console.log(local.length);
			//returnStatus = GAME_STATUS_PLAYING_NO_CHANGE;
			returnStatus = false;

		}else if (remote.length > local.length){
			console.log("opponent made a move")
			console.log()
			if (remote.length != local.length +1 ){
				//not one move difference
				
				if (local[0]== ""){
					console.log("It seems like this is a recovered game.");
					// returnStatus = GAME_STATUS_RECOVER_GAME;
					returnStatus = false;
				}else{
					console.log("ASSERT ERROR, game state remote does not reflect one extra move. ");
					// returnStatus = GAME_STATUS_ERROR;
					returnStatus = false;
				}
				
				console.log(remote);
				console.log(local);

				//set up game for continuation
				//create new game with starting gamestring.

				
			}else{
				//one move difference
				returnStatus =true;
				//check history
				for (var i = 0; i < local.length; i++) { 
					if (local[i] != remote[i] ){
						console.log("ASSERT ERROR: gamestate history not indentical ");
						console.log(remote);
						console.log(local);
					
						// returnStatus = GAME_STATUS_ERROR;
						returnStatus = false;
					}
				} 

				// if (local [0]==""){
				// 	//first move.
				// 	// returnStatus = GAME_STATUS_PLAYING;
				// 	console.log("local first move....");
				// 	returnStatus = true;
				// }else{
				// 	console.log("local not empty....");
				// 	// returnStatus = GAME_STATUS_PLAYING;
				// 	returnStatus = false;
				// }
				
				//get the last move
				this.remoteMove = remote[remote.length - 1];
			}
			
	
		}else {

			console.log("ASSERT ERROR unvalid arrasy.");
			// returnStatus = GAME_STATUS_ERROR;
			returnStatus = false;
		}
		
		return returnStatus;
		
	}

	
		
	
}

