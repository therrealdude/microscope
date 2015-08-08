Shows = new Mongo.Collection('shows');

Shows.allow({
	update: function(userid, show) {return true;},
	remove: function(userid, show) {return true;}
});

Shows.deny({
	update: function(userid, show, fieldNames){
		return (_.without(fieldNames, 'name', 'description', 'venue', 'dates', 'acceptsSubmissions', 'ticketPrice').length > 0);
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
              ticketPrice: String}
             );
        
        var errors = validateShow(showAttributes);
        if(errors.name || errors.description || errors.dates || errors.venue) {
            throw new Meteor.Error('invalid-show', 'Show requires a name, description, date, and venue.');
        }
        
        var admins = [Meteor.user._id];
        var show = _.extend(showAttributes, {
            admins: admins,
            followers: []
        });
        
        var showID = Shows.insert(show);
        return {
            _id: showID
        };
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