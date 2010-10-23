window.CF = window.CF || (function($,F,w){
    
    // PRIVATE
    var $url = $('#new_url'),
        $search = $('#search'),
        $preview = $('#clip_embed'),
        $add = $('#add_clip'),
        $delete_video = $('#delete_video'),
        $leftbar = $('#left_bar'),
        $clipembed = $('#clip_embed'),
        $footer = $('footer'),
        $fb = $('#addFacebookVids'),
        lastURLTime = 0,
        URLIntervalID = null,
        lastSearchTime = 0,
        searchIntervalID = null,
        _cid = 0,
        _video = null,
        exps = [
            /youtube.com\/watch\?(?=.*v=\w+)(?:\S+)+/,
            /vimeo.com(\/|\/clip:)(\d+)(.*?)/,
            /video.yahoo.com\/watch\/(.*?)/
        ];
        
    var validate = function( url ) {
            for( var i in exps ) {
                if (url.match(exps[i])) return i;
            }
            return -1;
        },
        stopEvent = function(e) {
            if (e.stopPropagation) e.stopPropagation();
            else e.cancelBubble = true;
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
        },
        loginStatus = function( fn ) {
            F.getLoginStatus( function(response) {
                return !! response.session;
            });
        },
        get = function( action, data, success, error ) {
            data = $.extend({ action: action }, data);
            $.ajax({
                url: 'handler.php',
                dataType: 'json',
                cache: true,
                data: data,
                success: success,
                error: error
            });
        },
        error = function( msg ) {
            log( msg );
        },
        showError = function() {
            $preview.html('<img class="loading" src="assets/error.png" title="error!" />');
        },
        showLoading = function() {
            $preview.fadeOut('fast',function(){$(this).html('<img class="loading" src="assets/loading.gif" title="loading..." />').fadeIn('fast')});
        },
        showSuccess = function() {
            $preview.html('<img class="loading" src="assets/done.png" title="done!" />').delay(2000).fadeOut(450,function(){$(this).html('')});
        },
        populateFeed = function( arg, page ) {
            var success = function(data) {
                var ret = ['<h3>My Videos  <span class="source">(' + data.size + ')</span></h3><ul>'];
                if( data[0] != "You don't seem to have any results." ) {
                    for(var i in data['results']) {
                        if(data.results[i].cid) {
                            ret.push( '<li><a title="'+data.results[i].cid+'" href="#">'+ data.results[i].c_title +'</a></li>' );
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
            };
            get( 'getFeed', {arg: arg, page: page}, success );
        },
        populateList = function() {
            var ret = ['<h3>My Videos</h3><ul>'];
            for(var i in data) {
                ret.push( '<li><a title="'+ data[i].cid +'" href="#">'+ data[i].c_title +'</a><span class="source">'+ data[i].serv_name +'</span></li>' );
            }
            ret.push( '<ul>' );
            $leftbar.html(ret.join(''));
        },
        displayAll = function() {
            var pop = function() {
                populateFeed(0,0);
            };
            setTimeout(pop,100);
        },
        showVideo = function( oembed ) {
            _video = oembed;
            $clipembed.fadeOut(300,function(){$(this).html(oembed.html).delay(100).fadeIn(300,function(){$delete_video.fadeOut(300)})});
        },
        hideVideo = function() {
            $delete_video.fadeOut(300);
            _video = null;
            $preview.fadeOut(300,function(){$(this).html('')});
        },
        getVideo = function( cid ) {
            get( 'getClipEmbed', {cid: cid}, function(data){
                showVideo(data);
                _cid = cid;
            }, error('getVideo') );
        },
        getPreview = function() {
            //log('getPreview');
            getEmbedly( showVideo );
        },
        getEmbedly = function( fn ) {
            var url = $.trim($url.val());
            if( !url || url === '' ) { return hideVideo() }
            $.embedly(url, { maxWidth:630 }, function(oembed, dict){
                if( oembed == null || !oembed.hasOwnProperty('type') || oembed.type != 'video' ) { return showError() }
                fn(oembed);
                return
            });
            //showError();
        },
        search = function() {
            var q = $search.val();
            if( !q ) { return }
            else if( q === '' ) { return errorList() }
            get( 'search', {term: q}, populateList, errorList('search') );
        },
        addFacebookLinkVids = function() {
            $fb.html('working...');
            get( 'addFacebookLinkVids', {}, function() {
                $fb.html('done! '+ data.count + " videos were added from your Facebook.");
                    displayAll();
            });    
        },
        addVideo = function() {
            showLoading();
            if(_video.url !== undefined) {
            	$url.val(_video.url);
            }
            get( 'add', {url: $url.val() }, function() {
                $url.val('');
                showSuccess();
                displayAll();
            }, showError );
        };
        
    var urlTimer = function() {
            var newTime = (new Date()).getTime();
            //if (lastURLTime === 0) { lastURLTime = newTime }
            log(newTime - lastURLTime);
            if (newTime - lastURLTime > 400) {
                //log(newTime - lastURLTime);
                lastURLTime = newTime;
                setTimeout(getPreview, 50);
                clearInterval(URLIntervalID);
            }
        },
        searchTimer = function() {
            var newTime = (new Date()).getTime();
            //if (lastSearchTime === 0) { lastSearchTime = newTime }
            if (newTime - lastSearchTime > 400) {
                lastSearchTime = newTime;
                setTimeout(search, 50);
                clearInterval(searchIntervalID);
            }
        };
    
    // PUBLIC
    return (function(){
        
        // run on load
        F.init({appId: '148596221850855', status: true, cookie: true, xfbml: true});
        F.Event.subscribe('auth.login', function(response) {
            window.location.reload();
        });
        F.Event.subscribe('auth.logout', function(response) {
            window.location.reload();
        });
        displayAll();
        get( 'pageLoad', {}, function(data){ $footer.append(data.footer) } );
        
        $leftbar.delegate('li a', 'click', function() {
            getVideo(parseInt($(this).attr('title')));
        });
        
        $url.bind('focusin', function(){
            if($url.val()=='paste a URL of a video and click add') {
                $url.val('');
            }
        }).bind('focusout', function(){
            if($url.val()=='') {
                $url.val('paste a URL of a video and click add');
            }
        }).bind('keyup paste', function(){
            if (URLIntervalID) { clearInterval(URLIntervalID) }
            lastURLTime = (new Date()).getTime();
            URLIntervalID = setInterval(urlTimer, 100);
        });
        
        $search.bind('focusin', function(){
            if($search.val()=='Search') {
                $search.val('');
            }
        }).bind('focusout', function() {
            if($search.val()=='') {
                $search.val('Search');
            }
        }).bind('keyup paste', function() {
            if( !loginStatus() ) { return }
            if( $.trim($search.val()) === '' ) { return displayAll() }
            if( searchIntervalID ) { clearInterval(searchIntervalID) }
            lastSearchTime = (new Date()).getTime();
            searchIntervalID = setInterval(searchTimer, 100);
        });
        
        $add.bind('submit', function(e){
            stopEvent(e);
            addVideo();
        });
        
        $delete_video.bind('click', function() {
            var success = function() {
                 hideVideo()
                 populateFeed(0,0);
            };
            get( 'delete', {cid: _cid}, success );
        });
        
        // things to assign to namespace 'CF'
        return {
            
        }
        
    })();
    
})(jQuery,FB,window);
/*
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
                    setTimeout(populateFeed("ORDER BY c_clips.c_ts_added DESC",0),50);
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
                setTimeout(populateFeed("ORDER BY c_clips.c_ts_added DESC",0),50);
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
*/