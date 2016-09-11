/**
 * Created by master on 09/09/16.
 */
var ff = require('./farm_functions.js');
var express = require('express');
var router = express.Router();
var generateName = require('sillyname');

//node-rest-client
var Client = require('node-rest-client').Client;
var Curl = require( 'node-libcurl' ).Curl;

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
        res.json(found_item);
    });
});


//get childs - tested
router.get('/:itemUID/gc', function(req, res) {
    console.log(req.url);
    ff.get_childs(req.params.itemUID, function (childs) {
        res.json(childs);
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


//get childs tree - not ready
router.get('/:itemUID/gct',function(req, res){
    console.log(req.url);
    ff.get_item_tree(req.params.itemUID,function(created_item) {
        res.render('service', {title: created_item});
    });
});


//global functions
router.get('/:itemUID/test', function(req, res) {
    console.log(req.url);

    function get_childs(uid,service,result,farm,callback)
    {
        if ( farms.length == farm){
            console.log("Results: " + result);
            callback(result);
        } //end of recursive call
        else{
            var curl = new Curl();
            var current_call = farms[farm] + req.params.itemUID + service;
            console.log("Calling :"+ current_call );
            curl.setOpt( 'URL', current_call  );
            curl.on( 'end', function(statusCode, body, headers )
                {
                   //var res = body.replace("[","").replace("]","");
                    result.child_items.push(JSON.parse(body)); // uncomment
                    // forEach(item in body)
                    // {
                    //     result.items.push(JSON.parse(item));
                    // }
                    // console.log(body);
                    // body.replace("[","").replace("]","");
                    // console.log(body);
                    // var items = JSON.parse(body);
                    //
                    // //items = (items);
                    // console.log(items);
                    // result.items.push(items);
                    //for (var k in items)
                    // {
                    //     //result.push(JSON.parse(item));
                    //     console.log(k, );
                    // }
                    // items.forEach(function(item) {
                    //     result.push(JSON.parse(item));
                    //     });
                    //console.log(res);
                    //result = result + res;
                    //console.log(result);
                    //result.items.push(JSON.parse(body));
                    //endPoints.splice(0,1);
                    farm = farm + 1;
                    get_childs(uid,service,result,farm,callback);
                });
            curl.perform();
            }

    }

    ///call
    var result = {child_items:[]};
    get_childs(req.params.itemUID,"/gc",result,0,function () {
        res.json(result);
    });


});




router.get('/:itemUID/test1', function(req, res) {
    console.log(req.url);

    function get(uid,service,result,farm,callback)
    {
        if ( farms.length == farm){
            console.log("Results: " + result);
            callback(result);
        } //end of recursive call
        else{
            var curl = new Curl();
            var current_call = farms[farm] + req.params.itemUID + service;
            console.log("Calling :"+ current_call );
            curl.setOpt( 'URL', current_call  );
            curl.on( 'end', function(statusCode, body, headers )
            {
                //var res = body.replace("[","").replace("]","");
                result.child_items.push(JSON.parse(body)); // uncomment
                farm = farm + 1;
                get(uid,service,result,farm,callback);
            });
            curl.perform();
        }

    }
});




module.exports = router;