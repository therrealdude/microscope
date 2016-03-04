Template.personSubmit.onCreated(function() {
  Session.set('personSubmitErrors', {});
});

Template.personSubmit.onRendered(function(){
});

Template.personSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('personSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('personSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.personSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
	
    var person = {
      name: $(e.target).find('[name=name]').val(),
      bio: $(e.target).find('[name=bio]').val(),
      isPerformer: $(e.target).find('[name=isPerformer]').prop('checked'),
	  website: $(e.target).find('[name=website]').val(),
	  videos: Session.get('videosToSave'),
	  socialmedia: Session.get('socialmedia'),
	  images: Cloudinary.collection.find().fetch(),
      tags: $(e.target).find('[name=tags]').val()
    };
	
    var errors = validatePerson(person);
    if (errors.name || errors.bio || errors.duplicate)
      return Session.set('personSubmitErrors', errors);

    Meteor.call('personInsert', person, function(error, result) {
      // display the error to the user and abort
      if (error)
        console.log(error.reason);
	
	  var imagesToDelete = Session.get('imagesToDelete');
	  if(imagesToDelete){
		for (var i = 0; i<imagesToDelete.length; i++){
			Cloudinary.delete(imagesToDelete[i]);
		}
	  }
      // show this result but route anyway
      if (result.personExists)
        throw new Meteor.Error('This person has already been created');
    
      Router.go('/person/' + result._id);  
    });
  }
});