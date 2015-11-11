Template.venueList.helpers({
    venues: function(){
		var searchCriteria = Session.get('searchCriteria');
		if(!searchCriteria || (searchCriteria && searchCriteria.keywords === '' && (!searchCriteria.latitude || !searchCriteria.longitude || !searchCriteria.radius))) {
			Session.set('venueList', Venues.find().fetch());
		}
		else{
			Meteor.call('venueSearch', searchCriteria, function(error, result){
				if(error){
					Errors.throw(error.reason);
				}
				Session.set('venueList', result);
			});
		}
		return Session.get('venueList');
    }
});
