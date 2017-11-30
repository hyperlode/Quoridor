var logonText = "ifjefffff";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var LOGGEDINUSERS_DIV_LIST = "loggedinusers";
var GAME_CHECK_SERVER_INTERVAL = 3000;

document.addEventListener("DOMContentLoaded", function() {

	cafe = new Cafe();
	
	
	// getAllUsers();	
});



function Cafe(){

	//users login and credentials stuff
	account = new Account();
	console.log(logonText);
	account.listOfLoggedInUsers();
	
	remote = new RemoteContact();

	//create html elements
	this.setupButtonField();
}

Cafe.prototype.remoteGameStart= function (instance) {
	console.log("start remote game");
	
	instance.startLocalGameButton.style.visibility = 'hidden';
	instance.stopLocalGameButton.style.visibility = 'hidden';
	instance.restartLocalGameButton.style.visibility = 'hidden';
	instance.startRemoteGameButton.style.visibility = 'hidden';
	instance.stopRemoteGameButton.style.visibility = 'visible';

	instance.quoridorManager = new Manager();

	var localPlayerStarts =  instance.debugLocalPlayerStartsCheckBox.checked ;
	
	var startingPlayer = PLAYER1;
	if (!instance.debugLocalPlayerMovesUpCheckBox.checked ){
		startingPlayer = PLAYER2;
	}

	instance.quoridorManager.startMultiPlayerGame(startingPlayer, localPlayerStarts);


	this.remote.sendGameStateToRemote("");
}

Cafe.prototype.remoteGameStop= function (instance) {
	console.log("stop remote game");
	
	instance.startLocalGameButton.style.visibility = 'visible';
	instance.stopLocalGameButton.style.visibility = 'hidden';
	instance.restartLocalGameButton.style.visibility = 'hidden';
	instance.startRemoteGameButton.style.visibility = 'visible';
	instance.stopRemoteGameButton.style.visibility = 'hidden';
	
	instance.quoridorManager.stopMultiPlayerGame();
}

Cafe.prototype.debugSubmitMove= function (instance) {
	//the local player presses this button when he wants to submit his move.
	//debugger;
	instance.debugCommandTextBox.value = instance.quoridorManager.submitLocalMove();
	this.remote.sendGameStateToRemote(instance.debugCommandTextBox.value);
	this.remote.startCheckDatabaseForRemoteMoveLoop();

}
Cafe.prototype.debugNewCommand= function (instance) {
	instance.quoridorManager.submitRemoteMove(instance.debugCommandTextBox.value);
}	
	
Cafe.prototype.localGameStart= function (instance) {
	console.log("start local game");

	instance.startLocalGameButton.style.visibility = 'hidden';
	instance.stopLocalGameButton.style.visibility = 'visible';
	instance.restartLocalGameButton.style.visibility = 'visible';
	instance.startRemoteGameButton.style.visibility = 'visible';
	instance.startRemoteGameButton.style.visibility = 'hidden';
	//instance.stopRemoteGameButton.style.visibility = 'visible';
	
	
	instance.quoridorManager = new Manager();
	instance.quoridorManager.startNewLocalGame()
	

}
Cafe.prototype.localGameStop= function (instance) {
	console.log("stop local game");
	instance.startLocalGameButton.style.visibility = 'visible';
	instance.stopLocalGameButton.style.visibility = 'hidden';
	instance.restartLocalGameButton.style.visibility = 'hidden';
	instance.startRemoteGameButton.style.visibility = 'visible';

	instance.quoridorManager.stopAndDeleteLocalGame();
	
}

Cafe.prototype.localGameRestart= function (instance) {
	console.log("restart local game");
	instance.quoridorManager.restartLocalGame();
}



Cafe.prototype.setupButtonField= function () {
	
	//cafe controls (start stop game etc.)
	cafeControlsDiv = document.getElementById("cafeControls");
	this.startLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv,"Start local game","localGameStart", "localGameStart", this.localGameStart, this);
	this.startLocalGameButton.style.visibility = 'visible';
	this.stopLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv,"Stop local game","localGameStop", "localGameStart", this.localGameStop, this);
	this.stopLocalGameButton.style.visibility = 'hidden';
	this.restartLocalGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv,"Restart local game","localGameRestart", "localGameStart", this.localGameRestart, this);
	this.restartLocalGameButton.style.visibility = 'hidden';
	this.startRemoteGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv,"Start remote game","remoteGameStart", "remoteGameStart", this.remoteGameStart, this);
	this.startRemoteGameButton.style.visibility = 'visible';
	this.stopRemoteGameButton = addButtonToExecuteGeneralFunction(cafeControlsDiv,"Stop remote game","remoteGameStop", "remoteGameStop", this.remoteGameStop, this);
	this.stopRemoteGameButton.style.visibility = 'hidden';
	
	
	//debug field
	debugControlsDiv = document.getElementById("debugControls");
	this.debugSimulateRemoteCommandReceived = addButtonToExecuteGeneralFunction(debugControlsDiv,"Inputbox As received remote command","sendDebug", "sendDebug", this.debugNewCommand, this);
	this.debugSimulateRemoteCommandReceived.style.visibility = 'visible';
	
	this.debugSendMove = addButtonToExecuteGeneralFunction(debugControlsDiv,"SubmitLocalMove","submitMoveDebug", "submitMoveDebug", this.debugSubmitMove, this);
	
	
	this.debugCommandTextBox = addTextBox (debugControlsDiv,"de willem gaataddierallemaaloplossenzeg","debugCmdText","debugCmdText",20);
	
	this.debugLocalPlayerStartsCheckBox = addCheckBox(debugControlsDiv,"localPlayerStarts", "localPlayerStarts", true, "Local Player Starts");
	this.debugLocalPlayerMovesUpCheckBox = addCheckBox(debugControlsDiv,"localPlayerMovesUp", "localPlayerMovesUp", true, "Local Player is blue (move up)");

	this.debugNoServerSetup = addCheckBox(debugControlsDiv,"debugNoServerUse", "debugNoServerUse", false, "debug without server");
}



//--------------------------------------------------------------------------




function Account(){
	// var xmlhttp;
	//this.xmlhttp=new XMLHttpRequest();	
	this.setupLoginField();
}

Account.prototype.loadDoc= function (url, cFunction) {
	//cfunction is a call back function, called when response from url ready. set to null if no callbackfunction used.
	// call back function should accept xmlhttp, instance as argument.
	//https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp

	// var that = this;
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	var test = cFunction;
	var that = this;
	xmlhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			if (cFunction != null){
				test(that, this);
			}
		}
	};
	xmlhttp.open("GET", url, true);  //don't use false as third argument, apparently, synchronous is going to freeze stuff...
	xmlhttp.send();

	//this.listOfLoggedInUsers();
	
}

Account.prototype.setupLoginField= function(){

	//create html elements (
	elementToAttachTo = document.getElementById(ACCOUNT_DIV);
	
	
	//addBr(elementToAttachTo);
	this.logoutButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"logout","logoutbutton", "logoutbutton", this.userLogout, this);
	this.usernameTextBox = addTextBox(elementToAttachTo, "u","usernameTextBox", "usernameTextBox", 20);
	this.pwdTextBox = addTextBox(elementToAttachTo, "p","pwdTextBox", "pwdTextBox", 20);
	
	this.loginButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"login","loginbutton", "loginbutton", this.userLogin, this);
	this.registerButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"register","registerbutton", "registerbutton", this.userRegister, this);
	this.loginName = "";
	this.password = "";
	
	this.loginStatus(this);

}

Account.prototype.loginFieldElementsVisibility = function (instance, loginVisibleElseLogout){
	if (loginVisibleElseLogout){
		
		instance.loginButton.style.visibility = 'hidden';
		instance.pwdTextBox.style.visibility = 'hidden';
		instance.usernameTextBox.style.visibility = 'hidden';
		instance.registerButton.style.visibility = 'hidden';
		instance.logoutButton.style.visibility = 'visible';
	}else{
		instance.loginButton.style.visibility = 'visible';
		instance.registerButton.style.visibility = 'visible';
		instance.pwdTextBox.style.visibility = 'visible';
		instance.usernameTextBox.style.visibility = 'visible';
		instance.logoutButton.style.visibility = 'hidden';
	}
}
	
Account.prototype.loginAreaStatusUpdateText= function(text){
	document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = "<p>" + text + "</p>";
}

Account.prototype.loginStatus = function (instance){
		var url = "quoridorisloggedin.php";
	instance.loadDoc(url, instance.loginStatusCallBack);
}

Account.prototype.loginStatusCallBack = function (instance, xmlhttp){
	console.log(xmlhttp.responseText);
	var loggedIn = true;
	if (xmlhttp.responseText == "0"){
		loggedIn = false;
	}
	
	//set visibility
	instance.loginFieldElementsVisibility(instance, loggedIn);
	
	if (!loggedIn){
		// console.log("user not logged in ");
		instance.loginAreaStatusUpdateText("Please log in.");
		
	}else{
		// console.log("user logged in ");
		instance.loginAreaStatusUpdateText(xmlhttp.responseText + " logged in.");
	}	
}

Account.prototype.userLogout = function(instance){
	var url = "quoridorlogout.php";
	instance.loadDoc(url,instance.userLogoutCallBack ) ;

}

Account.prototype.userLogoutCallBack = function(instance,xlmhttp){
	instance.loginFieldElementsVisibility(instance, false);
	instance.loginAreaStatusUpdateText(xlmhttp.responseText);
}

Account.prototype.listOfLoggedInUsers = function(){
	var url = "quoridorloggedinusers.php";
	this.loadDoc(url,this.listOfLoggedInUsersCallBack ) ;
	console.log("tiehey");
}

Account.prototype.listOfLoggedInUsersCallBack = function(instance,xlmhttp){
	document.getElementById(LOGGEDINUSERS_DIV_LIST).innerHTML= xlmhttp.responseText;
	// console.log("iejijfjejfjef");
}

Account.prototype.userLogin = function(instance){
	var url = "quoridorlogin.php?username="+ instance.usernameTextBox.value + "&password="+ instance.pwdTextBox.value + "";
	// console.log("user login button clicked");
	instance.loadDoc(url,instance.userLoginCallBack);
}

Account.prototype.userLoginCallBack= function(instance, xlmhttp){
	
	var loggedIn = false;
	if (xlmhttp.responseText == "Logged in successfully!"){
		loggedIn = true;
	}
	instance.loginFieldElementsVisibility(instance, loggedIn);
	instance.loginAreaStatusUpdateText(xlmhttp.responseText);
}

Account.prototype.userRegister = function(instance){
	var url = "quoridornewuser.php?username="+ instance.usernameTextBox.value + "&password="+ instance.pwdTextBox.value + "";
	// console.log("user login button clicked");
	instance.loadDoc(url,instance.userRegisterCallBack);
}

Account.prototype.userRegisterCallBack= function(instance, xlmhttp){
	var loggedIn = false;
	if (xlmhttp.responseText == "Registered successfully!"){
		loggedIn = true;
	}
	instance.loginFieldElementsVisibility(instance, loggedIn);
	instance.loginAreaStatusUpdateText(xlmhttp.responseText);
}


//------------------------------------------------------

class RemoteContact {
	constructor() {
		this.gameId = 666;
		this.counter = 1;
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

	submitResponse(result){
		//feedback result from submitting the move to the database.
		document.getElementById("debugServerFeedback").innerHTML = result;
	}

	checkIfGameIdExists(id){

	}

	callPhpWithAjax(url,functionToCallWhenDone){
		//ajax is asynchronous, so give a function that should be called when a result is present (function must accept argument for the result text)
		var xmlhttp = new XMLHttpRequest();
		var returnText = "";
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				functionToCallWhenDone(this.responseText);
				//functionToCallWhenDone("LEIJE");
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
		return
	}

	startCheckDatabaseForRemoteMoveLoop(){
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+this.gameId;// No question mark needed
		this.callPhpWithAjax(url,this.pollResponse);
			
		window.setTimeout(function (){this.callbackCheckForRemoteUpdate( this.counter )}.bind(this),GAME_CHECK_SERVER_INTERVAL); 
		this.counter += 1;

		// console.log(instance.replayCounter);
		// console.log(instance.replaySaveMoves);
	}

	pollResponse(response){
		console.log(response);
		//console.log("lode");
	}

	callbackCheckForRemoteUpdate(counter){
		this.startCheckDatabaseForRemoteMoveLoop();
	}
}

