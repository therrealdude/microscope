Template.imageFeature.helpers({
    featuredImage: function(){
        for(var i = 0; i< this.images.length; i++){
            if(this.images[i].primary){
                Session.set('hasFeaturedImage' + this._id, true);
                return this.images[i].response;
            }
        }
        Session.set('hasFeaturedImage' + this._id, false);
    },
    hasFeaturedImage: function(){
        return Session.get('hasFeaturedImage' + this._id);
    }
});