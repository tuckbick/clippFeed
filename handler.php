<?php 

header('Content-type: application/json');

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";

$result = "<p>No result.</p>";
switch($_GET['action']) {
	case "preview":
		if(isset($_GET['url']) && isset($_GET['sid']) && extract_vid($_GET['url'],$_GET['sid'])!='0') {
			$result = get_embed($_GET['url'],$_GET['sid'],300,225);
		} else {
			$result = "";
		}
		$return['embed'] = $result;
		break;
	case "add":
		if(isset($_GET['url']) && isset($_GET['sid']) && extract_vid($_GET['url'],$_GET['sid'])!='0') {
			$return['success'] = add_clip(extract_vid($_GET['url'],$_GET['sid']),$video['sid']);
		} else {
			$return['success'] = '0';
		}
		break;
}

echo json_encode($return);

?>
