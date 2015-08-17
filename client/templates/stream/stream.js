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
                stream.add({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
            }
        }
        
        for(var i = 0; i<venues.length; i++){
            for(var j = 0; j< venues[i].dates; j++){
                stream.add({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
            }
        }
        
        for(var i = 0; i<groups.length; i++){
            for(var j = 0; j< groups[i].dates; j++){
                stream.add({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
            }
        }
        
        for(var i = 0; i<people.length; i++){
            for(var j = 0; j< people[i].dates; j++){
                stream.add({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
            }
        }
    }
});