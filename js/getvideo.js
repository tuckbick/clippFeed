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
function addFacebookLinkVids() {
    $fb = $('#addFacebookVids');
	$fb.html('working...');
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'addFacebookLinkVids'
		},
		success: function( data ) {
			$fb.html('done! '+ data.count + " videos were added from your Facebook.");
			populateFeed("ORDER BY c_clips.c_ts_added DESC",0);
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
            populateFeed("ORDER BY c_clips.c_ts_added DESC",0);
		}
	});
	return false;
}
function populateFeed(arg,page) {
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'getFeed',
			arg: arg,
			page: page
		},
		success: function( data ) {
            var ret = ['<h3>My Videos  <span class="source">(' + data.size + ')</span></h3><ul>'];
            if(data[0]!="You don't seem to have any results.") {
           		for(var i in data['results']) {
           			if(data.results[i].cid) {
                		ret.push( '<li><a href="javascript:getVideo('+ data.results[i].cid +')">'+ data.results[i].c_title +'</a><span class="source">'+ data.results[i].serv_name +'</span></li>' );
                	} else {
                		var inc = 1;
                		if(data.results[i]==="prev") {
                			inc = -1;
                		}
                		inc = page + inc; 
                		ret.push( '<li style="float:left;"><a href="javascript:populateFeed(\'' + arg + '\',' + inc + ')">'+data.results[i]+'</a>   </li>' );
                	}
            	}
            } else {
            	ret.push( '<li><em>Welcome to <strong>clippFeed</strong>! This is a site where you can organize and share links to your favorite videos from across the web. To see us in action, login and add some videos!</em></li>' );
            }
            ret.push( '<ul>' );
            $leftbar.html(ret.join(''));
		},
		error: function() {
		}
	});
}