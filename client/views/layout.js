Template.register.events({
  'submit form': function(event){
    event.preventDefault();
    console.log('Form submitted.');
  }
});

Template.register.events({
  'submit #register-form': function(event){
    event.preventDefault();
    //add validations
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
    //add validations
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
  },

  'click #facebook-login': function(event){
    Meteor.loginWithFacebook({}, function(err){
      if (err){
        throw new Meteor.Error("Facebook login failed");
      } else {
        Router.go('/dashboard');
      }
      return false;
    });
  },

  'click #twitter-login': function(event){
    Meteor.loginWithTwitter({}, function(err){
      if (err){
        throw new Meteor.Error("Twitter login failed");
      } else {
        Router.go('/dashboard');
      }
      return false;
    });
  },

  'click #google-login': function(event){
    Meteor.loginWithGoogle({}, function(err){
      if (err){
        throw new Meteor.Error("Google login failed");
      } else {
        Router.go('/dashboard');
      }
      return false;
    });
  },

  'click #github-login': function(event){
    Meteor.loginWithGithub({}, function(err){
      if (err){
        throw new Meteor.Error("Github login failed");
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

Template.todos.helpers({
  todos: function() {
    if (Session.get("hideCompleted")) {
      return TasksCollection.find(
        {
          checked: { $ne: true },
          state: "todos"
        },
        {
          sort: { createdAt: -1 }
        });
    } else {
      return TasksCollection.find(
        {
          state: "todos"
        },
        {
          sort: { createdAt: -1 }
        });
    }

    // return TasksCollection.find({state: "todos"}, {sort: {createdAt: -1}}).fetch();
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  incompleteCount: function () {
    return TasksCollection
      .find({
        checked: { $ne: true },
        state: "todos"
      })
      .count();
  }
});

Template.todos.events({
  "keypress .new-task-todo": function(event, template){
    var title_todo = template.find("#title_todo").value;
    if (title_todo.trim() === "") {
      return;
    }
    if (event.keyCode === 13) {
      TasksCollection.insert({
        user_id: Meteor.user()._id,
        title: title_todo,
        show: true,
        createdAt: new Date(),
        state: "todos"
      });
      template.find("#title_todo").value = "";
      template.find("#title_todo").focus();
      event.preventDefault();
    }
  },

  "change .hide-completed input": function(event){
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.todo.events({
  "click .drop": function(event){
    drop(event);
  },

  "click .toggle-checked": function () {
    TasksCollection.update(this._id, {
      $set: { checked: !this.checked }
    });
  },

  "click .delete": function () {
    TasksCollection.remove(this._id);
  }
});

Template.doings.helpers({
  doings: function(){
    if (Session.get("hideCompleted")) {
      return TasksCollection.find(
        {
          checked: { $ne: true },
          state: "doings"
        },
        {
          sort: { createdAt: -1 }
        });
    } else {
      return TasksCollection.find(
        {
          state: "doings"
        },
        {
          sort: { createdAt: -1 }
        });
    }

    // return TasksCollection.find({}, {sort: {createdAt: -1}}).fetch();
  },

  hideCompleted: function(){
    return Session.get("hideCompleted");
  },

  incompleteCount: function(){
    return TasksCollection
    .find({
        checked: {$ne: true},
        state: "doings"
      })
    .count();
  }
});

Template.doings.events({
  "keypress .new-task-doing": function(event, template){
    var title_doing = template.find("#title_doing").value;
    if (title_doing.trim() === "") {
      return;
    }
    if (event.keyCode === 13) {
      TasksCollection.insert({
        user_id: Meteor.user()._id,
        title: title_doing,
        show: true,
        createdAt: new Date(),
        state: "doings"
      });
      template.find("#title_doing").value = "";
      template.find("#title_doing").focus();
      event.preventDefault();
    }
  },

  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.doing.events({
  "click .drop": function (event) {
    drop(event);
  },

  "click .toggle-checked": function () {
    TasksCollection.update(this._id, {
      $set: { checked: !this.checked }
    });
  },

  "click .delete": function () {
    TasksCollection.remove(this._id);
  }
});

Template.dones.helpers({

  dones: function() {
    if (Session.get("hideCompleted")) {
      return TasksCollection.find(
        {
          checked: { $ne: true },
          state: "dones"
        },
        {
          sort: { createdAt: -1 }
        });
    } else {
      return TasksCollection.find(
        {
          state: "dones"
        },
        {
          sort: { createdAt: -1 }
        });
    }

    // return TasksCollection.find({}, {sort: {createdAt: -1}}).fetch();
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  },
  incompleteCount: function () {
    return TasksCollection
    .find({
        checked: {$ne: true},
        state: "dones"
      })
    .count();  }
});

Template.dones.events({
  "keypress .new-task-done": function(event, template) {
    var title_done = template.find("#title_done").value;
    if (title_done.trim() === "") {
      return;
    }
    if (event.keyCode === 13) {
      TasksCollection.insert({
        user_id: Meteor.user()._id,
        title: title_done,
        show: true,
        createdAt: new Date(),
        state: "dones"
      });
      template.find("#title_done").value = "";
      template.find("#title_done").focus();
      event.preventDefault();
    }
  },

  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.done.events({
  "click .toggle-checked": function () {
    TasksCollection.update(this._id, {
      $set: { checked: !this.checked }
    });
  },

  "click .delete": function () {
    TasksCollection.remove(this._id);
  }
});