// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}

hasLink = function(personID) {
	return People.find({_id: personID}).count;
}

//check if 
isPerson = function(userId, person) {
  return person.userId === userId;
}