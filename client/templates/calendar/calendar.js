Template.calendar.onCreated(function(){
    Session.set('dateOffset', 0);
});

Template.calendar.events({
	'click .calendarNext': function(e){
		Session.set('dateOffset', Session.get('dateOffset') + 1);
	},
	'click .calendarPrevious': function(e){
		Session.set('dateOffset', Session.get('dateOffset') - 1);
	}
});

Template.calendar.helpers({
    calendarShows: function(){
        var url = Router.current().url;
        var shows = [];
        var dateOffSet = Session.get('dateOffset');
        
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dateOffSet, 0, 0, 0);
		console.log(startDate.getDay());
        
        var ret = [{day: startDate, shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1, 0, 0, 0), shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 2, 0, 0, 0), shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 3, 0, 0, 0), shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 4, 0, 0, 0), shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 5, 0, 0, 0), shows: []}, 
		{day: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6, 0, 0, 0), shows: []}];
        
        if (url.indexOf('person') != -1){
            shows = Shows.find({'dates.0.people': this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: ret[6].date}}).fetch();
        }
        else if (url.indexOf('group') != -1){
            shows = Shows.find({'dates.0.groups': this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: ret[6].date}}).fetch();
        }
        else if (url.indexOf('venue') != -1){
            shows = Shows.find({venue: this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: ret[6].date}}).fetch();
        }
        else {
            shows.push(this);
        }
        for (var i = 0; i < shows.length; i++){
            for (var j = 0; j < shows[i].dates.length; j++){
				for (var z = 0; z < ret.length; z++){
					if(shows[i].dates[j].date > ret[z].day && shows[i].dates[j].date.getDate() < ret[z].date.setDate(ret[z].date.getDate() + 1)){
						var venue = Venues.find({_id: shows[i].venue});
						ret[z].shows.push({
							showName: shows[i].name, 
							showLocation: venue.name, 
							showAddress: venue.address1,
							showTime: shows[i].dates[j].date.getTime()
						});
					}	
				}
            }
        }
		
		console.log(ret);
		return ret;
    }
});

