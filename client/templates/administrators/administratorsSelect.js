Template.administratorsSelect.onRendered(function(){
    if (this.data){
        $('#administrators').dropdown('set selected', this.data.administrators);
    }
    else{
        $('#administrators').dropdown('set selected', [Meteor.userId()]);
    }
});

Template.administratorsSelect.helpers({
    administrators: function(){
		return People.find().fetch().map(
			function(p){
				if (p.images){
					for (var i = 0; i<p.images.length; i++){
						if (p.images[i].primary){
							_.extend(p, {featuredImageID: p.images[i].response.public_id});
							return p;
						}
					}
				}
				return p;
			});
	}
});