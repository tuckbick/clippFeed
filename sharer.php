<?php

$u = $_GET['u'];
$t = $_GET['t'];
include 'templates/layout.php';

startblock('title'); echo $t; endblock();

startblock('content'); ?>
<div id="sharer">
    <label for="new_url">New URL</label>
    <input id="new_url" name="url" type="text" value="<?php echo $u; ?>" />
    <div id="new_url_preview">
        hello
    </div>
</div>
<?php endblock();

startblock('scriptTag'); ?>
    <script src="js/preview.js"></script>
<?php endblock(); ?>