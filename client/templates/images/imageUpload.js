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
            .find({status: 'complete'})
            .fetch()
            .map(function(i){
            return i.response;
        });
    },
    hasImages: function(){
        return Cloudinary.collection.find().fetch().length > 0;
    }
});

Template.imageUpload.events({
    'click .ui.icon.button': function(e){
        $('[name=imageUpload]').click();  
    },
    'change [name=imageUpload]': function(e){
        Cloudinary.upload(e.currentTarget.files);
        e.currentTarget.files = [];
    },
    'change [name=primary]': function(e){
        Cloudinary.collection.update({}, {$set: {primary: false}});
        Cloudinary.collection.update({'response.public_id': $(e.target).attr('id')}, {$set: {primary: $(e.target).prop('checked')}});
    }
});