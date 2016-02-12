Template.showSubmit.onCreated(function(){
    Session.set('showSubmitErrors', {});
});

Template.showSubmit.onRendered(function(){
});


Template.showSubmit.helpers({
    errorMessage: function(field){
        return Session.get('showSubmitErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('showSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.showSubmit.events({
    'submit form': function(e){
        e.preventDefault();
        
        var dates = [];
        var showDateInfo = Session.get('showDateInfo');
        var dateCount = 0;
        for (var i = 0; i < showDateInfo.length; i++) {
            if(showDateInfo[i].display){
                var control = $(e.target).find('#' + showDateInfo[i].id);
                var performers = control.find('[name=performersSearch]').val();
                var people = [];
                var groups = [];
				if(performers){
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
                            id: 'date' + dateCount.toString(),
                            performers: performersList,
							requests: {people: [], groups: []}});
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
					images: Cloudinary.collection.find().fetch(),
					administrators: $(e.target).find('[name=administrators]').val().split(','),
                    tags: $(e.target).find('[name=tags]').val()
                   };
        
        var errors = validateShow(show);
        var check = {};
        if(errors === check){
            return Session.set('showSubmitErrors', errors);
        }
        
        Meteor.call('showInsert', show, Session.get('imagesToDelete'), function(error, result){
            if(error){
                Errors.throw(error.reason);
            }
            
            Router.go('showPage', {_id: result._id});
        });
    }
});


    