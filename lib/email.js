Meteor.methods({
	sendEmail: function(to, from, subject, text){
		if (Meteor.isServer) {
			Email.send({
				to: to, 
				from: from, 
				subject: subject, 
				text: text});
		}
	}
})