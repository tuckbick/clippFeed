window.CFbm = window.CFbm || (function($,F,w){
    
    // PRIVATE
    var $url = $('#new_url'),
        $preview = $('#clip_embed'),
        $add = $('#add_clip'),
        $clipembed = $('#clip_embed'),
        lastURLTime = 0,
        URLIntervalID = null,
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
            console.log( msg );
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
        showVideo = function( oembed ) {
            _video = oembed;
            $clipembed.fadeOut(300,function(){$(this).html(oembed.html).delay(100).fadeIn(300)});
        },
        hideVideo = function() {
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
        addVideo = function() {
            showLoading();
            if(_video.url !== undefined) {
                $url.val(_video.url);
            }
            get( 'add', {url: $url.val() }, function() {
                $url.val('');
                showSuccess();
                setTimeout(window.close,3000);
            }, showError );
        };
        
    var urlTimer = function() {
            var newTime = (new Date()).getTime();
            //if (lastURLTime === 0) { lastURLTime = newTime }
            if (newTime - lastURLTime > 400) {
                //log(newTime - lastURLTime);
                lastURLTime = newTime;
                setTimeout(getPreview, 50);
                clearInterval(URLIntervalID);
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
        
        $add.bind('submit', function(e){
            stopEvent(e);
            addVideo();
        });
        
        // things to assign to namespace 'CF'
        return {
            
        }
        
    })();
    
})(jQuery,FB,window);