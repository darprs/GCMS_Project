/**
 * Created by master on 09/09/16.
 */
var ff = require('./farm_functions.js');
var express = require('express');
var router = express.Router();
var generateName = require('sillyname');


//system setup - tested
router.get('/clean_setup', function(req, res) {
    console.log(req.url);
    ff.clear_collections();
    ff.setup_collections(function (result) {
        res.render('service', {title: result});
    });
});


//GET testItemCreation - tested
router.get('/createRandomRootfolder', function(req, res) {
    console.log(req.url);
    var sillyName = generateName();
    ff.new_item(sillyName,ff.getrootUID(),0,function(created_item) {
        res.render('service', {title: created_item});
    });
});


//get item - tested
router.get('/:itemUID', function(req, res) {
    console.log(req.url);
    ff.get_item(req.params.itemUID,null, function (found_item) {
        res.send(found_item);
    });
});

//GET item set rundom name (SRN) - tested
router.get('/:itemUID/srn', function(req, res) {
    console.log(req.url);
    ff.set_item_random_name(req.params.itemUID, function (updated_item) {
        res.send(updated_item);
    });
});


//get item by version - tested
router.get('/:itemUID/v/:itemVer', function(req, res) {
    console.log(req.url);
    ff.get_item(req.params.itemUID,req.params.itemVer ,function (found_item) {
        res.send(found_item);
    });
});


//get childs - tested
router.get('/:itemUID/gc', function(req, res) {
    console.log(req.url);
    ff.get_childs(req.params.itemUID, function (childs) {
        res.send(childs);
    });
});


//get childs visual - tested
router.get('/:itemUID/gcv', function(req, res) {
    console.log(req.url);
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    ff.get_childs(req.params.itemUID, function (childs) {
        ff.get_item(req.params.itemUID, null, function (folder) {
            res.render('items_list', {
                "itemsList" : childs , "folder" : folder , "req":req , "fullUrl":fullUrl
            });
        })

    });
});



//set parent for item - tested
router.get('/:itemUID/sp/:parentUID', function(req, res){
    console.log(req.url);
    if (req.params.itemUID == ff.getrootUID()) // no change for root
    {
        ff.get_item(req.params.itemUID,null, function (found_item) {
            res.send(found_item);
        });
    }
    else
        {
            ff.set_item_parent(req.params.itemUID ,req.params.parentUID,function(value) {
                res.send(value);
            });
        }
});



router.get('/:itemUID/test', function(req, res) {
    console.log(req.url);
    ff.get_childs(req.params.itemUID, function (childs) {
        console.log(req.path);
        res.render('items_list', {
            "itemsList" : childs
        });
    });
});




module.exports = router;