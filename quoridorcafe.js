var logonText = "ifjefffff";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";
var LOGGEDINUSERS_DIV_LIST = "loggedinusers";




document.addEventListener("DOMContentLoaded", function() {

	cafe = new Cafe();
	
	
	// getAllUsers();	
});


function Cafe(){
	//create html elements (
	
	account = new Account();
	console.log(logonText);
	account.listOfLoggedInUsers();
	
	this.setupButtonField();
}


Cafe.prototype.localGameStart= function (instance) {
	console.log("start local game");
	instance.quoridorManager = new Manager();
	instance.quoridorManager.startNewGame()
	instance.startLocalGameButton.style.visibility = 'hidden';
	instance.stopLocalGameButton.style.visibility = 'visible';
	instance.restartLocalGameButton.style.visibility = 'visible';
}
Cafe.prototype.localGameStop= function (instance) {
	console.log("stop local game");
	instance.quoridorManager.stopAndDeleteGame();
	instance.startLocalGameButton.style.visibility = 'visible';
	instance.stopLocalGameButton.style.visibility = 'hidden';
	instance.restartLocalGameButton.style.visibility = 'hidden';
}

Cafe.prototype.localGameRestart= function (instance) {
	console.log("reatart local game");
	instance.quoridorManager.restartGame();
}



Cafe.prototype.setupButtonField= function () {
	
	elementToAttachTo = document.getElementById("cafeControls");
	this.startLocalGameButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"Start local game","localGameStart", "localGameStart", this.localGameStart, this);
	this.startLocalGameButton.style.visibility = 'visible';
	console.log(this.startLocalGameButton);
	this.stopLocalGameButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"Stop local game","localGameStop", "localGameStart", this.localGameStop, this);
	this.stopLocalGameButton.style.visibility = 'hidden';
	this.restartLocalGameButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"Restart local game","localGameRestart", "localGameStart", this.localGameRestart, this);
	this.restartLocalGameButton.style.visibility = 'hidden';
}

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


