Meteor.methods({
    save_url:function(image){
        console.log(image);
		Images.insert(image.upload_data);
    },
    geocode: function(address) {
        try{
            var googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address;
            var ret = HTTP.get(googleMapsUrl);
            //console.log(JSON.parse(ret.content));
            return JSON.parse(ret.content);
        }
        catch(ex) {
            console.log('Geocoding failed.');
            }
    }
});