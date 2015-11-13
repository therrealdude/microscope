Template.streamItem.helpers({
	message: function(){
		console.log('Creating message');
		var ret = '';
		if (this.showFollowed){
			ret += 'You follow this show. ';
		}
		if (this.venueFollowed){
			ret += 'You follow this venue. ';
		}
		if (this.peopleFollowed){
			ret += 'You follow people in this show. ';
		}
		if (this.groupsFollowed){
			ret += 'You follow groups in this show.';
		}
		console.log(ret);
		return ret;
	}
});