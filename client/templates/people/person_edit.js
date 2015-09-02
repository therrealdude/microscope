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
	
	var sessionvideos = Session.get('videoLinks');
	var personvideos = [];
	for (var i = 0; i<sessionvideos.length; i++) {
		if (sessionvideos[i].display) {
			personvideos.push(sessionvideos[i].content);
		}
	}
	
    var personProperties = {
      name: $(e.target).find('[name=name]').val(),
      bio: $(e.target).find('[name=bio]').val(),
	  videos: personvideos,
	  socialmedia: Session.get('socialmedia')
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
        Router.go('personPage', {_id: currentPersonId});
      }
    });
  }
});