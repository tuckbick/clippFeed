<?php
include 'layout.php';

startblock('content'); ?>

<div id="home">
    <label for="new_url">New URL</label>
    <input id="new_url" name="url" type="text" value="Video URL" />
    <div id="new_url_preview">
        hello
    </div>
</div>

<?php endblock();

startblock('scriptTag'); ?>
    <script src="js/preview.js"></script>
<?php endblock(); ?>