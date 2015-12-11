Cloudinary.config({
	cloud_name: 'all-for-a-punchline',
    api_key: '929425885711145',
    api_secret: 'edxs9DubvTpZQ_7aosz5duHB60w'
});

Meteor.startup( function() {
  process.env.MAIL_URL = "smtp://postmaster@sandbox5d90f02283cb46b0b71ba3a829abc0e4.mailgun.org:525d5f09875be8ced53b5349a23e5625@smtp.mailgun.org:587";
});