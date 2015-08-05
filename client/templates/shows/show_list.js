Template.showList.helpers({
    shows: function(){
    var searchCriteria = Session.get('searchCriteria');
    if(!searchCriteria || searchCriteria === ''){
        return Shows.find();
    }
    else{
        return Shows.find({name: {$regex: new RegExp(searchCriteria, "i")}});
    }
    }
});