Template.showEdit.onCreated(function(){
    Session.set('showEditErrors', {});
	var dates = this.data.dates.length;
	var controls = [];
	for (var i = 0; i < dates; i++){
		controls.push({id: 'date' + i, display: true, date: this.data.dates[i].date, performers: this.data.dates[i].performers});
	}
	Session.set('showDateInfo', controls);
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
    }
});

Template.showEdit.events({
    'click input#btnAddDate': function(){
        var ret = Session.get('showDateInfo');
        ret.push({id: 'date' + ret.length, display: true});
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
        for (var i = 0; i < showDateInfo.length; i++) {
            if(showDateInfo[i].display){
                var control = $(e.target).find('#' + showDateInfo[i].id);
                dates.push({date: new Date(control.find('[name=showdate]').val()), 
                            performers: control.find('[name=performersSearch]').val()});
            }
        }
        
        var show = {name: $(e.target).find('[name=name]').val(),
                    description: $(e.target).find('[name=description]').val(),
                    venue: $(e.target).find('[name=venueSearch]').val(),
                    acceptsSubmissions: $(e.target).find('[name=acceptsSubmissions]').val() === "on",
                    ticketPrice: $(e.target).find('[name=ticketPrice]').val(),
                    dates: dates
                   };
        
        var errors = validateShow(show);
        var check = {};
        if(errors === check){
            return Session.set('showSubmitErrors', errors);
        }
        
        Shows.update(showid, {$set: show}, function(error){
            if(error){
                Errors.throw(error.reason);
            }
            
            Router.go('showPage', {_id: showid});
        });
    },
	
	'click .delete': function(e) {
		e.preventDefault();

		if (confirm("Delete this post?")) {
		  var currentShowId = this._id;
		  Shows.remove(currentShowId);
		  Router.go('home');
		}
	}
});