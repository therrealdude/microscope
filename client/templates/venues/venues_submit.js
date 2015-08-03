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
        description: $(e.target).find('[name=description]').val(),
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
      
    Meteor.call('venueInsert', venueAttributes, function(error, result) {
        if(error) {
            Errors.throw(error.reason);
        }
        
        Router.go('venueList');
    });
  }
});