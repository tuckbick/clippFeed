<?php

require_once 'apis/facebook-php-sdk/src/facebook.php';
require_once 'fb_funcs.php';

// Create our Application instance.
$facebook = new Facebook(array(
  'appId'  => '148596221850855',
  'secret' => '25ba671ee41108618fe7b6003e132688',
  'cookie' => true
));

$u = $_GET['u'];
$t = $_GET['t'];

$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
?>

<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <title>clippFeed - <?php echo $t; ?></title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script>!window.jQuery && document.write('<script src="js/jquery-1.4.2.min.js"><\/script>')</script>
  <script src="js/jquery-effects-core.min.js"></script>
  <script src="js/plugins.js?v=1"></script>
  <script src="js/script.js?v=1"></script>
</head>
<body>
		<div id="login" style="float:right;">
        <?php if ($cookies) { ?>
      	<span style="padding:10px;">Logged in as <fb:name uid="<?php echo $cookies['uid']; ?>" useyou="false"></fb:name></span><fb:profile-pic uid="<?php echo $cookies['uid']; ?>" size="q"></fb:profile-pic>
   		<?php } else { ?>
      	<fb:login-button></fb:login-button>
    	<?php } ?>
    	</div>
<div id="fb-root"></div>
<script src="http://connect.facebook.net/en_US/all.js"></script>
  <script>
      FB.init({appId: '148596221850855', status: true, cookie: true, xfbml: true});
      FB.Event.subscribe('auth.login', function(response) {
        window.location.reload();
      });
  </script>
<div id="sharer">
    <form id="add_clip">
        <label for="new_url">New URL</label>
        <input id="new_url" name="url" type="text" value="<?php echo $u; ?>" />
        <input type="submit" id="add_submit" value="Add" />
    </form>
    <div id="new_url_preview"></div>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script>!window.jQuery && document.write('<script src="js/jquery-1.4.2.min.js"><\/script>')</script>
<script src="js/jquery-effects-core.min.js"></script>
<script src="js/preview.js"></script>
</body>
</html>