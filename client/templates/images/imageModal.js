Template.imageModal.onRendered(function(){
    $('.ui.modal').modal({
        observeChanges: true,
        onVisible: function(){
            $('#' + this.public_id + '.ui.modal').modal('refresh');
        }
    });
});

Template.imageModal.helpers({
    width: function() {
        return ($(window).width() - 100).toString();
    },
    height: function() {
        return ($(window).height() - 100).toString();  
    }
});
