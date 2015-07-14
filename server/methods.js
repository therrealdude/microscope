Meteor.methods({
    save_url:function(response){
        console.log('Add '+response.upload_data+' to the id of '+response.context);
    }
});