Shows = new Mongo.Collection('shows');

Shows.allow({
	update: function(userid, show, fieldNames, modifier) {    
        if(modifier['$set'] && (modifier['$set'].followers || modifier['$set'].dates)) {
            return true;
        }
        else{
            return isAdmin(userid, show.administrators); 
        }
    },
	remove: function(userid, show) {return isAdmin(userid, show.administrators);}
});

Shows.deny({
	update: function(userid, show, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'venue', 'dates', 'acceptsSubmissions', 'ticketPrice', 'followers', 'socialmedia', 'videos', 'ticketLink', 'images', 'administrators', 'tags').length > 0);
	}
});

Meteor.methods({
    showInsert: function(showAttributes, imagesToDelete){
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
			  administrators: [String],
              tags: [String]}
             );
        
        var errors = validateShow(showAttributes);
        if(errors.name || errors.description || errors.dates || errors.venue) {
            throw new Meteor.Error('invalid-show', 'Show requires a name, description, date, and venue.');
        }
        
        var show = _.extend(showAttributes, {
            followers: []
        });
        
        var showID = Shows.insert(show);
        if(imagesToDelete){
            for (var i = 0; i<imagesToDelete.length; i++){
                Cloudinary.delete(imagesToDelete[i]);
            }
        }
        Meteor.call('tagsInsert', show.tags, function(error, result){});
        return {
            _id: showID
        };
    },
    showUpdate: function(show, imagesToDelete) {
        Shows.update(show._id, {$set: show}, function(error, result){
            if (error){
                Errors.throw(error.reason);
            } else {
                console.log(show);
                if(imagesToDelete){
                    for (var i = 0; i<imagesToDelete.length; i++){
                        Cloudinary.delete(imagesToDelete[i]);
                    }
                }
            }
        });
        Meteor.call('tagsInsert', show.tags, function(error, result){});
    },
	searchShows: function(searchCriteria){
		if(Meteor.isServer){
			var includeKeywords = searchCriteria != undefined && searchCriteria.keywords != undefined && searchCriteria.keywords != '';
			var includeDates = searchCriteria != undefined && searchCriteria.startdate != undefined && searchCriteria.enddate != undefined && searchCriteria.startdate != '' && searchCriteria.enddate != '';
			var includeLocation = searchCriteria != undefined && searchCriteria.latitude != undefined && searchCriteria.longitude != undefined && searchCriteria.radius != undefined && searchCriteria.longitude != '' && searchCriteria.latitude != '' && searchCriteria.radius != '';
			
			var venues;
			var venue_ids = [];
			if(includeLocation){
				Meteor.call('getVenuesNearLocation', searchCriteria, function(error, result){ if (error) {console.log(error); } else { venues = result; }});
				venue_ids = [];
				if (venues){
					for(var i = 0; i<venues.length; i++){ venue_ids.push(venues[i].venue_id); }
				}
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