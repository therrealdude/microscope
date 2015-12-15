Cloudinary.config({
	cloud_name: 'all-for-a-punchline',
    api_key: '929425885711145',
    api_secret: 'edxs9DubvTpZQ_7aosz5duHB60w'
});

Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});
Accounts.emailTemplates.siteName = 'Affordable City Entertainment';
Accounts.emailTemplates.from = 'accounts@affordablecityentertainment.com';
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to Affordable City Entertainment, " + user.emails(0).address;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
    return "You have "
        + " To activate your account, simply click the link below:\n\n"
        + url;
};

Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster@sandbox5d90f02283cb46b0b71ba3a829abc0e4.mailgun.org:525d5f09875be8ced53b5349a23e5625@smtp.mailgun.org:587";
});