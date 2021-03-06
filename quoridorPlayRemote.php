<?php
	// $servername = "lode.ameije.com";
	include("./credentialsNotInGit.php"); //get passwords and login credentials.
	
	//output buffer, will store in output buffer, this needs to be returned manually.
	ob_start();
	

	$conn = connectToDataBase();
	//select database
	//$db = mysql_select_db(databasename, $con);
	
	
	//SQL command
	//delete record with same gameId	
	$action = $_GET["action"]; //action is "submit" or "poll"


	if ($action == "submit" ){
		echo "submitting move<br>";
		ob_end_clean();
		ob_start();
		$gameId = $_GET["gameId"];
		$gameState = $_GET["gameState"];
		//sqlDeleteGameIdRecord($conn, $gameId);
		//sqlCreateRecordForGameId($conn , $gameId, $gameState  );
		echo sqlUpdateRecordToGameState($conn , $gameId, $gameState);
		return  ob_get_contents();
	
	}elseif ($action == "setGameStatus"){
		
		echo "set game Status<br>";
		ob_end_clean();
		ob_start();
		$gameId = $_GET["gameId"];
		$gameStatus = $_GET["gameStatus"];
		//sqlDeleteGameIdRecord($conn, $gameId);
		//sqlCreateRecordForGameId($conn , $gameId, $gameState  );
		echo sqlUpdateRecordGameStatus($conn , $gameId, $gameStatus);
		return  ob_get_contents();
	
		
	}elseif ($action == "poll"){
		
		printf("poll game id");
		$gameId = $_GET["gameId"];
		
		$resultArray = sqlGetGameData($conn, $gameId);
		$result = json_encode($resultArray);
		ob_end_clean();
		ob_start();
		//$result = trim($result, "\x00..\x1F"); //get rid of whitespace.
		
		echo $result;
		return  ob_get_contents();
	
	}elseif ($action == "createGame"){
		
		$player1Id = $_GET["player1"];
		$player2Id = $_GET["player2"];
		$player1FirstMove = intval($_GET["player1FirstMove"]); //should be 1 or 0 
		$result  = sqlCreateNewGame($conn, $player1Id, $player2Id, $player1FirstMove);//$result = 

		$gameId = $result;
			
		$resultArray = sqlGetGameData($conn, $gameId);
		$result = json_encode($resultArray);

		ob_end_clean();
		ob_start();
		echo $result;
		//echo $result;
		return  ob_get_contents();
		
	}elseif ($action == "joinGame"){
		
		echo "joingame php test";
		$gameId = $_GET["gameId"];
		$playerId = $_GET["playerId"];
		$playerNumber = $_GET["playerNumber"]; // 1 for player 1, 2 for player 2

		if ($playerNumber == "1"){
			$resultArray = joinActiveGameAsPlayer1($conn,$gameId,$playerId);
			echo "player 1";
		}elseif($playerNumber == "2"){
			$resultArray = joinActiveGameAsPlayer2($conn,$gameId,$playerId);
			echo "player 2";
		}else{
			echo "wrong playernumber ";
		}
		
		$resultArray = sqlGetGameData($conn, $gameId);

		$result = json_encode($resultArray);
	
		ob_end_clean();
		ob_start();
	
		echo $result;
		return  ob_get_contents();
	}elseif ($action == "listOfGames"){
		
		$gameStatusFilter = $_GET["gameStatusFilter"];
		$playerIdFilter = $_GET["playerIdFilter"];
		
		echo $playerIdFilter;
		if ($playerIdFilter == 666){
			
			$result = getListOfActiveGames($conn,$gameStatusFilter);
		}else{
			$result = getListOfGames($conn,$gameStatusFilter,$playerIdFilter);
		}
		
		ob_end_clean();
		ob_start();
		$result = json_encode($result);
		echo $result;
		return  ob_get_contents();
	}else{
		//printf("unknown action (or none provided) : ". $action ."<br>");
		ob_end_clean();
		ob_start();
		echo "unknown action";
		return  ob_get_contents();
	}
	
	function connectToDataBase() {
		// $servername = "50.62.176.142"; //found in "remote Mysql" page of godaddy dashboard.
		// $username = "superlode";
		// $password = "dummy dummy no passwords in git please."; 
		$databasename = "ameijeData";
		
		// // Create connection
		// $connn = new mysqli($servername, $username, $password,$databasename);
		
		// $connn = new mysqli($GLOBALS["mysql_hostname"], $GLOBALS["mysql_username"], $GLOBALS["mysql_password"], $GLOBALS["mysql_database"]);
		$connn = new mysqli($GLOBALS["mysql_hostname"], $GLOBALS["mysql_username"], $GLOBALS["mysql_password"], $databasename);
		if( $connn->mysqli->connect_error ){
			throw new Exception("MySQL connection could not be established, are  credentials set correctly in the file on the server? This file is not in the source control: ".$this->mysqli->connect_error);
		}
		
		// Check connection
		if ($connn->connect_error) {
			die("Connection failed: " . $connn->connect_error);
		} 
		
		echo "Connected successfully <br>";

		return $connn;
	}


	function sqlDeleteGameIdRecord($conn, $gameId){
		$sql = "DELETE FROM activeGames WHERE gameId =".$gameId;  //works!
		if ($conn->query($sql) === TRUE) {	
			echo "delete record where gameId is". $gameId;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	function joinActiveGameAsPlayer2($conn,$gameId,$playerId){
		$sql = "UPDATE activeGames SET playerId2 = '".$playerId."'WHERE gameId = ".$gameId;
		if ($conn->query($sql) === TRUE) {	
			return true;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
			return false;
		}
	}

	function joinActiveGameAsPlayer1($conn,$gameId,$playerId){
		$sql = "UPDATE activeGames SET playerId1 = '".$playerId."' WHERE gameId = ".$gameId;
		if ($conn->query($sql) === TRUE) {	
			return true;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
			return false;
		}
	}
	
/*
	function returnUnexistingGameId($conn){

		$sql = "SELECT EXISTS(SELECT 1 FROM activeGames WHERE gameId = 10 )";
		$returnString = "";
		if ($result = $conn->query($sql) ) {	
			
			while ($row = $result->fetch_assoc()) {
			
				$returnString .=$row["gameId"] . ",";
				
			}
			$result->close();
			
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $returnString;
	}
*/

	function getListOfGames($conn, $gameStatusFilter, $playerIdFilter){
		//$sql = "SELECT * FROM activeGames WHERE gameStatus = ".$gameStatusFilter." AND (playerId1 = ".$playerIdFilter." OR playerId2 = ".$playerIdFilter.")"  ;
		$sql = "SELECT * FROM activeGames WHERE (playerId1 = ".$playerIdFilter." OR playerId2 = ".$playerIdFilter.")"  ;
		if ($result = $conn->query($sql) ) {	
			$rows = array();

			while ($row = $result->fetch_assoc()) {
				$rows[] = $row; 
			}
			$result->close();
			return $rows;
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $returnString;
	}

	function getListOfActiveGames($conn, $gameStatusFilter) {
		$sql = "SELECT * FROM activeGames WHERE gameStatus = ".$gameStatusFilter;
		if ($result = $conn->query($sql) ) {	
			$rows = array();
			while ($row = $result->fetch_assoc()) {
				$rows[] = $row; 
			}
			$result->close();
			return $rows;
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $returnString;
	}

	function sqlCreateNewGame($conn,  $player1Id, $player2Id, $player1FirstMove){
		$sql = "INSERT INTO `activeGames`( `playerId1`, `playerId2`,`gameStatus`,`gameState`,`gameStarted`,`gameLastActivityPlayer1`,`gameLastActivityPlayer2`,`player1DoesFirstMove`) 
		VALUES (".$player1Id.",".$player2Id.",'1','notyetstarted','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."',". $player1FirstMove .");";  //works!
			
		if ($conn->query($sql) === TRUE) {	
			////https://www.w3schools.com/php/php_mysql_insert_lastid.asp		
			$last_id = $conn->insert_id; //returns last created primary key
			return $last_id;
		} else {
			return "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	function sqlUpdateRecordGameStatus($conn, $gameId, $gameStatus){
		$sql = "UPDATE activeGames SET gameStatus = '".$gameStatus."'	WHERE gameId = ".$gameId;
		if ($conn->query($sql) === TRUE) {	
			return true;
		} else {
			return "Error: " . $sql . "<br>" . $conn->error;
		}
	}
	
	function sqlUpdateRecordToGameState($conn, $gameId, $gameState){
		$sql = "UPDATE activeGames SET gameState = '".$gameState."'	WHERE gameId = ".$gameId;
		if ($conn->query($sql) === TRUE) {	
			return true;
		} else {
			return "Error: " . $sql . "<br>" . $conn->error;
		
		}
	}
	
	function sqlCreateRecordForGameId($conn, $gameId, $gameState){		
		$sql = "INSERT INTO `activeGames`(`gameId`, `playerId1`, `playerId2`,`gameState`,`gameStarted`,`gameLastActivityPlayer1`,`gameLastActivityPlayer2`,`player1DoesFirstMove`) 
		VALUES (". $gameId.",1,2,'".$gameState."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."',1)";  //works!
		
		echo sql ; 
	
		if ($conn->query($sql) === TRUE) {	
			echo "New record created successfully,game id: ".$gameId;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	// $returnString = "";
	// if ($result = $conn->query($sql) ) {	
	
	// 	while ($row = $result->fetch_assoc()) {
	// 		//echo "%s", $row["gameState"];
	// 		// $test = "%s",$row["gameState"]; //ERROR!!!!
	// 		//$test = $row["gameId"]; 
	// 		$returnString .=$row["gameId"] . ",";
			
	// 	}
	// 	$result->close();
		
	// } else {
	// 	echo "Error return value: " . $sql . "<br>" . $conn->error;
	// }	

	function sqlGetGameData ($conn, $gameId){
		//http://php.net/manual/en/class.mysqli-result.php
		//$sql = "SELECT gameState FROM activeGames WHERE gameId =".$gameId;
		$sql = "SELECT * FROM activeGames WHERE gameId =".$gameId;
		
		$returnString = "";
		$jsonData = "";
		if ($result = $conn->query($sql) ) {	
			
			//http://php.net/manual/en/mysqli.query.php
			echo "executed ok. response (for gameId ".$gameId.") ".$result->num_rows ." <br>";
			// fetch all results into an array
			$response = array();
			while($row = $result->fetch_assoc()){
				$response = $row;
			} 

			// save the JSON encoded array
			header('Content-type: application/json');
			//
			//$returnString = json_encode($response);
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $response;
	}

	function sqlOutputAllRowsIfValueInColumn(){
		//SQL command
		//check if record with gameid already exists.
		/*
		//http://php.net/manual/en/class.mysqli-result.php
		$sql = "SELECT * FROM activeGames WHERE gameId = 10";
		if ($result = $conn->query($sql) ) {	
			//http://php.net/manual/en/mysqli.query.php
			echo "executed ok. response: ".$result->num_rows ." <br>";
			//while ($row = $result->fetch_row()) {
			//	printf ("%s (%s)<br>", $row[0], $row[1]);
			//}
			while ($row = $result->fetch_assoc()) {
				printf ("%s - (%s)<br>", $row["gameState"], $row["gameLastActivityPlayer1"]);
			}
			$result->close();
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}
		*/
	}
?>