/**
 * Created by master on 06/09/16.
 */
var express = require('express');



/* System objects mongoose models */

global.UID = mongoose.model('UID',
    {
        geo_prefix:String,
        ID:Number,
        versionKey: false
    });

global.Item = mongoose.model('Item',
    {
        item_uid:{ type: String, index: true },
        item_name:{ type: String, index: true },
        item_version:Number,
        item_parent_uid:{ type: String, index: true },
        item_type:Number, //0  - folder , 1 document
        versionKey: false
    }
);
