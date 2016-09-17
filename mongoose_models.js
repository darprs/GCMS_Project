/**
 * Created by master on 06/09/16.
 */
var express = require('express');



/* System objects mongoose models */

global.UID = mongoose.model('UID',
    {
        geo_prefix:String,
        ID:Number
    });

global.Item = mongoose.model('Item',
    {
        item_uid:{ type: String, index: true ,required: true},
        item_name:{ type: String, index: true ,required: true},
        item_version:{type:Number, required: true},
        item_parent_uid:{ type: String, index: true ,required: true},
        item_type:{type:Number, required: true}, //0  - folder , 1 document
        item_content:String,
        versionKey: false
    }
);

global.Farm = mongoose.model('Farm',
    {
        name:String,
        hostname:String,
        port:Number
    }
);
