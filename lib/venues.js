Venues = new Mongo.Collection('venues');

Venues.allow({
	update: function(userid, venue) {return true;},
	remove: function(userid, venue) {return true;}
});

Venues.deny({
	update: function(userid, venue, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'address1', 'latitude', 'longitude', 'formatted_address').length > 0);
	}
});

Meteor.methods({
    venueInsert: function(venueAttributes){
        console.log('Inserting venue');
        check(venueAttributes, {
              name: String,
              description: String,
              address1: String,
              latitude: String,
              longitude: String,
              formatted_address: String
              });
        var errors = validateVenues(venueAttributes);
        //enter validation here
        
        //var geocode = Session.get('geocodeVenue');
        var user = Meteor.user();
        var venue = _.extend(venueAttributes, {
            userId: user._id,
            //locationData: geocode,
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