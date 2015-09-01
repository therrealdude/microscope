Template.videoAdd.onCreated(function() {
	if(this.data && this.data.videos){
		var videos = [];
		for (var i = 0; i<this.data.videos.length; i++){
			videos.push({id: 'video' + i, display: true, content: this.data.videos[i]});
		}
		Session.set('videoLinks', videos);
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
        for(var i = 0; i < videos.length; i++)
        {
            if(id === videos[i].id){
                videos[i].display = false;
            }
        }
        Session.set('videoLinks', videos);
	},
	'click input#btnAddVideo': function(e){
		var videos = Session.get('videoLinks');
		videos.push({id: 'video' + videos.length, display: true, content: ''});
		Session.set('videoLinks', videos)
	}
});