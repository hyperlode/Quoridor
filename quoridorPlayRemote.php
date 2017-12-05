<?php
	// $servername = "lode.ameije.com";
	
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
		$gameId = $_GET["gameId"];
		$gameState = $_GET["gameState"];
		sqlDeleteGameIdRecord($conn, $gameId);
		sqlCreateRecordForGameId($conn , $gameId, $gameState  );
	}elseif ($action == "poll"){
	
		printf("polling for change...<br>");
		$gameId = $_GET["gameId"];
		
		$result = sqlGetGameState($conn, $gameId);
		ob_end_clean();
		ob_start();
		//$result = trim($result, "\x00..\x1F"); //get rid of whitespace.
		
		echo $result;
		return  ob_get_contents();
	
	}elseif ($action == "createGame"){
		//
		$gameId = 988;
		$player1Id = $_GET["player1"];
		$player2Id = $_GET["player2"];
		$result  = sqlCreateNewGame($conn, $gameId,$player1Id, $player2Id);//$result = 
		ob_end_clean();
		ob_start();
		echo $result;
		//echo $result;
		return  ob_get_contents();
	}elseif ($action == "listOfGames"){
		ob_end_clean();
		ob_start();
		
		//return;
		$result = getListOfActiveGames($conn);
		echo $result;
		return  ob_get_contents();
		
	}elseif ($action == "joinGame"){
		echo "joingame php test";
		$gameId = $_GET["gameId"];
		$player2Id = $_GET["player2"];
		$result = joinActiveGame($conn,$gameId,$player2Id);
		ob_end_clean();
		ob_start();
		if ($result == true){
			echo "1";
		}else{
			echo $result;
		}
		
		return ob_get_contents();
	}else{
		//printf("unknown action (or none provided) : ". $action ."<br>");
		ob_end_clean();
		ob_start();
		echo "unknown action";
		return  ob_get_contents();
	}

	// ob_end_clean();





	//SQL command
	//set gamestate of game with game id.
	
	function connectToDataBase() {
		$servername = "50.62.176.142"; //found in "remote Mysql" page of godaddy dashboard.
		$username = "superlode";
		$password = "sl8afval";
		$databasename = "ameijeData";
		
		// Create connection
		$connn = new mysqli($servername, $username, $password,$databasename);
	
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



	

	function joinActiveGame($conn,$gameId,$player2Id){
		$sql = "UPDATE activeGames SET playerId2 = '".$player2Id."'	WHERE gameId = ".$gameId;
		if ($conn->query($sql) === TRUE) {	
			return true;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
			return false;
		}
	}
	

	function getUntakenGameId($conn){


	}

	function getListOfActiveGames($conn) {
		$sql = "SELECT * FROM activeGames WHERE playerId2 = 666";
		//$sql = "SELECT gameState FROM activeGames WHERE gameId = 666";
		$returnString = "";
		if ($result = $conn->query($sql) ) {	
		
			while ($row = $result->fetch_assoc()) {
				//echo "%s", $row["gameState"];
				// $test = "%s",$row["gameState"]; //ERROR!!!!
				//$test = $row["gameId"]; 
				$returnString .=$row["gameId"] . ",";
				
			}
			$result->close();
			
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $returnString;
	}


	function sqlCreateNewGame($conn, $gameId, $player1Id, $player2Id){
		$sql = "INSERT INTO `activeGames`(`gameId`, `playerId1`, `playerId2`,`gameState`,`gameStarted`,`gameLastActivityPlayer1`,`gameLastActivityPlayer2`,`player1DoesFirstMove`) 
		VALUES (". $gameId.",".$player1Id.",".$player2Id.",'notyetstarted','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."',1)";  //works!
		
		//echo sql ; 
	
		if ($conn->query($sql) === TRUE) {	
			echo "New game created successfully,game id: ".$gameId;
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
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

	function sqlGetGameState ($conn, $gameId){
		//http://php.net/manual/en/class.mysqli-result.php
		$sql = "SELECT gameState FROM activeGames WHERE gameId =".$gameId;
		$returnString = "";
		if ($result = $conn->query($sql) ) {	
			
			//http://php.net/manual/en/mysqli.query.php
			echo "executed ok. response (for gameId ".$gameId.") ".$result->num_rows ." <br>";
			// while ($row = $result->fetch_row()) {
			// 	printf ("%s (%s)<br>", $row[0], $row[1]);
			// }
			
			while ($row = $result->fetch_assoc()) {
				//echo "%s", $row["gameState"];
				// $test = "%s",$row["gameState"]; //ERROR!!!!
				$test = $row["gameState"]; 
				$returnString .=$test;
				//return "%s", $row["gameState"];
			}
			$result->close();
			
		} else {
			echo "Error return value: " . $sql . "<br>" . $conn->error;
		}	
		return $returnString;
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