var logonText = "Welcome in Quoridor Cafe The big wall.";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var LOGGEDINUSERS_DIV_LIST = "loggedinusers";
var LISTEDGAMES_DIV_LIST = "listedGames";
var AVAILABLE_GAMES_ON_SERVERS_DIV = "availableGamesOnServer";
var CAFE_STATUS_DIV = "cafeStatus";

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
		this.remote.setUpdateStatusFieldCallback(this.updateStatusField);
		
		
		this.showingGamesList = false;
		var listElement = document.getElementById(AVAILABLE_GAMES_ON_SERVERS_DIV);
		listElement.style.display = 'none';
		
		
		this.updateStatusField("Welcome to the quoridor cafe.");
		
		
	}

	remoteGameStart(instance) {
		console.log("start remote game");
		
		alert("Reminder: Do not forget to press the button submitLocalMove after each move you make! ");
		
		instance.clearStatusField();
		
		instance.localGameControlsDiv.style.display = 'none';

		// instance.startLocalGameButton.style.visibility = 'hidden';
		// instance.stopLocalGameButton.style.visibility = 'hidden';
		// instance.restartLocalGameButton.style.visibility = 'hidden';
		
		instance.stopRemoteGameButton.style.visibility = 'visible';
		instance.listGamesButtom.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'hidden';
		instance.joinRemoteGameButton.style.visibility = 'hidden';
		instance.remoteGameIdTextBox.style.visibility = 'hidden';
		instance.player1StartsCheckbox.style.visibility = 'hidden';
		instance.localPlayerMovesUpCheckbox.style.visibility = 'hidden';
		document.getElementById(instance.player1StartsCheckbox.id+"_label").style.visibility = 'hidden';
		instance.localPlayerMovesUpCheckbox.style.visibility = 'hidden';
		document.getElementById(instance.localPlayerMovesUpCheckbox.id+"_label").style.visibility = 'hidden';
		instance.submitLocalMoveButton.style.visibility = 'visible';
		instance.setGamesListVisibility(false);



		var localPlayerGoesUpwards = instance.localPlayerMovesUpCheckbox.checked;
		instance.remote.setGameProperties(localPlayerGoesUpwards);
		
		var localId = instance.account.getLoggedInUserId();
		//var debugGameId = instance.remoteGameIdTextBox.value;
		
		//alert("game start: player:" + localId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");
		
		var localPlayerStarts = instance.player1StartsCheckbox.checked;
		instance.remote.initNewGame(localId, NO_PLAYER_DUMMY_ID,localPlayerStarts );
	
	}

	setVisibilityControlsRemoteStarted(){

	}
	

	startAndDisplayMultiPlayerGameQuoridor(instance, startingPlayer, localPlayerStarts, player1GoesUpwards, gameStateString ){
		
		instance.quoridorManager = new Manager();

		console.log("starting board, gamestatstring: " + gameStateString);
		if (gameStateString == "notyetstarted"){
			gameStateString = "";
		}
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

	joinRemoteGame(instance){

		alert("Reminder: Do not forget to press the button submitLocalMove after each move you make! ");
	
		instance.clearStatusField();
		
		//get game id from field.
		//check for remote game with this id
		instance.remote.setLocalPlayerId( instance.account.getLoggedInUserId());
		var joinGameId = instance.remoteGameIdTextBox.value;
		
		instance.remote.joinGame(joinGameId);	
		console.log("attempt to join game with id: " + joinGameId);
		var localPlayerGoesUpwards = instance.localPlayerMovesUpCheckbox.checked;
		instance.remote.setGameProperties(localPlayerGoesUpwards);
		instance.localGameControlsDiv.style.display = 'none';
		
		// instance.startLocalGameButton.style.visibility = 'hidden';
		// instance.stopLocalGameButton.style.visibility = 'hidden';
		// instance.restartLocalGameButton.style.visibility = 'hidden';
		
		instance.stopRemoteGameButton.style.visibility = 'visible';
		instance.listGamesButtom.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'hidden';
		instance.joinRemoteGameButton.style.visibility = 'hidden';
		instance.remoteGameIdTextBox.style.visibility = 'hidden';
		instance.player1StartsCheckbox.style.visibility = 'hidden';
		document.getElementById(instance.player1StartsCheckbox.id+"_label").style.visibility = 'hidden';
		instance.localPlayerMovesUpCheckbox.style.visibility = 'hidden';
		document.getElementById(instance.localPlayerMovesUpCheckbox.id+"_label").style.visibility = 'hidden';
		instance.submitLocalMoveButton.style.visibility = 'visible';
		instance.setGamesListVisibility(false);
	}

	listGames(instance){
		//check all available games for joining...
		instance.remote.listOfGames(1);
		
		instance.setGamesListVisibility(!instance.showingGamesList);
			
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



	remoteGameStop(instance) {
		console.log("stop remote game");
		instance.localGameControlsDiv.style.display = 'block';
		// instance.startLocalGameButton.style.visibility = 'visible';
		// instance.stopLocalGameButton.style.visibility = 'hidden';
		// instance.restartLocalGameButton.style.visibility = 'hidden';

		instance.stopRemoteGameButton.style.visibility = 'hidden';
		instance.listGamesButtom.style.visibility = 'visible';
		instance.startRemoteGameButton.style.visibility = 'visible';
		instance.joinRemoteGameButton.style.visibility = 'visible';
		instance.remoteGameIdTextBox.style.visibility = 'visible';
		instance.player1StartsCheckbox.style.visibility = 'visible';
		instance.localPlayerMovesUpCheckbox.style.visibility = 'visible';
		document.getElementById(instance.player1StartsCheckbox.id+"_label").style.visibility = 'visible';
		instance.localPlayerMovesUpCheckbox.style.visibility = 'visible';
		document.getElementById(instance.localPlayerMovesUpCheckbox.id+"_label").style.visibility = 'visible';
		instance.submitLocalMoveButton.style.visibility = 'hidden';



		instance.quoridorManager.stopMultiPlayerGame();
	}

	submitLocalMove(instance) {
		//the local player presses this button when he wants to submit his move.
		instance.debugCommandTextBox.value = instance.quoridorManager.submitLocalMove();
		instance.remote.sendGameStateToRemote(instance.debugCommandTextBox.value);

		//send out the request for periodically checking the database on the server for opponent move
		instance.remote.startCheckDatabaseForRemoteMoveLoop();
		console.log("local move sent to server...");
		//check locally if remote has moved.		
	}

	clearStatusField(){
		document.getElementById(CAFE_STATUS_DIV).innerHTML = "";
	}
	updateStatusField(updateString){
		document.getElementById(CAFE_STATUS_DIV).innerHTML = document.getElementById(CAFE_STATUS_DIV).innerHTML +"<br>"+ updateString;
	}
	
	
	debugNewCommand(instance) {
		instance.remote.setLocalPlayerId( instance.account.getLoggedInUserId());
		var joinGameId = instance.remoteGameIdTextBox.value;
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
		instance.joinRemoteGameButton.style.visibility = 'hidden';

		instance.remoteGameControlsDiv.style.display = 'none';
		//instance.stopRemoteGameButton.style.visibility = 'visible';
		instance.quoridorManager = new Manager();
		instance.quoridorManager.startNewLocalGame();
	}
	localGameStop(instance) {
		instance.remoteGameControlsDiv.style.display = 'block';
		console.log("stop local game");
		instance.startLocalGameButton.style.visibility = 'visible';
		instance.stopLocalGameButton.style.visibility = 'hidden';
		instance.restartLocalGameButton.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'visible';
		instance.joinRemoteGameButton.style.visibility = 'visible';
		instance.quoridorManager.stopAndDeleteLocalGame();
	}
	localGameRestart(instance) {
		console.log("restart local game");
		instance.quoridorManager.restartLocalGame();
	}
	


	setupButtonField() {
		//cafe controls (start stop game etc.)
		this.localGameControlsDiv = document.getElementById("localGameControls");
		this.startLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Start local game", "localGameStart", "localGameStart", this.localGameStart, this);
		this.startLocalGameButton.style.visibility = 'visible';
		this.stopLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Stop local game", "localGameStop", "localGameStart", this.localGameStop, this);
		this.stopLocalGameButton.style.visibility = 'hidden';
		this.restartLocalGameButton = addButtonToExecuteGeneralFunction(this.localGameControlsDiv, "Restart local game", "localGameRestart", "localGameStart", this.localGameRestart, this);
		this.restartLocalGameButton.style.visibility = 'hidden';
		



		this.remoteGameControlsDiv = document.getElementById("remoteGameControls");
		
		this.stopRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Stop remote game", "remoteGameStop", "remoteGameStop", this.remoteGameStop, this);
		this.stopRemoteGameButton.style.visibility = 'hidden';
		this.submitLocalMoveButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "SubmitLocalMove", "submitMoveDebug", "submitMoveDebug", this.submitLocalMove, this);
		this.submitLocalMoveButton.style.visibility = 'hidden';
		
		
		addBr(this.remoteGameControlsDiv);
		
		this.startRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Start remote game", "remoteGameStart", "remoteGameStart", this.remoteGameStart, this);
		this.startRemoteGameButton.style.visibility = 'visible';
		this.player1StartsCheckbox = addCheckBox(this.remoteGameControlsDiv, "PLAYER1 starts", "PLAYER1 starts", true, "I (who initiates the game) make the first move.");
		addBr(this.remoteGameControlsDiv);
		
		this.listGamesButtom = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "Show the available multiplayer games", "getActiveGamesList", "getActiveGamesList", this.listGames, this);
		this.listGamesButtom.style.visibility = 'visible';
		
		this.joinRemoteGameButton = addButtonToExecuteGeneralFunction(this.remoteGameControlsDiv, "join Game with id provided -->", "joinGame", "joinGame", this.joinRemoteGame, this);
		this.joinRemoteGameButton.style.visibility = 'visible';
		this.remoteGameIdTextBox = addTextBox(this.remoteGameControlsDiv, "ganeId", "remoteGameIdTextBox", "remoteGameIdTextBox", 10);
		addBr(this.remoteGameControlsDiv);
		
		
		//debug field
		addBr(this.remoteGameControlsDiv);
		var debugControlsDiv = document.getElementById("debugControls");
		this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv, "debug poll...", "sendDebug", "sendDebug", this.debugNewCommand, this);
		this.debugSimulateRemoteCommandReceived.style.visibility = 'visible';
		this.debugCommandTextBox = addTextBox(debugControlsDiv, "debug", "debugCmdText", "debugCmdText", 20);
		this.debugNoServerSetup = addCheckBox(debugControlsDiv, "debugNoServerUse", "debugNoServerUse", false, "debug without server");
		this.localPlayerMovesUpCheckbox = addCheckBox(debugControlsDiv, "localPlayerMovesUp", "localPlayerMovesUp", true, "Display Local Player moves up on the board.");
		
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
	}

	setupLoginField() {
		//create html elements (
		var elementToAttachTo = document.getElementById(ACCOUNT_DIV);
		//addBr(elementToAttachTo);
		this.logoutButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "logout", "logoutbutton", "logoutbutton", this.userLogout, this);
		this.usernameTextBox = addTextBox(elementToAttachTo, "username", "usernameTextBox", "usernameTextBox", 20);
		this.pwdTextBox = addTextBox(elementToAttachTo, "password", "pwdTextBox", "pwdTextBox", 20);
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
		var responseJSON = xlmhttp.responseText;
		var remoteDataArray =  JSON.parse(responseJSON);
		
		console.log(remoteDataArray);
		//var responseArray = response.split(",");
		var outputString = "Name:Id of registered users: ";

		//for (var i = 0; i < responseArray.length; i+=2) {
		for (var i = 0; i < remoteDataArray.length; i+=1) {

			outputString += " " + remoteDataArray[i]["uUsername"] + ": " + remoteDataArray[i]["userId"] + "***"; 
			//outputString += responseArray[i] + " - id: " + responseArray[i+1] + ", ";
		}
		document.getElementById(LOGGEDINUSERS_DIV_LIST).innerHTML = outputString;
	}

	//LOG IN
	userLogin(instance) {

		var userName = instance.usernameTextBox.value;
		if (userName == "username"){
			alert("Please enter a valid username and password.");
			return false;
		}
		var url = "quoridorlogin.php?username=" + userName + "&password=" + instance.pwdTextBox.value + "";
		instance.loadDoc(url, instance.userLoginCallBack);
	}
	userLoginCallBack(instance, xlmhttp) {
		//returns error, or userId.

		if (xlmhttp.responseText == "Wrong username-password combination.") {
			instance.loggedIn = false;
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
		var userName = instance.usernameTextBox.value;
		if (userName == "username"){
			alert("Please enter a valid username and password.");
			return false;
		}
		var url = "quoridornewuser.php?username=" + userName + "&password=" + instance.pwdTextBox.value + "";
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
		

		this.localPlayerFirstMove = false;
		this.startingPlayer = PLAYER1;
		this.localPlayerGoesUpwards = false;



		this.gameStatus = GAME_STATUS_NO_STATUS_YET;
		this.desiredRemotePlayerId = 124; //not yet important as of dec 2017, the idea could be here that if you want to start a newGame, you want to make sure you play against this opponent only.
		
		this.counter = 1;
		
		this.continuePollingForRemoteMove = false;
		this.currentLocalGameStateString = "";
		this.remoteMovedCallBackfunction;
		this.updateCafeStatusField;
		this.remoteGameData = {};
		
	}


	setGameProperties(localPlayerGoesUpwards ){

		//should be stored remotely, but this will do for now.
		//this.startingPlayer = startingPlayer;
		this.localPlayerGoesUpwards = localPlayerGoesUpwards;
	}

	setLocalPlayerId(id){
		this.localPlayerId = id;
	}
	setRemoteMovedCallback(instance ,callbackFunction){
		this.cafeInstance = instance;
		this.remoteMovedCallBackfunction = callbackFunction;
	}
	
	setUpdateStatusFieldCallback(callbackFunction){
		//this.cafeInstance = instance;
		this.updateCafeStatusField = callbackFunction;
		
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
			this.updateCafeStatusField("game not found... gameId provided: " + gameId);
			return false;
		}
		if (this.localPlayerId == remotePlayer1 && this.localPlayerId == remotePlayer2){
			console.log("ASSERT ERROR: game with id" +remoteDataArray["gameId"] +" has two players already (and the local player id is not one of them) will not join the game.");
			this.updateCafeStatusField("No joining possible. (game full)");
		
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
			this.updateCafeStatusField("No joining possible. (check gameId and playeId)");
		}
	}

	joinGameExecute(gameId, playerNumber){
		//playernumber: local id is playerId1 or Id2 -->//1 or 2.
		
	//joinGame(gameId){
		//game can also be joined if it was made earlier on...
		//so first check if the game id exists, and if the player id's are both filled in. 

		//add localplayer as player2
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"joinGame"+"&playerId=" + this.localPlayerId + "&gameId=" + gameId+ "&playerNumber=" + playerNumber;// No question mark needed
		console.log("try to join game: " + gameId + ". By player: " + this.localPlayerId);
		
		this.updateCafeStatusField("joining game: " + gameId + ". By player: " + this.localPlayerId);
		
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
		this.startCheckDatabaseForRemoteMoveLoop();	
		this.updateCafeStatusField("joining successful");
		
		
	}


	//-------------------create a new game in the remote database 
	initNewGame(localPlayerId, desiredRemotePlayerId, localPlayerFirstMove){
		
		this.localPlayerId = localPlayerId;
		this.desiredRemotePlayerId = desiredRemotePlayerId;
		
		this.updateCafeStatusField("game start: player:" + localPlayerId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");

		this.localPlayerFirstMove = localPlayerFirstMove;
		var firstMoveAsPlayer1DoesFirstMove = 1;
		if (!localPlayerFirstMove){
			var firstMoveAsPlayer1DoesFirstMove = 0;		
		}
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"createGame"+"&player1=" + this.localPlayerId + "&player2=" + this.desiredRemotePlayerId + "&player1FirstMove=" + firstMoveAsPlayer1DoesFirstMove ;// No question mark needed
		console.log("create new game");
		console.log(url);
		this.callPhpWithAjax(url, this.newGameCreatedFeedback.bind(this));	

		//debug.
	}

	newGameCreatedFeedback(responseJSON){

		//console.log("new game created raw response: " + responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		// var remoteStatus = this.processResponse(remoteDataArray);
		console.log( remoteDataArray); //"remote Game Data: " +
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		this.gameId = gameId; 
		if (remotePlayer2 == NO_PLAYER_DUMMY_ID){
			this.gameStatus = GAME_STATUS_INITIALIZING;
			this.remotePlayerId = remotePlayer2;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponenent yet. Wait for it.");
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponenent yet. Wait for it.");
			
			
		}else{
			this.gameStatus = GAME_STATUS_PLAYING;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
		}


		this.startCheckDatabaseForRemoteMoveLoop();
	}

	//---------------list all the available games from the database
	
	listOfGames(remoteGameStatusFilter){
		//remotegamestatus --> see: REMOTE_GAME_STATUS_....
		this.remoteGameStatusFilter = remoteGameStatusFilter;

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"listOfGames" + "&gameStatusFilter=" + remoteGameStatusFilter;
		console.log("list of games");
		this.callPhpWithAjax(url, this.listOfGamesCallBack.bind(this));	
	}

	listOfGamesCallBack(responseJSON){
		
		var remoteDataArray =  JSON.parse(responseJSON);
		//console.log(remoteDataArray);
		var htmlString = ""

		if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_INITIALIZING){
			htmlString += "List of unstarted games to join:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_PLAYING){
			htmlString += "List of already started games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_ERROR){
			htmlString += "List of erroneous games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_ARCHIVED){
			htmlString += "List of archived games:<br>"
		}else{
			htmlString += "unknown game status list: <br>"
		}

		for (var i=0;i<remoteDataArray.length;i+=1){
			htmlString += "gameId: " + remoteDataArray[i]["gameId"] + ", player1: "+ remoteDataArray[i]["playerId1"] + ", player2: "+ remoteDataArray[i]["playerId2"] + "<br>" ;
		}
		

		// var responseArray = responseText.split(",");
		// var outputString = "";

		// for (var i = 0; i < responseArray.length; i+=1) {
		
		// 	outputString +=  " game id: " + responseArray[i]   + "<br>";
		// }
		 document.getElementById(LISTEDGAMES_DIV_LIST).innerHTML = htmlString;
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

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ this.currentLocalGameStateString+"&action="+"submit"+"&gameId="+this.gameId;// No question mark needed
		console.log(url);
		this.callPhpWithAjax(url, this.submitResponse.bind(this));	
		console.log("gamestate Sent");
	}

	submitResponse(instance,result){
		//feedback result from submitting the move to the database.
		//document.getElementById("debugServerFeedback").innerHTML = result;
	}



	// ------------------check for remote move.


	startCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = true;
		this.callbackCheckForRemoteUpdate();
	}

	stopCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = false;
	}

	checkDatabaseForRemoteMoveLoop(){
	
		//console.log("start remote check loop");
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
		// console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		var remoteStatus = this.processResponse(remoteDataArray);
		
		
		//local game action:
		if (remoteStatus == GAME_STATUS_NO_STATUS_YET){
			console.log("waiting for remote database game init.");
		}else if (remoteStatus == GAME_STATUS_PLAYING){

			//verify remote data
			if(!this.verifyRemoteGameData(remoteDataArray)){
				console.log("ASSERT ERROR");
				return false;
			};		

			//if local state is still "initializing, this is the time to display. the board."
			//basically startup edge.
			if (this.gameStatus == GAME_STATUS_INITIALIZING || this.gameStatus == GAME_STATUS_NO_STATUS_YET){
				//first feedback from "playing game". possible already with opponent move. 
				console.log("starting local game. ");
				this.initialSetLocalToMirrorRemoteGame(remoteDataArray);

				//define rotation of board
				var player1GoesUpwards = false;
				if ( this.localPlayerIsPlayer1){
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = true;
						console.log("player1GoesUpwards = true;");
					}else{
						player1GoesUpwards = false;
						console.log("player1GoesUpwards = false;");
					}
				}else{
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = false;
						console.log("local player is player 2  , player1GoesUpwards = false; ");
					}else{
						player1GoesUpwards = true;
						console.log("local player is player 2  , player1GoesUpwards = true; ");
					}
				}
				var initialGameState = remoteDataArray["gameState"];
				if( initialGameState == "notyetstarted"){
					initialGameState = "";
				}

				//check starting player.
				if (remoteDataArray["player1DoesFirstMove"] == 1){
					this.localPlayerFirstMove = this.localPlayerIsPlayer1;
					console.log("PLAYER1 starts");
				}else if (remoteDataArray["player1DoesFirstMove"] == 0){
					this.localPlayerFirstMove = !this.localPlayerIsPlayer1;
					console.log("PLAYER2 starts");
				}else{
					console.log("assert ERROR undefined starting player");
				}

				// display quoridor board
				this.startLocalBoardCallBackfunction(this.storedInstance2,this.startingPlayer, this.localPlayerFirstMove, player1GoesUpwards, initialGameState);
								
				this.currentLocalGameStateString = initialGameState;
				this.gameStatus = GAME_STATUS_PLAYING;
				
				this.updateCafeStatusField("game start. GameId: " + this.gameId+", your player id: "+ this.localPlayerId + ", opponent playerId: " + this.remotePlayerId);
				return true;
				
				
			}

			//Check if local player's turn.
			//when game starts, a poll is done to see if the opponent has joined. problem is, if a local move is requiered, that it is also stuck in this poll loop.
			
			var evenNumberOfTurns = this.numberOfMovesPlayed()%2 == 0;
			// console.log(evenNumberOfTurns);
			// console.log(this.numberOfMovesPlayed()%2);
			// console.log(this.localPlayerFirstMove);

			if (this.localPlayerFirstMove && evenNumberOfTurns){
				//local player turn. so no more checking for remote.
				this.stopCheckDatabaseForRemoteMoveLoop();
				console.log("local player turn. so no more checking for remote.");
				return true;
			}else if (!this.localPlayerFirstMove && !evenNumberOfTurns) {
				this.stopCheckDatabaseForRemoteMoveLoop();
				console.log(" odd number of turns. local player turn. so no more checking for remote.");
				return true;
			}
			
			//check for remote move.
			var opponentMovedOneMove = this.compareGameStates(remoteDataArray)
			//console.log("compare states status, did opponent made move? : " + opponentMovedOneMove);
			if (opponentMovedOneMove){
				// returnStatus
				console.log("opponent moved");
				this.stopCheckDatabaseForRemoteMoveLoop();
				this.remoteMovedCallBackfunction(this.cafeInstance, remoteDataArray["gameState"]);
			}
			return true;
		}else if (remoteStatus == GAME_REGISTER_LOCAL_PLAYER){
			console.log("register local player");
		}else if (remoteStatus == GAME_STATUS_INITIALIZING){
			//give command to startup the boards 
			console.log("game status: initializing. Wait for all players to join, before showing the board. ");
			//--> not yet ok, this would imply that there must be a move first, while that's impossible if there is not yet a board visible. 
		}else if (remoteStatus == GAME_STATUS_ERROR){
			console.log("error in database response. The game seems not to be valid. " +remoteDataArray );
		}
	}

	numberOfMovesPlayed(){
		//console.log(this.currentLocalGameStateString);
		var movesArray = this.currentLocalGameStateString.split(",");
		var numberOfMovesPlayed = movesArray.length;
		//console.log( this.currentLocalGameStateString.split(","));
		
		if (numberOfMovesPlayed == 1 && (movesArray[0]=="" || movesArray[0]=="notyetmoved")){
			numberOfMovesPlayed = 0;
		}

		
		return numberOfMovesPlayed;
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
		//console.log( remoteDataArray["gameId"]);
		var returnStatus = GAME_STATUS_ERROR;

		if (remoteDataArray.length == 0){
			console.log(this.gameStatus)	;
			if (this.gameStatus == GAME_STATUS_NO_STATUS_YET){
				console.log("Waiting for first database response...");
				returnStatus = GAME_STATUS_NO_STATUS_YET;
			}else{
				console.log("no valid array found");
				returnStatus = GAME_STATUS_ERROR;
			}
		}else 	if (remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING){
			//console.log();
			//console.log(remoteDataArray["playerId2"]);
			//console.log("wait for opponent to join game.");
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
			console.log("game status error.");
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
//		console.log(remoteGameData);
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
		}

		if (remote.length< local.length){
			console.log ("not yet updated");
			
		}else if(remote.length == local.length){
			console.log("waiting for opponent to make a move");
			//console.log("remote: " + remote);
			//console.log("local: " + local);
		
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

