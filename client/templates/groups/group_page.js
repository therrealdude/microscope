Template.groupPage.helpers({
	groupMembers: function() {
		var group = Groups.findOne({_id: this._id});
		return group.members.map(function(m){
			var person = People.findOne({_id: m});
			if(person){
				return person;
			}
			else{
				return {name: m};
			}
		});
	}
});

toTitleCase = function(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

hasID = function(m){
	return this._id != undefined;
}
