var express = require('express');
var router = express.Router();



router.get('/', function (req, res) {
    res.render('master',
        { title : 'GCMS' }
    )
})









module.exports = router;
