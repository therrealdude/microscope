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
	
	var sessionvideos = Session.get('videoLinks');
	var groupvideos = [];
	for (var i = 0; i<sessionvideos.length; i++) {
		if(sessionvideos[i].display){
			groupvideos.push(sessionvideos[i].content);
		}
	}
	
    var group = {
      name: $(e.target).find('[name=name]').val(),
      description: $(e.target).find('[name=description]').val(),
	  members: $(e.target).find('[name=members]').val(),
	  website: $(e.target).find('[name=website]').val(),
	  videos: groupvideos,
	  socialmedia: Session.get('socialmedia')
    };
	
    var errors = validategroup(group);
    if (errors.name || errors.description)
      return Session.set('groupSubmitErrors', errors);

    Groups.update(groupid, {$set: group}, function(error) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      Router.go('groupPage', {_id: groupid});  
    });
  }
});
