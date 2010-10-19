var exps = [
    /youtube.com\/watch\?(?=.*v=\w+)(?:\S+)+/,
    /vimeo.com(\/|\/clip:)(\d+)(.*?)/,
    /video.yahoo.com\/watch\/(.*?)/
    //http://video.google.it/videoplay?docid=3947293349740494460
    ///http:\/\/(www.vimeo|vimeo)\.com(\/|\/clip:)(\d+)(.*?)/,
    //http://purinaanimalallstars.yahoo.com/?v=8380138
    //
],
validate = function( url ) {
    for( var i in exps ) {
        if (url.match(exps[i])) return i;
    }
    return -1;
},
$url = $('#new_url'),
$search = $('#search'),
$preview = $('#clip_embed'),
$spreview = $('#sclip_embed'),
$add = $('#add_clip'),
$sadd = $('#sadd_clip'),
$delete_video = $('#delete_video'),
$leftbar = $('#left_bar'),
$clipembed = $('#clip_embed'),
lastURLTime = 0,
lastSearchTime = 0,
_cid = 0,
stopEvent = function(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
},
SupdatePreview = function() {
	var url = $url.val();
	if( url && url != '' ) {
    	var type = validate( url );
    	if( type != -1 ) {
    		$.ajax({
    			url: 'handler.php',
    			dataType: 'json',
    			cache: false,
    			data: {
    				action: 'spreview',
    				sid: type,
    				url: url
    			},
    			success: function( data ) {
    				if( data.hasOwnProperty('embed') ) {
    					if( data.embed != '' ) {
    					    $spreview.fadeOut(300,function(){$(this).html(data.embed).delay(100).fadeIn(300)});
    					} else {
    						$spreview.fadeOut(300,function(){$(this).html('')});
    					}
    				}
    			},
    			error: function( ) {
    				$spreview.fadeOut(300,function(){$(this).html('')});
    			}
    		});
    	}
	} else {
    	$spreview.fadeOut(300,function(){$(this).html('');$url.val('');});
	}
},
updatePreview = function() {
	var url = $url.val();
	if( url && url != '' ) {
    	var type = validate( url );
    	if( type != -1 ) {
    		$.ajax({
    			url: 'handler.php',
    			dataType: 'json',
    			cache: false,
    			data: {
    				action: 'preview',
    				sid: type,
    				url: url
    			},
    			success: function( data ) {
    				if( data.hasOwnProperty('embed') ) {
    					if( data.embed != '' ) {
    					    $preview.fadeOut(300,function(){$(this).html(data.embed).delay(100).fadeIn(300,function(){$delete_video.fadeIn(400)})});
    					} else {
    					    $delete_video.fadeOut(300)
    						$preview.fadeOut(300,function(){$(this).html('')});
    					}
    				}
    			},
    			error: function( ) {
    				$delete_video.fadeOut(300)
    				$preview.fadeOut(300,function(){$(this).html('')});
    			}
    		});
    	}
	} else {
    	$delete_video.fadeOut(300)
    	$preview.fadeOut(300,function(){$(this).html('');$url.val('');});
	}
},
search = function() {
	FB.getLoginStatus(function(response) {
  		if (response.session) {
			var q = $search.val();
			if( q ) {
				if(q !== '') {
					$.ajax({
						url: 'handler.php',
						dataType: 'json',
						cache: true,
						data: {
							action: 'search',
							term: q
						},
						success: function( data ) {
							var ret = ['<h3>My Videos</h3><ul>'];
							for(var i in data) {
								ret.push( '<li><a href="javascript:getVideo('+ data[i].cid +')">'+ data[i].c_title +'</a><span class="source">'+ data[i].serv_name +'</span></li>' );
							}
							ret.push( '<ul>' );
							$leftbar.html(ret.join(''));
						},
						error: function( ) {
							setTimeout(populateFeed("ORDER BY c_clips.c_ts_added DESC",0),50);
						}
					});
				} else {
					setTimeout(populateFeed("ORDER BY c_cid_uid.time_posted DESC",0),50);
				}
			}
		} else {
			//what to do when not logged in
		}
	});
};
updatePreview();
SupdatePreview();
$url.bind('focusin',function() {
	if($url.val()=='paste a URL of a video and click add') {
		$url.val('');
	}
});
$url.bind('focusout',function() {
	if($url.val()=='') {
		$url.val('paste a URL of a video and click add');
	}
});
$search.bind('focusin',function() {
	if($search.val()=='Search') {
		$search.val('');
	}
});
$search.bind('focusout',function() {
	if($search.val()=='') {
		$search.val('Search');
	}
});
$url.bind('keyup paste', function(e) {
    var newTime = (new Date()).getTime();
    if( newTime - lastURLTime > 500 ) {
        lastURLTime = newTime;
        setTimeout(updatePreview,50);
    }
});
$search.bind('keyup paste', function(e) {
	FB.getLoginStatus(function(response) {
  		if (response.session) {
  			if($search.val() !== '') {
				var newTime = (new Date()).getTime();
				if( newTime - lastSearchTime > 500 ) {
					lastSearchTime = newTime;
					setTimeout(search,50);
				}
			} else {
				setTimeout(populateFeed("ORDER BY c_cid_uid.time_posted DESC",0),50);
			}
		}	
	});
});
$add.submit(function(e) {
	stopEvent(e);
	var url = $url.val(),
	type = validate( url );
	FB.getLoginStatus(function(response) {
  		if (response.session) {
  			if(type !== -1) {
				$preview.hide().html('<img class="loading" src="assets/loading.gif" title="loading..." />').fadeIn('fast');
				$.ajax({
					url:'handler.php',
					dataType:'json',
					cache:'false',
					data: {
						action: 'add',
						sid: type,
						url: url
					},
					success: function( data ) {
						$url.val('');
						$preview.html('<img class="loading" src="assets/done.png" title="done!" />').delay(2000).fadeOut(450,function(){$(this).html('')});
						setTimeout(populateFeed("ORDER BY c_clips.c_ts_added DESC",0),250);
					}
				});
			} else {
				alert('That seems to be an invalid video. Try a different URL!');
			}
  		} else {
  			alert('You must be logged in to do that!');
  			FB.login();
  		}
	});
    return false;
});
$sadd.submit(function(e) {
	stopEvent(e);
	FB.getLoginStatus(function(response) {
		var url = $url.val(),
		type = validate( url );
		if (response.session) {
			if(type !== -1) {
				$spreview.hide().html('<img class="loading" src="assets/loading.gif" title="loading..." />').fadeIn('fast');
				$.ajax({
					url:'handler.php',
					dataType:'json',
					cache:'false',
					data: {
						action: 'add',
						sid: type,
						url: url
					},
					success: function( data ) {
						$url.val('');
						$spreview.html('<img class="loading" src="assets/done.png" title="done!" />').delay(2000).fadeOut(450,function(){$(this).html('')});
						setTimeout(window.close,3000);
					}
				});
				
			} else {
				alert('That seems to be an invalid video. Try a different URL!');
			}
		} else {
			alert('You must be logged in to do that!');
			FB.login();
		}
    });
    return false;
});