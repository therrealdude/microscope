Template.showPage.onCreated(function(){
	Session.set('isAdmin', $.inArray(Meteor.userId(), this.data.administrators) != -1);
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
	for(var i = 0; i<this.data.dates.length; i++){
		$('#' + this.data.dates[i].id + ' .viewRequests').popup({
			popup : $('#' + this.data.dates[i].id + ' .custom.popup'),
			on    : 'click'
		  });
		  for (var j = 0; j<this.data.dates[i].requests.people.length; j++){
			  $('#' + this.data.dates[i].requests.people[j].id + '.personstatusddl').dropdown('set selected', this.data.dates[i].requests.people[j].status);
		  }
		  for (var j = 0; j<this.data.dates[i].requests.groups.length; j++){
			  $('#' + this.data.dates[i].requests.groups[j].id + '.groupstatusddl').dropdown('set selected', this.data.dates[i].requests.groups[j].status);
		  }
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
			if (person){
				_.extend(person, {type: 'P'});
				ret.push(person);
			}
        }
        for(var i = 0; i<this.performers.groups.length; i++){
            var group = Groups.findOne({_id: this.performers.groups[i]._id});
			if(group){
				_.extend(group, {type: 'G'});
				ret.push(group);
			}
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
	},
	getPerson: function(){
		return _.extend(People.findOne({_id: this.id}), {status: this.status});
	},
	getGroup: function() {
		return _.extend(Groups.findOne({_id: this.id}), {status: this.status});
	},
	disabledPersonClass: function() {
		return this.requests && $.inArray(this.requests.people, this._id) ? "disabled" : "";
	},
	disabledPersonAttribute : function () {
		return this.requests && $.inArray(this.requests.people, this._id) ? 'disabled="disabled"' : "";
	},
	personTitle : function () {
		return this.requests && $.inArray(this.requests.people, this._id) ? 'You are already in this show' : 'Check to request a slt in this show';
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
		var addedRequests = [];
		var show = Template.parentData();
		
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
			addedRequests.push({
				personId: yourself.attr('id'), 
				date: this.date, 
				showId: show._id, 
				type: notificationType_showRequestPerson, 
				recipients: show.administrators});
        }
        for(var i = 0; i < groups.length; i++){
			var addGroup = groups[i].checked;
            if(addGroup){
                requests.groups.push({id: groups[i].id, status: 'Pending', message: ''});
				addedRequests.push({
					groupId: groups[i].id, 
					date: this.date, 
					showId: show._id, 
					type: notificationType_showRequestGroup,
					recipients: show.administrators});
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
                console.log(error.reason);
            }
			else {
				Meteor.call('createMultipleNotifications', addedRequests, function(error, result){
					if (error){
						console.log(error);
					}
				});
			}
        });
    },
	'click .updateRequests': function(e){
		e.preventDefault();
		var show = Template.parentData();
		var popup = $(e.target).closest('.popup');
		
		for (var i = 0; i<show.dates.length; i++){
			if(show.dates[i].id === popup.attr('id')){
				var changedItems = {people: [], groups: []};
				for (var p = 0; p<show.dates[i].requests.people.length; p++){
					var status = popup.find('.personstatusddl ' + '#' + show.dates[i].requests.people[p].id).val();
					show.dates[i].requests.people[p].status = status;
					if(status === 'Accepted'){
						show.dates[i].performers.people.push({_id: show.dates[i].requests.people[p].id});
						changedItems.push({
							personId: show.dates[i].requests.people[p]._id, 
							recipients: show.dates[i].requests.people[p].userId,
							showId: show._id,
							date: show.dates[i].date,
							status: status,
							type: notificationType_showAnswerPerson});
					}
					else if(status === 'Declined'){
						show.dates[i].performers.people.pop({_id: show.dates[i].requests.people[p].id});
						changedItems.push({
							personId: show.dates[i].requests.people[p]._id, 
							recipients: show.dates[i].requests.people[p].userId,
							showId: show._id,
							date: show.dates[i].date,
							status: status,
							type: notificationType_showAnswerPerson});
					}
					else{
						show.dates[i].performers.people.pop({_id: show.dates[i].requests.people[p].id});
					}
				}
				for (var p = 0; p<show.dates[i].requests.groups.length; p++){
					var status = popup.find('.groupstatusddl ' + '#' + show.dates[i].requests.groups[p].id).val();
					show.dates[i].requests.group[p].status = status;
					var recipients = People.find({_id: {$in: show.dates[i].requests.groups[p].members}}).fetch().map(function(u) {return u.userId});
					if(status === 'Accepted'){
						show.dates[i].performers.groups.push({_id: show.dates[i].requests.groups[p].id});
						changedItems.groups.push({
							groupId: show.dates[i].requests.groups[p]._id, 
							recipients: recipients,
							showId: show._id,
							status: status, 
							date: show.dates[i].date,
							type: notificationType_showAnswerGroup});
					}
					else if (status === 'Declined'){
						show.dates[i].groups.pop({_id: show.dates[i].requests.groups[p].id});
						changedItems.groups.push({
							groupId: show.dates[i].requests.groups[p]._id, 
							recipients: recipients,
							showId: show._id,
							status: status, 
							date: show.dates[i].date,
							type: notificationType_showAnswerGroup});
					}
					else{
						show.dates[i].performers.groups.pop({_id: show.dates[i].requests.groups[p].id});
					}
				}
				Shows.update(show._id, {$set: {dates: show.dates}}, function(error){
					if(error){
						console.log(error);
					} 
					else{
						Meteor.call('createMultipleNotifications', changedItems, function(error, result){
							if(error){
								Errors.throw(error.reason);
							}
						});
					}
				});
			}
		}
	}
})