Template.venueSubmit.onRendered(function(){
    $('select#state').dropdown();
});

Template.venueSubmit.onCreated(function(){
    Session.set('venueSubmitErrors', {}); 
});

Template.venueSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('venueSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('venueSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.venueSubmit.events({
  'submit form': function(e) {
    var venueAttributes = {
        name: $(e.target).find('[name=name]').val(),
        description:    $(e.target).find('[name=description]').val(),
        address1: $(e.target).find('[name=address1]').val(),
        address2: $(e.target).find('[name=address2]').val(),
        city: $(e.target).find('[name=city]').val(),
        state: $(e.target).find('[name=state]').val(),
        zipcode: $(e.target).find('[name=zipcode]').val()
    };
    
    var errors = validateVenues(venueAttributes);
    if (errors.anything) {
        return Session.set('venueSubmitErrors', errors);
    }
    
    var addressString = venueAttributes.address1.split(' ').join('+') + venueAttributes.address2.split(' ').join('+') + ',' + venueAttributes.city + ',' + venueAttributes.state;
      
    Meteor.call('geocode', addressString, function(error, result){
        if(error){
            Meteor.Error.throw(error.reason);
        }
        var venue = _.extend(venueAttributes, {locationData: result})
        
        Meteor.call('venueInsert', venue, function(error, result) {
            if(error) {
                Errors.throw(error.reason);
            }

            Router.go('search');
        });
    });
  }
});