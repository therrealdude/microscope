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
            followers = this.followers.push(currentUser._id);
        }
        else{
            followers = [currentUser._id];
        }
        
        var following;
        if(currentUser.following) {
            following = currentUser.following;
            if(following.people){    
                following.people.push(this._id);
            }
            else{
                following.people = [this._id]
            }
        }
        else{
            following = {people: [this._id], venues: [], groups: [], shows: []};
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