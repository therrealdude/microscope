Template.venueSearch.onRendered(function(){
    if(this.data && this.data.venue){
        $('select#venueSearch').dropdown('set selected', this.data.venue);
    }
    else{
        $('select#venueSearch').dropdown();
    }
});

Template.venueSearch.helpers({
    venuesSearch: function(){
        return Venues.find();
    }
});