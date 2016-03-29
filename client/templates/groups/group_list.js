Template.groupList.helpers({
  groups: function(){
    var searchCriteria = Session.get('searchCriteria');
    var chkKeywords = searchCriteria && searchCriteria.keywords && searchCriteria.keywords != '';
    var chkTags = searchCriteria && searchCriteria.tags && searchCriteria.tags.length > 0;
    console.log(chkKeywords);
    console.log(chkTags);
      
    if(chkKeywords && chkTags){
        return Groups.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, tags: {$in: searchCriteria.tags}});
    }
    else if (chkKeywords && !chkTags){
        return Groups.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}});
    }
    else if (!chkKeywords && chkTags){
        return Groups.find({tags: {$in: searchCriteria.tags}});
    }
    else{
        return Groups.find();
    }
  }
});

// Template.peopleList.onRendered(function () {
  // this.find('.wrapper')._uihooks = {
    // insertElement: function (node, next) {
      // $(node)
        // .hide()
        // .insertBefore(next)
        // .fadeIn();
    // },
    // moveElement: function (node, next) {
      // var $node = $(node), $next = $(next);
      // var oldTop = $node.offset().top;
      // var height = $node.outerHeight(true);

      // // find all the elements between next and node
      // var $inBetween = $next.nextUntil(node);
      // if ($inBetween.length === 0)
        // $inBetween = $node.nextUntil(next);

      // // now put node in place
      // $node.insertBefore(next);

      // // measure new top
      // var newTop = $node.offset().top;

      // // move node *back* to where it was before
      // $node
        // .removeClass('animate')
        // .css('top', oldTop - newTop);

      // // push every other element down (or up) to put them back
      // $inBetween
        // .removeClass('animate')
        // .css('top', oldTop < newTop ? height : -1 * height)


      // // force a redraw
      // $node.offset();

      // // reset everything to 0, animated
      // $node.addClass('animate').css('top', 0);
      // $inBetween.addClass('animate').css('top', 0);
    // },
    // removeElement: function(node) {
      // $(node).fadeOut(function() {
        // $(this).remove();
      // });
    // }
  // }
// });