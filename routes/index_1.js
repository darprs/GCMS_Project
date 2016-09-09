var express = require('express');
var router = express.Router();
var generateName = require('sillyname');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function clear_collections(){
    UID.remove({}, function(err) {
        console.log('UID collection cleared')
    });
    Item.remove({}, function(err) {
        console.log('Item collection cleared')
    });
}

/** setup system. **/
router.get('/clean_setup', function(req, res, next) {

    clear_collections();
    //User.index({ first: 1, last: -1 }, { unique: true })
    //Item.index({item_uid:1 ,item_version: -1}, { unique: true });
    //mongoose.ensu
    //Item.ensureIndex({item_uid:1 ,item_version: -1}, { unique: true });
    var startUID = new UID(
        {
            geo_prefix: app_config.geoPrefix,
            ID: parseInt(app_config.startUID)
        }

    );

    startUID.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('UID values saved successfully:', userObj);
            //res.render('service', { title: 'System setup completed' });
        }
    });

    var root = new Item(
        {
            item_uid:getrootUID(),
            item_name:'Root_folder',
            item_version:0,
            item_parent_uid:getrootUID(),
            item_type:0

        }

    );


    root.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {

            console.log('Items values saved successfully:', userObj);
            res.render('service', { title: 'System setup completed' });
        }
    });

});

/** function get new UID  - if call back passed will call if not will return new id**/
function getnewuid(callback){
    UID.findOneAndUpdate({} ,{ $inc: { ID: 1 }},{new : true},function(err, doc){
        if(err){
            console.log("Unable to provide new ID");
        }
        else
        {
            var newUID = doc.geo_prefix + doc.ID;
            console.log('New UID allocated :' ,newUID);
            callback ( newUID);
        }
        return err;
    });
}



/** function get root UID **/
function getrootUID(){
    return app_config.geoPrefix + app_config.startUID;
};



/** GET new UID test**/
router.get('/getnewuid',function(req, res, next) {
    getnewuid(function (value) {
        res.render('service', { title: value });
    })

});


/** GET testItemCreation**/
router.get('/createRandomRootfolder', function(req, res, next) {

    var sillyName = generateName();
    getnewuid(function (new_id) {
        var testitem = new Item(
            {
                item_uid:new_id,
                item_name: sillyName,
                item_version:0,
                item_parent_uid:getrootUID(),
                item_type:0
            }
        );
        testitem.save(function (err, saved) {
            if (err) {
                console.log(err);
            } else {
                console.log('Folder created:', saved);
                res.render('service', {title: saved});
            }

        });
    });
});




//get item
router.get('/:itemUID', function(req, res) {
    get_item_by_UID(req.params.itemUID, function (found_item) {
                    res.send(found_item);
    });
});


function get_item_by_UID(uid,callback){
    console.log('Tring to get : '+ uid);
    Item.aggregate({$match:{item_uid:uid}},{$sort:{item_version:-1}},{$limit:1}
    ,function(err,found_arr){
        console.log('Found ', found_arr.length , ' items' );
        if (found_arr.length == 0)
        {
            console.log('Not found');
            callback('ID Not found... i was really looking and checking... in other places too.. but no :(');
        }
        else {
            console.log('Item found : ', found_arr[0]);
            callback(found_arr[0]);
        }
    });

}


router.get('/:itemUID/gc', function(req, res) {
    get_childs_by_UID(req.params.itemUID, function (childs) {
        res.send(childs);
    });
});



function get_childs_by_UID(uid,callback) {
    console.log('Checking childitems for : '+ uid);
    Item.aggregate
    ( [ {$match:{item_parent_uid:uid}},
            {$sort: {"item_uid":1,"item_version":-1}},
            { $group : { _id : "$item_uid" ,
                item_uid:{$first:"$item_uid"},
                item_version: {$first:"$item_version"},
                item_name: {$first:"$item_name"},
                item_parent_uid:{$first:"$item_parent_uid"}
            }
            },{$sort: {"_id":1}}
        ],
        function(err, childItems) {
        if (childItems.length == 0)
        {
            console.log('No child items');
            get_item_by_UID(uid,callback);
        }
        else {
            console.log('Childs found');
            callback(childItems);
        }
    });
}

//GET item set rundom name (SRN)
router.get('/:itemUID/srn', function(req, res) {
    set_item_random_by_UID(req.params.itemUID, function (updated_item) {
        res.send(updated_item);
    });
});




function set_item_by_UID(uid,name, parent_uid, callback) {
    console.log('Updating ',  uid , ' to ' , name  ,  ' and parent :' , parent_uid);

    get_item_by_UID(uid,function (found_item) {
        if (uid == getrootUID())   {callback(found_item)}
        else {
            var new_par = "";
            var new_name ="";
            if (!parent_uid) { new_par = found_item.item_parent_uid; }
            else { new_par = parent_uid; }
            if (!name) { new_name = found_item.item_name;}
            else { new_name = name; }
            var new_version = new Item(
                {
                    item_uid: uid,
                    item_name: new_name,
                    item_version: found_item.item_version + 1,
                    item_parent_uid: new_par,
                    item_type: found_item.item_type
                }
            );


            new_version.save(function (err, userObj) {
                if (err) {
                    console.log(err);
                } else {

                    console.log('Item saved successfully:', userObj);
                    callback(userObj);
                }
            });
        }
    });
}



function set_item_random_by_UID(uid,callback) {
    var newName =  generateName();

    console.log('New name for UID:',uid,' :"' , newName,'".');
    set_item_by_UID(uid,newName,null,callback);
}




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

router.get('/:itemUID/sp/:parentUID', function(req, res){
    test_item(req.params.itemUID ,req.params.parentUID,
        function(uid, p_uid ,result){
            if (!result)
                {  res.send("item "  + uid + " not exist.");}
            else
                {
                    test_item(p_uid,uid,
                        function (p_uid, uid ,result) {
                            if (!result)
                            {  res.send("item "  + p_uid + " not exist.");}
                            else {
                                console.log("Changing parent of ", uid, " to ", p_uid);
                                res.send(("Changing parent of "+ uid + " to " + p_uid));
                            }
                    });
                }

        });
});



function test_item(uid,puid,callback) {
    Item.findOne({'item_uid':uid},function (err, result) {
        if (result)
        {
            console.log ("Item UID:", puid, " exist.");
            callback(uid,puid,true);
        }
        else
        {
            console.log ("Item UID:", puid, " NOT exist.");
            callback(uid,puid,false);
        }
    });
}


module.exports = router;
