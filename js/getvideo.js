function getVideo(cid) {
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'getClipEmbed',
			cid: cid
		},
		success: function( data ) {
		    _cid = cid;
			$clipembed.fadeOut(300,function(){$(this).html(data.embed).delay(100).fadeIn(300, function(){$delete_video.fadeOut(300)})})
		}
	});	
}
function deleteVideo() {
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'delete',
			cid: _cid
		},
		success: function( data ) {
    		$delete_video.fadeOut(300)
			$preview.fadeOut(300,function(){$(this).html('');$url.val('');});
            setTimeout(populateFeed,1000);
		}
	});
	return false;
}
function populateFeed() {
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'getFeed'
		},
		success: function( data ) {
            var ret = ['<h3>My Videos</h3><ul>'];
            for(var i in data) {
                ret.push( '<li><a href="javascript:getVideo('+ data[i].cid +')">'+ data[i].c_title +'</a><span class="source">'+ data[i].serv_name +'</span></li>' );
            }
            ret.push( '<ul>' );
            $leftbar.html(ret.join(''));
		},
		error: function() {
		}
	});
}