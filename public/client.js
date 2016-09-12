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

        console.log(tree);

        res_json = JSON.parse(tree);

        $('#MyTree').jstree({ 'core' : {'data': res_json } });

        $("#Entry_Btn_Login").hide();
    });
});



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