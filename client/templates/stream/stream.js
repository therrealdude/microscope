Template.showstream.helpers({
	hasStreamShows: function(){
		if(Session.get('stream')){
			return Session.get('stream').length > 0;
		}
		else{
			return true;
		}
	},
    streamShows: function(){
        var stream = [];
        var currentUser = People.findOne({userId: Meteor.userId()});
		if (currentUser.following) {
			
			if(currentUser.following.shows){
				stream = addShowsToStream(Shows.find({_id: {$in: currentUser.following.shows}, 'dates.0.date': {$gte: new Date() }}).fetch(), stream, currentUser);
			}
			
			if(currentUser.following.venues){
				addShowsToStream(Shows.find({venue: {$in: currentUser.following.venues}, 'dates.0.date': {$gte: new Date() }}).fetch(), stream, currentUser);
			}
			
			if(currentUser.following.groups){
				addShowsToStream(Shows.find({'dates.0.performers.groups.0._id': {$in: currentUser.following.groups}, 'dates.0.date': {$gte: new Date() }}).fetch(), stream, currentUser);
			}
			
			if(currentUser.following.people){
				addShowsToStream(Shows.find({'dates.0,performers.people.0._id': {$in: currentUser.following.people}, 'dates.0.date': {$gte: new Date() }}).fetch(), stream, currentUser);
			}
		}
		stream.sort(function(a, b){ return a.date > b.date });
		Session.set('stream', stream);
		return stream;
    }
});

var addShowsToStream = function(shows, stream, currentUser){
	for (var i = 0; i < shows.length; i++){
		for (var j = 0; j < shows[i].dates.length; j++){
			if(shows[i].dates[j].date >= new Date() && $.grep(stream, function(e){return e.show_id === shows[i]._id && e.date.toString() === shows[i].dates[j].date.toString();}).length === 0){
				var peopleFollowed;
				var groupsFollowed;
				for (var p = 0; p<shows[i].dates[j].performers.people.length; p++){
					if($.inArray(shows[i].dates[j].performers.people[p]._id, currentUser.following.people) != -1){
						if (!peopleFollowed) { peopleFollowed = [];}
						peopleFollowed.push(shows[i].dates[j].performers.people[p]._id)
					}
				}
				for (var g = 0; g<shows[i].dates[j].performers.groups.length; g++){
					if($.inArray(shows[i].dates[j].performers.groups[g]._id, currentUser.following.groups) != -1){
						if (!groupsFollowed) { groupsFollowed = [];}
						groupsFollowed.push(shows[i].dates[j].performers.groups[g]._id)
					}
				}
				var venueFollowed = $.inArray(shows[i].venue, currentUser.following.venues) != -1;
				var showFollowed = $.inArray(shows[i]._id, currentUser.following.shows) != -1;
				stream.push({show: shows[i], date: shows[i].dates[j].date, peopleFollowed: peopleFollowed, groupsFollowed: groupsFollowed, venueFollowed: venueFollowed, showFollowed: showFollowed});
			}
		}
	}
	return stream;
}