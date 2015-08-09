Meteor.startup(function(){
  if(TasksCollection.find().fetch().length === 0){
    TasksCollection.insert({
      title: "First Task",
      description: "Hello World",
      show: true,
      added: Date.now()
    });
  }
});

Meteor.publish('userData', function(){

});