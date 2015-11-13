Template.showPage.onCreated(function(){
	Session.set('isAdmin', $.inArray(Meteor.userId(), this.data.admins) != -1);
	Session.set('acceptsSubmissions', this.data.acceptsSubmissions);
    Session.set('currentShow', this.data);
});

Template.showPage.onRendered(function(){
	for(var i = 0; i<this.data.dates.length; i++){
		$('#' + this.data.dates[i].id + ' .requestSlot').popup({
			popup : $('#' + this.data.dates[i].id + ' .custom.popup'),
			on    : 'click'
		  });
	}
})

Template.showPage.helpers({
    isAdmin: function() {
        return Session.get('isAdmin');
    },
	acceptsSubmissions: function(){
		return Session.get('acceptsSubmissions') && !Session.get('isAdmin');
	},
    performersList: function() {
        var ret = [];
        for(var i = 0; i<this.performers.people.length; i++){
            var person = People.findOne({_id: this.performers.people[i]._id});
            _.extend(person, {type: 'P'});
            ret.push(person);
        }
        for(var i = 0; i<this.performers.groups.length; i++){
            var group = Groups.findOne({_id: this.performers.groups[i]._id});
            _.extend(group, {type: 'G'});
            ret.push(group);
        }
        return ret;
    },
    isPerson: function() {
        return this.type === 'P';
    },
    isGroup: function() {
        return this.type === 'G';
    },
    formatDateString: function(){
        return this.date.toLocaleString();
    },
	currentUser: function(){
		return People.find({userId: Meteor.userId()}).fetch();
	},
	userGroups: function(){
		var person = People.findOne({userId: Meteor.userId()});
		return Groups.find({members: person._id}).fetch();
	},
	numberRequests: function(){
		return this.requests.people.length + this.requests.groups.length;
	}
});

Template.showPage.events({
	'click .btnclose': function(e){
		e.preventDefault();
		$(e.target).closest('.popup').popup('hide all');
	},
    'click .request': function(e){
		e.preventDefault();
		
        var popup = $(e.target).closest('.popup');
        var requests;
        if(this.requests){
            requests = this.requests;
        }
        else{
            requests = {people: [], groups: []};
        }
        
        var yourself = popup.find('input[name=chooseYourself]');
        var groups = popup.find('input[name=chooseGroup]');
        
        if(yourself.prop('checked')){
            requests.people.push({id: yourself.attr('id'), status: 'Pending', message: ''});
        }
        for(var i = 0; i < groups.length; i++){
			var addGroup = groups[i].checked;
            if(addGroup){
                requests.groups.push({id: groups[i].id, status: 'Pending', message: ''});
            }
        }
        
        this.requests = requests;
        var show = Session.get('currentShow');
        for(var i = 0; i<show.dates.length; i++){
            if(show.dates[i].id === this.id){
                show.dates[i] = this;
            }
        }
		
		var showid = show._id;
        Shows.update(showid, {$set: {dates: show.dates}}, function(error){
            if(error){
                Error.throw(error.reason);
            }
        });
    }
})