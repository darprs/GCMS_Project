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
    ff.new_item(null,sillyName,null,ff.getrootUID(),null,function(created_item) {
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
        res.json(found_item);
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

    ff.get_childs(req.params.itemUID, function (childs) {
        ff.get_item(req.params.itemUID, null, function (folder) {
            var parentUrl = (req.protocol + '://' + req.get('host') + req.originalUrl).replace(folder.item_uid,folder.item_parent_uid);
            res.render('items_list', {
                "itemsList" : childs , "folder" : folder , "parentUrl":parentUrl
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



// router.post('/:itemUID/cc/:child_name/') , function (req, res) {
//     console.log(req.url);
//     ff.new_item(req.params.child_name,req.params.itemUID,0,function (result) {
//         res.json(result);
//     })
// };

router.get('/:itemUID/cc/:child_name',function (req, res) {
    //console.log(req.params.child_name);
    ff.new_item(null,req.params.child_name,null,req.params.itemUID,null,function (result) {
        res.json(result);
    })
});

router.get('/:itemUID/cc/:child_name/content/:document_content',function (req, res) {
    ff.new_item(null,req.params.child_name,null,req.params.itemUID,req.params.document_content,function (result) {
        res.json(result);
    })

});
// router.get('/:itemUID/gp', function(req, res) {
//     console.log(req.url);
//     var result = [];
//     ff.get_item(req.params.itemUID,null,function (item) {
//         result.push(item);
//         ff.get_path(item, result, function (result) {
//             res.json(result);
//         });
//     });
// });

//set old
router.get('/:itemUID/so',function (req, res) {
    ff.set_item_not_last(req.params.itemUID,function (old_item) {
        res.json(old_item);
    })
});

//set existing child
router.get('/:itemUID/sec/:itemParentUID/:item_version/:child_name/:document_content',function (req, res) {
    //ff.new_item(null,req.params.child_name,null,req.params.itemUID,req.params.document_content,function (result) {
        ff.new_item(req.params.itemUID,req.params.child_name,req.params.item_version,req.params.itemParentUID,req.params.document_content,function (result) {
            res.json(result);
        });
    // }
    //     res.json(result);
    });

module.exports = router;