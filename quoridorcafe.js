var logonText = "ifjef";


var ACCOUNT_DIV = "loginArea";
var ACCOUNT_DIV_STATUS = "loginAreaStatus";


// function account(){
	
// }


function loadDoc(url, cFunction) {
	//cfunction is a call back function, called when response from url ready.
	// call back function should accept xmlhttp as argument.
	//https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp

	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			cFunction(this);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function loginStatus(){

	//create html elements (
	elementToAttachTo = document.getElementById(ACCOUNT_DIV);
	var logoutButton = addButton(elementToAttachTo,"logout","logoutbutton", "logoutbutton", userLogout);
	logoutButton.style.visibility = 'hidden';
	
	// link.style.display = 'none'; //or
	
	var url = "http://lode.ameije.com/SimpleUsers/quoridorisloggedin.php";
	loadDoc(url, loginStatusCallBack);
	// var url = "http://lode.ameije.com/SimpleUsers/quoridorlogin.php?username=poendi&password=pandi";
	// console.log("bleefep");
	// var xmlhttp = new XMLHttpRequest();
	// xmlhttp.onreadystatechange = function() {
		// if (this.readyState == 4 && this.status == 200) {
			 // document.getElementById("loginArea").innerHTML = this.responseText;
		// }
	// };	
}

function loginStatusCallBack(xmlhttp){
	document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = xmlhttp.responseText;
	console.log(xmlhttp.responseText);
	var test = xmlhttp.responseText;
	console.log(typeof test);
	if (xmlhttp.responseText == "0"){
		//display login info
		console.log("user not logged in ");
		userLoginInfo();
	}else{
		//display "logged in" and logout button.
		console.log("user logged in ");
		//logoutButton = document.getElementById("logoutbutton");
		//logoutButton.style.visibility = 'visible';
		//userLogoutInfo();
		
	}	
}
function userLogout(){
	var url = "http://lode.ameije.com/SimpleUsers/quoridorlogout.php";
	// logoutButton = document.getElementById("logoutbutton");
	// logoutButton.style.visibility = 'hidden';
	loadUrl(url,userLoginInfo);
	
	// display login information
	// loadUrl(url,userLoginInfo);
	
}

function userLoginInfo(){
	var url = "http://lode.ameije.com/SimpleUsers/quoridorlogin.php";
	console.log("fetch login info");
	loadUrl(url,userLoginInfoCallback);
}

function userLoginInfoCallback(xlmhttp){
	document.getElementById(ACCOUNT_DIV_STATUS).innerHTML = this.responseText;
}



function getUrlAndResponseToDiv(url, responseDivName){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById(responseDivName).innerHTML = this.responseText;
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function getAllUsers(){
	var url = "../SimpleUsers/users.php";// No question mark needed
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("displayAllUsers").innerHTML = this.responseText;
		}
		console.log("donehere");
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

document.addEventListener("DOMContentLoaded", function() {

	//var divDisplayAllUsers = document.getElementById("displayAllUsers");
	// addButtonToExecuteGeneralFunction(domElement,"logffin","fefe", "wwww", userLogin,this);
	loginStatus();
	
	//callUrl("../SimpleUsers/quoridorlogin.php" , "loginArea");
	// callUrlGetText("../SimpleUsers/quoridorlogin.php");
	console.log(logonText);
	
	// getAllUsers();
	
	 // $('#buttonSaveAsPng').click(function(){
      // saveSvgAsPng(document.getElementById(SVG_ID), "diagram.png", 3);
    // });
	
	
});

