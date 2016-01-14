Template.notificationsPage.helpers({
	notifications: function() {
		return Notifications.find({userId: Meteor.userId()});
	}
});