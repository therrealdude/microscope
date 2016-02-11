Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications'), 
            Meteor.subscribe('people'), 
            Meteor.subscribe('groups'),
            Meteor.subscribe('venues'),
            Meteor.subscribe('shows'),
            Meteor.subscribe('tags')
           ];
  }
});
/* Post Routes */
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(), 
      ready: this.postsSub.ready,  
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home'
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});


Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
    waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'postSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(function() {
    if (Meteor.user() != null){
        if(Meteor.user().emails[0].verified)this.next();
        else this.render('verifyAccount');
    } else{
        this.next();
    }});

/* Person Routes */
Router.route('/addPerson', {name: 'personSubmit'});
Router.route('/peopleList', {name: 'peopleList'});
Router.route('/person/:_id', {name: 'personPage', data: function() {return People.findOne(this.params._id)}});
Router.route('/personEdit', {name: 'personEdit', data: function() {return People.findOne({userId: Meteor.user()._id})}});

/* Group Routes */
Router.route('/addGroup', {name: 'groupSubmit'});
Router.route('/groupList', {name: 'groupList'});
Router.route('/group/:_id', {name: 'groupPage', data: function() {return Groups.findOne(this.params._id)}});
Router.route('/group/:_id/edit', 
             {
              name: 'groupEdit', 
              data: function() {return Groups.findOne(this.params._id)},
              onBeforeAction: function() {
				  var personid = People.findOne({userId: Meteor.userId()})._id;
                  if (isAdmin(personid, this.data().members)) {
                    this.next();
                  }
                  else{
                    this.render('accessDenied');
                  }
              }
            });

/* Venue Routes */
Router.route('/addVenue', {name: 'venueSubmit'});
Router.route('/venueList', {name: 'venueList'});
Router.route('/venue/:_id', {name: 'venuePage', data: function() {return Venues.findOne(this.params._id)}});
Router.route('/venue/:_id/edit', 
             {
                name: 'venueEdit', 
                data: function() {return Venues.findOne(this.params._id)},
                onBeforeAction: function() {
                  if (isAdmin(Meteor.userId(), this.data().administrators)) {
                    this.next();
                  }
                  else{
                    this.render('accessDenied');
                  }
              }
            });

/* Show Routes */
Router.route('/addShow', {name: 'showSubmit'});
Router.route('/showList', {name: 'showList'});
Router.route('/show/:_id', {name: 'showPage', data: function() {return Shows.findOne(this.params._id)}});
Router.route('/show/:_id/edit', 
             {
                name: 'showEdit', 
                data: function() {return Shows.findOne(this.params._id)},
                onBeforeAction: function() {
                  if (isAdmin(Meteor.userId(), this.data().administrators)) {
                    this.next();
                  }
                  else{
                    this.render('accessDenied');
                  }
              }
             });

/* Search Routes */
Router.route('/search', {name: 'search'});

/* Stream Routes */
Router.route('/stream', {name: 'showstream'});

/* Notifications */
Router.route('/notifications', {name: 'notificationsPage'});