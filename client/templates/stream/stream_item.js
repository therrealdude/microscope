Template.streamItem.onRendered(function(){
	var control = $('#' + this.data.id);
	control.find('.content').popup({
		popup: control.find('.popup'),
		hoverable: true,
		position: 'bottom left'
	});
});

Template.streamItem.helpers({
	venue: function(){
		return Venues.findOne({_id: this.show.venue});
	}
});