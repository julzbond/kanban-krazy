TasksCollection.allow({
  'insert': function(userId){
    return true;
  },
  'update': function(userId){
    return true;
  },
  'remove': function(userId){
    return true;
  }
});

Meteor.users.allow({
  update: function(userId, docs, fields, modifier) {
    return true;
  }
});