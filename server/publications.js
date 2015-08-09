Meteor.publish('tasks', function(){
  return TasksCollection.find();
});