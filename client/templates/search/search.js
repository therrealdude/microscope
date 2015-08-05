Template.search.onCreated(function(){
    if (!Session.get('lastClicked')){
        Session.set('lastClicked', 'shows');
    }
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
    }
});