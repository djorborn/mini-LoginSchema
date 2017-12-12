var mongoose = require('mongoose');
mongoose.connect("mongodb://192.168.0.143:27017/hp",{ useMongoClient: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo Error: "));
db.once('open', function(){console.log("Mongo Connected")});

//  User Schema
var userSchema = new mongoose.Schema({
  username    : String,
  password    : String,
  first_name  : String,
  last_name   : String,
  age         : Number,
  email       : String,
  address     : String,
  city        : String,
  zip         : Number,
  auth        : String
});

var User = mongoose.model('User', userSchema);


// Main App
require('express')()

.set('view engine', 'pug')
.use(require('express').static(__dirname + "/public"))
.use(require('body-parser').urlencoded({extended:true}))
.use(require('cookie-parser')())

// Routing \\
// Register
.get('/register', function(req, res){
  res.render('register', {
    title: 'Register',
    msg   : req.query.msg
  })
})
.post('/register', function(req, res){
  registerNewUser(req, res);
})
.post('/check_username_availability', function(req, res){
  checkUsernameAvailability(req.body.username, res);
})



// Login
.get('/login', function(req, res){
  res.render('login', {
    title: "Login",
    msg: req.query.msg
  })
})
.post('/login', function(req, res){
  loginUser(req, res);
})
// Logout
.get('/logout', function(req, res){
  logUserOut(req, res);
})


//Main
.get('/*', function(req, res){
  var session = req.cookies.session;
  if(session !== undefined){
    User.find({'auth': session.auth}, function(err, data){
      if(data[0] !== undefined){
        var user = data[0];
        var url = req._parsedUrl.path;

        if(url === "/"){

          // Main Home Page
          res.render('main', {
            title: user.username + " Page",
            first_name: user.first_name,
            last_name : user.last_name
          })
        } else if(url === "/dashboard", {}){

          // Dashboard Page
          res.render('dash', {
            title       : "Dashboard",
            username    : user.username,
            password    : user.password,
            email       : user.email,
            first_name  : user.first_name,
            last_name   : user.last_name,
            age         : user.age,
            address     : user.address,
            city        : user.city,
            zip         : user.zip
          })
        }
      } else {
        res.redirect('/login');
      }
    })
  } else {
    res.redirect('/login');
  }
})

.post('/dashboard', function(req, res){
  // Update User Info
  updateUserInfo(req, res);
})

//Delete Account
.post('/delete_account', function(req, res){
  deleteAccount(req, res);
})
.listen(3000);
// Functions \\
//Login Functions
function loginUser(req, res){
  User.find({'username': req.body.username}, function(err, data){

    if(data[0] !== undefined){
      var user = data[0];
      //Check Password
      if(req.body.password === user.password){
        //Login User
        var auth = Math.random().toString().replace('.', '');
        var session = {
          user_id   : user._id,
          username  : user.username,
          auth      : auth
        };
        user.auth = auth;
        user.save(function(){
          console.log("User Logged In");
          res.cookie('session', session).redirect('/');
        });
      } else {
        //Bad Password
        res.redirect('/login?msg=Wrong Username or Password');
      }
    } else {
      //Bad Stuff
      res.redirect('/login?msg=Wrong Username or Password');
    }
  })
}
// Logout Function
function logUserOut(req, res){
  var session = req.cookies.session;
  User.find({auth: session.auth}, function(err, data){
    if(data[0] !== undefined){
      var user = data[0];
      user.auth = "";
      user.save(function(){
        console.log("User Logged Off");
        res.clearCookie('session').redirect('/');
      })
    } else {
      res.clearCookie('session').redirect('/');
    }
  })
}


// Register Functions
function registerNewUser(req, res){
  User.find({username: req.body.username}, function(err, data){
    if(data == ""){
      var newUser = new User({
        username    : req.body.username,
        password    : req.body.password,
        first_name  : req.body.first_name,
        last_name   : req.body.last_name,
        age         : req.body.age,
        email       : req.body.email,
        address     : req.body.address,
        city        : req.body.city,
        zip         : req.body.zip
      });
      console.log("New User");
      newUser.save(function(){
        res.redirect('/login?msg=Account Created!');
      })
    } else {
      res.redirect('/register?msg=Username Univalable');
    }
  })
}
function checkUsernameAvailability(username, res){
  User.find({'username': username}, function(err, reply){

    if(reply == ''){
      res.send({availability: 'available'});
    } else {
      res.send({availability: 'unavailable'});
    }
  })
}


// Update User Info
function updateUserInfo(req, res){
  User.update({'auth': req.cookies.session.auth}, {
    username    : req.body.username,
    password    : req.body.password,
    first_name  : req.body.first_name,
    last_name   : req.body.last_name,
    age         : req.body.age,
    email       : req.body.email,
    address     : req.body.address,
    city        : req.body.city,
    zip         : req.body.zip
  }, function(err, callback){
    res.redirect('/dashboard?msg=Profile Updated');
  });
}

// Delete Account
function deleteAccount(req, res){
  var session = req.cookies.session;
  User.remove({'auth': session.auth}, function(err, reply){
    (reply);
    res.sendStatus(200);
  })
}
