<?php 

header('Content-type: application/json');

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";

$result = "<p>No result.</p>";
switch($_GET['action']) {
	case "preview":
		if(isset($_GET['url']) && isset($_GET['sid']) && extract_vid($_GET['url'])!=0) {
			$result = get_embed($_GET['url'],$_GET['sid'],300,225);
		} else {
			$result = "<p>please send me a video link!</p>";
		}
		$return['embed'] = $result;
		break;
}

echo json_encode($return);

?>
