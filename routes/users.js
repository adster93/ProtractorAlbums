var express = require('express');
var router = express.Router();
var db = require('../config/database')
var userCollection = db.get('users')
var sha256 = require('sha256')

router.post('/', function(req, res, next) {
  userCollection.insert(req.body, function(err, albums){
    if(err) throw err;
    req.session.username = req.body.username;
    res.redirect('users/login');
  })
})

router.get('/login', function(req, res, next) {
  res.render('users/login');
});


router.post('/login', function(req, res){
  userCollection.find(req.body, function(err, user){
    if(user.length === 0){
      res.redirect('/signup');
    }
    else{
      req.session.username = req.body.username;
      res.render('albums/index', {user: req.session.username, albums: ''});
    }
  });
});

router.get('/logout', function(req, res){
  userCollection.find({username: req.session.username}, function(err, user){
    req.session.destroy(function(err){
      res.redirect('/albums')
    });
  });
});

module.exports = router;
