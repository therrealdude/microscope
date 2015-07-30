Groups = new Mongo.Collection('groups');
GroupMembers = new Mongo.Collection('groupMembers');

Meteor.methods({
	groupInsert: function(groupAttributes) {
    check(Meteor.userId(), String);
    check(groupAttributes, {
      name: String,
      description: String
    });
      
    var errors = validategroup(groupAttributes);
    if (errors.name || errors.description)
      throw new Meteor.Error('invalid-group', "You must set a name and description for your group");
    
    var groupWithSameName = People.findOne({name: groupAttributes.name});
    if (groupWithSameName) {
      return {
        groupExists: true,
        _id: groupWithSameName._id
      }
    }
	
    var user = Meteor.user();
    var group = _.extend(groupAttributes, {
      userId: user._id
    });
    var groupId = People.insert(group);
    return {
      _id: groupId
    };
  }
})

validategroup = function (group) {
  var errors = {};
  if (!group.name)
    errors.title = "Please fill in a name";
  if (!group.description)
    errors.description =  "Please fill in a bio";
  return errors;
}