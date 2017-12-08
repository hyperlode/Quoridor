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

		instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts,true);

		var localId = instance.account.getLoggedInUserId();
		//var debugGameId = instance.debugRemotePlayerIdTextBox.value;
		
		alert("game start: player:" + localId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");
		
		instance.remote.initNewGame(localId, NO_PLAYER_DUMMY_ID );
	
		instance.remote.sendGameStateToRemote("");

		//console.log("game id at start:  "+instance.remote.gameId);
	}
	
	
	

	debugJoinRemoteGame(instance){

			//get game id from field.

		//check for remote game with this id

		//add name to 
		var joinGameId = instance.debugRemotePlayerIdTextBox.value;
		var localId = instance.account.getLoggedInUserId();
		console.log("join game button clicked");
		instance.remote.joinGame(joinGameId, localId);
		

		instance.quoridorManager = new Manager();
	
		// var localPlayerStarts = instance.debugLocalPlayerStartsCheckBox.checked;

		// var startingPlayer = PLAYER1;
		// if (!instance.debugLocalPlayerMovesUpCheckBox.checked) {
		// 	startingPlayer = PLAYER2;
		// }
		
		var localPlayerStarts = false;
		var startingPlayer = PLAYER1;
		var player1GoesUpwards = false;
		
		instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts,player1GoesUpwards);
	
		instance.remote.startCheckDatabaseForRemoteMoveLoop();

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




	debugNewCommand(instance) {
		//instance.quoridorManager.submitRemoteMove(instance.debugCommandTextBox.value);
		
		//instance.stopPollingForRemoteMove();
		instance.remote.debugImitateRemoteMoved(instance.debugCommandTextBox.value);
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
		this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv, "Inputbox As received remote command", "sendDebug", "sendDebug", this.debugNewCommand, this);
		this.debugSimulateRemoteCommandReceived.style.visibility = 'visible';
		this.debugSendMove = addButtonToExecuteGeneralFunction(debugControlsDiv, "SubmitLocalMove", "submitMoveDebug", "submitMoveDebug", this.debugSubmitMove, this);
		this.debugJoinRemoteGame = addButtonToExecuteGeneralFunction(debugControlsDiv, "join Game", "joinGame", "joinGame", this.debugJoinRemoteGame, this);
		
		
		
		this.initializeMultiPlayerGameDebug = addButtonToExecuteGeneralFunction(debugControlsDiv, "getActiveGamesList", "getActiveGamesList", "getActiveGamesList", this.debugInitMultiPlayerGame, this);
		this.initializeMultiPlayerGameDebug.style.visibility = 'visible';

		this.debugCommandTextBox = addTextBox(debugControlsDiv, "de willem gaataddierallemaaloplossenzeg", "debugCmdText", "debugCmdText", 20);


		this.debugRemotePlayerIdTextBox = addTextBox(debugControlsDiv, "remote player id", "debugRemotePlayerIdTextBox", "debugRemotePlayerIdTextBox", 10);

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
		this.localPlayerId = 123;
		this.remotePlayerId = 124;
		this.gameId = NO_GAME_ID_YET;
		this.counter = 1;
		this.databaseGameState = ""; 
		this.continuePollingForRemoteMove = false;
		this.currentLocalGameStateString = "";
		this.remoteMovedCallBackfunction;
	}


	setLocalPlayerId(id){
		this.localPlayerId = id;
	}
	setRemoteMovedCallback(instance ,callbackFunction){
		this.storedInstance = instance;
		this.remoteMovedCallBackfunction = callbackFunction;
	}


	//---------------------------join existing game by gameId.

	joinGame(gameId, localPlayerIdThatWillBecomeTheRemotePlayerOfThisGame){
		var playerId = localPlayerIdThatWillBecomeTheRemotePlayerOfThisGame;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"joinGame"+"&player2=" + playerId + "&gameId=" + gameId;// No question mark needed
		console.log("try to join game: " + gameId + ". By player: " + playerId);
		this.callPhpWithAjax(url, this.joinGameFeedback.bind(this));
		
		//debug for now:
		this.gameId = gameId;
		this.currentLocalGameStateString = "";
		
	}
	joinGameFeedback(response){
		console.log("feedback.");
		
		// this.localPlayerId = 123;
		// this.remotePlayerId = 124;
		// this.gameId = NO_GAME_ID_YET;
	}

	//-------------------create a new game in the remote database 
	initNewGame(localPlayerId, remotePlayerId){
		
		this.localPlayerId = localPlayerId;
		this.remotePlayerId = remotePlayerId;

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"createGame"+"&player1=" + this.localPlayerId + "&player2=" + this.remotePlayerId ;// No question mark needed
		console.log("create new game");
		console.log(url);
		this.callPhpWithAjax(url, this.newGameCreatedFeedback.bind(this));	

		//debug.
		//this.gameId = gameIdProvided;
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

	pollResponse(response){
		this.databaseGameState = response;
			
		var remoteGameAnalitcs = this.interpretResponse();
		
		var remoteMove  = this.compareGameStates();

		if (remoteMove != false){
			this.stopCheckDatabaseForRemoteMoveLoop();
			this.remoteMovedCallBackfunction(this.storedInstance, this.databaseGameState);
		}
	//	this.databaseGameState = response;
		//console.log(response);
		//console.log(this);
		//console.log("lode");
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


	interpretResponse(remoteGameData){
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


		
		
	}

	compareGameStates() {
		var remote = this.databaseGameState.split(",");
		var local = this.currentLocalGameStateString.split(",");
		var remoteMoved = false;
		var remoteMove = "";

		if (remote[0]!="" && remote[0]!="notyetstarted" &&  local [0]==""  ){
			local = [];
			console.log("first move opponent. remote: "+ remote  + " local: " + local);
			
		
		}

		if (remote.length< local.length){
			console.log ("not yet updated");
		}else if(remote.length == local.length){
			console.log("waiting for opponent to make a move");
			console.log(utilities.arraysEqual(remote,local));
		
			console.log(remote);
			console.log(local);
		
			console.log(remote.length);
			console.log(local.length);
			
		}else if (remote.length > local.length){
			console.log("opponent made a move")
			console.log()
			if (remote.length != local.length +1 ){
				console.log("ASSERT ERROR, game state remote does not reflext one extra move.");
				console.log(remote);
				console.log(local);

				//set up game for continuation
				//create new game with starting gamestring.

				return false;
			}

			for (var i = 0; i < local.length; i++) { 
				if (local[i] != remote[i] ){
					console.log("ASSERT ERROR: gamestate history not indentical ");
					console.log(remote);
					console.log(local);
				
					return false;
				}
			} 
			//return last element (the move)
			remoteMove = remote[remote.length - 1];
			remoteMoved = true;
			
	
		}else {

			console.log("ASSERT ERROR unvalid arrasy.");
		}
		if (remoteMoved){
			return remoteMove
		}else{
			return false;
		}
		
	}

	getLastReceivedGameState(){
		return this.databaseGameState;
	}
}

