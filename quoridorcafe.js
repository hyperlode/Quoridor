var logonText = "ifjefffff";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";


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
}

Account.prototype.setupLoginField= function(){

	//create html elements (
	elementToAttachTo = document.getElementById(ACCOUNT_DIV);
	
	this.logoutButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"logout","logoutbutton", "logoutbutton", this.userLogout, this);
	this.usernameTextBox = addTextBox(elementToAttachTo, "u","usernameTextBox", "usernameTextBox", 20);
	this.pwdTextBox = addTextBox(elementToAttachTo, "p","pwdTextBox", "pwdTextBox", 20);
	this.loginButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"login","loginbutton", "loginbutton", this.userLogin, this);
	this.loginName = "";
	this.password = "";
	
	this.loginStatus(this);

}

Account.prototype.loginFieldElementsVisibility = function (instance, loginVisibleElseLogout){
	if (loginVisibleElseLogout){
		
		instance.loginButton.style.visibility = 'hidden';
		instance.pwdTextBox.style.visibility = 'hidden';
		instance.usernameTextBox.style.visibility = 'hidden';
		instance.logoutButton.style.visibility = 'visible';
	}else{
		instance.loginButton.style.visibility = 'visible';
		instance.pwdTextBox.style.visibility = 'visible';
		instance.usernameTextBox.style.visibility = 'visible';
		instance.logoutButton.style.visibility = 'hidden';
	}
}
	
Account.prototype.loginAreaStatusUpdateText= function(text){
	document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = text;
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
		instance.loginAreaStatusUpdateText(xmlhttp.responseText + "logged in.");
	}	
}
Account.prototype.userLogoutCallBack = function(instance,xlmhttp){
	instance.loginFieldElementsVisibility(instance, false);
	instance.loginAreaStatusUpdateText(xlmhttp.responseText);
}

Account.prototype.userLogout = function(instance){
	var url = "quoridorlogout.php";
	instance.loadDoc(url,instance.userLogoutCallBack ) ;

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

document.addEventListener("DOMContentLoaded", function() {

	account = new Account();
	console.log(logonText);
	
	// getAllUsers();	
});

