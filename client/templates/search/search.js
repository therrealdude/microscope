Template.search.onCreated(function(){
    if (!Session.get('lastClicked')){
        Session.set('lastClicked', 'shows');
    }
	Session.set('searchCriteria', setSearchCriteria($('#searchCriteria')))
});

Template.search.onRendered(function(){
    this.autorun(function () {
        if (GoogleMaps.loaded()) {
          $("input#addressSearch").geocomplete({details: '.geolocation'});
        }
    });
	$('.set-due-date').datetimepicker({sideBySide: true}).on('dp.change', function(e){ e.preventDefault(); setSearchCriteria($('#searchCriteria')); });
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
		var item = $(e.target).attr('name')
        Session.set('lastClicked', item);
		if (item === 'shows'){
			$('#locationSearch').show();
			$('#dateSearch').show();
		}
		else if (item === 'groups'){
			$('#locationSearch').hide();
			$('#dateSearch').hide();
		}
		else if(item === 'people'){
			$('#locationSearch').hide();
			$('#dateSearch').hide();
		}
		else if(item === 'venues'){
			$('#locationSearch').show();
			$('#dateSearch').hide();
		}
    },
	'keyup #searchCriteria input': function(e){
		e.preventDefault();
		setSearchCriteria($(e.target).closest('#searchCriteria'));
    },
	'change #searchCriteria input': function(e){
		e.preventDefault();
		setSearchCriteria($(e.target).closest('#searchCriteria'));
	}
});

setSearchCriteria = function(container) {
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