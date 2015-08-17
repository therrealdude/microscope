Template.groupItem.events({
    'click #btnfollow': function(e){
        e.preventDefault();
        
        currentUser = People.findOne({userId: Meteor.userId()});
        
        var followers;
        if(this.followers){
            followers = this.followers.push(currentUser._id);
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