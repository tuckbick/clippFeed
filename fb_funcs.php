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



?>