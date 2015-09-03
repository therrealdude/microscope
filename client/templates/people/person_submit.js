Template.personSubmit.onCreated(function() {
  Session.set('personSubmitErrors', {});
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
	
	var sessionvideos = Session.get('videoLinks');
	var personvideos = [];
	for (var i = 0; i<sessionvideos.length; i++) {
		if(sessionvideos[i].display){
			personvideos.push(sessionvideos[i].content);
		}
	}
	
    var person = {
      name: $(e.target).find('[name=name]').val(),
      bio: $(e.target).find('[name=bio]').val(),
	  website: $(e.target).find('[name=website]').val(),
	  videos: personvideos,
	  socialmedia: Session.get('socialmedia')
    };
	
    var errors = validatePerson(person);
    if (errors.name || errors.bio || errors.duplicate)
      return Session.set('personSubmitErrors', errors);

    Meteor.call('personInsert', person, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.personExists)
        throw new Meteor.Error('This person has already been created');
    
      Router.go('peopleList');  
    });
  }
});