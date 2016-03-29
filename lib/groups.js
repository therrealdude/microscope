Groups = new Mongo.Collection('groups');

Groups.allow({
  update: function(userId, group, fieldNames, modifier) { 
    if(modifier['$set'] && modifier['$set'].followers) {
        return true;
    }
    else{
        var p = People.findOne({userId: userId});
        return isAdmin(p._id, group.members); 
    }
  },
  remove: function(userId, group) { return group.userId = userId; },
});

Groups.deny({
  update: function(userId, group, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'name', 'description', 'members', 'followers', 'website', 'videos', 'socialmedia').length > 0);
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
          socialmedia: Object,
          tags: [String]
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
  },
  groupUpdate: function(groupId, groupAttributes, imagesToDelete) {
    Groups.update(groupId, {$set: groupAttributes}, function(error) {
        // display the error to the user and abort
        if (error)
            Errors.throw(error.reason);
        else {
            if(imagesToDelete){
                for (var i = 0; i<imagesToDelete.length; i++){
                    Cloudinary.delete(imagesToDelete[i]);
                }
            }
        }
    });
    Meteor.call('tagsInsert', groupAttributes.tags, function(error, result){});
  }
});

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