/**
 * Created by master on 09/09/16.
 */
var ff = require('./farm_functions.js');
var express = require('express');
var router = express.Router();
var generateName = require('sillyname');



router.get('/clean_setup', function(req, res) {
    ff.clear_collections();
    ff.setup_collections(function (result) {
        res.render('service', {title: result});
    });
});



/** GET new UID test**/
router.get('/getnewuid',function(req, res) {
    ff.getnewuid(function (value) {
        res.render('service', { title: value });
    })
});



/** GET testItemCreation**/
router.get('/createRandomRootfolder', function(req, res) {

    var sillyName = generateName();
    ff.create_new_item(sillyName,ff.getrootUID(),0,function(created_item) {
        res.render('service', {title: created_item});
    });
});



router.get('/:itemUID', function(req, res) {
    ff.get_item_by_UID(req.params.itemUID, function (found_item) {
        res.send(found_item);
    });
});


router.get('/:itemUID/gc', function(req, res) {
    ff.get_childs_by_UID(req.params.itemUID, function (childs) {
        res.send(childs);
    });
});


//GET item set rundom name (SRN)
router.get('/:itemUID/srn', function(req, res) {
    ff.set_item_random_name_by_UID(req.params.itemUID, function (updated_item) {
        res.send(updated_item);
    });
});







router.get('/:itemUID/sp/:parentUID', function(req, res){
    if (req.params.itemUID == ff.getrootUID())
    {
        ff.get_item_by_UID(req.params.itemUID, function (found_item) {
            res.send(found_item);
        });
    }
    else
        {
            ff.set_item_parent_by_UID(req.params.itemUID ,req.params.parentUID,function(value) {
                res.send(value);
            });
        }
});



router.get('/:itemUID/test', function(req, res) {
    // Item.aggregate({$match:{item_uid:req.params.itemUID}},{$sort:{item_version:-1}},{$limit:1},function (err,f) {
    //     res.send(f[0]);
    // });

    Item.aggregate
    ( [ {$match:{item_parent_uid:req.params.itemUID}},
        {$sort: {"item_uid":1,"item_version":-1}},
        { $group : { _id : "$item_uid" ,
            item_uid:{$first:"$item_uid"},
            item_version: {$first:"$item_version"},
            item_name: {$first:"$item_name"},
            item_parent_uid:{$first:"$item_parent_uid"}
        }
        },{$sort: {"_id":1}}
    ],function (err,result) {
        if (err){res.send(err)}
        else { res.send(result);}
    });
});




module.exports = router;