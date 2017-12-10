var mongoose = require('mongoose');
mongoose.connect("mongodb://10.0.0.2/27017/mongoSchema")
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
});

var User = mongoose.model('User', userSchema);


// Main App
require('express')()

.set('view engine', 'pug')
.use(require('express').static(__dirname + "/public"))

.get('/register', function(req, res){
  res.render('register', {
    title: 'Register'
  })
})

.get('/login', function(req, res){
  res.render('login', {
    title: "Login"
  })
})

.get('/', function(req, res){
  res.render('home');
})

.listen(3000);
