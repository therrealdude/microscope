var images = undefined;
var imageOptions = undefined;

Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  },
  saved_images: function(){
		return Images.find();
  }
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
	
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
	
    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('postInsert', post, images, imageOptions, function(error, result) {
      // display the error to the user and abort
      if (error)
        Errors.throw(error.reason);
    
      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');
    
      Router.go('newPosts');  
    });
  },
  'change input[type=file].upload': function(e, helper){
	  var options = {context:this};
	  if(helper.data && _.has(helper.data,"callback")){
			options.callback = helper.data.callback;
		}
	  if(helper.data && _.has(helper.data,"public_id")){
			options.public_id = helper.data.public_id;
		}
	  imageOptions = options;
	  images = e.currentTarget.files;
  }
});