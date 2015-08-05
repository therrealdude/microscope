Template.header.onRendered(function() {
    $('input#search').val(Session.get('searchCriteria'));
});

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});

Template.header.events({
    'keyup input#search': function(e){
        e.preventDefault();
        Session.set('searchCriteria', $(e.target).val());
        if(e.keyCode === 13){
            Router.go('search')
        }
    }
});