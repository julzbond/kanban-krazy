Router.route('/', function(){
  if(Meteor.user()){
    return this.redirect('/dashboard');
  } else {
    return this.redirect('/login');
  }
});

Router.route('/register', function(){
  this.render('register');
});

Router.route('/login', function(){
  this.render('login');
});

Router.route('/dashboard', function(){
  if(!Meteor.user()){
    return this.render('pageNotFound');
  } else {
    this.layout('layout');
    this.render('dashboard');
  }
});

Router.route('/dashboard/profile', function(){
  this.layout('layout');
  this.render('profileEdit');
});