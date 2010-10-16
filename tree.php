<?php

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";

echo get_feed();
$video = get_clip(1);
echo get_embed($video['s_url'].$video['vid'],$video['sid'],300,225);
$video = get_clip(2);
echo get_embed($video['s_url'].$video['vid'],$video['sid'],300,225);

?>