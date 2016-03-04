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
      isPerformer: $(e.target).find('[name=isPerformer]').prop('checked'),
	  videos: Session.get('videosToSave'),
	  socialmedia: Session.get('socialmedia'),
      images: Cloudinary.collection.find().fetch(),
      tags: $(e.target).find('[name=tags]').val()
    }
    
    var errors = validatePerson(personProperties);
    if (errors.name || errors.bio)
      return Session.set('personEditErrors', errors);
    
    Meteor.call('personUpdate', currentPersonId, personProperties, Session.get('imagesToDelete'), function(error, result){
        if(error){
            console.log(error.reason);
        }
        Router.go('personPage', {_id: currentPersonId});
      }
    );
  }
});