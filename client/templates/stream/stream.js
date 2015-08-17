template.stream.helpers({
    streamShows: function(){
        var stream = [];
        var currentUser = People.findOne({userId: Meteor.userId()});
        var shows = Shows.find({_id: {$in: currentUser.following.shows}});
        var venues = Shows.find({venue: {$in: currentUser.following.venues}});
        var groups = Shows.find({performers: {groups: {_id: {$in: currentUser.following.groups}}}});
        var people = Shows.find({performers: {people: {_id: {$in: currentUser.following.people}}}});
        
        for(var i = 0; i<shows.length; i++){
            for(var j = 0; j< shows[i].dates; j++){
                stream.push({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
            }
        }
        
        for(var i = 0; i<venues.length; i++){
            for(var j = 0; j< venues[i].dates; j++){
				var v = Venues.findOne({_id: venues[i].venue});
                stream.push({date: dates[j].date, showname: shows[i].name, venue: v._id, message: [String.Format("<span>You follow <a href='/venue/{1}'>{0}</a></span>", v.Name, v._id)]});
            }
        }
        
        for(var i = 0; i<groups.length; i++){
            for(var j = 0; j< groups[i].dates; j++){
				var gs = groups[i].dates.groups;
				for (var g = 0; g < gs.length; g++ ){
					if($.inArray(g._id, currentUser.following.groups)){
						stream.push({date: dates[j].date, group: g._id, showname: shows[i].name, message: ["You follow this show"]});
					}
				}
            }
        }
        
        for(var i = 0; i<people.length; i++){
            for(var j = 0; j< people[i].dates; j++){
                var ps = groups[i].dates.groups;
				for (var p = 0; p < ps.length; p++ ){
					if($.inArray(p._id, currentUser.following.people)){
						stream.push({date: dates[j].date, person: p._id, showname: shows[i].name, message: ["You follow this show"]});
					}
				}
            }
        }
		
		return stream;
    }
});