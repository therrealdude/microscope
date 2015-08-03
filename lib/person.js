People = new Mongo.Collection('people');

People.allow({
  update: function(userId, person) { return person.userId = userId; },
  remove: function(userId, person) { return person.userId = userId; },
});

People.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'name', 'bio').length > 0);
  }
});

Meteor.methods({
  personInsert: function(personAttributes) {
    check(Meteor.userId(), String);
    check(personAttributes, {
      name: String,
      bio: String
    });
      
    var errors = validatePerson(personAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-person', "You must set a name and bio for your person");
	
    var user = Meteor.user();
    var person = _.extend(personAttributes, {
      userId: user._id
    });
    var personId = People.insert(person);
    return {
      _id: personId
    };
  }
});

validatePerson = function (person) {
  var errors = {};
  if (!person.name)
    errors.title = "Please fill in a name";
  if (!person.bio)
    errors.bio =  "Please fill in a bio";
  return errors;
}