Template.showList.helpers({
    shows: function(){
		var searchCriteria = Session.get('searchCriteria');
		var includeKeywords = searchCriteria != undefined && searchCriteria.keywords != undefined && searchCriteria.keywords != '';
		var includeDates = searchCriteria != undefined && searchCriteria.startdate != undefined && searchCriteria.enddate != undefined && searchCriteria.startdate != '' && searchCriteria.enddate != '';
		var includeLocation = searchCriteria != undefined && searchCriteria.latitude != undefined && searchCriteria.longitude != undefined && searchCriteria.radius != undefined && searchCriteria.longitude != '' && searchCriteria.latitude != '' && searchCriteria.radius != '';
		
		if(includeKeywords && includeDates && includeLocation){
			var venues = getVenues(searchCriteria);
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
			'dates.0.date': {$elemMatch: {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }},
			venue: {$in: venues}});
		}
		else if(includeKeywords && includeDates){
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, 
			'dates.0.date': {$elemMatch: {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }}});
		}
		else if(includeKeywords && includeLocation){
			var venues = getVenues(searchCriteria);
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
			venue: {$in: venues}});
		}
		else if(includeDates && includeLocation){
			var venues = getVenues(searchCriteria);
			return Shows.find({'dates.0.date': {$elemMatch: {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }}, 
			venue: {$in: venues}});
		}
		else if(includeKeywords){
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}});
		}
		else if(includeDates){
			return Shows.find({'dates.0.date': {$elemMatch: {$gte: new Date(searchCriteria.startdate), $lte: new Date(searchCriteria.enddate) }}});
		}
		else if(includeLocation){
			var venues = getVenues(searchCriteria);
			return Shows.find({venue: {$in: venues}});
		}
		else{
			return Shows.find();
		}
    }
});

var getVenues = function(searchCriteria){
	var equatorialRadiusMiles = 3963.2;
	return Venues.find({loc: {$geoWithin: {$centerSphere: [[parseFloat(searchCriteria.longitude), parseFloat(searchCriteria.latitude)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]}}}).map(function(v) {return v._id});
}

