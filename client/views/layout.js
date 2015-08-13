if(Meteor.isClient) {
  Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      console.log('Form submitted.');
    }
  });

  Template.register.events({
    'submit #register-form': function(event){
      event.preventDefault();
      var nameVar = event.target.registerName.value;
      var emailVar = event.target.registerEmail.value;
      var passwordVar = event.target.registerPassword.value;
      Accounts.createUser({
        name: nameVar,
        email: emailVar,
        password: passwordVar,
        createdAt: new Date()
      },
      function(error){
        if(error){
          console.log(error.reason);
        } else{
          Router.go('/dashboard');
        }
      });
    }
  });

  Template.login.events({
    'submit #login-form': function(event){
      event.preventDefault();
      var emailVar = event.target.loginEmail.value;
      var passwordVar = event.target.loginPassword.value;

      Meteor.loginWithPassword(emailVar, passwordVar, function(error){
        if(error) {
          alert("Incorrect email or password");
        } else {
          Router.go('/dashboard');
        }
        return false;
      });
    }
  });

  Template.dashboard.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('/login');
    }
  });

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
    "keypress .new-task": function(event, template) {

      var title = template.find("#title").value;

      if(title === "") {
        return;
      }

      if(event.keyCode === 13) {
        TasksCollection.insert({
          user_id: Meteor.user()._id,
          title: title,
          show: true,
          createdAt: new Date()
        });

        template.find("#title").value = "";
        template.find("#title").focus();
        event.preventDefault();
      }
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .drop": function (event) {
      drop(event);
    },
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