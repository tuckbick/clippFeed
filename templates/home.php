<?php
include 'layout.php';

startblock('content'); 
?>

<div id="home">
	<div id="left_bar" style="float:left; background-color:#fff; height:48em; width:150px; margin-right:5px; padding:10px;">
		loading...
	</div>
	<div class="main" style="width:100%; margin-left:auto; margin-right:auto;">
    <form id="add_clip">
    	<label for="new_url">New Video URL</label>
        <input id="new_url" name="url" size="50" type="text" value="paste a URL of a video and click add" />
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