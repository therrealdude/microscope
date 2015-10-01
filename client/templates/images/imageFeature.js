Template.imageFeature.helpers({
    featuredImage: function(){
        for(var i = 0; i< this.images.length; i++){
            if(this.images[i].primary){
                console.log(this.images[i].response.public_id);
                return this.images[i].response;
            }
        }
    }
});