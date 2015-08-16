Template.register.events({
  'submit #register-form': function(event){
    event.preventDefault();

    var username = event.target.registerName.value;
    var email = event.target.registerEmail.value;
    var password = event.target.registerPassword.value;

    var newUser = {
      username: username,
      email: email,
      password: password,
      createdAt: new Date()
    };

    Accounts.createUser(newUser,
    function(error){
      if(error){
        console.log(error.reason);
      } else {
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

Template.user.helpers({
  firstName: function() {
    return Meteor.user().profile.firstname;
  }
});

Template.user.events({
  'click #logout-buttons': function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go('/login');
  }
});

Template.profileEdit.helpers({
  firstName: function() {
    if(Meteor.user().profile.firstname){
      return Meteor.user().profile.firstname;
    }
  },

  lastName: function() {
    if(Meteor.user().profile.lastname){
      return Meteor.user().profile.lastname;
    }
  },

  emailAddress: function() {
    if(Meteor.user().emails[0].address){
      return Meteor.user().emails[0].address;
    }
  }
});

Template.profileEdit.events({
  'submit #profile-form': function(event){
    event.preventDefault();

    var firstname = event.target.firstName.value;
    var lastname = event.target.lastName.value;
    var emailaddress = event.target.emailAddress.value;

    if (firstname.trim() !== "") {
      Meteor.users.update(Meteor.userId(), { $set: { "profile.firstname" : firstname}}
      );
    }

    if (lastname.trim() !== "") {
      Meteor.users.update(Meteor.userId(), { $set: { "profile.lastname" : lastname}}
      );
    }

    if (emailaddress.trim() !== "") {
      Meteor.users.update(Meteor.userId(), { $set: { "emails.address" : emailaddress}}
      );
    }

    Router.go('/dashboard');
  }
});

Template.todos.helpers({
  "todos": hideCompleteToDos,
  "hideCompleted": hideCompleted,
  "incompleteCount": countIncompleteToDos
});

Template.todos.events({
  "keypress .new-task-todo": createNewToDo,
  "change .hide-completed input": changeHideCompleted
});

Template.todo.events({
  "click .toggle-checked": toggleCheckedTask,
  "click .delete": removeTask
});

Template.doings.helpers({
  "doings": hideCompleteDoings,
  "hideCompleted": hideCompleted,
  "incompleteCount": countIncompleteDoings
});

Template.doings.events({
  "keypress .new-task-doing": createNewDoing,
  "change .hide-completed input": changeHideCompleted
});

Template.doing.events({
  "click .toggle-checked": toggleCheckedTask,
  "click .delete": removeTask
});

Template.dones.helpers({
  "dones": hideCompleteDones,
  "hideCompleted": hideCompleted,
  "incompleteCount": countIncompleteDones
});

Template.dones.events({
  "keypress .new-task-done": createNewDone,
  "change .hide-completed input": changeHideCompleted
});

Template.done.events({
  "click .toggle-checked": toggleCheckedTask,
  "click .delete": removeTask
});


// HELPER FUNCTIONS

function hideTasks (taskState, bool) {
  if (Session.get("hideCompleted")) {
    return TasksCollection.find(
      {
        checked: bool,
        state: taskState
      },
      {
        sort: { createdAt: -1 }
      });
  } else {
    return TasksCollection.find(
      {
        state: taskState
      },
      {
        sort: { createdAt: -1 }
      });
  }
  // return TasksCollection.find({state: "todos"}, {sort: {createdAt: -1}}).fetch();
}

function hideCompleteToDos () {
  return hideTasks("todos", false);
}

function hideCompleteDoings () {
  return hideTasks("doings", false);
}

function hideCompleteDones () {
  return hideTasks("dones", false);
}

function hideCompleted () {
  return Session.get("hideCompleted");
}

function countIncompleteTasks(taskState) {
  return TasksCollection
    .find({
      checked: { $ne: true },
      state: taskState
    })
    .count();
}

function countIncompleteToDos(){
  return countIncompleteTasks("todos");
}

function countIncompleteDoings(){
  return countIncompleteTasks("doings");
}

function countIncompleteDones(){
  return countIncompleteTasks("dones");
}


//EVENT FUNCTIONS

function createNewTask (taskState, taskId, event, template){
  var title_todo = template.find(taskId).value;
  if (title_todo.trim() === "") {
    return;
  }
  if (event.keyCode === 13) {
    TasksCollection.insert({
      user_id: Meteor.user()._id,
      title: title_todo,
      show: true,
      createdAt: new Date(),
      state: taskState
    });
    template.find(taskId).value = "";
    template.find(taskId).focus();
    event.preventDefault();
  }
}

function createNewToDo(event, template) {
  return createNewTask("todos", "#title_todo", event, template);
}

function createNewDoing (event, template) {
  return createNewTask("doings", "#title_doing", event, template);
}

function createNewDone (event, template) {
  return createNewTask("dones", "#title_done", event, template);
}

function changeHideCompleted (event) {
  Session.set("hideCompleted", event.target.checked);
}

function toggleCheckedTask () {
  TasksCollection.update(this._id, {
    $set: { checked: !this.checked }
  });
}

function removeTask () {
  TasksCollection.remove(this._id);
}