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
    e.preventDefault();
	
    var venueAttributes = {
        name: $(e.target).find('[name=name]').val(),
        description:    $(e.target).find('[name=description]').val(),
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
		socialmedia: Session.get('socialmedia'),
		images: Cloudinary.collection.find().fetch(),
        administrators: $(e.target).find('[name=administrators]').val().split(','),
        tags: $(e.target).find('[name=tags]').val()
    };
    
    var errors = validateVenues(venueAttributes);
    if (errors.anything) {
        return Session.set('venueSubmitErrors', errors);
    }

    Meteor.call('venueInsert', venueAttributes, function(error, result) {
        if(error) {
            Errors.throw(error.reason);
        }
		var imagesToDelete = Session.get('imagesToDelete');
        if(imagesToDelete){
            for (var i = 0; i<imagesToDelete.length; i++){
                Cloudinary.delete(imagesToDelete[i]);
            }
        }
        Router.go('/venue/' + result.id);
    });
  }
});