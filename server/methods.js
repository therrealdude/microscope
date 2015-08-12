Meteor.methods({
    save_url:function(image){
        console.log(image);
		Images.insert(image.upload_data);
    },
    geocode:function(address){
        var googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address;
        var ret = HTTP.get(googleMapsUrl);
        console.log(ret.content);
        return ret.content;
    }
});