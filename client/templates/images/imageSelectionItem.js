
Template.imageSelectionItem.events({
    'change [name=primary]': function(e){
        Cloudinary.collection.update({}, {$set: {primary: false}}, {multi: true});
        Cloudinary.collection.update({'response.public_id': $(e.target).attr('id')}, {$set: {primary: $(e.target).prop('checked')}});
    },
    'click [name=deleteImage]': function(e){
        e.preventDefault();
        var image = Cloudinary.collection.findOne({'response.public_id': this.public_id})
        Cloudinary.collection.remove(image._id);
        var imagesToDelete = [];
        if(Session.get('imagesToDelete')){
            imagesToDelete = Session.get('imagesToDelete'); 
        }
        imagesToDelete.push(this.public_id);
        Session.set('imagesToDelete', imagesToDelete);
    },
    'click [name=imageDisplay]': function(e){
        $('#' + this.public_id + '.ui.modal').modal('show');
        $('#' + this.public_id + '.ui.modal').modal('show');
    }
});