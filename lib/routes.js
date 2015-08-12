Router.route('/', function(){
  if(Meteor.user()){
    return this.redirect('/dashboard');
  } else {
    return this.render('home');
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
    this.render('dashboard');
  }
});

Router.route('/dashboard/profile/edit', function(){
  if(!Meteor.user()){
    return this.render('pageNotFound');
  } else {
    this.render('profile');
  }
});