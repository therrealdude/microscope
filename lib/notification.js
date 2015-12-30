Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && 
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

Meteor.methods({
	createNotification: function(notification) {
		if (notification.type === ''){
			
		}
		else if (notification.type === ''){
			
		}
	}
})



createCommentNotification = function(comment) {
  var post = Posts.findOne(comment.postId);
  if (comment.userId !== post.userId) {
    Notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};

createPersonRequestNotification = function (request, show) {
	if (Meteor.IsServer){
		
	}
}

createGroupRequestNotification = function(request, show){
	if (Meteor.IsServer){
		
	}
}

createPersonRequestResponseNotification = function(changedItem, show) {
	if(Meteor.IsServer){
        for (var i = 0; i<show.administrators.length; i++){
          Notifications.insert({
              userId: show.administrators[i],
              show_id: show._id,
              date: changedItem.date,
              person_id: changedItem.person._id,
              status: changedItem.status,
			  type: 'PersonRequestResponse',
			  read: false
          });
        }
    }
};

createGroupRequestResponseNotification = function(changedItem, show) {
	if(Meteor.IsServer){
        for (var i = 0; i<show.administrators.length; i++){
          Notifications.insert({
              userId: show.administrators[i],
              show_id: show._id,
              date: changedItem.date,
              group_id: changedItem.person._id,
              status: changedItem.status,
			  type: 'GroupRequestResponse',
			  read: false
          });
        }
    }
};