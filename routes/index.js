var express = require('express');
var router = express.Router();
var generateName = require('sillyname');









router.get('/local/:itemUID/sp/:parentUID', function(req, res){
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





module.exports = router;
