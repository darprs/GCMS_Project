var express = require('express');
var router = express.Router();

//all files for farm services served by farm.js and accessable using: http://localhost:8080/farm/


/* GET home page. */
router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
});


module.exports = router;
