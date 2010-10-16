<?php
include 'layout.php';

startblock('content'); ?>

<div id="home">
    <label for="new_url">New URL</label>
    <input id="new_url" name="url" type="text" />
    <div id="new_url_preview">
        hello
    </div>
</div>

<?php endblock();

startblock('readyScript'); ?>

    var exps = [
        /^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?/,
        /^http:\/\/(?:www\.)?vimeo.com(\/|\/clip:)(\d+)(.*?)/,
        /^http:\/\/(?:www\.)?video.yahoo.com\/watch\/(.*?)/
        //http://video.google.it/videoplay?docid=3947293349740494460
        ///http:\/\/(www.vimeo|vimeo)\.com(\/|\/clip:)(\d+)(.*?)/,
        //http://purinaanimalallstars.yahoo.com/?v=8380138
        //
    ],
    validate = function( url ) {
        for( var i in exps ) {
            if (url.match(exps[i][0])) return i;
        }
        return -1;
    },
    $url = $('#new_url'),
    $preview = $('#new_url_preview');
    $url.bind('keyup paste', function(e) {
        var url = $url.val(),
            type = validate( url );
        if( type != -1 ) {
            $preview.slideDown( 'fast', function() {
                $.getJSON('handler.php', {
                    action: 'preview',
                    sid: type,
                    url: url
                })
            });
        } else {
            $preview.slideUp( 'fast' );
        }
    });

<?php endblock() ?>