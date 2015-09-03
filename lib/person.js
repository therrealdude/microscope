People = new Mongo.Collection('people');

People.allow({
  update: function(userId, person, fieldNames, modifier) {
      if(modifier['$set'] && modifier['$set'].followers) {
        return true;
      }
      else{
        return isPerson(userId, person); 
      }
  },
  remove: function(userId, person) { return isPerson(userId, person); },
  insert: function(userId, person) {return isPerson(userId, person)}
});

People.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'name', 'bio', 'followers', 'following', 'videos', 'socialmedia', 'website').length > 0);
  }
});

Meteor.methods({
  personInsert: function(personAttributes) {
    check(Meteor.userId(), String);
    check(personAttributes, {
      name: String,
      bio: String,
	  website: String,
	  videos: [String],
	  socialmedia: Object
    });
      
    var errors = validatePerson(personAttributes);
    if (errors.name || errors.url)
      throw new Meteor.Error('invalid-person', "You must set a name and bio for your person");
    if (errors.duplicate)
        throw new Meteor.Error('invalid-person', "This person has already been submitted.");
	
    var user = Meteor.user();
    if(People.find({userId: user._id}).length > 0){
        return {personExists: true};
    }
    var person = _.extend(personAttributes, {
      userId: user._id,
      followers: [],
      following: {people: [], venues: [], groups: [], shows: []}
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
    errors.name = "Please fill in a name";
  if (!person.bio)
    errors.bio =  "Please fill in a bio";
  if(People.findOne({userId: Meteor.userId()})) {
    errors.duplicate = "This user already has information";
  }
  return errors;
}