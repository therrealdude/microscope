Template.showEdit.onCreated(function(){
	Session.set('showEditErrors', {});
});

Template.showEdit.onRendered(function(){
});

Template.showEdit.helpers({
    errorMessage: function(field){
        return Session.get('showEditErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('showEditErrors')[field] ? 'has-error' : '';
    },
	administrators: function(){
		return People.find().fetch().map(
			function(p){
				if (p.images){
					for (var i = 0; i<p.images.length; i++){
						if (p.images[i].primary){
							_.extend(p, {featuredImageID: p.images[i].response.public_id});
							return p;
						}
					}
				}
				return p;
			});
	}
});

Template.showEdit.events({
    'submit form': function(e){
        e.preventDefault();
        
		var showid = this._id;
		
        var dates = [];
        var showDateInfo = Session.get('showDateInfo');
        var dateCount = 0;
        
        for (var i = 0; i < showDateInfo.length; i++) {
            if(showDateInfo[i].display){
                var control = $(e.target).find('#' + showDateInfo[i].id);
                var performers = control.find('[name=performersSearch]').val();
                var people = [];
                var groups = [];
				if(performers != null){
					for (var j = 0; j<performers.length; j++){
						if(performers[j].indexOf('p:') != -1){
							people.push({_id: performers[j].replace('p:', '')});
						}
						if(performers[j].indexOf('g:') != -1){
							groups.push({_id: performers[j].replace('g:', '')});
						}
					}
				}
                var performersList = {groups: groups, people: people};
                dates.push({date: new Date(control.find('[name=showdate]').val()), 
                            id: 'date' + dateCount,
                            performers: performersList,
							requests: showDateInfo[i].requests});
                dateCount++;
            }
        }
		
        var show = {name: $(e.target).find('[name=name]').val(),
                    description: $(e.target).find('[name=description]').val(),
                    venue: $(e.target).find('[name=venueSearch]').val(),
                    acceptsSubmissions: $(e.target).find('[name=acceptsSubmissions]').prop('checked'),
                    ticketPrice: $(e.target).find('[name=ticketPrice]').val(),
                    ticketLink: $(e.target).find('[name=ticketLink]').val(),
                    dates: dates,
                    socialmedia: Session.get('socialmedia'),
                    videos: Session.get('videosToSave'),
					administrators: $(e.target).find('[name=administrators]').val().split(","),
                    tags: $(e.target).find('[name=tags]').val()
                   };
        
        //var errors = validateShow(show);
        //var check = {};
        //if(errors != check){
         //   return Session.set('showSubmitErrors', errors);
        //}
        
        Meteor.call('showUpdate', show, Session.get('imagesToDelete'), function(error, result){
            if(error){
                console.log(error.reason);
            }
            
            Router.go('showPage', {_id: showid});
        });
    },
	
	'click .delete': function(e) {
		e.preventDefault();

		if (confirm("Delete this show?")) {
		  var currentShowId = this._id;
		  Shows.remove(currentShowId);
		  Router.go('home');
		}
	}
});