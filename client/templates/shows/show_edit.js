Template.showEdit.onCreated(function(){
    Session.set('showEditErrors', {});
	var dates = this.data.dates.length;
	var controls = [];
	for (var i = 0; i < dates; i++){
		controls.push({id: this.data.dates[i].id, display: true, date: this.data.dates[i].date, performers: this.data.dates[i].performers, requests: this.data.dates[i].requests});
	}
	Session.set('showDateInfo', controls);
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
    numShowDates: function(){
        var ret = [];
        if(Session.get('showDateInfo')) {
            ret = Session.get('showDateInfo');
        }
        return ret;
    },
    dateString: function(){
		if (this.date){
			return this.date.toISOString().replace('Z', '').replace(':00.000', '');
		}
		else {
			return '';
		}
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
    'click input#btnAddDate': function(){
        var ret = Session.get('showDateInfo');
        ret.push({id: 'date' + ret.length, display: true, requests: {people: [], groups: []}});
        Session.set('showDateInfo', ret);
    },
    'click input.removeDate': function(e){
        var info = Session.get('showDateInfo');
        var id = $(this).attr('id');
        for(var i = 0; i < info.length; i++)
        {
            if(id === info[i].id){
                info[i].display = false;
            }
        }
        Session.set('showDateInfo', info);
    },
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
					administrators: $(e.target).find('[name=administrators]').val().split(",")
                   };
        
        //var errors = validateShow(show);
        //var check = {};
        //if(errors != check){
         //   return Session.set('showSubmitErrors', errors);
        //}
        
        Shows.update(showid, {$set: show}, function(error){
            if(error){
                Errors.throw(error.reason);
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