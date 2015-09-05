Template.videoAdd.onCreated(function() {
	if(this.data && this.data.videos){
		var videos = [];
        var videosToSave = [];
		for (var i = 0; i<this.data.videos.length; i++){
			videos.push({id: 'video' + i, display: true, content: this.data.videos[i].url});
            videosToSave.push({url: this.data.videos[i].url, displayorder: i});
		}
		Session.set('videoLinks', videos);
        Session.set('videosToSave', videosToSave);
	}
	else { 
		Session.set('videoLinks', [{id: 'video0', display: true, content: ''}]);
        Session.set('videosToSave', []);
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
        var videosToSave = [];
		var id = $(e.target).attr('id');
		var video;
        
        var videosToSaveIndex = 0;
		for(var i = 0; i<videos.length; i++) {
			if(videos[i].id === id) {
				videos[i].content = $(e.target).val();
			}
            if(videos[i].display){
                videosToSave.push({
                    url: videos[i].content,
                    displayorder: videosToSaveIndex
                });
                videosToSaveIndex++;
            }
		}
        
        
		
		Session.set('videoLinks', videos);
        Session.set('videosToSave', videosToSave);
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
        var videosToSave = Session.get('videosToSave');
		videos.push({id: 'video' + videos.length, display: true, content: ''});
        videosToSave.push({});
		Session.set('videoLinks', videos);
        Session.set('videosToSave', videosToSave);
	}
});