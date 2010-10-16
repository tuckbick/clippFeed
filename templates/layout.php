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
/*
$pages = array ( 
	'blog' => 'Blog',
	'links' => 'Links',
	'portfolio' => 'Portfolio',
	'contact' => 'Contact'
);

function nav ( $current = 'blog' ) {
	global $pages;
	$html = '<ul>';
	foreach ( $pages as $ascii=>$page ) {
		$class = '';
		if( $ascii == $current) {
			$class = 'class="current"';
		}
		$html .= '<li><a '.$class.' href="'.$ascii.'" rel="prefetch">'.$page.'</a></li>';
	}
	return $html . '</ul>';
}
*/

if(isset($_COOKIE['fbs_148596221850855'])) {
	$cookies = get_facebook_cookie("148596221850855","25ba671ee41108618fe7b6003e132688");
}

?>
<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <!--[if IE]><![endif]-->

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>clippFeed - <?php emptyblock('title') ?></title>
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="css/style.css?v=1">
  <link rel="stylesheet" media="handheld" href="css/handheld.css?v=1">
  <script src="js/modernizr-1.5.min.js"></script>

</head>
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->

  <div id="container">
    <header>
    	<div id="login" style="float:right;">
        <?php if (isset($cookies)) { ?>
      	<span style="padding:10px;">Logged in as <fb:name uid="<?php echo $cookies['uid']; ?>" useyou="false"></fb:name></span><fb:profile-pic uid="<?php echo $cookies['uid']; ?>" size="q"></fb:profile-pic>
   		<?php } else { ?>
      	<fb:login-button></fb:login-button>
    	<?php } ?>
    	</div>
        <h1>clippFeed</h1>
    </header>
    
    <div id="main">
        <?php startblock('content') ?>page left intentionally blank<?php endblock() ?>
    </div>
    
    <footer>

    </footer>
  </div> <!-- end of #container -->
  <div id="fb-root"></div>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script>!window.jQuery && document.write('<script src="js/jquery-1.4.2.min.js"><\/script>')</script>
  <script src="js/jquery-effects-core.min.js"></script>
  <script src="js/plugins.js?v=1"></script>
  <script src="js/script.js?v=1"></script>
  <script src="http://connect.facebook.net/en_US/all.js"></script>
  <script>
  	  $login = $('#login');
      FB.init({appId: '148596221850855', status: true, cookie: true, xfbml: true});
      FB.Event.subscribe('auth.sessionChange', function(response) {
        if (response.session) {
          $.ajax({
				url: 'handler.php',
				dataType: 'json',
				cache: false,
				data: {
					action: 'getUID',
				},
				success: function( data ) {
					$login.html('<span style="padding:10px;">Logged in as <fb:name uid="data.uid" useyou="false"></fb:name></span><fb:profile-pic uid="data.uid" size="q"></fb:profile-pic>');
				}
				});
        } else {
        	 $.ajax({
				url: 'handler.php',
				dataType: 'json',
				cache: false,
				data: {
					action: 'end_session',
				},
				success: function( data ) {
					$login.html('<fb:login-button></fb:login-button>');
				}
				});
        }
      });
  </script>
  <script>
      $(function(){
          <?php emptyblock('script') ?>
      });
  </script>
  <script>
      $(document).ready(function() {
              <?php emptyblock('readyScript') ?>
      });
  </script>

  <!--[if lt IE 7 ]>
    <script src="js/dd_belatedpng.js?v=1"></script>
  <![endif]-->

  <script src="js/profiling/yahoo-profiling.min.js?v=1"></script>
  <script src="js/profiling/config.js?v=1"></script>

  <script>
   var _gaq = [['_setAccount', 'UA-6013405-1'], ['_trackPageview']]; 
   (function(d, t) {
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.async = true; g.src = '//www.google-analytics.com/ga.js'; s.parentNode.insertBefore(g, s);
   })(document, 'script');
  </script>
  
</body>
</html>