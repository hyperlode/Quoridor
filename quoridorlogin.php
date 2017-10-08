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
		echo "logged in user: " . $SimpleUsers->userdata["uUsername"] . " - last activity was at " . $SimpleUsers->userdata["uActivity"] ."<br>"; 
		exit;
	}
	
	if (isset ($_GET["username"]) and isset ($_GET["password"])){
		// Attempt to login the user - if credentials are valid, it returns the users id, otherwise (bool)false.
		$res = $SimpleUsers->loginUser($_GET["username"], $_GET["password"]);
		if(!$res){
			$error = "Wrong username-password combination.";
			echo $error;
		}
		else
		{
				//header("Location: users.php");
				echo "Logged in successfully!";
				// $userNumber = $res;
				
				exit;
		}
	}
	
	//} // Validation end

?>

