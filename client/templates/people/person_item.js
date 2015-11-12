Template.personItem.helpers({
    isPerson: function(){
        return this.userId === Meteor.userId();
    },
	isFollowing: function(){
		var curPerson = People.findOne({userId: Meteor.userId()});
		return $.inArray(curPerson._id, this.followers) != -1;
	}
});

Template.personItem.events({
    
});