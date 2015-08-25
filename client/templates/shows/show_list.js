Template.showList.helpers({
    shows: function(){
		var searchCriteria = Session.get('searchCriteria');
		var includeKeywords = searchCriteria && searchCriteria.keywords && searchCriteria.keywords != '';
		var includeDates = searchCriteria && searchCriteria.startdate && searchCriteria.enddate && searchCriteria.startdate != '' && searchCriteria.enddate != '';
		var includeLocation = searchCriteria && searchCriteria.lat && searchCriteria.lng && searchCriteria.radius && searchCriteria.lng != '' && searchCriteria.lat != '' && searchCriteria.radius != '';
		var equatorialRadiusMiles = 3963.2;
		
		if(includeKeywords && includeDates && includeLocation){
			var venues = Venues.find({geoWithin : {$centerSphere: [[parseFloat(searchCriteria.lat), parseFloat(searchCriteria.lng)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]}}).map(function(v) {return v._id});
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
			'dates.0.date': {$elemMatch: {$gt: new ISODate(searchCriteria.startdate), $lt: new ISODate(searchCriteria.enddate) }},
			venue: {$in: venues}});
		}
		else if(includeKeywords && includeDates){
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, 
			'dates.0.date': {$elemMatch: {$gt: new ISODate(searchCriteria.startdate), $lt: new ISODate(searchCriteria.enddate) }}});
		}
		else if(includeKeywords && includeLocation){
			var venues = Venues.find({geoWithin : {$centerSphere: [[parseFloat(searchCriteria.lat), parseFloat(searchCriteria.lng)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]}}).map(function(v) {return v._id});
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")},
			venue: {$in: venues}});
		}
		else if(includeDates && includeLocation){
			var venues = Venues.find({geoWithin : {$centerSphere: [[parseFloat(searchCriteria.lat), parseFloat(searchCriteria.lng)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]}}).map(function(v) {return v._id});
			return Shows.find({venue: {$in: venues}});
		}
		else if(includeKeywords){
			return Shows.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}});
		}
		else if(includeDates){
			return Shows.find({'dates.0.date': {$elemMatch: {$gt: new ISODate(searchCriteria.startdate), $lt: new ISODate(searchCriteria.enddate) }}});
		}
		else if(includeLocation){
			var venues = Venues.find({geoWithin : {$centerSphere: [[parseFloat(searchCriteria.lat), parseFloat(searchCriteria.lng)], parseFloat(searchCriteria.radius)/equatorialRadiusMiles]}}).map(function(v) {return v._id});
			return Shows.find({venue: {$in: venues}});
		}
		else{
			return Shows.find();
		}
    }
});