var express = require('express');
var router = express.Router();
var ff = require('./farm_functions.js');

//all files for farm services served by farm.js and accessable using: http://localhost:8080/farm/


/* GET home page. */
router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
});



/**************************************************************************/
/* Daria Test */

router.get('/get_all', function(req, res)
{
      get_all(function (all) {
            res.send(all);
      });
});


function get_all(callback)
{
      console.log('\n Daria testing in functions');

      Item.aggregate
      ( [ {$sort: {"item_uid":1,"item_version":-1}},
                { $group : { _id : "$item_uid" ,
                      item_uid:{$first:"$item_uid"},
                      item_version: {$first:"$item_version"},
                      item_name: {$first:"$item_name"},
                      item_parent_uid:{$first:"$item_parent_uid"}
                }
                },{$sort: {"_id":1}}
          ],
          function(err, all) {
                if (all.length == 0)
                {
                      console.log('\n Daria - ERORR!!!');
                      get_all(callback);
                }
                else {
                      console.log('\n Daria - All found');
                      callback(all);
                }
          });
}





/* Download File */

router.get('/home/darprs/GCMS/ISR/Folder2/Folder3/Test.txt', function(req, res)
{
    res.sendFile('/home/darprs/GCMS/ISR/Folder2/Folder3/Test.txt');

});


/* Upload File */

router.post('/upload', function(req, res)
{
    var sampleFile;

    if (!req.files)
    {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.sampleFile;

    //TODO: define path

    sampleFile.mv('/home/darprs/GCMS/ISR/test.txt', function(err)
    {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.send('File uploaded!');
        }
    });
});



/*
 module.exports.get_all = function(callback)
 {
 console.log('\n Daria testing in functions');

 Item.find( function(err, all) {
 if (all.length == 0)
 {
 console.log('\n Daria - ERORR!!!');
 ff.get_all(callback);
 }
 else {
 console.log('\n Daria - All found');
 callback(all);
 }
 });
 };

 */





module.exports = router;
