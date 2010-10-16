<?php

include_once "connect.php";
include_once "functions.inc";
include_once "functions2.inc";

echo get_feed();
$video = get_clip(1);
echo get_embed($video['s_url'].$video['vid'],$video['sid'],300,225);
$video2 = get_clip(2);
echo get_embed($video2['s_url'].$video2['vid'],$video2['sid'],300,225);

print_r(get_video($video['vid'],$video['sid']));



?>