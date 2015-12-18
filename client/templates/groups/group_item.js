Template.groupItem.helpers({
    canEdit: function(){
        var currentPerson = People.findOne({userId: Meteor.userId()});
		console.log(this.members);
        return $.inArray(currentPerson._id, this.members) != -1;
    }
});

Template.groupItem.events({
    'click #btnfollow': function(e){
        e.preventDefault();
        
        currentUser = People.findOne({userId: Meteor.userId()});
        
        var followers = [];
        if(this.followers && this.followers.constructor === Array){
            followers = this.followers;
			followers.push(currentUser._id);
        }
        else{
            followers = [currentUser._id];
        }
        
        var following;
        if(currentUser.following) {
            following = currentUser.following;
            if(following.groups){    
                following.groups.push(this._id);
            }
            else{
                following.groups = [this._id]
            }
        }
        else{
            following = {people: [], venues: [], groups: [this._id], shows: []};
        }
        
        People.update(currentUser._id, {$set: {following: following}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
        
        Groups.update(this._id, {$set: {followers: followers}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
    }
});