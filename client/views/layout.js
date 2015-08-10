Router.route('/', function(){
  this.render('tasks');
});

if(Meteor.isClient) {

  Template.tasks.helpers({

    tasks: function() {
      if (Session.get("hideCompleted")) {
        return TasksCollection.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return TasksCollection.find({}, {sort: {createdAt: -1}});
      }

      return TasksCollection.find({}, {sort: {createdAt: -1}}).fetch();
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return TasksCollection.find({checked: {$ne: true}}).count();
    }
  });

  Template.tasks.events({
    "keypress .new-task": function(evt, tmpl) {

      var title = tmpl.find("#title").value;

      if(title === "") {
        return;
      }

      if(evt.keyCode === 13) {
        TasksCollection.insert({
          title: title,
          show: true,
          createdAt: Date.now()
        });

        tmpl.find("#title").value = "";
        tmpl.find("#title").focus();
        evt.preventDefault();
      }
    },
    "change .hide-completed input": function (evt) {
      Session.set("hideCompleted", evt.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      TasksCollection.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      TasksCollection.remove(this._id);
    }
  });
}