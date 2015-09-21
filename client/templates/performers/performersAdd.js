Template.performersSearch.helpers({
    performers: function(){
        var ret = [];
        People.find().map(function(p){
            ret.push({_id: 'p:' + p._id, name: p.name});
        });
        Groups.find().map(function(g){
            ret.push({_id: 'g:' + g._id, name: g.name});
        });
        return ret;    
    }
});

Template.performersSearch.onRendered(function(){
	if(this.data && this.data.performers) {
		var val = [];
		for(var j = 0; j<this.data.performers.groups.length; j++){
			val.push('g:' + this.data.performers.groups[j]._id);
		}
		for(var j = 0; j<this.data.performers.people.length; j++){
			val.push('p:' + this.data.performers.people[j]._id);
		}
		
		$('#' + this.data.id).find('[name=performersSearch]').dropdown({allowAdditions: true}).dropdown('set selected', val);
	}
	else{
		$('[name=performersSearch]').dropdown({allowAdditions: true})
	}
});