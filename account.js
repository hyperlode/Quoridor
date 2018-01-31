
//------------------------------------------------------------------------------------------------------------
//                                  ACCOUNT
//------------------------------------------------------------------------------------------------------------

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
		this.loggedInCallback;
		this.logoutCallback;
		
	}
	// setStatusMessageCallback(callbackFunction){
		// this.submitStatus = callbackFunction ;
	// }
	setLoggedInCallback(callbackFunction){
		this.loggedInCallback = callbackFunction;
	}
	setLogoutCallback(callbackFunction){
		this.logoutCallback = callbackFunction;
	}
	
	getLoggedInUserId(){
		return this.loggedInUserId;
	}
	
	getLoggedInUserName(){
		return this.loggedInUserName;
	}
	
	getNameFromId(id){
		//console.log(id);
		//nametoid
		if (id == NO_PLAYER_DUMMY_ID){
			return "[no player assigned]";
		}else if (id == NO_LOGGED_IN_USER_DUMMY_ID){
			return "[notloggedinplayer]";

		}
		console.log("efijeijfijeifjiejf");
		console.log(this.allRegisteredUsersIdToName);
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
		}else {
			// console.log("user logged in ");
			//this.loginAreaStatusUpdateText(xmlhttp.responseText + " logged in.");

			var response = xmlhttp.responseText.split(",");
			this.loggedInUserId = response[0];
			this.loggedInUserName = response[1];
			this.loginAreaStatusUpdateText("user: " + this.loggedInUserName + " with id: " + this.loggedInUserId  + " logged in.");
			
			//callback show all the rest of the page.
			this.loggedInCallback();
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
		//callback 
		this.logoutCallback();
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
		//console.log(this.allRegisteredUsersIdToName);
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
