Template.venueEdit.onRendered(function(){
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("input#address1").geocomplete({details: '.geolocation'});
        }
    });
});

Template.venueEdit.onCreated(function(){
    Session.set('venueEditErrors', {}); 
});

Template.venueEdit.helpers({
  errorMessage: function(field) {
    return Session.get('venueEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('venueEditErrors')[field] ? 'has-error' : '';
  }
});

Template.venueEdit.events({
  'submit form': function(e) {
    e.preventDefault();
	var venueId = this._id;  
	
    var venueAttributes = {
        name: $(e.target).find('[name=name]').val(),
        description: $(e.target).find('[name=description]').val(),
        address1: $(e.target).find('[name=address1]').val(),
		loc: {
			type: 'Point',
			coordinates: [
				parseFloat($(e.target).find('[name=lng]').val()),
				parseFloat($(e.target).find('[name=lat]').val())
			]
		},
		formatted_address: $(e.target).find('[name=formatted_address]').val(),
		website: $(e.target).find('[name=website]').val(),
		videos: Session.get('videosToSave'),
		socialmedia: Session.get('socialmedia')
    };
    
    var errors = validateVenues(venueAttributes);
    if (errors.anything) {
        return Session.set('venueSubmitErrors', errors);
    }
      
    Venues.update(venueId, {$set: venueAttributes}, function(error) {
        if(error) {
            Errors.throw(error.reason);
        }
        
        Router.go('/venue/' + venueId);
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentVenueId = this._id;
      Venues.remove(currentVenueId);
      Router.go('home');
    }
  }
});