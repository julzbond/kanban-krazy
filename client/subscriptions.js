Meteor.subscribe('tasks', function(){
  return TasksCollection.find({
    user_id: this.userId,
  });
});