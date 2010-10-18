<?php

require_once 'functions2.inc';
require_once 'fb_funcs.php';
require_once 'connect.php';
require_once 'apis/facebook-php-sdk/src/facebook.php';
$clientLibraryPath = 'apis/gdata/library';
$oldPath = set_include_path(get_include_path() . PATH_SEPARATOR . $clientLibraryPath);
require_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Gdata_YouTube');

function get_feed($cookies,$order="ORDER BY c_clips.c_ts_added DESC",$page=0,$perpage=15) {
	if($cookies) {
		$count = get_count('c_cid_uid','uid='.$cookies['uid']);
		$con = con();
		$query = 'SELECT * FROM c_cid_uid
			INNER JOIN c_clips ON c_cid_uid.cid = c_clips.cid
			INNER JOIN c_servs ON c_clips.sid = c_servs.sid 
			WHERE c_cid_uid.uid = '.$cookies['uid'].' '.$order.' LIMIT 15 OFFSET '.($page*$perpage);
		$result = mysql_query($query);
		discon($con);
		while($row = mysql_fetch_assoc($result)) {
			$return[$row['cid']] = $row;
		}
		if(sizeof($return)==0) {
			$return[0] = "You don't seem to have any results.";
		} 
		if($page != 0) {
			array_push($return,'prev');
		}
		if(sizeof($return)<$count && $page<(floor(($count+1)/$perpage)-1)) {
			array_push($return,'next');
		}
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

function get_sid($url) {
	$exps = array('/youtube.com\/watch\?(?=.*v=\w+)(?:\S+)+/','/vimeo.com(\/|\/clip:)(\d+)(.*?)/');
	for($i=0;$i<sizeof($exps);$i++) {
        if (preg_match($exps[$i],$url)) {
        	return $i;
        }
    }
    return -1;
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
			
			try {
				$v_obj = $yt->getVideoEntry($vid);
				if($v_obj->isVideoPrivate()==false && $v_obj->isVideoEmbeddable()==true) {
					$video['title'] = htmlentities($v_obj->getVideoTitle());
					$video['desc'] = htmlentities($v_obj->getVideoDescription());
					$video['private'] = 0;
				} else {
					$video['private'] = 1;
				}
			} catch(Zend_Gdata_App_HttpException $e) {
				$video['private'] = 1;
			}
			break;
		case 1:
			$vim = unserialize(file_get_contents("http://vimeo.com/api/v2/video/".$vid.".php"));
			$video['desc'] = htmlentities($vim[0]['description']);
			$video['title'] = htmlentities($vim[0]['title']);
			$video['private'] = 0;
			break;
	}
	return $video;
}

function get_count($table, $param) {
	$con = con();
	$query = "SELECT COUNT(*) FROM ".$table." WHERE ".$param;
	$result = mysql_query($query);
	$row = mysql_fetch_array($result) or die(mysql_error());
	discon($con);
	return $row['COUNT(*)'];
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
		if(get_count("c_clips","vid='".$vid."'")<1) {
			$con = con();
			$video = get_video($vid,$sid);
			if($video['private'] != 1) {
				$query = 'INSERT INTO c_clips (`vid`,`c_title`,`c_desc`,`sid`) VALUES ("'.$vid.'","'.$video['title'].'","'.$video['desc'].'",'.$sid.')'; 
				$result = mysql_query($query);
			} else {
				return false;
			}
			discon($con);
			if($result) {
				add_assoc_uid($vid,$cookies);
			} else {
				echo $query;
			}
		} else {
			$result = add_assoc_uid($vid,$cookies);
		}
	} else {
		$result = false;
	}
	return $result;
}

function add_assoc_uid($vid,$cookies) {
	$cid = get_cid($vid);
	if(get_count("c_cid_uid","cid=".$cid." AND uid=".$cookies['uid'])<1) {
		$result = true;
		$con = con();
		$query = 'INSERT INTO c_cid_uid VALUES ('.$cid.','.$cookies['uid'].')';
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