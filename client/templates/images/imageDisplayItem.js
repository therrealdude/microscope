Template.imageDisplayItem.events({
    'click [name=imageDisplay]': function(e){
        $('#' + this.public_id + '.ui.modal').modal('show');
    }
});