Template.performersSearch.onCreated(function(){
	Session.set('showEditErrors', {});
	if (this.data){
		var dates = this.data.dates.length;
		var controls = [];
		for (var i = 0; i < dates; i++){
			_.extend(this.data.dates[i], {display: true});
			controls.push(this.data.dates[i]);
		}
		Session.set('showDateInfo', controls);
	}
	else{
		Session.set('showDateInfo', [{id: 'date0', display: true}]);
	}
	
});

Template.performersSearch.onRendered(function(){
	if(Session.get('showDateInfo')) {
		var dates = Session.get('showDateInfo');
		console.log(dates.length);
		if(dates.length > 0){
			for (var i = 0; i<dates.length; i++) {
				if (dates[i].performers){
					var val = [];
					for(var j = 0; j<dates[i].performers.groups.length; j++){
						val.push('g:' + dates[i].performers.groups[j]._id);
					}
					for(var j = 0; j<dates[i].performers.people.length; j++){
						val.push('p:' + dates[i].performers.people[j]._id);
					}
					$('#' + dates[i].id).find('[name=performersSearch]').dropdown({allowAdditions: true}).dropdown('set selected', val);
					console.log(dates[i].date.toISOString().replace('Z', '').replace(':00.000', '').replace('T', ' '));
					$('#' + dates[i].id).find('[name=showdate]').datetimepicker({defaultDate: dates[i].date.toISOString().replace('Z', '').replace(':00.000', '').replace('T', ' ')});
				}
				else{
					$('[name=performersSearch]').dropdown({allowAdditions: true});
					$('[name=showdate]').datetimepicker();
				}
			}
		}
		else {
			console.log('initialize empty search');
			$('[name=performersSearch]').dropdown({allowAdditions: true});
			$('[name=showdate]').datetimepicker();
		}
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
    },
	numShowDates: function(){
        var ret = [];
        if(Session.get('showDateInfo')) {
            ret = Session.get('showDateInfo');
        }
        return ret;
    },
	dateString: function(){
		if (this.date){
			return this.date.toISOString().replace('Z', '').replace(':00.000', '');
		}
		else {
			return '';
		}
    }
});

Template.performersSearch.events({
	'click input#btnAddDate': function(){
        var ret = Session.get('showDateInfo');
        ret.push({id: 'date' + ret.length, display: true, requests: {people: [], groups: []}});
        Session.set('showDateInfo', ret);
		setTimeout(function(){
			console.log($('#date' + (Session.get('showDateInfo').length - 1).toString()));
			$('#date' + (Session.get('showDateInfo').length - 1).toString()).find('[name=performersSearch]').dropdown({allowAdditions: true});
			$('#date' +(Session.get('showDateInfo').length - 1).toString()).find('[name=showdate]').datetimepicker();
		}, 100);
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
    }
});