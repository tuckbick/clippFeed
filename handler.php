<?php 

header('Content-type: application/json');

include_once "functions.inc";

$result = "";

$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");

switch($_GET['action']) {
	case "pageLoad":
		$return['footer'] = get_count('c_cid_uid','uid',true).' users and counting!';
		break;
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
			$return['results'] = get_feed($cookies,$_GET['arg'],$_GET['page']);
			foreach($return['results'] as $clip) {
				$clip['title'] = stripslashes(utf8_decode($clip['title']));
				$clip['description'] = stripslashes(utf8_decode($clip['description']));
			}
			$return['size'] = get_count('c_cid_uid', 'uid='.$cookies['uid']);
		} else {
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
	case "addFacebookLinkVids":
		$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
		$result = json_decode(fql('SELECT url, created_time FROM link WHERE owner='.$cookies['uid'],'json'));
		$vids = array();
		$count = 0;
		foreach($result as $link) {
			$sid = get_sid($link->url);
			if($sid!=-1 && extract_vid($link->url,$sid)!='0') {
				$add = add_clip(extract_vid($link->url,$sid),$sid,$link->created_time);
				if($add) {
					$count++;
				}
			}
		}
		$return['count'] = $count;
		break;
	default:
		$return = "";
		break;
}

echo json_encode($return);

?>
