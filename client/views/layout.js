Router.route('/', function(){
  if(Meteor.user()){
    return this.redirect('/dashboard');
  } else {
    return this.render('home');
  }
});

Router.route('/dashboard', function(){
  this.render('dashboard');
});

if (Meteor.isClient){
  Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      console.log('Form submitted.');
    }
  });
}

Template.register.events({
  'submit #register-form': function(event){
    event.preventDefault();
    var emailVar = event.target.registerEmail.value;
    var passwordVar = event.target.registerPassword.value;
    Accounts.createUser({
      email: emailVar,
      password: passwordVar
    }, function(error){
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
      if(error){
        console.log(error.reason);
      } else{
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
    Router.go('/');
  }
});

Template.tasks.created = function(){
  console.log('created');
};

Template.tasks.rendered = function(){
  console.log('rendered');
};

Template.tasks.destroyed = function(){
  console.log('destroyed');
};

Template.tasks.helpers({
  'tasks': function(){
    return TasksCollection.find().fetch();
  }
});

Template.tasks.events({
  //layout

  'click': function(){
    console.log('event');
  }
});