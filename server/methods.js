Meteor.methods({
    save_url:function(image){
        console.log(image);
		Images.insert(image.upload_data);
    }
});