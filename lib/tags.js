Tags = new Mongo.Collection('tags');

Tags.allow({
    update: function(){return false;},
    remove: function(){return false;}
});

Meteor.methods({
    tagsInsert: function(tags){
        for (var i = 0; i<tags.length; i++){
            var hasTag = Tags.findOne({name: tags[i]});
            if(!hasTag) {
                var tag = {name: tags[i]};
                check(tag, {name: String});
                Tags.insert(tag);
            }
        }
    }
});