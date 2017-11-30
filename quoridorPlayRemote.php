<?php
	// $servername = "lode.ameije.com";

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
	

	}else{
		printf("unknown action (or none provided) : ". $action ."<br>");

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