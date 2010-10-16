<?php

$u = $_GET['u'];
$t = $_GET['t'];

?>

<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <title>clippFeed - <?php echo $t; ?></title>
</head>
<body>

<div id="sharer">
    <label for="new_url">New URL</label>
    <input id="new_url" name="url" type="text" value="<?php echo $u; ?>" />
    <div id="new_url_preview">
        hello
    </div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script>!window.jQuery && document.write('<script src="js/jquery-1.4.2.min.js"><\/script>')</script>
<script src="js/jquery-effects-core.min.js"></script>
<script src="js/preview.js"></script>

</body>
</html>