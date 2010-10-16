<?php

function youtube($url) {
        if (preg_match('%youtube\\.com/(.+)%', $url, $match)) {
                $match = $match[1];
                $replace = array("watch?v=", "v/", "vi/");
                $match = str_replace($replace, "", $match);
        }
        return $match;
}
function vimeo($url) {
    //    /http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/
        if (preg_match('%vimeo\\.com/(.+)%', $url, $match)) {
                $match = $match[1];
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