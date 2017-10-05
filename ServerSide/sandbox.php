<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php echo '<p>Hello World</p>'; ?> 
 
 <?php
	// $servername = "lode.ameije.com";
	$servername = "50.62.176.142"; //found in "remote Mysql" page of godaddy dashboard.
	$username = "superlode";
	$password = "sl8afval";
	$databasename = "quoridor";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password,$databasename);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	echo "Connected successfully <br>";

	//select database
	//$db = mysql_select_db(databasename, $con);
	$q = intval($_GET['q']); //q is a variable posted with the url as:  www.fiejfief.com/mypage.php?q=666
	$action = $_GET['action']; //define the action
	
	if ($action == "write"){ 
		echo "variable q:".$q."<br>";
		
		
		
		//add record each time page is called	
		//$sql = "INSERT INTO `test`(`gameId`, `owner`, `date`) VALUES (10,'bbjbe','1984-07-16 12:23:23')";  //works!
		$sql = "INSERT INTO `test`(`gameId`, `owner`, `date`) VALUES (10,'brecht','".date("Y-m-d H:i:s")."')";  //works!
		
		echo sql ; 
		if ($conn->query($sql) === TRUE) {	
			echo "New reeeecord created successfully at ".date("Y-m-d H:i:s");
		} else {
			echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}else if ($action == "read"){
		// $sql="SELECT * FROM 'test' LIMIT 0, 30";
		$sql="SELECT * FROM `test`";
		echo $sql;
		//$result = mysqli_query($con,$sql);
		// $result = $conn->query($sql);
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			echo "rows were returned!<br>";
		}
		// echo " ".$result;
		// echo "readtest<br>";
		
	if ($result->num_rows > 0) {	
		echo "<table>
		<tr>
		<th>Firstname</th>
		<th>Lastname</th>
		<th>Age</th>
		// <th>Hometown</th>
		// <th>Job</th>
		</tr>";
		// while($row = mysqli_fetch_array($result)) {
		while($row = $result->fetch_assoc()) {

			echo "<tr>";
			echo "<td>" . $row['gameId'] . "</td>";
			echo "<td>" . $row['owner'] . "</td>";
			echo "<td>" . $row['date'] . "</td>";
			// echo "<td>" . $row['date'] . "</td>";
			// echo "<td>" . $row['date'] . "</td>";
			echo "</tr>";
		}
		echo "</table>";
	}
		
	}else if ($action == "test"){
		echo "nothing happened";
	}
	
	$conn->close();
?>
 
 </body>
</html>