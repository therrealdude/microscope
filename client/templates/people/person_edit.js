Template.personEdit.onCreated(function() {
  Session.set('personEditErrors', {});
});
Template.personEdit.helpers({
  errorMessage: function(field) {
    return Session.get('personEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('personEditErrors')[field] ? 'has-error' : '';
  }
});

Template.personEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPersonId = this._id;
	
    var personProperties = {
      name: $(e.target).find('[name=name]').val(),
      bio: $(e.target).find('[name=bio]').val(),
	  website: $(e.target).find('[name=website]').val(),
	  videos: Session.get('videosToSave'),
	  socialmedia: Session.get('socialmedia'),
	  email: $(e.target).find('[name=email]').val(),
	  phone: $(e.target).find('[name=phone]').val(),
	  showContactInfo: $(e.target).find('[name=showContactInfo]').prop('checked'),
      images: Cloudinary.collection.find().fetch()
    }
    
    var errors = validatePerson(personProperties);
    if (errors.name || errors.bio)
      return Session.set('personEditErrors', errors);
    
    People.update(currentPersonId, {$set: personProperties}, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
        // show this result but route anyway
        if (result.postExists)
            Errors.throw('This link has already been posted');
      } else {
        var imagesToDelete = Session.get('imagesToDelete');
        for (var i = 0; i<imagesToDelete.length; i++){
            Cloudinary.delete(imagesToDelete[i]);
        }
        Router.go('personPage', {_id: currentPersonId});
      }
    });
  }
});