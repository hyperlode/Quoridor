
//------------------------------------------------------------------------------------------------------------
//                                  CHAT
//------------------------------------------------------------------------------------------------------------
REFRESH_CHAT_RATE_MILLIS = 3000;

class Chatbox{
	constructor(){
		this.display();
		this.userId = NO_LOGGED_IN_USER_DUMMY_ID;
		this.userName = "Anonymus";
		
		this.pollsRunning = 0; //
		
	}
	
	display(){
		var chatAreaControls= document.getElementById("chatArea");
		this.sendTextButton = addButtonToExecuteGeneralFunction(chatAreaControls, "Submit ", "submitText", "submitText", this.submitTextField.bind(this));
		this.writeTextbox = addTextBox(chatAreaControls, "submit", "submitBox", "submitBox", 20);
		//addBr(chatAreaControls);
		//this.displayTextbox= addTextArea(chatAreaControls, "display", "displayBox", "dislayBox", 10);
		this.displayTextBox = addDiv(chatAreaControls, "chatDisplay" );
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
		var messagesNumber = 5;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/chatbox.php?action="+"getMessages"+"&messagesNumber=" + messagesNumber; 		
		console.log(url);
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
