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
	},
	dateString: function(){
		var dateStr = '';
		if (this.date.getTime() > 11){	
			this.date.setHours(this.date.getHours() - 12);
			dateStr = this.date.toISOString().replace('Z', '').replace(':00.000', '').replace('T0', ' ').replace('T', ' ') + ' PM';
		}
		else{
			dateStr = this.date.toISOString().replace('Z', '').replace(':00.000', '').replace('T0', ' ').replace('T', ' ') + ' AM';
		}
		return dateStr;
	}
});