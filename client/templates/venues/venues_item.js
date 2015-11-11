Template.venueItem.helpers({
    isAdmin: function(){
        return $.inArray(Meteor.userId(), this.administrators) != -1;
    }
});

Template.venueItem.events({
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
            if(following.venues){    
                following.venues.push(this._id);
            }
            else{
                following.venues = [this._id]
            }
        }
        else{
            following = {people: [], venues: [this._id], groups: [], shows: []};
        }
        
        People.update(currentUser._id, {$set: {following: following}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
        
        Venues.update(this._id, {$set: {followers: followers}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
    }
});