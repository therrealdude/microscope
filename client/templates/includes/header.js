Template.header.onRendered(function() {
    $('input#search').val(Session.get('searchCriteria'));
	$('.ui.sticky.navbar.navbar-default').sticky({context: '#page'});
});

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  },
  hasSubmittedProfile: function() {
    return People.findOne({userId: Meteor.user()._id});
  }
});

Template.header.events({
});