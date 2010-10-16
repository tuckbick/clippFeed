<?php 

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";

$result = "<p>No result.</p>";
switch($_GET['action']) {
	case "preview":
		if(isset($_GET['vid'])&&isset($_GET['sid'])) {
			$result = get_embed($_GET['vid'],$_GET['sid'],300,225);
		} else {
			$result = "<p>please send me a video link!</p>";
		}
		break;
}

?>
