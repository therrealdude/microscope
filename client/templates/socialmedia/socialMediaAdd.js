Template.socialMediaAdd.onCreated(function(){
	if(this.data && this.data.socialmedia){
		Session.set('socialmedia', this.data.socialmedia);
	}
	else{
		Session.set('socialmedia', {});
	}
});

Template.socialMediaAdd.onRendered(function(){
	if(this.data && this.data.socialmedia){
		$('[name=facebook]').val(this.data.socialmedia.facebook);
		$('[name=twitter]').val(this.data.socialmedia.twitter);
		$('[name=tumblr]').val(this.data.socialmedia.tumblr);
		$('[name=googleplus]').val(this.data.socialmedia.googleplus);
		$('[name=youtube]').val(this.data.socialmedia.youtube);
		$('[name=vimeo]').val(this.data.socialmedia.vimeo);
	}
});

Template.socialMediaAdd.events({
	'change .socialmediainputs input' : function(e){
		var container = $(e.target).closest('.socialmediainputs');
		var socialmedia = {
			facebook: container.find('[name=facebook]').val(),
			twitter: container.find('[name=twitter]').val(),
			tumblr: container.find('[name=tumblr]').val(),
			googleplus: container.find('[name=googleplus]').val(),
			youtube: container.find('[name=youtube]').val(),
			vimeo: container.find('[name=vimeo]').val()
		};
		Session.set('socialmedia', socialmedia);
	}
});