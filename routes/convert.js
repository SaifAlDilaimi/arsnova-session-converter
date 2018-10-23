const path = require('path');
const Session = require('../models/session')
const LaTeXDoc = require('../models/latexdoc')
var express = require('express');
const fse = require('fs-extra');
var router = express.Router();

//multer object creation
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
})

var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.json') {
      return callback(new Error('Only ARSnova JSON files are allowed'))
    }
    callback(null, true)
  },
  limits:{
    fileSize: 1024 * 1024
  } 
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
router.post('/upload', upload.single('session'),function(req, res) {
  var session_file = JSON.parse(fse.readFileSync(req.file.path, 'utf-8'));

  var session = new Session(session_file);
  
  var tex = new LaTeXDoc(session);

  var options = {
    root: '../tmp/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  res.sendFile(path.resolve("./tmp/"+tex.pdf_name));
});

module.exports = router;
