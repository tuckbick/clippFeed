<?php

include_once 'functions.inc';

echo eliminate_duplicates('c_cid_uid');
echo garbage_collection('c_clips','c_cid_uid','cid');
echo garbage_collection('c_cid_uid','c_clips','cid');

?>