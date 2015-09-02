Template.socialMediaDisplay.helpers({
	hasSocialMedia: function(){
		return this.socialmedia && (this.socialmedia.facebook != '' || this.socialmedia.twitter != '' || this.socialmedia.tumblr != '' || this.socialmedia.googleplus != ''
		|| this.socialmedia.youtube != '' || this.socialmedia.vimeo != '')
	},
	hasFacebook: function(){
		return this.socialmedia && this.socialmedia.facebook && this.socialmedia.facebook != '';
	},
	hasTwitter: function(){
		return this.socialmedia && this.socialmedia.twitter && this.socialmedia.twitter != '';
	},
	hasTumblr: function(){
		return this.socialmedia && this.socialmedia.tumblr && this.socialmedia.tumblr != '';
	},
	hasGooglePlus: function(){
		return this.socialmedia && this.socialmedia.googleplus && this.socialmedia.googleplus != '';
	},
	hasYouTube: function(){
		return this.socialmedia && this.socialmedia.youtube && this.socialmedia.youtube != '';
	},
	hasVimeo: function(){
		return this.socialmedia && this.socialmedia.vimeo && this.socialmedia.vimeo != '';
	}
});