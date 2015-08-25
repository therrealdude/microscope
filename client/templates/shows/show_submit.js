Template.showSubmit.onCreated(function(){
    Session.set('showSubmitErrors', {});
    Session.set('showDateInfo', [{id: 'date0', display: true}]);
});

Template.performersSearch.onRendered(function(){
    $('select#performersSearch').dropdown({allowAdditions: true});
});

Template.venueSearch.onRendered(function(){
    $('select#venueSearch').dropdown();
});

Template.showSubmit.helpers({
    errorMessage: function(field){
        return Session.get('showSubmitErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('showSubmitErrors')[field] ? 'has-error' : '';
    },
    numShowDates: function(){
        var ret = [];
        if(Session.get('showDateInfo')) {
            ret = Session.get('showDateInfo');
        }
        return ret;
    }
});

Template.showSubmit.events({
    'click input#btnAddDate': function(){
        var ret = Session.get('showDateInfo');
        ret.push({id: 'date' + ret.length, display: true});
        Session.set('showDateInfo', ret);
    },
    'click input.removeDate': function(e){
        var info = Session.get('showDateInfo');
        var id = $(this).attr('id');
        for(var i = 0; i < info.length; i++)
        {
            if(id === info[i].id){
                info[i].display = false;
            }
        }
        Session.set('showDateInfo', info);
    },
    'submit form': function(e){
        e.preventDefault();
        
        var dates = [];
        var showDateInfo = Session.get('showDateInfo');
        for (var i = 0; i < showDateInfo.length; i++) {
            if(showDateInfo[i].display){
                var control = $(e.target).find('#' + showDateInfo[i].id);
                var performers = control.find('[name=performersSearch]').val();
                var people = [];
                var groups = [];
                for (var i = 0; i<performers.length; i++){
                    if(performers[i].indexOf('p:') != -1){
                        people.push({_id: performers[i].replace('p:', '')});
                    }
                    if(performers[i].indexOf('g:') != -1){
                        groups.push({_id: performers[i].replace('g:', '')});
                    }
                }
                var performersList = {groups: groups, people: people};
                dates.push({date: new ISODate(control.find('[name=showdate]').val()), 
                            performers: performersList});
            }
        }
        
        var show = {name: $(e.target).find('[name=name]').val(),
                    description: $(e.target).find('[name=description]').val(),
                    venue: $(e.target).find('[name=venueSearch]').val(),
                    acceptsSubmissions: $(e.target).find('[name=acceptsSubmissions]').val() === "on",
                    ticketPrice: $(e.target).find('[name=ticketPrice]').val(),
                    dates: dates
                   };
        
        var errors = validateShow(show);
        var check = {};
        if(errors === check){
            return Session.set('showSubmitErrors', errors);
        }
        
        Meteor.call('showInsert', show, function(error, result){
            if(error){
                Errors.throw(error.reason);
            }
            
            Router.go('showList');
        });
    }
});

Template.venueSearch.helpers({
    venuesSearch: function(){
        return Venues.find();
    }
});

Template.performersSearch.helpers({
    performers: function(){
        var ret = [];
        People.find().map(function(p){
            ret.push({_id: 'p:' + p._id, name: p.name});
        });
        Groups.find().map(function(g){
            ret.push({_id: 'g:' + g._id, name: g.name});
        });
        return ret;    
    }
});
    