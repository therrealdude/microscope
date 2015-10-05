Template.imageDisplay.onRendered(function(){
    $('#imageDiv').slimScroll({
        height: '400px'
    })
});

Template.imageDisplay.helpers({
    images: function(){
        var ret = [];
        if(this.images){
            for (var i = 0; i< this.images.length; i+= 5){
                var image1 = null;
                var image2 = null;
                var image3 = null;
                var image4 = null;
                var image5 = null;
                var image6 = null;
                var image7 = null;
                
                if(i < this.images.length){
                    image1 = this.images[i].response;
                }
                if(i + 1 < this.images.length){
                    image2 = this.images[i + 1].response;
                }
                if(i + 2 < this.images.length){
                    image3 = this.images[i + 2].response;
                }
                if(i + 3 < this.images.length){
                    image4 = this.images[i + 3].response;
                }
                if(i + 4 < this.images.length){
                    image5 = this.images[i + 4].response;
                }
                if(i + 5 < this.images.length){
                    image6 = this.images[i + 5].response;
                }
                if(i + 6 < this.images.length){
                    image7 = this.images[i + 6].response;
                }
                ret.push({
                    image1: image1, 
                    image2: image2, 
                    image3: image3, 
                    image4: image4, 
                    image5: image5,
                    image6: image6,
                    image7: image7
                         });
            }
        }
        return ret;
    }   
});