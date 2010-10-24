<?php
// Awesome Facebook Application
// 
// Name: clippFeed
// 


ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', dirname(__FILE__) . '/error_log.txt');
error_reporting(E_ALL);

header('HTTP/1.1 200 OK');
header('Expires: '.gmdate("D, d M Y H:i:s", time() + 604800 ).' GMT');

// gzip
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) ob_start("ob_gzhandler"); else ob_start();
require_once '../ti.php';
require_once '../apis/facebook-php-sdk/src/facebook.php';
require_once '../fb_funcs.php';

// Create our Application instance.
$facebook = new Facebook(array(
  'appId'  => '148596221850855',
  'secret' => '25ba671ee41108618fe7b6003e132688',
  'cookie' => true,
));

blockbase();

$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");

$u = isset($_GET['u'])?$_GET['u']:'paste a URL of a video and click add';

?>
<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <!--[if IE]><![endif]-->

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>clippFeed - <?php echo $u; ?></title>
  <link rel="stylesheet" href="css/style.css?v=1">

</head>
<body class="s">

  <div id="scontainer">
        <div id="login" style="float:right;">
        <?php if ($cookies) { ?>
            <fb:profile-pic uid="<?php echo $cookies['uid']; ?>" size="q"></fb:profile-pic>
        <?php } else { ?>
            <fb:login-button></fb:login-button>
        <?php } ?>
        </div>

    <div id="smain">
        <div id="home">
            <div id="smiddle">
                <form id="sadd_clip">
                    <label class="visuallyhidden" for="new_url">New Video URL</label>
                    <input id="new_url" name="url" type="text" value="<?php echo $u ?>" />
                    <input type="submit" id="add_submit" value="Add" />
                </form>
                <div id="new_url_preview"></div>
                <div id="clip_embed"></div>
            </div>
        </div>
    </div>

  </div> <!-- end of #container -->
  <div id="fb-root"></div>
  <script src="js/LAB.min.js"></script>
  <script>
    $LAB
        .script("http://connect.facebook.net/en_US/all.js")
        .script("http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js").wait()
        .script("js/bm.js")
        .script("js/jquery.embedly.min.js?v=1")
  </script>
  <!--<script src="js/jquery-effects-core.min.js"></script>-->

  <script>
   var _gaq = [['_setAccount', 'UA-6013405-1'], ['_trackPageview']]; 
   (function(d, t) {
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.async = true; g.src = '//www.google-analytics.com/ga.js'; s.parentNode.insertBefore(g, s);
   })(document, 'script');
  </script>
  
</body>
</html>