Template.showPage.onCreated(function(){
	Session.set('isAdmin', $.inArray(Meteor.userId(), this.data.admins));
	Session.set('acceptsSubmissions', this.data.acceptsSubmissions);
    Session.set('currentShow', this.data);
});

Template.showPage.onRendered(function(){
	$('.requestSlot').popup({
		popup : $('.custom.popup'),
		on    : 'click'
	  });
})

Template.showPage.helpers({
    isAdmin: function() {
        return Session.get('isAdmin');
    },
	acceptsSubmissions: function(){
		return Session.get('acceptsSubmissions');
	},
    performersList: function() {
        var ret = [];
        for(var i = 0; i<this.performers.people.length; i++){
            var person = People.findOne({_id: this.performers.people[i]._id});
            _.extend(person, {type: 'P'});
            ret.push(person);
        }
        for(var i = 0; i<this.performers.groups.length; i++){
            var group = People.findOne({_id: this.performers.groups[i]._id});
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
	}
});

Template.showPage.events({
    'click .request': function(e){
        var popup = $(e.target).closest('.popup');
        var requests;
        if(this.data.requests){
            requests = this.data.requests;
        }
        else{
            requests = {people: [], groups: []};
        }
        
        var yourself = popup.find('input.chooseYourself');
        var groups = popup.find('input.chooseGroup');
        
        if(yourself.prop('checked')){
            requests.people.push(yourself.attr('id'));
        }
        for(var i = 0; i< groups.length; i++){
            if(groups[i].attr('checked')){
                requests.groups.push({id: groups[i].attr(id), status: 'Pending', message: ''});
            }
        }
        
        this.data.requests = requests;
        var show = Session.get('currentShow');
        for(var i = 0; i<show.dates; i++){
            if(show.dates[i].id === this.data.id){
                show.dates[i] = this.data;
            }
        }
        Shows.update(show._id, {$set: show}, function(error){
            if(error){
                Error.throw(error.reason);
            }
        });
    }
})