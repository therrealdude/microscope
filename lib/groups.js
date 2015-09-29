Groups = new Mongo.Collection('groups');

Groups.allow({
  update: function(userId, group) { return group.userId = userId; },
  remove: function(userId, group) { return group.userId = userId; },
});

Groups.deny({
  update: function(userId, group, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'name', 'description', 'members', 'following', 'website', 'videos', 'socialmedia').length > 0);
  }
});


Meteor.methods({
	groupInsert: function(groupAttributes) {
    check(Meteor.userId(), String);
    check(groupAttributes, {
      name: String,
      description: String,
	  members: [String],
	  website: String,
	  videos: [Object],
	  socialmedia: Object
    });
      
    var errors = validategroup(groupAttributes);
    if (errors.name || errors.description)
      throw new Meteor.Error('invalid-group', "You must set a name and description for your group");
    
    var groupWithSameName = Groups.findOne({name: groupAttributes.name});
    if (groupWithSameName) {
      return {
        groupExists: true,
        _id: groupWithSameName._id
      }
    }
	var admin = Meteor.user();
	var group = _.extend(groupAttributes, {
		admins: [admin._id],
        followers: []
	});
    var groupId = Groups.insert(group);
    return {
      _id: groupId
    };
  }
})

validategroup = function (group) {
  var errors = {};
  if (!group.name)
    errors.name = "Please fill in a name";
  if (!group.description)
    errors.description =  "Please fill in a description";
  if (!group.members || group.members == [])
	errors.members = "Group needs at least one member";
  return errors;
}