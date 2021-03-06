Template.followButtons.onRendered(function(){
});

Template.followButtons.helpers({
	isFollowing: function(){
		var curPerson = People.findOne({userId: Meteor.userId()});
		if (curPerson) {
			return $.inArray(curPerson._id, this.followers) != -1;
		}
		else{
			return false;
		}
	}
})

Template.followButtons.events({
	'click .followbtn': function(e){
        e.preventDefault();
        currentUser = People.findOne({userId: Meteor.userId()});
		
		var isPerson = $(e.target).closest('.item').hasClass('person');
		var isGroup = $(e.target).closest('.item').hasClass('group');
		var isVenue = $(e.target).closest('.item').hasClass('venue');
		var isShow = $(e.target).closest('.item').hasClass('performance');
		var notificationItem = {personId: currentUser._id, recipients: [], type: ''};
		
        if(this.followers && this.followers.constructor === Array){
			this.followers.push(currentUser._id);
		}
        else{
            this.followers = [currentUser._id];
        }
        
		var collection;
		if (isPerson){
			if(currentUser.following && currentUser.following.people){
				currentUser.following.people.push(this._id);
			}
			else if (currentUser.following){
				currentUser.following.people = [this._id];
			}
			else{
				currentUser.following = {people: [this._id], groups: [], venues: [], shows: []}
			}
			notificationItem.type = notificationType_personFollow;
			notificationItem.recipients = this.userId;
			collection = People;
		}
		else if (isGroup){
			if(currentUser.following && currentUser.following.groups){
				currentUser.following.groups.push(this._id);
			}
			else if (currentUser.following){
				currentUser.following.groups = [this._id];
			}
			else{
				currentUser.following = {people: [], groups: [this._id], venues: [], shows: []}
			}
			notificationItem.type = notificationType_groupFollow;
			var admins = People.find({_id: {$in: this.members}}).fetch().map(function(p) {return p.userId;});
			notificationItem.recipients = admins;
			notificationItem.groupId = this._id;
			collection = Groups;
		}
		else if (isVenue){
			if(currentUser.following && currentUser.following.venues){
				currentUser.following.venues.push(this._id);
			}
			else if (currentUser.following){
				currentUser.following.venues = [this._id];
			}
			else{
				currentUser.following = {people: [], groups: [], venues: [this._id], shows: []}
			}
			notificationItem.type = notificationType_venueFollow;
			notificationItem.recipients = this.administrators;
			notificationItem.venueId = this._id;
			collection = Venues;
		}
		else if (isShow){
			if(currentUser.following && currentUser.following.shows){
				currentUser.following.shows.push(this._id);
			}
			else if (currentUser.following){
				currentUser.following.shows = [this._id];
			}
			else{
				currentUser.following = {people: [], groups: [], venues: [], shows: [this._id]}
			}
			notificationItem.type = notificationType_showFollow;
			notificationItem.recipients = this.administrators;
			notificationItem.showId = this._id;
			collection = Shows;
		}
        
        People.update(currentUser._id, {$set: {following: currentUser.following}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            }
        });
        
        collection.update(this._id, {$set: {followers: this.followers}}, function(error) {
            if(error){
                Errors.throw(error.reason);
            } else{
				Meteor.call('createNotification', notificationItem, function(error, result){
					if(error){
						Errors.throw(error.reason);
					}
				})
			}
        });
    },
	'click .unfollowbtn': function(e){
		e.preventDefault();
		currentUser = People.findOne({userId: Meteor.userId()});
		var collection;
		
		var isPerson = $(e.target).closest('.item').hasClass('person');
		var isGroup = $(e.target).closest('.item').hasClass('group');
		var isVenue = $(e.target).closest('.item').hasClass('venue');
		var isShow = $(e.target).closest('.item').hasClass('performance');
		
		if (isPerson){
			currentUser.following.people.pop(this._id);
			collection = People;
		}
		else if(isGroup){
			currentUser.following.groups.pop(this._id);
			collection = Groups;
		}
		else if(isVenue){
			currentUser.following.venues.pop(this._id);
			collection = Venues;
		}
		else if(isShow){
			currentUser.following.shows.pop(this._id);
			collection = Shows;
		}
		this.followers.pop(currentUser._id);
		
		People.update(currentUser._id, {$set: {following: currentUser.following}}, function(error){
			if (error){
				console.log(error);
			}
		});
		
		collection.update(this._id, {$set: {followers: this.followers}}, function(error){
			if (error){
				console.log(error);
			}
		});
	}
	
})