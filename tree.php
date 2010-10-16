<?php

include_once "connect.php";
include_once "functions.inc";

echo get_feed();
$video = get_clip(1);
echo get_embed($video['vid'],$video['sid']);
$video = get_clip(2);
echo get_embed($video['vid'],$video['sid']);

?>