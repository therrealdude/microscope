Template.search.onCreated(function(){
    if (!Session.get('lastClicked')){
        Session.set('lastClicked', 'shows');
    }
});

Template.search.onRendered(function(){
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("input#addressSearch").geocomplete({details: '.geolocation'});
        }
    });
});

Template.search.helpers({
    showsSelected: function() {
        return Session.get('lastClicked') === 'shows';
    },
    groupsSelected: function() {
        return Session.get('lastClicked') === 'groups';
    },
    peopleSelected: function() {
        return Session.get('lastClicked') === 'people';
    },
    venuesSelected: function() {
        return Session.get('lastClicked') === 'venues';
    },
    showsActive: function() {
        return Session.get('lastClicked') === 'shows' && 'active';
    },
    groupsActive: function() {
        return Session.get('lastClicked') === 'groups' && 'active';
    },
    peopleActive: function() {
        return Session.get('lastClicked') === 'people' && 'active';
    },
    venuesActive: function() {
        return Session.get('lastClicked') === 'venues' && 'active';
    }
});

Template.search.events({
    'click a.item': function(e) {
        Session.set('lastClicked', $(e.target).attr('name'));
    },
	'keyup #searchCriteria input': function(e){
        e.preventDefault();
		var container = $(e.target).closest('#searchCriteria');
		var searchCriteria = {
			'keywords': container.find('#search').val(),
			'latitude': container.find('#lat').val(),
			'longitude': container.find('#lng').val(),
			'radius': container.find('#radius').val(),
			'startdate': container.find('#startdate').val(),
			'enddate': container.find('#enddate').val()
		}
        Session.set('searchCriteria', searchCriteria);
    }
});