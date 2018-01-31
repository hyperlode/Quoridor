var NUMBER_OF_MESSAGES_CHAT_DISPLAY = 10;
var CHAT_TEXTBOX = "submitBox";
var CHAT_SUBMIT_BUTTON = "submitText";
//------------------------------------------------------------------------------------------------------------
//                                  CHAT
//------------------------------------------------------------------------------------------------------------
REFRESH_CHAT_RATE_MILLIS = 3000;

// document.onkeydown = function(evt) {
    // evt = evt || window.event;
    // var charCode = evt.keyCode || evt.which;
	// var charStr = String.fromCharCode(charCode);
// //	console.log(event.keyCode === 13);//enter button
// //	console.log(charStr + " " + event.keyCode);

	// if (event.keyCode === 13){
		// //enter pressed
		// //call button. 
		// if (document.getElementById(CHAT_TEXTBOX).value != ""){
			// document.getElementById(CHAT_TEXTBOX).click();	
		// }
	
	// }
	
	
// };

class Chatbox{
	constructor(chatDiv){
		this.chatAreaControls= chatDiv;
		this.display();
		this.userId = NO_LOGGED_IN_USER_DUMMY_ID;
		this.userName = "Anonymus";
		
		this.pollsRunning = 0; //
		
	}
	
	display(){
		
		this.sendTextButton = addButtonToExecuteGeneralFunction(this.chatAreaControls, "Submit ", CHAT_SUBMIT_BUTTON, CHAT_SUBMIT_BUTTON, this.submitTextField.bind(this));
		this.writeTextbox = addTextBox(this.chatAreaControls, "submit", CHAT_TEXTBOX, CHAT_TEXTBOX, 20);
		//addBr(this.chatAreaControls);
		//this.displayTextbox= addTextArea(this.chatAreaControls, "display", "displayBox", "dislayBox", 10);
		this.displayTextBox = addDiv(this.chatAreaControls, "chatDisplay" );
		console.log(this.displayTextBox);
	}
	
	setUserData(id,name){
		this.userId = id;
		this.userName = name;
	}
	
	startRefreshLoop(){
		//activate the polling.
		this.pollsRunning += 1;
		this.getMessages(); 
	}
	
	stopRefreshLoop(){
		this.pollsRunning = 0;
	}
	
	getMessages(){
		//don't call this directly! (for the refresh control).
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/chatbox.php?action="+"getMessages"+"&messagesNumber=" + NUMBER_OF_MESSAGES_CHAT_DISPLAY; 		
		//console.log(url);
		this.callPhpWithAjax(url,this.getMessagesResponse.bind(this));
	}
	
	getMessagesResponse(responseJSON){
		//console.log(responseJSON);
		
		var remoteDataArray =  JSON.parse(responseJSON);
		//remoteDataArray = remoteDataArray[0];
		var outputString = remoteDataArray;
		var outputString = "";
		
		for (var i=remoteDataArray.length-1;i>=0 ;i-=1){
			//outputString =  outputString +  "id" + remoteDataArray[i]["messageId"] + "(" + remoteDataArray[i]["submitTime"] + ")" + remoteDataArray[i]["userName"] + " : " +  remoteDataArray[i]["message"]+"<br>"  ;
			outputString =  outputString + "(" + remoteDataArray[i]["submitTime"] + ")" + remoteDataArray[i]["userName"] + " : " +  remoteDataArray[i]["message"]+"<br>"  ;
			//console.log(remoteDataArray[i]);
			// console.log(remoteDataArray[i])[];
			// console.log(remoteDataArray[i]["playerId1"]);
			// // htmlString += "gameId: " + remoteDataArray[i]["gameId"] + ", player1: "+ remoteDataArray[i]["playerId1"] + ", player2: "+ remoteDataArray[i]["playerId2"] + "<br>" ;
			// htmlString += "<input type='radio' name='gameIdSelection' value='" + 
				// remoteDataArray[i]["gameId"] + "'> gameNumber: "+ remoteDataArray[i]["gameId"] +
				// ", "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId1"]) + 
				// " versus "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId2"]) + 
				// "<br>" ;
		}
		
		document.getElementById("chatDisplay").innerHTML = outputString;
		
		
		//we only want one cyclic update, but we also want to be able to update right away when asked for.
		if (this.pollsRunning >1){
			this.pollsRunning -= 1;
		}else if (this.pollsRunning == 1){
			window.setTimeout(function (){this.getMessages();}.bind(this),REFRESH_CHAT_RATE_MILLIS); 
		}else{
			//do nothing
		}
	}
	
	submitTextField(){
		this.submitText(this.writeTextbox.value);
	}
	
	submitText(message){
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/chatbox.php?action="+"postMessage"+"&userId=" + this.userId+"&userName=" + this.userName + "&message=" + message; 
		this.callPhpWithAjax(url,this.submitResponse.bind(this));
	}
	submitResponse(result){
		this.writeTextbox.value = "";
		this.startRefreshLoop();
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
	}
}
