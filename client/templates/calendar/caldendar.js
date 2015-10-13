Template.calendar.onCreated(function(){
    Session.set('dateOffset', 0);
});

Template.calendar.helpers({
    showsCalendar: function(){
        var url = Router.current().route().getname();
        var shows = [];
        var dateOffSet = Session.get('dateOffset');
        
        var today = new Date();
        var startDate = today.setDate(today.getDate() + dateOffSet).setHours(0).setMinutes(0)
        var endDate = today.setDate(startDate.getDate() + dateOffSet + 7).setHours(0).setMinutes(0);
        
        var ret = [];
        
        if (url.indexOf('person') != -1){
            shows = Shows.find({'dates.0.people': this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: endDate}}).fetch();
        }
        else if (url.indexOf('group') != -1){
            shows = Shows.find({'dates.0.groups': this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: endDate}}).fetch();
        }
        else if (url.indexOf('venue') != -1){
            shows = Shows.find({venue: this._id,
                               'dates.0.date': {$gte: startDate},
                               'dates.0.date': {$lte: endDate}}).fetch();
        }
        else {
            shows.push(this);
        }
        for (var i = 0; i < shows.length; i++){
            for (var j = 0; j < shows[i].dates.length; j++){
                if(shows[i].dates[j].getDate() > startDate.getDate() + j 
                  && shows[i].dates[j].getDate() < startDate.getDate() + j + 1
                  && shows[i].dates[j].getDate() < endDate){
                    
                }
            }
        }
    }
});