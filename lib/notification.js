Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && 
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

Meteor.methods({
	createNotification: function(item) {
		notification_create(item);
	},
	createMultipleNotifications: function(items){
		for(var i = 0; i<items.length; i++)
		{
			notification_create(items[i])
		}
	}
});

notification_create = function(item){
	if (item.type === notificationType_personFollow){
		notificationType_personFollow_create(item);
	}
	else if (item.type === notificationType_venueFollow){
		notificationType_venueFollow_create(item);
	}
	else if (item.type === notificationType_showFollow){
		notificationType_showFollow_create(item);
	}
	else if (item.type === notificationType_groupFollow){
		notificationType_groupFollow_create(item);
	}
	else if (item.type === notificationType_showRequestPerson){
		notificationType_showRequestPerson_create(item);
	}
	else if (item.type === notificationType_showRequestGroup){
		notificationType_showRequestGroup_create(item);
	}
	else if (item.type === notificationType_showAnswerPerson){
		notificationType_showAnswerPerson_create(item);
	}
	else if (item.type === notificationType_showAnswerGroup){
		notificationType_showAnswerGroup_create(item);
	}
}

notificationType_personFollow_create = function(item){
	//{{person}} is following you
	Notifications.insert({
		personId: item.personId,
		userId: item.recipients,
		read: false,
		type: notificationType_personFollow,
		dateAdded: new Date()
	});
};

notificationType_venueFollow_create = function(item){
	//{{person}} is following {{venue}}.
	for (var i = 0; i< item.recipients.length; i++){
		Notifications.insert({
			personId: item.personId,
			venueId: item.venueId,
			userId: item.recipients[i],
			read: false,
			type: notificationType_venueFollow,
			dateAdded: new Date()
		});
	}
};

notificationType_showFollow_create = function(item){
	//{{person}} is following {{show}}.
	for (var i = 0; i<item.recipients.length; i++){
		Notifications.insert({
			personId: item.personId,
			showId: item.showId,
			userId: item.recipients[i],
			read: false,
			type: notificationType_showFollow,
			dateAdded: new Date()
		});
	}
};

notificationType_groupFollow_create = function(item){
	//{{person}} is following {{group}}.
	for(var i = 0; i<item.recipients.length; i++){
		Notifications.insert({
			personId: item.personId,
			groupId: item.groupId,
			userId: item.recipients[i],
			read: false,
			type: notificationType_groupFollow,
			dateAdded: new Date()
		});
	}
};

notificationType_showRequestPerson_create = function(item){
	//{{person}} requested a slot in {{show}} on {{date}}.
	for (var i = 0; i < item.recipients.length; i++){
		Notifications.insert({
			personId: item.personId,
			showId: item.showId,
			date: item.date,
			userId: item.recipients[i],
			read: false,
			type: notificationType_showRequestPerson,
			dateAdded: new Date()
		});
	}
};

notificationType_showRequestGroup_create = function(item){
	//{{group}} has requested a slot in {{show}} on {{date}}.
	for (var i = 0; i < item.recipients.length; i++){
		Notifications.insert({
			groupId: item.groupId,
			showId: item.showId,
			date: item.date,
			userId: item.recipients[i],
			read: false,
			type: notificationType_showRequestGroup,
			dateAdded: new Date()
		});
	}
};

notificationType_showAnswerPerson_create = function(item){
	//Your request to be in {{show}} on {{date}} has been {{status}}.
	Notifications.insert({
		showId: item.showId,
		date: item.date,
		status: item.status,
		userId: items.recipients,
		read: false,
		type: notificationType_showAnswerPerson,
		dateAdded: new Date()
	});
};

notificationType_showAnswerGroup_create = function(item){
	//Your request for {{group}} to be in {{show}} on {{date}} has been {{status}}.
	for (var i = 0; i < item.recipients.length; i++){
		Notifications.insert({
			groupId: item.groupId,
			showId: item.showId,
			date: item.date,
			status: item.status,
			userId: item.recipients[i],
			read: false,
			type: notificationType_showAnswerGroup,
			dateAdded: new Date()
		});
	}
};