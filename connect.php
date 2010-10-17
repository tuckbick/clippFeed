<?php
		function con(){

		//Connect To Database
		$hostname='localhost';
		$username='XXXXX';
		$password='XXXXX';
		$dbname='XXXXX';

		$con = mysql_connect($hostname,$username, $password) OR DIE ('Unable to connect to database! Please try again later.');
		mysql_select_db($dbname);
		
		return $con;

	}
	
	function discon($connection) {
		
		return mysql_close($connection);
		
	}
  
?>