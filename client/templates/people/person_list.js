Template.peopleList.helpers({
  people: function(){
    var searchCriteria = Session.get('searchCriteria');
    if(!searchCriteria || searchCriteria === ''){
        return People.find({isPerformer: true});
    }
    else if (searchCriteria && !searchCriteria.tags){
        return People.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, isPerformer: true});
    }
    else if (searchCriteria && !searchCriteria.keywords){
        return People.find({tags: {$in: searchCriteria.tags}});
    }
    else{
        return People.find({name: {$regex: new RegExp(searchCriteria.keywords, "i")}, tags: {$in: searchCriteria.tags}, isPerformer: true});
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