Meteor.subscribe('tasks', function(){
  return TasksCollection.find();
});