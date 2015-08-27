
Template.showList.helpers({
    shows: function(){
		
		var searchCriteria = Session.get('searchCriteria');
		
		if((searchCriteria === undefined) ||
		((searchCriteria.keywords === undefined || searchCriteria.keywords === '') &&
		(searchCriteria.startdate === undefined || searchCriteria.startdate === '' || searchCriteria.enddate === undefined || searchCriteria.enddate === '') &&
		(searchCriteria.latitude === undefined || searchCriteria.latitude === '' || searchCriteria.longitude === undefined || searchCriteria.longitude === '' || searchCriteria.radius === undefined || searchCriteria.radius === '')))
		{
			Session.set('showList', Shows.find().fetch());
		}
		else{
			Meteor.call('searchShows', searchCriteria, function(error, result){
				if(error){
					Errors.throw(error.reason);
				}
				Session.set('showList', result);
			});
		}
		
		return Session.get('showList');
    }
});


