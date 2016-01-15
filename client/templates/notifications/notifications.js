Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId()}, {sort: {dateAdded: -1}}, {limit: 10});
  },
  notificationCount: function(){
      return Notifications.find({userId: Meteor.userId(), read: false}).count();
  },
  hasNotifications: function(){
	  return Notifications.find({userId: Meteor.userId()}).count() > 0;
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
    return Router.routes.postPage.path({_id: this.postId});
  },
  followPerson: function(){
	  return this.type === notificationType_personFollow;
  },
  followGroup: function(){
	  return this.type === notificationType_groupFollow;
  },
  followShow: function(){
	  return this.type === notificationType_showFollow;
  },
  followVenue: function(){
	  return this.type === notificationType_venueFollow;
  },
  showRequestPerson: function(){
	  return this.type === notificationType_showRequestPerson;
  },
  showRequestGroup: function(){
	  return this.type === notificationType_showRequestGroup;
  },
  showAnswerPerson: function(){
	  return this.type === notificationType_showAnswerPerson;
  },
  showAnswerGroup: function(){
	  return this.type === notificationType_showAnswerGroup;
  },
  personName: function(){ 
	  var person = People.findOne({_id: this.personId});
	  if(person){
		return person.name;
	  }
	  return '';
  },
  personRoute: function(){
	  return Router.routes.personPage.path({_id: this.personId});
  },
  groupName: function(){
	  var group = Groups.findOne({_id: this.groupId});
	  if(group){
		return group.name;
	  }
	  return '';
  },
  groupRoute: function(){
	  return Router.routes.groupPage.path({_id: this.groupId});
  },
  showName: function(){
	  var show = Shows.findOne({_id: this.showId});
	  if(show){
		return show.name;
	  }
	  return '';
  },
  showRoute: function(){
	  return Router.routes.showPage.path({_id: this.showId});
  },
  venueName: function() { 
      var venue = Venues.findOne({_id: this.venueId});
	  if (venue){
		return venue.name;
	  }
	  return '';
  },
  venueRoute: function(){
	  return Router.routes.venuePage.path({_id: this.venueId});
  }
});

Template.notifications.events({
  'click #notifications': function() {
	var notes = Notifications.find({userId: Meteor.userId(), read: false}).fetch();
	for (var i = 0; i<notes.length; i++){
		Notifications.update(notes[i]._id, {$set: {read: true}});
	}
  }
});