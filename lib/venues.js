Venues = new Mongo.Collection('venues');

if(Meteor.IsServer){
	Venues._ensureIndex({'loc.coordinates': '2dsphere'});
}

Venues.allow({
	update: function(userid, venue) {    
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
		return (_.without(fieldNames, 'name', 'description', 'address1', 'loc', 'formatted_address', 'videos', 'socialmedia', 'website', 'images', 'administrators').length > 0);
	}
});

Meteor.methods({
    venueInsert: function(venueAttributes){
        console.log('Inserting venue');
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
              administrators: [String]
              });
        var errors = validateVenues(venueAttributes);
        //enter validation here
		
        var user = Meteor.user();
        var venue = _.extend(venueAttributes, {
            userId: user._id,
            followers: []
        });
        
        var venueId = Venues.insert(venue);
        console.log('Venue inserted!');
        return{
            id: venueId
        };
     }
});

validateVenues = function(){
    var errors = {};
    return errors;
}