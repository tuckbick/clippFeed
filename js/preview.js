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
        _video = null;
        
    var stopEvent = function(e) {
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
        
        $fb.bind( 'click', addFacebookLinkVids );
        
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