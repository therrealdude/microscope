Template.videoAdd.onCreated(function() {
	if(this.data && this.data.videos){
		var videos = [];
		for (var i = 0; i<this.data.video.length; i++){
			videos.push({id: 'video' + videos.length, display: true, content: videos[i]});
		}
		Session.set('videoLinks')
	}
	else { 
		Session.set('videoLinks', [{id: 'video0', display: true, content: ''}]);
	}
});

Template.videoAdd.helpers({
	videoElements : function(){
		return Session.get('videoLinks');
	}
});

Template.videoAdd.events({
	'change input.videoTextBox': function(e) {
		var videos = Session.get('videoLinks');
		var id = $(e.target).attr('id');
		var video;
		for(var i = 0; i<videos.length; i++) {
			if(videos[i].id === id) {
				videos[i].content = $(e.target).val();
			}
		}
		
		Session.set('videoLinks', videos);
	},
	'click input.removeVideo': function(e){
		var videos = Session.get('videoLinks');
        var id = $(this).attr('id');
        for(var i = 0; i < info.length; i++)
        {
            if(id === info[i].id){
                videos[i].display = false;
            }
        }
        Session.set('videoLinks', videos);
	},
	'click input.btnAddVideo': function(e){
		var videos = Session.get('videoLinks');
		Session.set('videoLinks', videos.push({id: 'video' + videos[i].length, display: true, content: ''}))
	}
});