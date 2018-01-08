<?php

	/**
	* Make sure you started your'e sessions!
	* You need to include su.inc.php to make SimpleUsers Work
	* After that, create an instance of SimpleUsers and your'e all set!
	*/
	session_start();
	require_once(realpath(__DIR__ . '/..')."/SimpleUsers/su.inc.php");


	$SimpleUsers = new SimpleUsers();

	// Validation of input
	if ((isset ($_GET["username"]) and isset ($_GET["password"])))
	{
		if( empty($_GET["username"]) || empty($_GET["password"]) ){
			$error = "You have to choose a username and a password";
			echo $error;
			
		}
		else
		{
			// Both fields have input - now try to create the user.
			// If $res is (bool)false, the username is already taken.
			// Otherwise, the user has been added, and we can redirect to some other page.
			$res = $SimpleUsers->createUser($_GET["username"], $_GET["password"]);

			if(!$res){
				$error = "Username already taken.";
				echo $error;
			}
			else
			{
					//header("Location: users.php");
					// $error = "user: ".$_GET["username"]."registered successfully.";
					$error = "Registered successfully! (please log in)";
					echo $error;
					exit;
			}
		}

	} // Validation end
	
?>