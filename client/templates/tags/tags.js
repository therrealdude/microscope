Template.tags.onRendered(function() {
   if (this.data && this.data.tags){
        $('[name=tags]').dropdown({allowAdditions: true}).dropdown('set selected', this.data.tags); 
   } else {
       console.log($('[name=tags]'));
        $('[name=tags]').dropdown({allowAdditions: true}); 
   }
});

Template.tags.helpers({
    tags: function(){
        return Tags.find().fetch();
    }
});