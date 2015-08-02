Venues = new Mongo.Collection('venues');

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
            userId: user._id
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