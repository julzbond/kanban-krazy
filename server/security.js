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
})