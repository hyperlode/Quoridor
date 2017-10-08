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
	this.logoutButton.style.visibility = 'hidden';
	
	
	
	this.usernameTextBox = addTextBox(elementToAttachTo, "u","usernameTextBox", "usernameTextBox", 20);
	this.usernameTextBox.style.visibility = 'hidden';

	this.pwdTextBox = addTextBox(elementToAttachTo, "p","pwdTextBox", "pwdTextBox", 20);
	this.pwdTextBox.style.visibility = 'hidden';
	
	this.loginButton = addButtonToExecuteGeneralFunction(elementToAttachTo,"login","loginbutton", "loginbutton", this.userLogin, this);
	this.loginButton.style.visibility = 'hidden';
	
	this.loginName = "";
	this.password = "";
	
	
	// link.style.display = 'none'; //or
	
	var url = "quoridorisloggedin.php";
	this.loadDoc(url, this.loginStatusCallBack);
	// var url = "quoridorlogin.php?username=poendi&password=pandi";
	// console.log("bleefep");
	// var xmlhttp = new XMLHttpRequest();
	// xmlhttp.onreadystatechange = function() {
		// if (this.readyState == 4 && this.status == 200) {
			 // document.getElementById("loginArea").innerHTML = this.responseText;
		// }
	// };	
}

Account.prototype.loginStatusCallBack = function (instance, xmlhttp){
	console.log(xmlhttp.responseText);
	if (xmlhttp.responseText == "0"){
		//display login info
		// console.log("user not logged in ");
		instance.loginAreaStatusUpdateText("Please log in.");
		instance.loginButton.style.visibility = 'visible';
		instance.pwdTextBox.style.visibility = 'visible';
		instance.usernameTextBox.style.visibility = 'visible';
		instance.logoutButton.style.visibility = 'hidden';
		
		
	}else{
		//display "logged in" and logout button.
		// console.log("user logged in ");
		instance.loginAreaStatusUpdateText(xmlhttp.responseText + "logged in.");

		instance.loginButton.style.visibility = 'hidden';
		instance.pwdTextBox.style.visibility = 'hidden';
		instance.usernameTextBox.style.visibility = 'hidden';
		instance.logoutButton.style.visibility = 'visible';
		//userLogoutInfo();
		
	}	
}
Account.prototype.userLogout = function(instance){
	var url = "quoridorlogout.php";
	instance.logoutButton.style.visibility = 'hidden';
	
	instance.loadDoc(url,instance.loginAreaStatusUpdate ) ;
	
	
	instance.loginButton.style.visibility = 'visible';
	instance.pwdTextBox.style.visibility = 'visible';
	instance.usernameTextBox.style.visibility = 'visible';
	instance.logoutButton.style.visibility = 'hidden';
	
	
	// display login information
	// loadUrl(url,userLoginInfo);
}

Account.prototype.userLogin = function(instance){
	
	
	
	var url = "quoridorlogin.php?username="+ instance.usernameTextBox.value + "&password="+ instance.pwdTextBox.value + "";
	
	console.log("user login button clicked");
	console.log(url);
	instance.loadDoc(url,instance.loginAreaStatusUpdate);
	// instance.log
	
}




// Account.prototype.userLoginCallback = function(instance, xlmhttp){
	// console.log("login callback");
	// instance.loginAreaStatusUpdate( xlmhttp.responseText);
// }

Account.prototype.loginAreaStatusUpdate= function(instance, xlmhttp){
	
	console.log(xlmhttp.responseText);
	instance.loginAreaStatusUpdateText(xlmhttp.responseText);
}

Account.prototype.loginAreaStatusUpdateText= function(text){

	document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = text;
}

Account.prototype.getUrlAndResponseToDiv = function(url, responseDivName){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(responseDivName).innerHTML = this.responseText;
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

// Account.prototype.getAllUsers= function(){
	// var url = "../SimpleUsers/users.php";// No question mark needed
	// var xmlhttp = new XMLHttpRequest();
	// xmlhttp.onreadystatechange = function() {
		// if (this.readyState == 4 && this.status == 200) {
			// document.getElementById("displayAllUsers").innerHTML = this.responseText;
		// }
		// console.log("donehere");
	// };
	
	// xmlhttp.open("GET", url, true);
	// xmlhttp.send();
// }

document.addEventListener("DOMContentLoaded", function() {

	account = new Account();
	console.log(logonText);
	
	
	
	// getAllUsers();
	
	 // $('#buttonSaveAsPng').click(function(){
      // saveSvgAsPng(document.getElementById(SVG_ID), "diagram.png", 3);
    // });
	
	
});

