Template.showItem.helpers({
	hasDistance: function(){
		this.distance != undefined;
	}
});

Template.showItem.events({
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
            if(following.shows){    
                following.shows.push(this._id);
            }
            else{
                following.shows = [this._id]
            }
        }
        else{
            following = {people: [], venues: [], groups: [], shows: [this._id]};
        }
        
        People.update(currentUser._id, {$set: {following: following}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
        
        Shows.update(this._id, {$set: {followers: followers}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
    }
});