Template.videoDisplay.onCreated(function() {
    Session.set('currentVideo', 0);
});

Template.videoDisplay.onRendered( function(){
	$('.ui.embed').embed();
});

Template.videoDisplay.helpers({
	formattedVideoUrls: function(){
		var urls = [];
		for (var i = 0; i < this.videos.length; i++){
			if(this.videos[i].url.indexOf('youtube') != -1 && this.videos[i].url.indexOf('embed') === -1){
				urls.push({url: this.videos[i].url.replace('.com/watch?v=', '.com/embed/'), displayorder: this.videos[i].displayorder});
			}
		}
		return urls;
	},
    getVideoVisibility: function(displayorder){
        var style = 'display:none';
        if(Session.get('currentVideo') === displayorder){
            style = '';
        }
        return style;
    },
    getVideoID: function(displayorder){
        var id = 'video' + displayorder;
        return id;
    },
    hasVideos: function(){
        return this.videos && this.videos.length > 0;
    }
});

Template.videoDisplay.events({
    'click .nextVideo': function(e){
        var currentVideo = Session.get('currentVideo') + 1;
        if(currentVideo === this.videos.length)
        {
            Session.set('currentVideo', 0);
        }
        else{
            Session.set('currentVideo', currentVideo);
        }
    },
    'click .previousVideo': function(e){
        var currentVideo = Session.get('currentVideo') - 1;
        if(currentVideo < 0){
            Session.set('currentVideo', this.videos.length - 1);
        }
        else{
            Session.set('currentVideo', currentVideo);
        }
    }
    
});