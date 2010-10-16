<?php

include_once "connect.php";

echo "hello world!<br />";
$con = con();
$query = "SELECT * FROM `c_servs`";
$result = mysql_query($query);
while($row = mysql_fetch_assoc($result)) {
	echo $row['serv_name']."<br />";
}



?>