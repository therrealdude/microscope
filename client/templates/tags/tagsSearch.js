Template.tagsSearch.onRendered(function() {
    $('[name=tagsSearch]').dropdown({allowAdditions: true}); 
});

Template.tagsSearch.helpers({
    tags: function(){
        return Tags.find().fetch();
    }
});