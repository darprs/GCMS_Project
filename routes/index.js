var express = require('express');
var router = express.Router();



router.get('/', function (req, res) {
    res.render('master',
        { title : app_config.GeoPrefix }
    )
})









module.exports = router;
