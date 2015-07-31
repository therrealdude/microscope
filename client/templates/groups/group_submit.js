Template.groupSubmit.onCreated(function() {
  Session.set('groupSubmitErrors', {});
});

Template.groupSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('groupSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('groupSubmitErrors')[field] ? 'has-error' : '';
  },
  personSearch : function(){
	
  }
});

Template.personSelect.onCreated(function(){

});

Template.personSelect.onRendered(function(){
	$('select#members').dropdown('allowAdditions', true);
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
      bio: $(e.target).find('[name=bio]').val()
    };
	
    var errors = validategroup(group);
    if (errors.title || errors.url)
      return Session.set('groupSubmitErrors', errors);

    Meteor.call('groupInsert', group, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.groupExists)
        throwError('This group has already been created');
    
      Router.go('peopleList');  
    });
  },
  'keydown #membersearch' : function(e) {
	  
  }
});
