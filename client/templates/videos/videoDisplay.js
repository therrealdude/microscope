Template.videoDisplay.onRendered( function(){
	$('.ui.embed').embed();
});

Template.videoDisplay.helpers({
	formattedVideoUrls: function(){
		var urls = [];
		for (var i = 0; i<this.videos.length; i++){
			if(this.videos[i].indexOf('youtube') != -1 && this.videos[i].indexOf('embed') === -1){
				urls.push(this.videos[i].replace('.com/watch?v=', '.com/embed/'));
			}
		}
		return urls;
	}
})