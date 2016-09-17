/**
 * Created by darprs on 09/09/16.
 */

$("#Entry_Btn_Login").click(function(){
    $.get("/get_all", function(data, status){

        //var json_string = JSON.stringify(data);

        var tree = '[ ';

        for(var i in data)
        {
            tree += '{ "id" : "' + data[i].item_uid + '" , "parent" :  "';

            if(data[i].item_parent_uid == 'ISR10000000')
            {
                tree += '#" , "text" : "' + data[i].item_name + '" } ,';
            }
            else
            {
                tree += data[i].item_parent_uid + '" , "text" : "' + data[i].item_name + '" } ,';

            }
        }

        var len = tree.length;
        tree = tree.substring(0, len-1);
        tree += ' ]';

        //console.log(tree);

        res_json = JSON.parse(tree);

        $('#MyTree').jstree({ 'core' : {'data': res_json } });

        $("#Entry_Btn_Login").hide();
    });
});


$("#download_button").click(function() {

    /* Download File */

    var iframe = document.getElementById("downloadFrame");
    iframe.src = "/home/darprs/GCMS/ISR/Folder2/Folder3/Test.txt";

});

/*
$("#upload_button").click(function() {

    /* Upload File */

/*
    var formData = new FormData($('form')[0]);
    $.ajax({
        url: 'upload.php',  //Server script to process data
        type: 'POST',
        xhr: function() {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events
        beforeSend: beforeSendHandler,
        success: completeHandler,
        error: errorHandler,
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
    });

});






//  /home/darprs/GCMS/ISR/Folder2/Folder3/Test.txt



/*
$(document).ready( function() {

    $('#MyTree').jstree({ 'core' : {
        'data' : [
            { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
            { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
            { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
            { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
        ]
    } });

});
*/



/*  WORKING!!!!
$(document).ready( function() {
    $('#MyTree').jstree({ 'core' : {
        'data' : [
            'Simple root node',
            {
                'text' : 'Root node 2',
                'state' : {
                    'opened' : true,
                    'selected' : true
                },
                'children' : [
                    { 'text' : 'Child 1' },
                    'Child 2'
                ]
            }
        ]
    } });
});


$('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
});

*/