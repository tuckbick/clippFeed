<?php
include 'layout.php';

$q = isset($_GET['q'])?$_GET['q']:'Search';
$u = isset($_GET['u'])?$_GET['u']:'paste a URL of a video and click add';

startblock('content'); 
?>

<div id="home">
    <div id="side_area">
        <form id="search_bar">
            <label class="visuallyhidden" for="search">Search</label>
            <input id="search" name="q" type="text" value="<?php echo $q ?>" />
        </form>
        <div id="left_bar">
            loading...
        </div>
    </div>
    <div id="middle">
        <form id="add_clip">
            <label class="visuallyhidden" for="new_url">New Video URL</label>
            <input id="new_url" name="url" type="text" value="<?php echo $u ?>" />
            <input type="submit" id="add_submit" value="Add" />
        </form>
    </div>
</div>

<?php endblock();

startblock('embed'); ?>
    <div id="embed">
        <div id="clip_embed"></div>
        <div id="below">
            <a id="delete_video" href="javascript:deleteVideo()">Delete</a>
        </div>
    </div>
<?php endblock();

startblock('scriptTag'); ?>
    <script src="js/preview.js"></script>
<?php endblock(); 

startblock('readyScript'); ?>
    populateFeed("ORDER BY c_cid_uid.time_posted DESC",0);
    $.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'pageLoad'
		},
		success: function( data ) {
			$('footer').append(data.footer);
		}
	});
<?php
endblock();
?>