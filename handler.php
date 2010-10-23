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
		if(isset($_GET['url'])) {
			$video = get_video($_GET['url'],630);
			$result = $video['embed'];
		} else {
			$result = "";
		}
		$return['embed'] = $result;
		break;
	case "spreview":
		if(isset($_GET['url'])) {
			$video = get_video($_GET['url'],405);
			$result = $video['embed'];
		} else {
			$result = "";
		}
		$return['embed'] = $result;
		break;
	case "add":
		if(isset($_GET['url'])) {
			$return['success'] = add_clip($_GET['url']);
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
		$sql_args = array("ORDER BY c_cid_uid.time_posted DESC");
		if($cookies && isset($_GET['arg']) && isset($_GET['page'])) {
			$return['results'] = get_feed($cookies,$sql_args[$_GET['arg']],$_GET['page']);
			foreach($return['results'] as $clip) {
				$clip['title'] = stripslashes(utf8_decode($clip['title']));
				$clip['description'] = stripslashes(utf8_decode($clip['description']));
			}
			$return['size'] = get_count('c_cid_uid', 'uid='.$cookies['uid']);
		} else {
 			$return[0] = "haha.";
		}
		break;
	case "getClipEmbed":
		if(isset($_GET['cid'])) {
			$c = get_clip($_GET['cid']);
			$video = get_video($c['c_url']);
			if(isset($video->embed)) {
				$return['html'] = $video->embed;
			} else {
				$return['html'] = $video->html;
			}
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
			if(get_video($url)) {
				$add = add_clip($link->url,$link->created_time);
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
