const path = require('path');
const ConversionService = require('../models/service')
const fse = require('fs-extra');
var express = require('express');
var Promise = require('promise')


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
 
router.post('/upload', upload.single('session'), async(req, res, next) => {
  try {  
    var sessionJson = JSON.parse(fse.readFileSync(req.file.path, 'utf-8'));

    const service = new ConversionService();
    const pdfName = await service.exportLaTeXDocuments(sessionJson);

    res.sendFile(path.resolve(`./tmp/${pdfName}`)); 
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
