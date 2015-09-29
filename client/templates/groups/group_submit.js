Template.groupSubmit.onCreated(function() {
  Session.set('groupSubmitErrors', {});
});

Template.groupSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('groupSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('groupSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.personSelect.onRendered(function(){
	$('select#members').dropdown({allowAdditions: true});
});

Template.personSelect.helpers({
	personSearch : function() {
		return People.find();
	}
});

Template.groupSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
	
    var group = {
      name: $(e.target).find('[name=name]').val(),
      description: $(e.target).find('[name=description]').val(),
	  members: $(e.target).find('[name=members]').val(),
	  website: $(e.target).find('[name=website]').val(),
	  videos: Session.get('videosToSave'),
	  socialmedia: Session.get('socialmedia')
    };
	
    var errors = validategroup(group);
    if (errors.name || errors.description)
      return Session.set('groupSubmitErrors', errors);

    Meteor.call('groupInsert', group, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.groupExists)
        throwError('This group has already been created');
    
      Router.go('groupList');  
    });
  }
});
