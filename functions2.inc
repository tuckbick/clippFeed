<?php

function youtube($url) {
        if (preg_match('%youtube\\.com/(.+)%', $url, $match)) {
                $match = $match[1];
                $replace = array("watch?v=", "v/", "vi/");
                $match = str_replace($replace, "", $match);
                $match = substr($match, 0, 11);
        }
        $data = file_get_contents('http://gdata.youtube.com/feeds/videos/'.$match.'?alt=json');
        if( !$data || $data == 'Invalid id' ) {
            return '0';
        }
        return $match;
}
function vimeo($url) {
        if (preg_match('%vimeo\\.com/(.+)%', $url, $match)) {
                $match = $match[1];
        }
        $data = file_get_contents('http://vimeo.com/api/v2/video/'.$match.'.json');
        if( !$data || $data == '[]' ) {
            return '0';
        }
        return $match;
}

function extract_vid( $url, $type ) {
    switch( $type ) {
        case 0:
            return youtube( $url );
            break;
        case 1:
            return vimeo( $url );
            break;
        case 2:
            break;
        default:
            break;
    }
}