/**
 * Created by Owner on 12/14/2015.
 */
Template.verifyAccount.events({
    'click #sendVerification': function(e){
        console.log('sending email');
        Meteor.call('sendVerificationEmail', Meteor.user(), function(error, result){
            console.log('email sent');
            if(error){
                console.log(error);
            }
        });
    }
});
