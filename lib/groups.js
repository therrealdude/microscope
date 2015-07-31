Groups = new Mongo.Collection('groups');
GroupMembers = new Mongo.Collection('groupMembers');

Meteor.methods({
	groupInsert: function(groupAttributes) {
    check(Meteor.userId(), String);
    check(groupAttributes, {
      name: String,
      description: String,
	  members: [String]
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
		admins: [admin._id]
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