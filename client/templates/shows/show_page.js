Template.showPage.helpers({
    isAdmin: function() {
        return $.inArray(Meteor.userId(), this.admins);
    },
    performersList: function() {
        console.log('entered performers list function');
        var ret = [];
        for(var i = 0; i<this.performers.people.length; i++){
            var person = People.findOne({_id: this.performers.people[i]._id});
            _.extend(person, {type: 'P'});
            ret.push(person);
        }
        for(var i = 0; i<this.performers.groups.length; i++){
            var group = People.findOne({_id: this.performers.groups[i]._id});
            _.extend(group, {type: 'G'});
            ret.push(group);
        }
        console.log(ret);
        return ret;
    },
    isPerson: function() {
        console.log('checking if is a person');
        console.log(this.type);
        return this.type === 'P';
    },
    isGroup: function() {
        console.log('checking if is a group');
        console.log(this.type);
        return this.type === 'G';
    },
    formatDateString: function(){
        return this.date.toLocaleString();
    }
});