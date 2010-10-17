<?php

include_once 'functions2.inc';
include_once 'fb_funcs.php';
$clientLibraryPath = 'apis/gdata/library';
$oldPath = set_include_path(get_include_path() . PATH_SEPARATOR . $clientLibraryPath);
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_YouTube');

function get_feed($cookies,$order="ORDER BY c_clips.c_ts_added DESC",$page=0,$perpage=15) {
	if($cookies) {
		$con = con();
		$count = get_count('c_cid_uid','uid='.$cookies['uid']);
		$query = 'SELECT * FROM c_cid_uid
			INNER JOIN c_clips ON c_cid_uid.cid = c_clips.cid
			INNER JOIN c_servs ON c_clips.sid = c_servs.sid 
			WHERE c_cid_uid.uid = '.$cookies['uid'].' '.$order.' LIMIT 15 OFFSET '.($page*$perpage);
		$result = mysql_query($query);
		while($row = mysql_fetch_assoc($result)) {
			$return[$row['cid']] = $row;
		}
		if(sizeof($return)==0) {
			$return[0] = "You don't seem to have any results.";
		} 
		if($page!=0) {
			array_push($return,'<a href="javascript:populateFeed(' . $arg . ','. $page-1 .')"><< prev</a>');
		}
		if(sizeof($return)<get_count("c_cid_uid",'uid = '.$cookies['uid'])) {
			array_push($return,'<a href="javascript:populateFeed(' . $arg . ','. $page+1 .')">next >></a>');
		}
		discon($con);
	} else {
		$return[0] = "You don't seem to have any results.";
	}
	return $return;
}

function get_embed($url,$sid,$width,$height) {
	$return = '';
	$vid = extract_vid($url,$sid);
	switch($sid) {
		case 0:
			$return .= '<object width="'.$width.'" height="'.$width.'"><param name="movie" value="http://www.youtube.com/v/'.$vid.'?fs=1&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'.$vid.'?fs=1&amp;hl=en_US" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'.$width.'" height="'.$height.'"></embed></object>';
			break;
		case 1:
			$return .= '<iframe src="http://player.vimeo.com/video/'.$vid.'?color=ffffff" width="'.$width.'" height="'.$height.'" frameborder="0"></iframe>';
			break;
	}
	return $return;
}

function get_cid($vid) {
	$con = con();
	$query = 'SELECT * FROM `c_clips` WHERE vid="'.$vid.'" LIMIT 1';
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$return = $row['cid'];
	}
	discon($con);
	return $return;
}

function get_clip($cid,$limit="LIMIT 1") {
	$con = con();
	$query = 'SELECT * FROM c_clips 
		INNER JOIN c_servs ON c_clips.sid = c_servs.sid 
		WHERE cid='.$cid.' '.$limit;
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$return = $row;
	}
	discon($con);
	return $return;
}

function get_video($vid,$sid) {
	switch($sid) {
		case 0:
			$yt = new Zend_Gdata_YouTube();
			$v_obj = $yt->getVideoEntry($vid);
			$video['title'] = addslashes($v_obj->getVideoTitle());
			$video['desc'] = addslashes($v_obj->getVideoDescription());
			break;
		case 1:
			$vim = unserialize(file_get_contents("http://vimeo.com/api/v2/video/".$vid.".php"));
			$video['desc'] = addslashes($vim[0]['description']);
			$video['title'] = addslashes($vim[0]['title']);
			break;
	}
	return $video;
}

function get_count($table, $param) {
	$query = "SELECT COUNT(*) ON ".$table." WHERE ".$param;
	$result = mysql_query($query);
	return $result;
}

function get_search($cookies,$term) {
	if($term=='') {
		$ret = get_feed($cookies,"ORDER BY c_clips.c_ts_added DESC",0,15);
	} else {
		$con = con();
		$query = "SELECT * FROM c_clips 
				INNER JOIN c_cid_uid ON c_cid_uid.cid=c_clips.cid 
				INNER JOIN c_servs ON c_servs.sid=c_clips.sid 
				WHERE CONCAT(c_clips.c_title, ' ', c_clips.c_desc) LIKE '%".$term."%'";
		if($cookies) { $query .= " AND c_cid_uid.uid=".$cookies['uid']; }
		$query .= ' LIMIT 15';
		$result = mysql_query($query);
		$ret = array();
		discon($con);
		while($row = mysql_fetch_assoc($result)) {
			array_push($ret,$row);
		}
	}
	return $ret;
}

function add_clip($vid,$sid) {
	$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
	if($cookies) {
		$con = con();
		$video = get_video($vid,$sid);
		$query = 'INSERT INTO c_clips (`vid`,`c_title`,`c_desc`,`sid`) VALUES ("'.$vid.'","'.$video['title'].'","'.$video['desc'].'",'.$sid.')'; 
		$result = mysql_query($query);
		discon($con);
		if($result) {
			add_assoc_uid($vid,$cookies);
		}
	} else {
		$result = false;
	}
	return $result;
}

function add_assoc_uid($vid,$cookies) {
	$cid = get_cid($vid);
	$con = con();
	$query = 'INSERT INTO c_cid_uid (`cid`,`uid`) VALUES ('.$cid.','.$cookies['uid'].');';
	$result = mysql_query($query);
	discon($con);
	return $result;
}

function delete_clip($cookies,$cid) {
	if($cookies) {
		$con = con();
		$query = "DELETE FROM c_cid_uid WHERE cid=".$cid." AND uid=".$cookies['uid'];
		$result = mysql_query($query);
		discon($con);
	} else {
		$result = false;
	}
	return $result;
}

/*function here($vid) {
	$query = "SELECT * FROM c_clips WHERE vid='".$vid."'";
	$result = mysql_query($query);
	if(mysql_num_rows($result)!=0) {
		$return = true;
	} else {
		$return = false;
	}
	return $return;
}*/

?>