<?php

include_once 'functions.inc';

echo eliminate_duplicates('c_cid_uid');
echo garbage_collection('c_clips','c_cid_uid','cid');

?>