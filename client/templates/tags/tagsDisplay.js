Template.tagsDisplay.helpers({
    tags: function(){
        return this.tags;
    },
    hastags: function(){
        return this.tags && this.tags.length > 0;
    }
});