<?php
	function con(){

		//Connect To Database
//		$hostname='p50mysql273.secureserver.net';
//		$hostname='tuckbick.db.3318765.hostedresource.com';
		$hostname='localhost';
		$username='tuckbick_truax11';
		$password='N0acc355';
		$dbname='tuckbick_misc';

		$con = mysql_connect($hostname,$username, $password) OR DIE ('Unable to connect to database! Please try again later.');
		mysql_select_db($dbname);
		
		return $con;

	}
	
	function discon($connection) {
		
		return mysql_close($connection);
		
	}
  
?>