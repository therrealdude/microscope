Venues = new Mongo.Collection('venues');

Venues.allow({
	update: function(userid, venue) {return true;},
	remove: function(userid, venue) {return true;}
});

Venues.deny({
	update: function(userid, venue, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'address1', 'address2', 'city', 'state', 'zipcode').length > 0);
	}
});

Meteor.methods({
    venueInsert: function(venueAttributes){
        check(venueAttributes, {
              name: String,
              description: String,
              address1: String,
              address2: String,
              city: String,
              state: String,
              zipcode: String
              });
        var errors = validateVenues(venueAttributes);
        //enter validation here
        
        var user = Meteor.user();
        var venue = _.extend(venueAttributes, {
            userId: user._id,
            followers: []
        });
        var venueId = Venues.insert(venue);
        return{
            id: venueId
        };
        
    }
});

validateVenues = function(){
    var errors = {};
    return errors;
}