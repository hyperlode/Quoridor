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

	if( $SimpleUsers->logged_in ) {
       echo $SimpleUsers->userdata["uUsername"];
	   
		exit;
	}else{
		echo 0;
		exit;
	}

?>