Template.venueSubmit.onRendered(function(){
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("input#address1").geocomplete({details: '.geolocation'});
        }
    });
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
        latitude: $(e.target).find('[name=lat]').val(),
        longitude: $(e.target).find('[name=lng]').val(),
        formatted_address: $(e.target).find('[name=formatted_address]').val()
    };
    
    var errors = validateVenues(venueAttributes);
    if (errors.anything) {
        return Session.set('venueSubmitErrors', errors);
    }

    Meteor.call('venueInsert', venueAttributes, function(error, result) {
        if(error) {
            Errors.throw(error.reason);
        }

        Router.go('search');
    });
  }
});