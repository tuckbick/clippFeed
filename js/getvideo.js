function getVideo(cid) {
	$.ajax({
		url:'handler.php',
		dataType:'json',
		cache:'false',
		data: {
			action: 'getClipEmbed',
			cid: cid
		},
		success: function( data ) {
			$('#clip_embed').html(data.embed);
		}
	});	
}