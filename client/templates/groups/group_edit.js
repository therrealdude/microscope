Template.groupEdit.onCreated(function() {
  Session.set('groupEditErrors', {});
});

Template.groupEdit.onRendered(function(){
	$('select#members').dropdown({allowAdditions: true, 'set exactly': this.members}).dropdown('set exactly', this.data.members);
});

Template.groupEdit.helpers({
  errorMessage: function(field) {
    return Session.get('groupEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('groupEditErrors')[field] ? 'has-error' : '';
  },
  personSearch : function() {
	return People.find();
  }
});

Template.groupEdit.events({
  'submit form': function(e) {
    e.preventDefault();
	
	var groupid = this._id;
	
    var group = {
      name: $(e.target).find('[name=name]').val(),
      description: $(e.target).find('[name=description]').val(),
	  members: $(e.target).find('[name=members]').val()
    };
	
    var errors = validategroup(group);
    if (errors.name || errors.description)
      return Session.set('groupSubmitErrors', errors);

    Groups.update(groupid, {$set: group}, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.groupExists)
        throwError('This group has already been created');
    
      Router.go('groupPage', {_id: groupid});  
    });
  }
});
