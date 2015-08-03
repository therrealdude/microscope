Template.venueEdit.onRendered(function(){
    $('select#state').dropdown('set selected', this.data.state);
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
	var venueId = this._id;  
	
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
      
    Venues.update(venueId, {$set: venueAttributes}, function(error) {
        if(error) {
            Errors.throw(error.reason);
        }
        
        Router.go('venue', {_id: venueId});
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