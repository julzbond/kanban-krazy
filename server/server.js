Meteor.startup(function(){
  if(TasksCollection.find().fetch().length === 0){
    TasksCollection.insert({
      title: "Test title",
      description: "This is a task description",
      show: true,
      createdAt: Date.now()
    });
  }
});