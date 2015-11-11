Shows = new Mongo.Collection('shows');

Shows.allow({
	update: function(userid, show) {    
        if(modifier['$set'] && modifier['$set'].followers) {
            return true;
        }
        else{
            return isAdmin(userid, show.administrators); 
        }
    },
	remove: function(userid, show) {return true;}
});

Shows.deny({
	update: function(userid, show, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'venue', 'dates', 'acceptsSubmissions', 'ticketPrice', 'followers', 'socialmedia', 'videos', 'ticketLink', 'images', 'administrators').length > 0);
	}
});

Meteor.methods({
    showInsert: function(showAttributes){
        check(Meteor.user()._id, String);
        check(showAttributes, 
              {name: String,
              description: String,
              dates: [Object],
              venue: String,
              acceptsSubmissions: Boolean,
              ticketPrice: String,
              ticketLink: String,
              socialmedia: Object,
              videos: [Object],
			  images: [Object],
			  administrators: [String]}
             );
        
        var errors = validateShow(showAttributes);
        if(errors.name || errors.description || errors.dates || errors.venue) {
            throw new Meteor.Error('invalid-show', 'Show requires a name, description, date, and venue.');
        }
        
        var show = _.extend(showAttributes, {
            followers: []
        });
        
        var showID = Shows.insert(show);
        return {
            _id: showID
        };
    },
	searchShows: function(searchCriteria){
		if(Meteor.isServer){
			var includeKeywords = searchCriteria != undefined && searchCriteria.keywords != undefined && searchCriteria.keywords != '';
			var includeDates = searchCriteria != undefined && searchCriteria.startdate != undefined && searchCriteria.enddate != undefined && searchCriteria.startdate != '' && searchCriteria.enddate != '';
			var includeLocation = searchCriteria != undefined && searchCriteria.latitude != undefined && searchCriteria.longitude != undefined && searchCriteria.radius != undefined && searchCriteria.longitude != '' && searchCriteria.latitude != '' && searchCriteria.radius != '';
			
			var venues;
			var venue_ids = [];
			if(includeLocation){
				venues = getVenues(searchCriteria);
				venue_ids = [];
				for(var i = 0; i<venues.length; i++){ venue_ids.push(venues[i].venue_id); }
			}
			
			if(includeKeywords && includeDates && includeLocation){
				return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
				'dates.0.date': {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) },
				venue: {$in: venue_ids}}).map(function(s){
					var distance = 0;
					for(var i = 0; i < venues.length; i++){
						if(venues[i].venue_id === s.venue){
							distance = venues[i].distance;
						}
					}
					return _.extend(s, {distance: distance});
				});
			}
			else if(includeKeywords && includeDates){
				return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, 
				'dates.0.date': {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }}).fetch();
			}
			else if(includeKeywords && includeLocation){
				return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
				venue: {$in: venue_ids}}).fetch();
			}
			else if(includeDates && includeLocation){
				return Shows.find({'dates.0.date': {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }, 
				venue: {$in: venue_ids}}).fetch();
			}
			else if(includeKeywords){
				return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}}).fetch();
			}
			else if(includeDates){
				return Shows.find({'dates.0.date': {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }}).fetch();
			}
			else if(includeLocation){
				return Shows.find({venue: {$in: venue_ids}}).map(function(s){
					var distance = 0;
					for(var i = 0; i < venues.length; i++){
						console.log('checking if venue: ' + venues[i].venue_id + ' is the same as ' + s.venue);
						if(venues[i].venue_id === s.venue){
							distance = venues[i].distance;
						}
					}
					return _.extend(s, {distance: distance});
				});
			}
		}
		else{
			return Shows.find().fetch();
		}
	}
});


var getVenues = function(searchCriteria){
	if(Meteor.isServer){
		var equatorialRadiusMiles = 3963.2;
		var milesPerRadian = 154947.5545004958;
		console.log('searching for venues ' + parseFloat(searchCriteria.radius)/equatorialRadiusMiles + ' radians away from ' + searchCriteria.longitude + ', ' + searchCriteria.latitude)
		return Venues.find({
			loc: {
				$geoWithin: {
					$centerSphere: [[parseFloat(searchCriteria.longitude), parseFloat(searchCriteria.latitude)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]
					}
				}
			}).map(
			function(v) {
				var distance = calcDistance(v.loc.coordinates, [parseFloat(searchCriteria.longitude), parseFloat(searchCriteria.latitude)], equatorialRadiusMiles); 
				console.log('Found venue ' + distance + ' miles away.');
				console.log('Outputting: ' + v._id + ' ' + distance);
				return {venue_id: v._id, distance: distance};
			});
	}
}

calcDistance = function(p1, p2, radius){
    var dLat = rad(p2[0] - p1[0]);
    var dLong = rad(p2[1] - p1[1]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radius * c;
    return d.toFixed(2); // returns the distance in miles
}

function rad(deg) {
  return deg * (Math.PI/180)
}

validateShow = function(show) {
    errors = {};
    if(!show.name) {
        errors.name = 'Show name is required.'
    }
    if(!show.description){
        errors.description = 'Show description is required';
    }
    if(!show.dates){
        errors.date = 'Show date is required';
    }
    if(!show.venue){
        errors.venue = 'Show venue is required.'
    }
    return errors;
}