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
		//call button. 
		document.getElementById("submitMoveDebug").click();
	}
	
};

class Cafe {
	constructor() {
		//users login and credentials stuff
		this.account = new Account();
		this.account.listOfUsers();
		
		console.log(logonText);
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
		
		
	}

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



class Account {
	constructor() {
		// var xmlhttp;
		//this.xmlhttp=new XMLHttpRequest();	
		this.setupLoginField();
		this.loggedIn = false;
		this.loggedInUserId = NO_LOGGED_IN_USER_DUMMY_ID;
		this.loggedInUserName = "noname";
		this.allRegisteredUsersNameToId = [];
		this.allRegisteredUsersIdToName = [];

	}

	getLoggedInUserId(){
		return this.loggedInUserId;
	}

	getNameFromId(id){
		//console.log(id);
		//nametoid
		if (id == NO_PLAYER_DUMMY_ID){
			return "[no player assigned]";
		}else if (id == NO_LOGGED_IN_USER_DUMMY_ID){
			return "[notloggedinplayer]";

		}
		return this.allRegisteredUsersIdToName[id];
	}

	getIdFromName(name){
		return this.allRegisteredUsersNameToId[name];
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
					//test(that, this);
					cFunction(this); //this is xmlhttp 
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
		this.logoutButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "logout", "logoutbutton", "logoutbutton", this.userLogout.bind(this), this);
		this.usernameTextBox = addTextBox(elementToAttachTo, "username", "usernameTextBox", "usernameTextBox", 20);
		this.pwdTextBox = addTextBox(elementToAttachTo, "password", "password", "pwdTextBox", 20);
		this.pwdTextBox.type = "password";
		
		
		
		this.loginButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "login", "loginbutton", "loginbutton", this.userLogin.bind(this), this);
		this.registerButton = addButtonToExecuteGeneralFunction(elementToAttachTo, "register", "registerbutton", "registerbutton", this.userRegister.bind(this), this);
		this.loginName = "";
		this.password = "";
		this.loginStatus();
	}
	loginFieldElementsVisibility( loginVisibleElseLogout) {
		if (loginVisibleElseLogout) {
			this.loginButton.style.visibility = 'hidden';
			this.pwdTextBox.style.visibility = 'hidden';
			this.usernameTextBox.style.visibility = 'hidden';
			this.registerButton.style.visibility = 'hidden';
			this.logoutButton.style.visibility = 'visible';
		}
		else {
			this.loginButton.style.visibility = 'visible';
			this.registerButton.style.visibility = 'visible';
			this.pwdTextBox.style.visibility = 'visible';
			this.usernameTextBox.style.visibility = 'visible';
			this.logoutButton.style.visibility = 'hidden';
		}
	}
	loginAreaStatusUpdateText(text) {
		document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = "<p>" + text + "</p>";
	}
	
	
	//-------------------------------------------------------------------------------------------------------------
	//ACTIONS 
	//-------------------------------------------------------------------------------------------------------------
	

	//STATUS
	//gets id and username of logged in user.
	loginStatus() {
		var url = "quoridorGetLoggedInStatus.php";
		this.loadDoc(url, this.loginStatusCallBack.bind(this));
	}
	
	loginStatusCallBack( xmlhttp) {
		//console.log(xmlhttp.responseText);
		var loggedIn = true;
		if (xmlhttp.responseText == "false") {
			loggedIn = false;
		}

		//set visibility
		this.loginFieldElementsVisibility( loggedIn);
		if (!loggedIn) {
			// console.log("user not logged in ");
			this.loginAreaStatusUpdateText("Please log in.");
		}
		else {
			// console.log("user logged in ");
			//this.loginAreaStatusUpdateText(xmlhttp.responseText + " logged in.");

			var response = xmlhttp.responseText.split(",");
			this.loggedInUserId = response[0];
			this.loggedInUserName = response[1];
			this.loginAreaStatusUpdateText("user: " + this.loggedInUserName + " with id: " + this.loggedInUserId  + " logged in.");
		}
		this.loggedIn = loggedIn;
	}

	//LOG OUT
	userLogout() {
		var url = "quoridorlogout.php";
		this.loadDoc(url, this.userLogoutCallBack.bind(this));
	}
	userLogoutCallBack( xlmhttp) {
		this.loginFieldElementsVisibility( false);
		this.loginAreaStatusUpdateText(xlmhttp.responseText);
	}

	//GET LIST OF USERS
	listOfUsers() {
		var url = "quoridorloggedinusers.php";
		this.loadDoc(url, this.listOfUsersCallBack.bind(this));
		//console.log("all logged in players listed up");
	}

	listOfUsersCallBack( xlmhttp) {
		//console.log(xlmhttp.responseText);
		var responseJSON = xlmhttp.responseText;
		var remoteDataArray =  JSON.parse(responseJSON);

		this.allRegisteredUsersIdToName = [];
		this.allRegisteredUsersNameToId = [];
		this.allUserIds = [];
		//console.log(remoteDataArray);
		//var responseArray = response.split(",");
		
		//for (var i = 0; i < responseArray.length; i+=2) {
		for (var i = 0; i < remoteDataArray.length; i+=1) {
			this.allUserIds.push(remoteDataArray[i]["userId"]);
			this.allRegisteredUsersIdToName[remoteDataArray[i]["userId"]]= remoteDataArray[i]["uUsername"] ;
			this.allRegisteredUsersNameToId[remoteDataArray[i]["username"]]= remoteDataArray[i]["userId"] ;
		}	
	}
	
	//return listOfUsers as string
	listOfUsersToElement(){
		var outputString = "Name:Id of registered users: ";
		for (var i = 0; i < this.allUserIds.length; i+=1) {
			var id = this.allUserIds[i];
			outputString += " " + this.allRegisteredUsersIdToName[id] + ": " + id + ","; 
		}
		document.getElementById(USERS_DIV_LIST).innerHTML = outputString;
	}

	//LOG IN
	userLogin() {

		var userName = this.usernameTextBox.value;
		if (userName == "username"){
			alert("Please enter a valid username and password.");
			return false;
		}
		var url = "quoridorlogin.php?username=" + userName + "&password=" + this.pwdTextBox.value + "";
		this.loadDoc(url, this.userLoginCallBack.bind(this));
	}
	userLoginCallBack( xlmhttp) {
		//returns error, or userId.

		if (xlmhttp.responseText == "Wrong username-password combination.") {
			this.loggedIn = false;
			console.log("Wrong username-password combination.");
			this.loginAreaStatusUpdateText("Wrong username-password combination. Please try again.");
		}else{
			
			//var userId = xlmhttp.responseText;
			
			//this.loggedInUserId = userId;
			//this.loginFieldElementsVisibility(this, loggedIn);
			this.loginStatus(); //sets all login info up.
		}
		//this.loginAreaStatusUpdateText(xlmhttp.responseText);
		//console.log(this.loggedInUserId);
		//this.loggedIn = loggedIn;
	}

	//REGISTRATION 
	userRegister() {
		var userName = this.usernameTextBox.value;
		if (userName == "username"){
			alert("Please enter a valid username and password.");
			return false;
		}
		var url = "quoridornewuser.php?username=" + userName + "&password=" + this.pwdTextBox.value + "";
		// console.log("user login button clicked");
		this.loadDoc(url, this.userRegisterCallBack.bind(this));
	}
	userRegisterCallBack( xlmhttp) {
		var loggedIn = false;
		if (xlmhttp.responseText == "Registered successfully!") {
			loggedIn = true;
		}
		this.loginFieldElementsVisibility( loggedIn);
		this.loginAreaStatusUpdateText(xlmhttp.responseText);
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

	setAccountInstance(account){
		this.accountInstance = account;
	}

	setGameProperties(localPlayerGoesUpwards ){

		//should be stored remotely, but this will do for now.
		//this.startingPlayer = startingPlayer;
		this.localPlayerGoesUpwards = localPlayerGoesUpwards;
	}

	setLocalPlayerId(id){
		this.localPlayerId = id;
	}
	setRemoteMovedCallback(callbackFunction){
		this.remoteMovedCallBackfunction = callbackFunction;
	}
	
	setUpdateStatusFieldCallback(callbackFunction){
		this.updateCafeStatusField = callbackFunction;
		
	}

	setStartLocalBoardCallback(callbackFunction){
		this.startLocalBoardCallBackfunction = callbackFunction;
	}
	
	getPlayerNameFromId(id){
		return this.accountInstance.getNameFromId(id);

	}
	//---------------------------join existing game by gameId.

	joinGame(gameId){
		//2 steps: step one: check if possible, step two: join.
		console.log("checkit");
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+gameId;// No question mark needed
		this.callPhpWithAjax(url,this.joinGameFeedback.bind(this));
	}

	joinGameFeedback(responseJSON){
		console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log(remoteDataArray);
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		if (remoteDataArray.length == 0){

			console.log("game not found... gameId provided: " + gameId);
			this.updateCafeStatusField("game not found... gameId provided: " + gameId);
			return false;
		}
		
		
		if (remotePlayer1 == this.localPlayerId){
			console.log("continue game (as remote player 1) ");
			this.joinGameExecute(gameId,1);
			
		}else if (remotePlayer2 == this.localPlayerId){
			this.joinGameExecute(gameId,2);
			console.log("continue game (as remote player 2) ");
		}else  if ( remotePlayer1 == NO_PLAYER_DUMMY_ID &&  remotePlayer2 != this.localPlayerId ){
			this.joinGameExecute(gameId,1);
			console.log("join as remote player 1");
		}else if (remotePlayer1 != this.localPlayerId &&  remotePlayer2 == NO_PLAYER_DUMMY_ID ){
			this.joinGameExecute(gameId,2);
			console.log("join as remote player 2");
		}else if( remotePlayer1 == NO_PLAYER_DUMMY_ID &&  remotePlayer2 == NO_PLAYER_DUMMY_ID){
			console.log("first player to join");
			this.joinGameExecute(gameId,1);
		}else{
			console.log();			
			console.log(this.accountInstance.getNameFromId(remotePlayer1));	
			console.log(this.accountInstance.getNameFromId(remotePlayer2));	
			console.log(remotePlayer2 == this.localPlayerId);
			console.log(this.accountInstance.getNameFromId(this.localPlayerId));	
			console.log(this.accountInstance.getNameFromId(NO_PLAYER_DUMMY_ID));	
			//check if room free in the game.
			
			console.log("possible 2 ASSERT errors:");
			console.log("ASSERT ERROR: game with id" +remoteDataArray["gameId"] +" cannot join game.");
			console.log("This game is not available for this player. There must be a free spot, or it must be a continuation of a previous game. " );
			this.updateCafeStatusField("No joining possible. (check gameId and playeId)");
			
			return false;
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
		
		this.setLocalGameToMirrorRemoteGame(remoteGameData);
		
		
		
				
		//auto start if two players available and game status still set to initializing.
		if(this.gameStatus == GAME_STATUS_INITIALIZING ){
			//if two players joined, set game to playing!
			console.log("all players ready, let's start playing! (and provide that information to the database.");
			this.setGameStatus(REMOTE_GAME_STATUS_PLAYING);
			
			this.startCheckDatabaseForRemoteMoveLoop();	
			this.updateCafeStatusField("joining successful, attempting to set remote game status to playing.");
			
		}else if(this.gameStatus == GAME_STATUS_PLAYING ){
			this.startCheckDatabaseForRemoteMoveLoop();	
			this.updateCafeStatusField("joining successful");
			
		}else if(this.gameStatus == GAME_STATUS_FINISHED ){
			
			
			console.log(this.gameStatus);
			console.log("TODO: game status :finished game --> not yet handled. No moving should be possible anymore.");
			
			
		
		}else{
			console.log("ASSERT ERROR: unhandled game status:");
			console.log(this.gameStatus);
		
		}
			
		
		
		
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
	}

	newGameCreatedFeedback(responseJSON){

		//console.log("new game created raw response: " + responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log( remoteDataArray); //"remote Game Data: " +
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		this.gameId = gameId; 
		if (remotePlayer2 == NO_PLAYER_DUMMY_ID){
			//no opponent yet
			this.gameStatus = GAME_STATUS_INITIALIZING;
			this.remotePlayerId = remotePlayer2;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponent yet. Wait for it.");
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponenent yet. Gameboard will be displayed when opponent joins. Wait for it.");
			
			
		}else{
			//game has two players.
			this.gameStatus = GAME_STATUS_PLAYING;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
		}

		this.startCheckDatabaseForRemoteMoveLoop();
	}

	//---------------list all the available games from the database
	
	listOfGames(remoteGameStatusFilter, playerIdFilter){
		playerIdFilter = (typeof playerIdFilter !== 'undefined') ?  playerIdFilter : NO_PLAYER_DUMMY_ID;
		
		
		//remotegamestatus --> see: REMOTE_GAME_STATUS_....
		this.remoteGameStatusFilter = remoteGameStatusFilter;

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"listOfGames" + "&gameStatusFilter=" + remoteGameStatusFilter +"&playerIdFilter=" + playerIdFilter;
		console.log("list of games");
		this.callPhpWithAjax(url, this.listOfGamesCallBack.bind(this));	
	}

	listOfGamesCallBack(responseJSON){
		console.log(responseJSON);
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log(remoteDataArray);
		var htmlString = "<form action=''>";

		if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_INITIALIZING){
			htmlString += "List of unstarted games to join:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_PLAYING){
			htmlString += "List of already started games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_ERROR){
			htmlString += "List of erroneous games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_FINISHED){
			htmlString += "List of archived games:<br>"
		}else{
			htmlString += "unknown game status list: <br>"
		}

		//for (var i=0;i<remoteDataArray.length;i+=1){
		for (var i=remoteDataArray.length-1;i>=0 ;i-=1){
			console.log(remoteDataArray[i]);
			console.log(remoteDataArray[i]["playerId1"]);
			// htmlString += "gameId: " + remoteDataArray[i]["gameId"] + ", player1: "+ remoteDataArray[i]["playerId1"] + ", player2: "+ remoteDataArray[i]["playerId2"] + "<br>" ;
			htmlString += "<input type='radio' name='gameIdSelection' value='" + 
				remoteDataArray[i]["gameId"] + "'> gameNumber: "+ remoteDataArray[i]["gameId"] +
				", "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId1"]) + 
				" versus "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId2"]) + 
				"<br>" ;
		}
		htmlString += "</form>";

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
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ gameStateString+"&action="+"submit"+"&gameId="+this.gameId;
		console.log("imitation move gamestring: " + gameStateString);
		this.callPhpWithAjax(url, this.debugRemoteMoveImitation.bind(this));	
	}
	debugRemoteMoveImitation(response){
		console.log("remoteImitatedMove");
	}

	
	//-----------------post game status
	setGameStatus(gameStatus){
		
		this.gameStatus = gameStatus;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameStatus="+ gameStatus +"&action="+"setGameStatus"+"&gameId="+this.gameId;
		this.callPhpWithAjax(url, this.setGameStatusResponse.bind(this));	
	}
	
	setGameStatusResponse(result){
		//feedback result from submitting the move to the database.
		//document.getElementById("debugServerFeedback").innerHTML = result;
		console.log("game status set.");
		console.log(result);
	}
	
	
	//---------------post local move

	sendGameStateToRemote(gameStateString, setGameStatusToArchive) {
		this.setGameStatusToArchive = setGameStatusToArchive;
		this.currentLocalGameStateString = gameStateString;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ this.currentLocalGameStateString+"&action="+"submit"+"&gameId="+this.gameId;
		this.callPhpWithAjax(url, this.submitResponse.bind(this));	
	}

	submitResponse(result){
		//feedback result from submitting the move to the database.
		//document.getElementById("debugServerFeedback").innerHTML = result;
		console.log(result);
		
		
		
		if (this.setGameStatusToArchive == true){
			this.setGameStatus( REMOTE_GAME_STATUS_FINISHED);
			
		}
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
		var remoteStatus = this.processRemoteResponseToLocalStatus(remoteDataArray);
		
		
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
				this.setLocalGameToMirrorRemoteGame(remoteDataArray);

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
				this.startLocalBoardCallBackfunction(this.startingPlayer, this.localPlayerFirstMove, player1GoesUpwards, initialGameState);
								
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
				this.remoteMovedCallBackfunction( remoteDataArray["gameState"]);
			}
			return true;
		}else if (remoteStatus == GAME_REGISTER_LOCAL_PLAYER){
			console.log("register local player");
		}else if (remoteStatus == GAME_STATUS_FINISHED){
			if (this.gameStatus){

				//check for remote move.
				var opponentMovedOneMove = this.compareGameStates(remoteDataArray)
				//console.log("compare states status, did opponent made move? : " + opponentMovedOneMove);
				if (opponentMovedOneMove){
					// returnStatus
					console.log("opponent moved");
					this.stopCheckDatabaseForRemoteMoveLoop();
					this.remoteMovedCallBackfunction( remoteDataArray["gameState"]);
				}
				return true;
			}			
			this.gameStatus = GAME_STATUS_FINISHED;
			console.log("game finished no more polling.");
			this.stopCheckDatabaseForRemoteMoveLoop();
			console.log("local player turn. so no more checking for remote.");
			return true;
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
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				functionToCallWhenDone( this.responseText);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		return
	}

	processRemoteResponseToLocalStatus(remoteDataArray){

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
		}else if (remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING){
			returnStatus = GAME_STATUS_INITIALIZING;
		}else if(remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_PLAYING){
			returnStatus = GAME_STATUS_PLAYING;
			
		}else if(remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_FINISHED){
			returnStatus = GAME_STATUS_FINISHED;
		
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


	setLocalGameToMirrorRemoteGame(remoteGameData){
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
				console.log("all players set, will soon go to playing game status.");
			}else{

				console.log("wait for opponent to join.");
			}

		}else if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_PLAYING ){
			this.gameStatus = REMOTE_GAME_STATUS_PLAYING;
			if (remoteGameData["gameState"] != "" && remoteGameData["gameState"] != "notyetstarted"){
				//game already started. that means: recover!
				console.log("recover game");
			}else{
				//start new game.
				console.log("new game.");
			}
			
		}else if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_FINISHED ){
			this.gameStatus = REMOTE_GAME_STATUS_FINISHED;
			console.log("game finished, only viewing allowed.");
			
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
			
			console.log ("not yet updated, resending game state.");
			this.sendGameStateToRemote(this.currentLocalGameStateString, this.setGameStatusToArchive);
			
		}else if(remote.length == local.length){
			console.log("waiting for opponent to make a move");
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

