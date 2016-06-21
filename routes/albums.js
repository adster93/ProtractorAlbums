var express = require('express');
var router = express.Router();
var db = require('../config/database')
var albumCollection = db.get('albums')

/* GET users listing. */
router.get('/', function(req, res, next) {
  albumCollection.find({}, function(err, albums){
    res.render('./albums/index', {albums: albums})
  })
})

router.get('/new', function(req, res, next) {
  res.render('./albums/new')
})
router.get('/:albumName', function(req, res, next) {
  albumCollection.findOne({album: req.params.albumName}, function(err, album){
  res.render('./albums/show', {album: album})
  })
})

router.post('/', function(req, res, next) {
  console.log(req.body);
  albumCollection.insert(req.body, function(err, albums){
    if(err) console.log(err);
    res.redirect('/albums')
  })
})
router.put('/:albumName', function(req, res, next) {
  console.log('derping hard')
  console.log(req.body);

  albumCollection.update({album: req.params.albumName},req.body, function(err, albums){
    if(err) console.log(err);
    console.log('getting here');
    res.redirect('/albums')
  })
})
router.get('/:albumName/edit', function(req, res, next) {
  albumCollection.findOne({album: req.params.albumName}, function(err, album){
    res.render('albums/edit', {album: album})
  })
})
router.delete('/:albumName', function(req, res, next) {
  albumCollection.findOne({album: req.params.albumName}, function(err, album){
    res.redirect('/albums')
  })
})


module.exports = router;
