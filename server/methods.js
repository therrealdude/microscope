Meteor.methods({
    save_url:function(image){
        console.log(image);
		Images.insert(image.upload_data);
    },
    geocode: function(address) {
        try{
            console.log('Geocoding beginning');
            var googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address;
            var ret = HTTP.get(googleMapsUrl);
            console.log('Geocoding complete');
            console.log('Geocoding data:');
            console.log(ret.content);
            //Session.set('geocodingData', ret.content);
            return ret.content;
        }
        catch(ex) {
            console.log(ex.message);
            }
    }
});