Template.imageUpload.onCreated(function(){
    Cloudinary.collection.remove({});
    if(this.data && this.data.images){
        for(var i = 0; i < this.data.images.length; i++){
            Cloudinary.collection.insert(this.data.images[i]);
        }
    }
});

Template.imageUpload.helpers({
    images: function(){
        return Cloudinary.collection
            .find({percent_uploaded: 100})
            .fetch()
            .map(function(i){
            console.log(i.percent_uploaded);
            return i.response;
        });
    }
});

Template.imageUpload.events({
    'click .ui.icon.button': function(e){
        $('[name=imageUpload]').click();  
    },
    'change [name=imageUpload]': function(e){
        Cloudinary.upload(e.currentTarget.files);
    }
});