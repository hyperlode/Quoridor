<?php

	/**
	* Make sure you started your sessions!
	* You need to include su.inc.php to make SimpleUsers Work
	* After that, create an instance of SimpleUsers and you're all set!
	*/

	session_start();
	require_once(realpath(__DIR__ . '/..')."/SimpleUsers/su.inc.php");

	$SimpleUsers = new SimpleUsers();
	
	if( $SimpleUsers->logged_in ) {
        echo "A user is already logged in here.<br>"; 
		//echo "logged in user: " . $SimpleUsers->userdata["uUsername"] . " - last activity was at " . $SimpleUsers->userdata["uActivity"] ."<br>"; 
		echo $SimpleUsers->userdata["userId"];
		exit;
	}
	
	if (isset ($_GET["username"]) and isset ($_GET["password"])){
		// Attempt to login the user - if credentials are valid, it returns the users id, otherwise (bool)false.
		$res = $SimpleUsers->loginUser($_GET["username"], $_GET["password"]);
		
		//$res is false if fail, userId when ok!
		if(!$res){
			//fail...
			$error = "Wrong username-password combination.";
			echo $error;
		}
		else
		{
			//success!

				//header("Location: users.php");
				echo "Logged in successfully!";
				// $userNumber = $res;
				echo $res;
				//echo "".$SimpleUsers->userdata["userId"].",".$SimpleUsers->userdata["uUsername"];
				//echo "eije";
				//outputUserData();
				exit;
		}
	}
	
	//} // Validation end
//	function outputUserData(){
	//	//echo $SimpleUsers->userdata["userId"];
//		echo $SimpleUsers;
//	}
?>