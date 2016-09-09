/**
 * Created by master on 09/09/16.
 */
var generateName = require('sillyname');
var ff = require('./farm_functions.js');

module.exports.clear_collections = function (){
    UID.remove({}, function(err) {
        if (err) {console.log(err);}
        console.log('UID collection cleared')
    });
    Item.remove({}, function(err) {
        if (err) {console.log(err);}
        console.log('Item collection cleared')
    });
};


/** function get root UID **/
module.exports.getrootUID = function ()
{
    return app_config.geoPrefix + app_config.startUID;
};



module.exports.getnewuid = function (callback){
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
};


module.exports.get_item_by_UID = function (uid,callback){
    console.log('Tring to get : '+ uid);
    Item.aggregate({$match:{item_uid:uid}},{$sort:{item_version:-1}},{$limit:1}
        ,function(err,found_arr){
            console.log('Found ', found_arr.length , ' items' );
            if (found_arr.length == 0)
            {
                console.log('Not found');
                callback('Not found... i was really looking and checking... in other places too.. but no :(');
            }
            else {
                console.log('Item found : ', found_arr[0]);
                callback(found_arr[0]);
            }
        });

};



module.exports.setup_collections = function(callback){
    var startUID = new UID(
        {
            geo_prefix: app_config.geoPrefix,
            ID: parseInt(app_config.startUID)
        }

    );
    startUID.save(function (err, userObj) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('UID values saved successfully:', userObj);
            var root = new Item(
                {
                    item_uid:ff.getrootUID(),
                    item_name:'Root_folder',
                    item_version:0,
                    item_parent_uid:ff.getrootUID(),
                    item_type:0
                }
            );
            root.save(function (err, userObj) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {

                    console.log('Items values saved successfully:', userObj);
                    callback( 'System setup completed successfully.');
                }
            });
        }
    });
};


module.exports.create_new_item = function (name,parent,type,callback){
    ff.getnewuid(function (new_id) {
        var testitem = new Item(
            {
                item_uid:new_id,
                item_name: name,
                item_version:0,
                item_parent_uid:parent,
                item_type:type
            }
        );
        testitem.save(function (err, saved) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log('Folder created:', saved);
                callback(saved);
            }

        });
    });
};


module.exports.get_childs_by_UID = function(uid,callback) {
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
                ff.get_item_by_UID(uid,callback);
            }
            else {
                console.log('Childs found');
                callback(childItems);
            }
        });
};


module.exports.set_item_by_UID = function(uid,name, parent_uid, callback) {
    console.log('Updating ',  uid , ' to ' , name  ,  ' and parent :' , parent_uid);

    ff.get_item_by_UID(uid,function (found_item) {
        if (uid == ff.getrootUID())   {callback(found_item)}
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
            new_version.save(function (err, updated) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {

                    console.log('Item saved successfully:', updated);
                    callback(updated);
                }
            });
        }
    });
};



module.exports.set_item_random_name_by_UID = function(uid,callback) {
    var newName =  generateName();

    console.log('New name for UID:',uid,' :"' , newName,'".');
    ff.set_item_by_UID(uid,newName,null,callback);
};




module.exports.test_item_exist = function(uid,puid,callback) {
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
};


module.exports.set_item_parent_by_UID = function (uid,p_uid,callback) {
    ff.test_item_exist(uid ,p_uid,
        function(uid, p_uid ,result){
            if (!result)
            {
                callback("item "  + uid + " not exist.");
            }
            else
            {
                ff.test_item_exist(p_uid,uid,
                    function (p_uid, uid ,result) {
                        if (!result)
                        {  callback("item "  + p_uid + " not exist.");}
                        else {
                            console.log("Changing parent of ", uid, " to ", p_uid);
                            ff.get_item_by_UID(uid,function(found_item) {
                                ff.set_item_by_UID_and_Version(found_item.item_uid,found_item.item_version,found_item.item_name,found_item.item_uid,function(result) {
                                    ff.set_item_by_UID(uid,null,p_uid,callback);
                                })
                            })
                        }
                    });
            }
        });
};


module.exports.set_item_by_UID_and_Version = function(uid,ver,name,parent_uid, callback) {
    console.log('Updating ',  uid , ', version :',ver, ' to ' , name  ,  ' and parent :' , parent_uid);
    if (uid == null || ver == null ) { callback("No Params") }
    else
    {
        Item.findOneAndUpdate({item_uid:{$eq:uid}, item_version: {$eq:ver}},{$set:{item_name:name,item_parent_uid:parent_uid}},{new : true},function (err,result) {
            if(err) {callback(err)}
            else
            {
                console.log('Item ',  uid , ', version :',ver, ' to ' , name  ,  ' and parent :' , parent_uid, " updated.");
                callback(result);
            }
        })
    }
};