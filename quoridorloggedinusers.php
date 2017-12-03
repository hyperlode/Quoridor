<?php

	/**
	* Make sure you started your sessions!
	* You need to include su.inc.php to make SimpleUsers Work
	* After that, create an instance of SimpleUsers and you're all set!
	*/

	session_start();
	//echo realpath(__DIR__ . '/..')."/SimpleUsers/su.inc.php";
	// $upOne = realpath(__DIR__ . '/..');
	// require_once(dirname(__FILE__)."../SimpleUsers/su.inc.php");
	require_once(realpath(__DIR__ . '/..')."/SimpleUsers/su.inc.php");

	$SimpleUsers = new SimpleUsers();
	$users = $SimpleUsers->getUsers();
	// $loggedInUserNames = array();
	// foreach ($SimpleUsers->userdata as $key => $value)
    foreach ($users as $user)
	{
		// if( $SimpleUsers->logged_in ) {
		   // array_push( $SimpleUsers->userdata["uUsername"]);
		   echo $user["uUsername"];
		   echo ",";
		   echo $user["userId"];
		   echo ",";
		   
		   // echo "<br>";
			// exit;
		// }
		//else{
		//	echo 0;
		//	exit;
		//}
	}
	
	echo "efef";
	
?>