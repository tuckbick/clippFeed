<?php

require_once 'functions2.inc';
require_once 'fb_funcs.php';
require_once 'connect.php';
require_once 'apis/facebook-php-sdk/src/facebook.php';

function get_feed($cookies,$order="ORDER BY c_cid_uid.time_posted DESC",$page=0,$perpage=15) {
	if($cookies) {
		$count = get_count('c_cid_uid','uid='.$cookies['uid']);
		$con = con();
		$query = 'SELECT * FROM c_cid_uid
			INNER JOIN c_clips ON c_cid_uid.cid = c_clips.cid
			WHERE c_cid_uid.uid = '.$cookies['uid'].' '.$order.' LIMIT 15 OFFSET '.($page*$perpage);
		$result = mysql_query($query);
		discon($con);
		while($row = mysql_fetch_assoc($result)) {
			$return[$row['cid']] = $row;
		}
		if(sizeof($return)==0) {
			$return[0] = "You don't seem to have any clips yet! Why don't you add some by using our handy bookmarklet or by copy and pasting any video's url in the box to the right?";
		}
		if($page != 0) {
			array_push($return,'prev');
		}
		if(sizeof($return)<$count && $page<(floor(($count-1)/$perpage))) {
			array_push($return,'next');
		}
	} else {
		$return[0] = "You don't seem to be logged in! Click the Facebook \"Login\" button on the right to start clippFeeding!";
	}
	return $return;
}

function get_cid($url) {
	$con = con();
	$query = 'SELECT * FROM `c_clips` WHERE c_url="'.$url.'" LIMIT 1';
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
		WHERE cid='.$cid.' '.$limit;
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$return = $row;
	}
	discon($con);
	return $return;
}

function get_video($url,$width=630) {
	$video = file_get_contents("http://api.embed.ly/v1/api/oembed?url=".$url."&maxwidth=600");
	return json_decode($video);
}

function get_count($table, $param, $distinct=false) {
	$con = con();
	if($distinct==true) {
		$query = "SELECT DISTINCT ".$param." FROM ".$table;
	} else {
		$query = "SELECT COUNT(*) FROM ".$table." WHERE ".$param;
	}
	$result = mysql_query($query);
	$row = mysql_fetch_array($result) or die(mysql_error());
	if($distinct == true) {
		$row['COUNT(*)'] = mysql_num_rows($result);
	}
	discon($con);
	return $row['COUNT(*)'];
}

function get_search($cookies,$term) {
	if($term=='') {
		$ret = get_feed($cookies,"ORDER BY c_cid_uid.time_posted DESC",0,15);
	} else {
		$con = con();
		$query = "SELECT * FROM c_clips 
				INNER JOIN c_cid_uid ON c_cid_uid.cid=c_clips.cid 
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

function add_clip($url,$time=0) {
	$video = get_video($url);
	$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
	if($time==0) {
		$time = time();
	}
	if($cookies) {
		if(get_count("c_clips","c_url='".$video->url."'")<1) {
			$con = con();
			$query = 'INSERT INTO c_clips (`c_title`,`c_desc`,`c_url`) VALUES ("'.utf8_encode(addslashes($video->title)).'","'.utf8_encode(addslashes($video->description)).'","'.$url.'")'; 
			$result = mysql_query($query);
			discon($con);
			if($result) {
				add_assoc_uid($url,$cookies,date('Y-m-d H:i:s',$time));
			} else {
				echo $query;
			}
		} else {
			$result = add_assoc_uid($video['url'],$cookies,date('Y-m-d H:i:s',$time));
		}
	} else {
		$result = false;
	}
	return $result;
}

function add_assoc_uid($url,$cookies,$time) {
	$cid = get_cid($url);
	if(get_count("c_cid_uid","cid=".$cid." AND uid=".$cookies['uid'])<1) {
		$result = true;
		$con = con();
		$query = "INSERT INTO `c_cid_uid` (`cid`,`uid`,`time_posted`) VALUES (".$cid.",".$cookies["uid"].",'".$time."')";
		$result = mysql_query($query);
		discon($con);
	} else {
		$result = false;
	}
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

function eliminate_duplicates($table) {
	echo "RUNNING eliminate_duplicates on ".$table."...<br />";
	$con = con();
	$q1 = "CREATE TABLE temp_".$table." LIKE ".$table.";";
	$q2 = "INSERT INTO temp_".$table." SELECT DISTINCT * FROM ".$table.";";
	$q3 = "DROP TABLE ".$table.";";
	$q4 = "RENAME TABLE temp_".$table." TO ".$table.";";
	echo "running ".$q1."... ";
	$r1 = mysql_query($q1);
	if($r1) {
		echo "success!<br />running ".$q2."... ";
	   $r2 = mysql_query($q2);
	   if($r2) {
	   	  echo "success!<br />running ".$q3." and ".$q4;
	      $r3 = mysql_query($q3);
	      $r4 = mysql_query($q4);
	   }
	}
	return "<br />".$r4;
	discon($con);
}

function garbage_collection($t1,$t2,$p) {
	echo "RUNNING garbage_collection on ".$t1."/".$t2.":".$p."...<br />";
	//checks if there is an instance of $t1 in $t2 of parameter $p, removes those that aren't in there
	$con = con();
	$q1 = "CREATE TABLE temp_".$t1." LIKE ".$t1.";";
	$q2 = "INSERT INTO temp_".$t1." SELECT * FROM ".$t1." WHERE ".$p." IN (SELECT DISTINCT ".$p." FROM ".$t2.");";
	$q3 = "DROP TABLE ".$t1.";";
	$q4 = "RENAME TABLE temp_".$t1." TO ".$t1.";";
	echo "running ".$q1."... ";
	$r1 = mysql_query($q1);
	if($r1) {
		echo "success!<br />running ".$q2."... ";
	   $r2 = mysql_query($q2);
	   if($r2) {
	   	  echo "success!<br />running ".$q3." and ".$q4;
	      $r3 = mysql_query($q3);
	      $r4 = mysql_query($q4);
	   }
	}
	return "<br />".$r4;
	discon($con);
}

?>
