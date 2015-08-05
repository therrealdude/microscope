Template.venueList.helpers({
    venues: function(){
    var searchCriteria = Session.get('searchCriteria');
    if(!searchCriteria || searchCriteria === ''){
        return Venues.find();
    }
    else{
        return Venues.find({name: {$regex: new RegExp(searchCriteria, "i")}});
    }
    }
});