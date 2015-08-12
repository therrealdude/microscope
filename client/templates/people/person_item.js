Template.personItem.helpers({
    isPerson: function(){
        return this.userId === Meteor.userId();
    }
});

Template.personItem.events({
    'click .followbtn': function(e){
        e.preventDefault();
        
        currentUser = People.findOne({userId: Meteor.userId()});
        
        var followers;
        if(this.followers){
            followers = this.followers.push(currentUser.userId);
        }
        else{
            followers = [currentUser.userId];
        }
        
        var following;
        if(currentUser.following) {
            following = currentUser.following;
            following.push(this._id);
        }
        else{
            following = [this._id];
        }
        
        People.update(currentUser._id, {$set: {following: following}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
        
        People.update(this._id, {$set: {followers: followers}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
    }
});