<?php
include 'layout.php';

$u = isset($_GET['u'])?$_GET['u']:'paste a URL of a video and click add';

startblock('content'); 
?>

<div id="home">
	<div id="left_bar">
		loading...
	</div>
	<div id="middle">
        <form id="add_clip">
        	<label class="visuallyhidden" for="new_url">New Video URL</label>
            <input id="new_url" name="url" type="text" value="<?php echo $u ?>" />
            <input type="submit" id="add_submit" value="Add" />
        </form>
        <div id="new_url_preview"></div>
    </div>
</div>

<?php endblock();

startblock('scriptTag'); ?>
    <script src="js/preview.js"></script>
<?php endblock(); 

startblock('readyScript'); ?>
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'getFeed',
			uid: 0
		},
		success: function( data ) {
		
			var ret ='<ul>';
			for(var i in data) {
				ret += '<li><a href="javascript:getVideo('+ data[i].cid +')">'+ data[i].c_title +'</a></li>';
			}
			ret += "<ul>";
			$('#left_bar').html(ret);
		}
	});
	
<?php
endblock();
?>