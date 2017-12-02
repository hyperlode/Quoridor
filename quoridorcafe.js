var logonText = "ifjefffff";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var LOGGEDINUSERS_DIV_LIST = "loggedinusers";
var GAME_CHECK_SERVER_INTERVAL = 3000;
var REFRESH_UPDATE_RATE = 3000; 

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
	}
	remoteGameStart(instance) {
		console.log("start remote game");
		instance.startLocalGameButton.style.visibility = 'hidden';
		instance.stopLocalGameButton.style.visibility = 'hidden';
		instance.restartLocalGameButton.style.visibility = 'hidden';
		instance.startRemoteGameButton.style.visibility = 'hidden';
		instance.stopRemoteGameButton.style.visibility = 'visible';
		instance.quoridorManager = new Manager();
		var localPlayerStarts = instance.debugLocalPlayerStartsCheckBox.checked;
		var startingPlayer = PLAYER1;
		if (!instance.debugLocalPlayerMovesUpCheckBox.checked) {
			startingPlayer = PLAYER2;
		}
		instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts);
		instance.remote.sendGameStateToRemote("");
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
	checkRemotePlayerUpdate() {
		console.log(this.remote);
		var remoteGameState = this.remote.getLastReceivedGameState();
		console.log(remoteGameState);
		var localGameState = this.quoridorManager.getMultiPlayerLocalGameState();
		console.log(remoteGameState);
		console.log(localGameState);
		this.compareGameStates(localGameState, remoteGameState);
		
		// string1 = s1.split(" ");
		if (true) {
			this.autoRefreshRemoteMove();
		}
	}
	compareGameStates(state1AsString, state2AsString) {
		var state1Arr = state1AsString.split(",");
		var state2Arr = state2AsString.split(",");
		console.log(state1Arr);
		console.log(state2Arr);
		console.log("-----");
	}
	autoRefreshRemoteMove() {
		window.setTimeout(function () { this.checkRemotePlayerUpdate(); } .bind(this), REFRESH_UPDATE_RATE);
	}
	debugSubmitMove(instance) {
		//the local player presses this button when he wants to submit his move.
		//debugger;
		instance.debugCommandTextBox.value = instance.quoridorManager.submitLocalMove();
		instance.remote.sendGameStateToRemote(instance.debugCommandTextBox.value);

		//send out the request for periodically checking the database on the server for opponent move
		instance.remote.startCheckDatabaseForRemoteMoveLoop();

		//check locally if remote has moved.
		instance.checkRemotePlayerUpdate();
	}
	debugNewCommand(instance) {
		instance.quoridorManager.submitRemoteMove(instance.debugCommandTextBox.value);
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
		this.debugCommandTextBox = addTextBox(debugControlsDiv, "de willem gaataddierallemaaloplossenzeg", "debugCmdText", "debugCmdText", 20);
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
	loginStatus(instance) {
		var url = "quoridorisloggedin.php";
		instance.loadDoc(url, instance.loginStatusCallBack);
	}
	loginStatusCallBack(instance, xmlhttp) {
		console.log(xmlhttp.responseText);
		var loggedIn = true;
		if (xmlhttp.responseText == "0") {
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
			instance.loginAreaStatusUpdateText(xmlhttp.responseText + " logged in.");
		}
	}
	userLogout(instance) {
		var url = "quoridorlogout.php";
		instance.loadDoc(url, instance.userLogoutCallBack);
	}
	userLogoutCallBack(instance, xlmhttp) {
		instance.loginFieldElementsVisibility(instance, false);
		instance.loginAreaStatusUpdateText(xlmhttp.responseText);
	}
	listOfLoggedInUsers() {
		var url = "quoridorloggedinusers.php";
		this.loadDoc(url, this.listOfLoggedInUsersCallBack);
		console.log("tiehey");
	}
	listOfLoggedInUsersCallBack(instance, xlmhttp) {
		document.getElementById(LOGGEDINUSERS_DIV_LIST).innerHTML = xlmhttp.responseText;
		// console.log("iejijfjejfjef");
	}
	userLogin(instance) {
		var url = "quoridorlogin.php?username=" + instance.usernameTextBox.value + "&password=" + instance.pwdTextBox.value + "";
		// console.log("user login button clicked");
		instance.loadDoc(url, instance.userLoginCallBack);
	}
	userLoginCallBack(instance, xlmhttp) {
		var loggedIn = false;
		if (xlmhttp.responseText == "Logged in successfully!") {
			loggedIn = true;
		}
		instance.loginFieldElementsVisibility(instance, loggedIn);
		instance.loginAreaStatusUpdateText(xlmhttp.responseText);
	}
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
		this.gameId = 666;
		this.counter = 1;
		this. databaseGameState = ""; 
	}
	sendGameStateToRemote(gameStateString) {
		//this.multiPlayerGame.deleteGame();
	// var url = "http://lode.ameije.com/sandbox.php?q=666&action=read";// No question mark needed
		//	var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php";// No question mark needed
		//	quoridorlogin.php?username="+ instance.usernameTextBox.value + "&password="+ instance.pwdTextBox.value + "";

		//var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState=n,s,n";// No question mark needed
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+gameStateString+"&action="+"submit"+"&gameId="+this.gameId;// No question mark needed

		this.callPhpWithAjax(url, this.submitResponse);	
	}

	submitResponse(instance,result){
		//feedback result from submitting the move to the database.
		document.getElementById("debugServerFeedback").innerHTML = result;
	}

	checkIfGameIdExists(id){

	}

	callPhpWithAjax(url,functionToCallWhenDone){
		//ajax is asynchronous, so give a function that should be called when a result is present (function must accept argument for the result text)
		var xmlhttp = new XMLHttpRequest();
		var returnText = "";
		var that = this;
		xmlhttp.onreadystatechange = function(that) {
			if (this.readyState == 4 && this.status == 200) {
				functionToCallWhenDone(that, this.responseText);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		return
	}

	startCheckDatabaseForRemoteMoveLoop(){
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+this.gameId;// No question mark needed
		this.callPhpWithAjax(url,this.pollResponse);
			
		window.setTimeout(function (){this.callbackCheckForRemoteUpdate( this.counter)}.bind(this),GAME_CHECK_SERVER_INTERVAL); 
		console.log(this);
		//window.setTimeout(this.callbackCheckForRemoteUpdate,GAME_CHECK_SERVER_INTERVAL,this); 
		this.counter += 1;
	}

	pollResponse(instance ,response){
		instance.databaseGameState = response;
		
	//	this.databaseGameState = response;
		console.log(response);
		console.log(instance);
		//console.log("lode");
	}

	getLastReceivedGameState(){
		return this.databaseGameState;

	}

	callbackCheckForRemoteUpdate(){
		
		this.startCheckDatabaseForRemoteMoveLoop();
	}
}

