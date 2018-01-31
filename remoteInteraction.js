
//------------------------------------------------------------------------------------------------------------
//                                  REMOTE SERVER CONTACT
//------------------------------------------------------------------------------------------------------------


class RemoteContact {
	constructor() {
		this.localPlayerId = NO_PLAYER_DUMMY_ID; //very important.  --> identify player 
		this.remotePlayerId = NO_PLAYER_DUMMY_ID
		this.gameId = NO_GAME_ID_YET;//very important --> use this for polling.
		this.localPlayerIsPlayer1 = true;
		

		this.localPlayerFirstMove = false;
		this.startingPlayer = PLAYER1;
		this.localPlayerGoesUpwards = false;



		this.gameStatus = GAME_STATUS_NO_STATUS_YET;
		this.desiredRemotePlayerId = 124; //not yet important as of dec 2017, the idea could be here that if you want to start a newGame, you want to make sure you play against this opponent only.
		
		this.counter = 1;
		
		this.continuePollingForRemoteMove = false;
		this.currentLocalGameStateString = "";
		this.remoteMovedCallBackfunction;
		this.updateCafeStatusField;
		this.remoteGameData = {};
		
	}
	
	setAccountInstance(account){
		this.accountInstance = account;
	}

	setGameProperties(localPlayerGoesUpwards ){

		//should be stored remotely, but this will do for now.
		//this.startingPlayer = startingPlayer;
		this.localPlayerGoesUpwards = localPlayerGoesUpwards;
	}

	setLocalPlayerId(id){
		this.localPlayerId = id;
	}
	setRemoteMovedCallback(callbackFunction){
		this.remoteMovedCallBackfunction = callbackFunction;
	}
	
	setUpdateStatusFieldCallback(callbackFunction){
		this.updateCafeStatusField = callbackFunction;
		
	}

	setStartLocalBoardCallback(callbackFunction){
		this.startLocalBoardCallBackfunction = callbackFunction;
	}
	
	getPlayerNameFromId(id){
		return this.accountInstance.getNameFromId(id);

	}
	//---------------------------join existing game by gameId.

	joinGame(gameId){
		//2 steps: step one: check if possible, step two: join.
		console.log("checkit");
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"poll"+"&gameId="+gameId;// No question mark needed
		this.callPhpWithAjax(url,this.joinGameFeedback.bind(this));
	}

	joinGameFeedback(responseJSON){
		console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log(remoteDataArray);
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		if (remoteDataArray.length == 0){

			console.log("game not found... gameId provided: " + gameId);
			this.updateCafeStatusField("game not found... gameId provided: " + gameId);
			return false;
		}
		
		
		if (remotePlayer1 == this.localPlayerId){
			console.log("continue game (as remote player 1) ");
			this.joinGameExecute(gameId,1);
			
		}else if (remotePlayer2 == this.localPlayerId){
			this.joinGameExecute(gameId,2);
			console.log("continue game (as remote player 2) ");
		}else  if ( remotePlayer1 == NO_PLAYER_DUMMY_ID &&  remotePlayer2 != this.localPlayerId ){
			this.joinGameExecute(gameId,1);
			console.log("join as remote player 1");
		}else if (remotePlayer1 != this.localPlayerId &&  remotePlayer2 == NO_PLAYER_DUMMY_ID ){
			this.joinGameExecute(gameId,2);
			console.log("join as remote player 2");
		}else if( remotePlayer1 == NO_PLAYER_DUMMY_ID &&  remotePlayer2 == NO_PLAYER_DUMMY_ID){
			console.log("first player to join");
			this.joinGameExecute(gameId,1);
		}else{
			console.log();			
			console.log(this.accountInstance.getNameFromId(remotePlayer1));	
			console.log(this.accountInstance.getNameFromId(remotePlayer2));	
			console.log(remotePlayer2 == this.localPlayerId);
			console.log(this.accountInstance.getNameFromId(this.localPlayerId));	
			console.log(this.accountInstance.getNameFromId(NO_PLAYER_DUMMY_ID));	
			//check if room free in the game.
			
			console.log("possible 2 ASSERT errors:");
			console.log("ASSERT ERROR: game with id" +remoteDataArray["gameId"] +" cannot join game.");
			console.log("This game is not available for this player. There must be a free spot, or it must be a continuation of a previous game. " );
			this.updateCafeStatusField("No joining possible. (check gameId and playeId)");
			
			return false;
		}
		
		
	}

	joinGameExecute(gameId, playerNumber){
		//playernumber: local id is playerId1 or Id2 -->//1 or 2.
		
	//joinGame(gameId){
		//game can also be joined if it was made earlier on...
		//so first check if the game id exists, and if the player id's are both filled in. 

		//add localplayer as player2
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"joinGame"+"&playerId=" + this.localPlayerId + "&gameId=" + gameId+ "&playerNumber=" + playerNumber;// No question mark needed
		console.log("try to join game: " + gameId + ". By player: " + this.localPlayerId);
		
		this.updateCafeStatusField("joining game: " + gameId + ". By player: " + this.localPlayerId);
		
		this.callPhpWithAjax(url, this.joinGameExecuteFeedback.bind(this));
		
		//debug for now:
		this.gameId = gameId; 
		this.currentLocalGameStateString = "";
		
	}
	
	joinGameExecuteFeedback(remoteGameDataJSON){
		//response should be JSON
		console.log(remoteGameDataJSON);
		var remoteGameData =  JSON.parse(remoteGameDataJSON);
		
		this.setLocalGameToMirrorRemoteGame(remoteGameData);
		
		
		
				
		//auto start if two players available and game status still set to initializing.
		if(this.gameStatus == GAME_STATUS_INITIALIZING ){
			//if two players joined, set game to playing!
			console.log("all players ready, let's start playing! (and provide that information to the database.");
			this.setGameStatus(REMOTE_GAME_STATUS_PLAYING);
			
			this.startCheckDatabaseForRemoteMoveLoop();	
			this.updateCafeStatusField("joining successful, attempting to set remote game status to playing.");
			
		}else if(this.gameStatus == GAME_STATUS_PLAYING ){
			this.startCheckDatabaseForRemoteMoveLoop();	
			this.updateCafeStatusField("joining successful");
			
		}else if(this.gameStatus == GAME_STATUS_FINISHED ){
			
			
			console.log(this.gameStatus);
			console.log("TODO: game status :finished game --> not yet handled. No moving should be possible anymore.");
			
			
		
		}else{
			console.log("ASSERT ERROR: unhandled game status:");
			console.log(this.gameStatus);
		
		}
			
		
		
		
	}


	//-------------------create a new game in the remote database 
	initNewGame(localPlayerId, desiredRemotePlayerId, localPlayerFirstMove){
		
		this.localPlayerId = localPlayerId;
		this.desiredRemotePlayerId = desiredRemotePlayerId;
		
		this.updateCafeStatusField("game start: player:" + localPlayerId + " and ...wait for opponent to log in." + "debug: game id will be shown in log window.");

		this.localPlayerFirstMove = localPlayerFirstMove;
		var firstMoveAsPlayer1DoesFirstMove = 1;
		if (!localPlayerFirstMove){
			var firstMoveAsPlayer1DoesFirstMove = 0;		
		}
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"createGame"+"&player1=" + this.localPlayerId + "&player2=" + this.desiredRemotePlayerId + "&player1FirstMove=" + firstMoveAsPlayer1DoesFirstMove ;// No question mark needed
		
		console.log("create new game");
		console.log(url);
		this.callPhpWithAjax(url, this.newGameCreatedFeedback.bind(this));	
	}

	newGameCreatedFeedback(responseJSON){

		//console.log("new game created raw response: " + responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log( remoteDataArray); //"remote Game Data: " +
		var gameId = remoteDataArray["gameId"];
		var remotePlayer1 = remoteDataArray["playerId1"];
		var remotePlayer2 = remoteDataArray["playerId2"];

		this.gameId = gameId; 
		if (remotePlayer2 == NO_PLAYER_DUMMY_ID){
			//no opponent yet
			this.gameStatus = GAME_STATUS_INITIALIZING;
			this.remotePlayerId = remotePlayer2;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponent yet. Wait for it.");
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " No opponenent yet. Gameboard will be displayed when opponent joins. Wait for it.");
			
			
		}else{
			//game has two players.
			this.gameStatus = GAME_STATUS_PLAYING;
			console.log("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
			this.updateCafeStatusField("game created with id: " + this.gameId + " local player id: "+ this.localPlayerId + " Opponent id (666 is no opponent yet): " + remotePlayer2);
		}

		this.startCheckDatabaseForRemoteMoveLoop();
	}

	//---------------list all the available games from the database
	
	listOfGames(remoteGameStatusFilter, playerIdFilter){
		playerIdFilter = (typeof playerIdFilter !== 'undefined') ?  playerIdFilter : NO_PLAYER_DUMMY_ID;
		
		
		//remotegamestatus --> see: REMOTE_GAME_STATUS_....
		this.remoteGameStatusFilter = remoteGameStatusFilter;

		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?action="+"listOfGames" + "&gameStatusFilter=" + remoteGameStatusFilter +"&playerIdFilter=" + playerIdFilter;
		console.log("list of games");
		this.callPhpWithAjax(url, this.listOfGamesCallBack.bind(this));	
	}

	listOfGamesCallBack(responseJSON){
		console.log(responseJSON);
		var remoteDataArray =  JSON.parse(responseJSON);
		console.log(remoteDataArray);
		var htmlString = "<form action=''>";

		if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_INITIALIZING){
			htmlString += "List of unstarted games to join:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_PLAYING){
			htmlString += "List of already started games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_ERROR){
			htmlString += "List of erroneous games:<br>"
		}else if(this.remoteGameStatusFilter == REMOTE_GAME_STATUS_FINISHED){
			htmlString += "List of archived games:<br>"
		}else{
			htmlString += "unknown game status list: <br>"
		}

		//for (var i=0;i<remoteDataArray.length;i+=1){
		for (var i=remoteDataArray.length-1;i>=0 ;i-=1){
			console.log(remoteDataArray[i]);
			console.log(remoteDataArray[i]["playerId1"]);
			// htmlString += "gameId: " + remoteDataArray[i]["gameId"] + ", player1: "+ remoteDataArray[i]["playerId1"] + ", player2: "+ remoteDataArray[i]["playerId2"] + "<br>" ;
			htmlString += "<input type='radio' name='gameIdSelection' value='" + 
				remoteDataArray[i]["gameId"] + "'> gameNumber: "+ remoteDataArray[i]["gameId"] +
				", "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId1"]) + 
				" versus "+ this.getPlayerNameFromId(remoteDataArray[i]["playerId2"]) + 
				"<br>" ;
		}
		htmlString += "</form>";

		// var responseArray = responseText.split(",");
		// var outputString = "";

		// for (var i = 0; i < responseArray.length; i+=1) {
		
		// 	outputString +=  " game id: " + responseArray[i]   + "<br>";
		// }
		 document.getElementById(LISTEDGAMES_DIV_LIST).innerHTML = htmlString;
	}
	

	//------------debug pretend a remote opponent moved.

	//post from this computer, but change in database, as if a remote player moved...
	debugImitateRemoteMoved(gameStateString) {
		
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ gameStateString+"&action="+"submit"+"&gameId="+this.gameId;
		console.log("imitation move gamestring: " + gameStateString);
		this.callPhpWithAjax(url, this.debugRemoteMoveImitation.bind(this));	
	}
	debugRemoteMoveImitation(response){
		console.log("remoteImitatedMove");
	}

	
	//-----------------post game status
	setGameStatus(gameStatus){
		
		this.gameStatus = gameStatus;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameStatus="+ gameStatus +"&action="+"setGameStatus"+"&gameId="+this.gameId;
		this.callPhpWithAjax(url, this.setGameStatusResponse.bind(this));	
	}
	
	setGameStatusResponse(result){
		//feedback result from submitting the move to the database.
		//document.getElementById("debugServerFeedback").innerHTML = result;
		console.log("game status set.");
		console.log(result);
	}
	
	
	//---------------post local move

	sendGameStateToRemote(gameStateString, setGameStatusToArchive) {
		this.setGameStatusToArchive = setGameStatusToArchive;
		this.currentLocalGameStateString = gameStateString;
		var url = "http://lode.ameije.com/QuoridorMultiPlayer/quoridorPlayRemote.php?gameState="+ this.currentLocalGameStateString+"&action="+"submit"+"&gameId="+this.gameId;
		this.callPhpWithAjax(url, this.submitResponse.bind(this));	
	}

	submitResponse(result){
		//feedback result from submitting the move to the database.
		//document.getElementById("debugServerFeedback").innerHTML = result;
		console.log(result);
		
		
		
		if (this.setGameStatusToArchive == true){
			this.setGameStatus( REMOTE_GAME_STATUS_FINISHED);
			
		}
	}



	// ------------------check for remote move.


	startCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = true;
		this.callbackCheckForRemoteUpdate();
	}

	stopCheckDatabaseForRemoteMoveLoop(){
		this.continuePollingForRemoteMove = false;
	}

	checkDatabaseForRemoteMoveLoop(){
	
		//console.log("start remote check loop");
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

	pollResponse(responseJSON){
		// console.log(responseJSON);	
		var remoteDataArray =  JSON.parse(responseJSON);
		var remoteStatus = this.processRemoteResponseToLocalStatus(remoteDataArray);
		
		
		//local game action:
		if (remoteStatus == GAME_STATUS_NO_STATUS_YET){
			
		
			console.log("waiting for remote database game init.");
			
		}else if (remoteStatus == GAME_STATUS_PLAYING){

			//verify remote data
			if(!this.verifyRemoteGameData(remoteDataArray)){
				console.log("ASSERT ERROR");
				return false;
			};		

			//if local state is still "initializing, this is the time to display. the board."
			//basically startup edge.
			if (this.gameStatus == GAME_STATUS_INITIALIZING || this.gameStatus == GAME_STATUS_NO_STATUS_YET){
				//first feedback from "playing game". possible already with opponent move. 
				console.log("starting local game. ");
				this.setLocalGameToMirrorRemoteGame(remoteDataArray);

				//define rotation of board
				var player1GoesUpwards = false;
				if ( this.localPlayerIsPlayer1){
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = true;
						console.log("player1GoesUpwards = true;");
					}else{
						player1GoesUpwards = false;
						console.log("player1GoesUpwards = false;");
					}
				}else{
					if (this.localPlayerGoesUpwards){
						player1GoesUpwards = false;
						console.log("local player is player 2  , player1GoesUpwards = false; ");
					}else{
						player1GoesUpwards = true;
						console.log("local player is player 2  , player1GoesUpwards = true; ");
					}
				}
				var initialGameState = remoteDataArray["gameState"];
				if( initialGameState == "notyetstarted"){
					initialGameState = "";
				}

				//check starting player.
				if (remoteDataArray["player1DoesFirstMove"] == 1){
					this.localPlayerFirstMove = this.localPlayerIsPlayer1;
					console.log("PLAYER1 starts");
				}else if (remoteDataArray["player1DoesFirstMove"] == 0){
					this.localPlayerFirstMove = !this.localPlayerIsPlayer1;
					console.log("PLAYER2 starts");
				}else{
					console.log("assert ERROR undefined starting player");
				}

				// display quoridor board
				this.startLocalBoardCallBackfunction(this.startingPlayer, this.localPlayerFirstMove, player1GoesUpwards, initialGameState);
								
				this.currentLocalGameStateString = initialGameState;
				this.gameStatus = GAME_STATUS_PLAYING;
				
				this.updateCafeStatusField("game start. GameId: " + this.gameId+", your player id: "+ this.localPlayerId + ", opponent playerId: " + this.remotePlayerId);
				return true;
				
				
			}

			//Check if local player's turn.
			//when game starts, a poll is done to see if the opponent has joined. problem is, if a local move is requiered, that it is also stuck in this poll loop.
			
			var evenNumberOfTurns = this.numberOfMovesPlayed()%2 == 0;
			// console.log(evenNumberOfTurns);
			// console.log(this.numberOfMovesPlayed()%2);
			// console.log(this.localPlayerFirstMove);

			if (this.localPlayerFirstMove && evenNumberOfTurns){
				//local player turn. so no more checking for remote.
				this.stopCheckDatabaseForRemoteMoveLoop();
				console.log("local player turn. so no more checking for remote.");
				return true;
			}else if (!this.localPlayerFirstMove && !evenNumberOfTurns) {
				this.stopCheckDatabaseForRemoteMoveLoop();
				console.log(" odd number of turns. local player turn. so no more checking for remote.");
				return true;
			}
			
			//check for remote move.
			var opponentMovedOneMove = this.compareGameStates(remoteDataArray)
			//console.log("compare states status, did opponent made move? : " + opponentMovedOneMove);
			if (opponentMovedOneMove){
				// returnStatus
				console.log("opponent moved");
				this.stopCheckDatabaseForRemoteMoveLoop();
				this.remoteMovedCallBackfunction( remoteDataArray["gameState"]);
			}
			return true;
		}else if (remoteStatus == GAME_REGISTER_LOCAL_PLAYER){
			console.log("register local player");
		}else if (remoteStatus == GAME_STATUS_FINISHED){
			if (this.gameStatus){

				//check for remote move.
				var opponentMovedOneMove = this.compareGameStates(remoteDataArray)
				//console.log("compare states status, did opponent made move? : " + opponentMovedOneMove);
				if (opponentMovedOneMove){
					// returnStatus
					console.log("opponent moved");
					this.stopCheckDatabaseForRemoteMoveLoop();
					this.remoteMovedCallBackfunction( remoteDataArray["gameState"]);
				}
				return true;
			}			
			this.gameStatus = GAME_STATUS_FINISHED;
			console.log("game finished no more polling.");
			this.stopCheckDatabaseForRemoteMoveLoop();
			console.log("local player turn. so no more checking for remote.");
			return true;
		}else if (remoteStatus == GAME_STATUS_INITIALIZING){
			
			//give command to startup the boards 
			console.log("game status: initializing. Wait for all players to join, before showing the board. ");
			//--> not yet ok, this would imply that there must be a move first, while that's impossible if there is not yet a board visible. 
		}else if (remoteStatus == GAME_STATUS_ERROR){
			console.log("error in database response. The game seems not to be valid. " +remoteDataArray );
		}
	}

	numberOfMovesPlayed(){
		//console.log(this.currentLocalGameStateString);
		var movesArray = this.currentLocalGameStateString.split(",");
		var numberOfMovesPlayed = movesArray.length;
		//console.log( this.currentLocalGameStateString.split(","));
		
		if (numberOfMovesPlayed == 1 && (movesArray[0]=="" || movesArray[0]=="notyetmoved")){
			numberOfMovesPlayed = 0;
		}		
		return numberOfMovesPlayed;
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
		return
	}

	processRemoteResponseToLocalStatus(remoteDataArray){

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
	
		

		//return remoteDataArray.gameStarted + "   " + remoteDataArray["gameStarted"];
		//remoteDataArray = remoteDataArray;
		// console.log(remoteDataArray);
		//console.log( remoteDataArray["gameId"]);
		var returnStatus = GAME_STATUS_ERROR;

		if (remoteDataArray.length == 0){
			console.log(this.gameStatus)	;
			if (this.gameStatus == GAME_STATUS_NO_STATUS_YET){
				console.log("Waiting for first database response...");
				returnStatus = GAME_STATUS_NO_STATUS_YET;
			}else{
				console.log("no valid array found");
				returnStatus = GAME_STATUS_ERROR;
			}
		}else if (remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING){
			returnStatus = GAME_STATUS_INITIALIZING;
		}else if(remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_PLAYING){
			returnStatus = GAME_STATUS_PLAYING;
			
		}else if(remoteDataArray["gameStatus"] == REMOTE_GAME_STATUS_FINISHED){
			returnStatus = GAME_STATUS_FINISHED;
		
		}else{
			var returnStatus = GAME_STATUS_ERROR;
			console.log("game status error.");
		}

		// }else if (remoteDataArray["gameStatus"] == ){
		// 	//check game state.	REMOTE_GAME_STATUS_PLAYING
		// 	returnStatus = GAME_STATUS_PLAYING;
		// }

		


		//check game status

		// if (remoteDataArray["gameStatus" == 0]){
		// 	//game not yet started.
		// }else if (remoteDataArray["gameStatus" == 1]){
		// 	//game continuation.

		// }

		return returnStatus ;
		//return  remoteDataArray["gameId"];
	}


	setLocalGameToMirrorRemoteGame(remoteGameData){
		var remotePlayer1Id  = parseInt(remoteGameData["playerId1"]); 
		var remotePlayer2Id  = parseInt(remoteGameData["playerId2"]); 
		if(remotePlayer1Id == remotePlayer2Id){
			console.log("error playing against yourself... id 1 and2 are equal. not allowed.");
			return false;
		}else if(this.localPlayerId == remotePlayer1Id){
			this.localPlayerIsPlayer1 = true;
			this.remotePlayerId = remotePlayer2Id;
		}else if (this.localPlayerId == remotePlayer2Id){
			this.localPlayerIsPlayer1 = false;
			this.remotePlayerId = remotePlayer1Id;
		}else {
			console.log("assert errro: local player ID not set in remote. ");
			return false;
		}
		
		if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_INITIALIZING ){
			this.gameStatus = GAME_STATUS_INITIALIZING;
			if (this.remotePlayerId != NO_PLAYER_DUMMY_ID){
				console.log("all players set, will soon go to playing game status.");
			}else{

				console.log("wait for opponent to join.");
			}

		}else if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_PLAYING ){
			this.gameStatus = REMOTE_GAME_STATUS_PLAYING;
			if (remoteGameData["gameState"] != "" && remoteGameData["gameState"] != "notyetstarted"){
				//game already started. that means: recover!
				console.log("recover game");
			}else{
				//start new game.
				console.log("new game.");
			}
			
		}else if (remoteGameData["gameStatus"] == REMOTE_GAME_STATUS_FINISHED ){
			this.gameStatus = REMOTE_GAME_STATUS_FINISHED;
			console.log("game finished, only viewing allowed.");
			
		}else{
			console.log("unhandled status: " + remoteGameData["gameStatus"]);
		}
		return true;

	}

	verifyRemoteGameData(remoteGameData){
		//if game is going, always verify every poll.
//		console.log(remoteGameData);
		var remotePlayer1Id  = parseInt(remoteGameData["playerId1"]); 
		var remotePlayer2Id  = parseInt(remoteGameData["playerId2"]); 
	
		if(this.localPlayerIsPlayer1){
			if(this.localPlayerId != remotePlayer1Id && this.remotePlayerId != remotePlayer2Id ){
				console.log(this.remotePlayerId);
				console.log(this.localPlayerId);
				console.log(remotePlayer1Id);
				console.log(remotePlayer2Id);
				console.log("assert error incorrect player ");
				return false;
			}
		}else{
			if(this.localPlayerId != remotePlayer2Id && this.remotePlayerId != remotePlayer1Id ){
				console.log(this.remotePlayerId);
				console.log(this.localPlayerId);
				console.log(remoteGameData["playerId1"]);
				console.log(remotePlayer2Id);
				console.log("assert error incorrect player ");
				return false;
			}
		}
		
		if (remoteGameData["gameId"] != this.gameId){
			console.log("ASSERT error: incorrect game id");
			return false;
		}
		return true;
		

	}

	// localPlayerIsRemotelySet(remoteGameData){
	// 	//return local player id is set in remote game.

	// 	var returnStatus = false;
	// 		//check player ids.
	// 	if (remoteGameData["playerId1"] == remoteGameData["playerId2"]){
			
	// 		console.log("ASSERT ERROR: two times the same player. You make this too hard for me. Please chose another opponent then yourself. id:" + this.remoteGameData["playerId2"] );
	// 		returnStatus = false;
	// 	}else if(remoteGameData["playerId1"] == this.localPlayerId){
	// 		this.localPlayerIsPlayer1 = true;
	// 		returnStatus = true;
	// 	}else if(remoteGameData["playerId2"] == this.localPlayerId){
	// 		this.localPlayerIsPlayer1 = false;
	// 		returnStatus = true;
	// 	}else{
	// 		console.log("response from a game where this playerId is not one of the players. is it set up correctly? Is the right gameId provided?");
	// 		//returnStatus = GAME_STATUS_ERROR;

	// 		returnStatus = false;
	// 	}

		
		
	// 	return returnStatus;
		
	// }

	compareGameStates(remoteGameData) {
		var remoteGameState = remoteGameData["gameState"];
		var remote = remoteGameState.split(",");
		var local = this.currentLocalGameStateString.split(",");
		var remoteMoved = false;
		var remoteMove = "";

		//var returnStatus = GAME_STATUS_ERROR;
		var returnStatus = false;
		//first move is a bit of a hack, as even an empty gameStateString returns an array of length 1
		if (remote[0]!="" && remote[0]!="notyetstarted" &&  local [0]==""  ){
			local = [];
			console.log("first move opponent. remote: "+ remote  + " local: " + local);
		}

		if (remote.length< local.length){
			
			console.log ("not yet updated, resending game state.");
			this.sendGameStateToRemote(this.currentLocalGameStateString, this.setGameStatusToArchive);
			
		}else if(remote.length == local.length){
			console.log("waiting for opponent to make a move");
			returnStatus = false;

		}else if (remote.length > local.length){
			console.log("opponent made a move")
			console.log()
			if (remote.length != local.length +1 ){
				//not one move difference
				
				if (local[0]== ""){
					console.log("It seems like this is a recovered game.");
					// returnStatus = GAME_STATUS_RECOVER_GAME;
					returnStatus = false;
				}else{
					console.log("ASSERT ERROR, game state remote does not reflect one extra move. ");
					// returnStatus = GAME_STATUS_ERROR;
					returnStatus = false;
				}
				
				console.log(remote);
				console.log(local);

				//set up game for continuation
				//create new game with starting gamestring.

				
			}else{
				//one move difference
				returnStatus =true;
				//check history
				for (var i = 0; i < local.length; i++) { 
					if (local[i] != remote[i] ){
						console.log("ASSERT ERROR: gamestate history not indentical ");
						console.log(remote);
						console.log(local);
					
						// returnStatus = GAME_STATUS_ERROR;
						returnStatus = false;
					}
				} 
				
				//get the last move
				this.remoteMove = remote[remote.length - 1];
			}
		}else {

			console.log("ASSERT ERROR unvalid arrasy.");
			// returnStatus = GAME_STATUS_ERROR;
			returnStatus = false;
		}
		
		return returnStatus;
		
	}

	
		
	
}