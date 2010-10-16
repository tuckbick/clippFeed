<?php

include_once 'functions2.inc';

function get_facebook_cookie($app_id, $application_secret) {
  $args = array();
  parse_str(trim($_COOKIE['fbs_' . $app_id], '\\"'), $args);
  ksort($args);
  $payload = '';
  foreach ($args as $key => $value) {
    if ($key != 'sig') {
      $payload .= $key . '=' . $value;
    }
  }
  if (md5($payload . $application_secret) != $args['sig']) {
    return null;
  }
  return $args;
}

function get_feed($order="c_clips.c_title ASC") {
	$cookies['uid'] = 1;
	$con = con();
	$query = 'SELECT * FROM c_cid_uid
		INNER JOIN c_clips ON c_cid_uid.cid = c_clips.cid
		INNER JOIN c_servs ON c_clips.sid = c_servs.sid 
		WHERE c_cid_uid.uid = '.$cookies['uid'].' ORDER BY '.$order;
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$return[$row['cid']] = $row;
	}
	discon($con);
	return json_encode($return);
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

function get_clip($cid) {
	$con = con();
	$query = 'SELECT * FROM c_clips 
		INNER JOIN c_servs ON c_clips.sid = c_servs.sid 
		WHERE cid="'.$cid.'" LIMIT 1';
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
			
			break;
		case 1:
			$video = unserialize(file_get_contents("http://vimeo.com/api/v2/video/".$vid.".php"));
			$video['desc'] = $video['video_description'];
			$video['title'] = $video['video_title'];
			break;
	}
	return $video;
}

function add_clip($vid,$sid) {
	$con = con();
	$video = get_video($vid,$sid);
	$query = 'INSERT INTO c_clips (`vid`,`c_title`,`c_desc`,`sid`)
		VALUES ("'.$vid.'","'.$video['title'].'","'.$video['desc'].'",'.$sid.')';
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$return = $row;
	}
	discon($con);
	return $return;
}

?>