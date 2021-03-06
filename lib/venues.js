Venues = new Mongo.Collection('venues');

if(Meteor.IsServer){
	Venues._ensureIndex({'loc.coordinates': '2dsphere'});
}

Venues.allow({
	update: function(userid, venue, fieldNames, modifier) {    
        if(modifier['$set'] && modifier['$set'].followers) {
            return true;
        }
        else{
            return isAdmin(userid, venue.administrators); 
        }
    },
	remove: function(userid, venue) {return true;}
});

Venues.deny({
	update: function(userid, venue, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'address1', 'loc', 'formatted_address', 'videos', 'socialmedia', 'website', 'images', 'administrators', 'followers').length > 0);
	}
});

Meteor.methods({
    venueInsert: function(venueAttributes, imagesToDelete){
        check(venueAttributes, {
              name: String,
              description: String,
              address1: String,
			  loc: Object,
              formatted_address: String,
              website: String,
              videos: [Object],
              socialmedia: Object,
			  images: [Object],
              administrators: [String],
              tags: [String]
              });
        var errors = validateVenues(venueAttributes);
        //enter validation here
		
        var user = Meteor.user();
        console.log(user);
        var venue = _.extend(venueAttributes, {
            userId: user._id,
            followers: []
        });
        
        var venueId = Venues.insert(venue);
        
        Meteor.call('tagsInsert', venue.tags, function(error, result){});
        
        return{
            id: venueId
        };
        
        
     },
     venueUpdate: function(venueId, venue, imagesToDelete) {
        Venues.update(venueId, {$set: venue}, function(error) {
            if(error) {
                Errors.throw(error.reason);
            }
            if(imagesToDelete){
                for (var i = 0; i<imagesToDelete.length; i++){
                    Cloudinary.delete(imagesToDelete[i]);
                }
            }
        });
     },
	 venueSearch: function(searchCriteria) {
		 if(Meteor.isServer){
			 var includeKeywords = searchCriteria != undefined && searchCriteria.keywords != undefined && searchCriteria.keywords != '';
			 var includeLocation = searchCriteria != undefined && searchCriteria.latitude != undefined && searchCriteria.longitude != undefined && searchCriteria.radius != undefined && searchCriteria.longitude != '' && searchCriteria.latitude != '' && searchCriteria.radius != '';
             var includeTags = searchCriteria != undefined && searchCriteria.tags && searchCriteria.tags.length > 0;
			 var venues;
			 var venue_ids = [];
			 if(includeLocation){
				Meteor.call('getVenuesNearLocation', searchCriteria, function(error, result){if (error) { Errors.throw(error); } else { venues = result; }});
				venue_ids = [];
				console.log(venues);
				if (venues){
					for(var i = 0; i<venues.length; i++){ venue_ids.push(venues[i].venue_id); }
				}
			 }
			 
			 if (includeKeywords && includeLocation){
				 return Venues.find({
					 _id: {$in: venue_ids},
					 name: {$regex: new RegExp(searchCriteria.keywords, "i")}
				 }).map(function(v){
					var distance = 0;
					for(var i = 0; i < venues.length; i++){
						if(venues[i].venue_id === v._id){
							distance = venues[i].distance;
						}
					}
					return _.extend(v, {distance: distance});
				});
			 }
			 else if(includeKeywords){
				 return Venues.find({
					 name: {$regex: new RegExp(searchCriteria.keywords, "i")}
				 }).fetch();
			 }
			 else if(includeLocation){
				 return Venues.find({
					 _id: {$in: venue_ids}
				 }).map(function(v){
					var distance = 0;
					for(var i = 0; i < venues.length; i++){
						if(venues[i].venue_id === v._id){
							distance = venues[i].distance;
						}
					}
					return _.extend(v, {distance: distance});
				});
			 }
			 else{
				 return Venues.find().fetch();
			 }
		 }
	 },
	 getVenuesNearLocation: function(searchCriteria){
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
					var distance;
					Meteor.call('calcDistance', v.loc.coordinates, [parseFloat(searchCriteria.longitude), parseFloat(searchCriteria.latitude)], equatorialRadiusMiles, function(error, result){
						if(error){
							console.log(error);
						}
						distance = result;
					}); 
					return {venue_id: v._id, distance: distance};
				});
		}
	 },
	 calcDistance: function(p1, p2, radius){
		var dLat = (p2[0] - p1[0]) * (Math.PI/180);
		var dLong = (p2[1] - p1[1])* (Math.PI/180);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1[0]) * (Math.PI/180)) * Math.cos((p2[0]) * (Math.PI/180)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = radius * c;
		return d.toFixed(2); // returns the distance in miles
	 }
});

validateVenues = function(venue){
    var errors = {};
    if(!venue.name || venue.name === ''){
        errors.name = 'Name is required.';
    }
    if (!venue.description || venue.description === ''){
        errors.description = 'Description is required.';
    }
    if (!venue.address1 || venue.address1 === '') {
        errors.address = 'Address is required.';
    }
    if (venue.address1 && (isNaN(venue.address1.loc.coordinates[0]) || isNaN(venue.address1.loc.coordinates[1]))) {
        errors.address1 = 'Address is invalid. Please click on address from options listed after typing.';
    }
    return errors;
}