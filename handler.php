<?php 

header('Content-type: application/json');

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";
include_once "fb_funcs.php";

$result = "";
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
			$return['success'] = add_clip(extract_vid($_GET['url'],$_GET['sid']),$_GET['sid']);
		} else {
			$return['success'] = '0';
		}
		break;
	case "getFeed":
		$return = get_feed();
		break;
	case "getUID":
		$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
		if($cookies) {
			$return['uid'] = $cookies['uid'];
		} else {
			$return['uid'] = 0;
		}
		break;
	default:
		$return = "";
		break;
}

echo json_encode($return);

?>
