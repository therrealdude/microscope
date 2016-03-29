Meteor.methods({
	sendEmail: function(to, from, subject, text){
		if (Meteor.isServer) {
			Email.send({
				to: to, 
				from: from, 
				subject: subject, 
				text: text});
		}
	},
	sendVerificationEmail: function(user){
		if(Meteor.isServer) {
			Accounts.sendVerificationEmail(user._id, user.emails[0].address);
		}
	}
});