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
	
    var person = {
      name: $(e.target).find('[name=name]').val(),
      bio: $(e.target).find('[name=bio]').val()
    };
	
    var errors = validatePerson(person);
    if (errors.title || errors.url)
      return Session.set('personSubmitErrors', errors);

    Meteor.call('personInsert', person, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.personExists)
        throwError('This person has already been created');
    
      Router.go('newPosts');  
    });
  }
});