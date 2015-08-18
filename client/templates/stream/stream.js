Template.showstream.helpers({
    streamShows: function(){
        var stream = [];
        var currentUser = People.findOne({userId: Meteor.userId()});
		if (currentUser.following) {
			
			if(currentUser.following.shows){
				var shows = Shows.find({_id: {$in: currentUser.following.shows}});
				for(var i = 0; i<shows.length; i++){
					for(var j = 0; j< shows[i].dates; j++){
						stream.push({date: dates[j].date, showname: shows[i].name, message: ["You follow this show"]});
					}
				}
			}
			
			console.log("Stream is:" + stream);
			
			if(currentUser.following.venues){
				var venues = Shows.find({venue: {$in: currentUser.following.venues}});
				console.log("Found " + venues.length + " venues");
				for(var i = 0; i<venues.length; i++){
					console.log(venues[i]);
					for(var j = 0; j< venues[i].dates; j++){
						var v = Venues.findOne({_id: venues[i].venue});
						stream.push({date: dates[j].date, showname: shows[i].name, venue: v._id, message: [String.Format("<span>You follow <a href='/venue/{1}'>{0}</a></span>", v.Name, v._id)]});
					}
				}
			}
			
			console.log("Stream is:" + stream);
			var allShows = Shows.find();
			if(currentUser.following.groups){
				var groupShows = [];
				for (var j = 0; j < allShows.length; j++)
				{
					for (var i = 0; i< allShows.performers.groups.length; i++)
					{
						if($.inArray(allShows[i].performers.groups[j]._id, allShows.performers.groups)){
							groupShows.push[{group: allShows[i].performers.groups[j]._id, show: allShows[i]}];
							console.log('Group added');
						}
					}
				}
				
				for(var i = 0; i<groupShows.length; i++){
					for(var j = 0; j< groupShows[i].show.dates; j++){
						if($.inArray(g._id, currentUser.following.groups)){
							stream.push({date: dates[j].date, group: groupsShows[i].group, showname: shows[i].name, message: ["You follow this group"]});
						}
					}
				}
			}
			
			console.log("Stream is:" + stream);
			
			if(currentUser.following.people){
				var people = Shows.find({performers: {people: {_id: {$in: currentUser.following.people}}}});
				console.log(people);
				for(var i = 0; i<people.length; i++){
					for(var j = 0; j< people[i].dates; j++){
						var ps = groups[i].dates.groups;
						for (var p = 0; p < ps.length; p++ ){
							if($.inArray(p._id, currentUser.following.people)){
								stream.push({date: dates[j].date, person: p._id, showname: shows[i].name, message: ["You follow a person"]});
							}
						}
					}
				}
			}
			
			console.log("Stream is:" + stream);
		}
		else{
			stream.push({message:"You don't follow anything."})
		}
		
		return stream;
    }
});