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
$preview = $('#new_url_preview'),
$form = $('#add_clip'),
lastTime = 0;
$url.bind('keyup paste', function(e) {
    var newTime = (new Date()).getTime();
    if( newTime - lastTime > 500 ) {
        lastTime = newTime;
        var finish = function() {
            var url = $url.val(),
                type = validate( url );
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
                                $preview.slideDown('fast', function(){$preview.html(data.embed);})
                            } else {
                                $preview.html('').delay(20).slideUp('fast');
                            }
                        }
                    },
                    error: function( ) {
                        $preview.html('').slideUp('fast');
                    }
                });
            }
        }
        setTimeout(finish,50);
    }
});

$form.submit(function() {
  var url = $url.val(),
		type = validate( url );
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
			//populate list again
		}
	});
	return false;
});