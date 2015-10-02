Template.imageUpload.onCreated(function(){
    Cloudinary.collection.remove({});
    if(this.data && this.data.images){
        for(var i = 0; i < this.data.images.length; i++){
            Cloudinary.collection.insert(this.data.images[i]);
        }
    }
});

Template.imageUpload.onRendered(function(){
    $('#imageDiv').slimScroll({
        'height': '400px'
    });
});

Template.imageUpload.helpers({
    images: function(){
        var images = Cloudinary.collection
            .find({status: 'complete'})
            .fetch()
            .map(function(i){
            return i.response;
        });
        var ret = [];
        for (var i = 0; i<images.length; i+=3)
        {
            var image1 = null;
            var image2 = null;
            var image3 = null;
            
            if(i< images.length){
                image1 = images[i];
            }
            if(i+1 < images.length){
                image2 = images[i + 1];
            }
            if (i+2 < images.length){
                image3 = images[i + 2];
            }
            ret.push({image1: image1, image2: image2, image3: image3});
        }
        return ret;
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
    }
});

Template.imageSelectionItem.events({
    'change [name=primary]': function(e){
        Cloudinary.collection.update({}, {$set: {primary: false}}, {multi: true});
        Cloudinary.collection.update({'response.public_id': $(e.target).attr('id')}, {$set: {primary: $(e.target).prop('checked')}});
    }
});