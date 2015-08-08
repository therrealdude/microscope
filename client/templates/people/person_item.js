Template.personItem.helpers({
    isPerson: function(){
        return this.userId === Meteor.userId();
    }
});