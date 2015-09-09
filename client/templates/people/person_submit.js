Template.personSubmit.onCreated(function() {
  Session.set('personSubmitErrors', {});
  $('#personContactInfo').checkbox({onChange: function(){console.log($(this).val())}});
});

Template.personSubmit.onRendered(function(){
	$('#personContactInfo').checkbox({'onChecked': function() { console.log($(this).val()) }});
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
	  website: $(e.target).find('[name=website]').val(),
	  videos: Session.get('videosToSave'),
	  socialmedia: Session.get('socialmedia'),
	  email: $(e.target).find('[name=email]').val(),
	  phone: $(e.target).find('[name=phone]').val(),
	  showContactInfo: $(e.target).find('[name=showContactInfo]').prop('checked')
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