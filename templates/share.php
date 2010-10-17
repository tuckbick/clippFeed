<?php
include 'slayout.php';

$u = isset($_GET['u'])?$_GET['u']:'paste a URL of a video and click add';

startblock('content'); ?>

<div id="home">
    <div id="smiddle">
        <form id="sadd_clip">
            <label class="visuallyhidden" for="new_url">New Video URL</label>
            <input id="new_url" name="url" type="text" value="<?php echo $u ?>" />
            <input type="submit" id="add_submit" value="Add" />
        </form>
        <div id="new_url_preview"></div>
        <div id="sclip_embed"></div>
    </div>
</div>

<?php endblock();

startblock('scriptTag'); ?>
    <script src="js/preview.js"></script>
<?php endblock(); 

startblock('readyScript'); ?>
	populateFeed();
<?php endblock(); ?>