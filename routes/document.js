var express = require('express');
const fse = require('fs-extra');
var router = express.Router();

/* GET home page. */
router.get('/:docname', function(req, res, next) {
    var docname = req.params.docname;

    var stream = fse.createReadStream("./tmp/"+docname);
    var filename = docname;
    // Be careful of special characters

    filename = encodeURIComponent(filename);
    // Ideally this should strip them

    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    stream.pipe(res);
});