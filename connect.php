<?php
		function con(){

		//Connect To Database
		$hostname='66.117.14.32';
		$username='paulma6';
		$password='2011pjm!';
		$dbname='paulma6_portfolio';

		$con = mysql_connect($hostname,$username, $password) OR DIE ('Unable to connect to database! Please try again later.');
		mysql_select_db($dbname);
		
		//return $con;
		return $con;

	}
	
	function discon($connection) {
		
		return mysql_close($connection);
		
	}
  
?>