<?php 

header('Content-type: application/json');

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";
include_once "fb_funcs.php";

$result = "";

$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");

switch($_GET['action']) {
	case "preview":
		if(isset($_GET['url']) && isset($_GET['sid']) && extract_vid($_GET['url'],$_GET['sid'])!='0') {
			$result = get_embed($_GET['url'],$_GET['sid'],630,467);
		} else {
			$result = "";
		}
		$return['embed'] = $result;
		break;
	case "spreview":
		if(isset($_GET['url']) && isset($_GET['sid']) && extract_vid($_GET['url'],$_GET['sid'])!='0') {
			$result = get_embed($_GET['url'],$_GET['sid'],405,300);
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
	case "delete":
		if(isset($_GET['cid'])) {
			$return['success'] = delete_clip($cookies,$_GET['cid']);
		} else {
			$return['success'] = false;
		}
		break;
	case "getFeed":
		if($cookies && isset($_GET['arg']) && isset($_GET['page'])) {
			$return = get_feed($cookies,$_GET['arg'],$_GET['page']);
		} else {
			print_r();
			$return[0] = "You don't seem to have any results.";
		}
		break;
	case "getClipEmbed":
		if(isset($_GET['cid'])) {
			$c = get_clip($_GET['cid']);
			$return['embed'] = get_embed($c['s_url'].$c['vid'],$c['sid'],630,467);
		} else {
			$return['embed'] = "<p>Please select a valid video!</p>";
		}
		break;
	case "search":
		if(isset($_GET['term'])) {
			$return = get_search($cookies,$_GET['term']);
		}
		break;
	default:
		$return = "";
		break;
}

echo json_encode($return);

?>
