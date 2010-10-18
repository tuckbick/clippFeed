<?php

function get_facebook_cookie($app_id, $application_secret) {
  $args = array();
  if(isset($_COOKIE['fbs_' . $app_id])) {
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
   else {
      return null;
   }
}

function fql($q,$format="") {

	$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
	if($cookies) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://api.facebook.com/method/fql.query');
		if(format!="") {
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'access_token='.$cookies['access_token'].'&query='.$q.'&format='.$format);
		} else {
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'access_token='.$cookies['access_token'].'&query='.$q);
		}
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_COOKIEJAR, "my_cookies.txt");
		curl_setopt($ch, CURLOPT_COOKIEFILE, "my_cookies.txt");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3");
		$response = curl_exec($ch);
		curl_close($ch);
		return $response;
	} else {
		return false;
	}

}



?>