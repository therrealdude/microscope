People = new Mongo.Collection('people');

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
    
    var personWithSameName = People.findOne({name: personAttributes.name});
    if (personWithSameName) {
      return {
        personExists: true,
        _id: personWithSameLink._id
      }
    }
	
    var user = Meteor.user();
    var person = _.extend(personAttributes, {
      userId: user._id
    });
    var personId = People.insert(person);
    return {
      _id: personId
    };
  }
})

validatePerson = function (person) {
  var errors = {};
  if (!person.name)
    errors.title = "Please fill in a name";
  if (!person.bio)
    errors.bio =  "Please fill in a bio";
  return errors;
}