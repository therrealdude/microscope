Template.streamItem.helpers({
	message: function(){
		console.log('Creating message');
		var ret = [];
		if (this.showFollowed){
			ret.push('You follow this show.');
		}
		if (this.venueFollowed){
			ret.push('You follow this venue.');
		}
		if (this.peopleFollowed){
			for (var i = 0; i < this.peopleFollowed.length; i++){
				var person = People.findOne({_id: this.peopleFollowed[i]});
				ret.push('You follow <a href="/person/' + this.peopleFollowed[i] + '">' + person.name + '.</a>');
			}
		}
		if (this.groupsFollowed){
			ret.push('You follow groups in this show.');
		}
		
		return ret;
	},
	venue: function(){
		return Venues.findOne({_id: this.show.venue});
	}
});