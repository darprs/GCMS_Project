/**
 * Created by darprs on 09/09/16.
 */

$("#Entry_Btn_Login").click(function(){
    $.get("/ISR10000000/gc", function(data, status){

        var json_string = JSON.stringify(data);

        var tree = '';

        for(var i in data)
        {
            tree += "{ 'id' : '" + data[i].item_uid + "' , 'parent' :  '";

            if(data[i].item_parent_uid == 'ISR10000000')
            {
                tree += "#' , 'text' : '" + data[i].item_name + "' } ,";
            }
            else
            {
                tree += data[i].item_parent_uid + "' , 'text' : '" + data[i].item_name + "' } ,";

            }
        }

        tree--;

        //alert(JSON.stringify(tree));


        $('#MyTree').jstree({ 'core' : {'data': [
            { 'id' : 'ISR10000001' , 'parent' :  '#' , 'text' : 'Fringewatcher Stone' } ,
            { 'id' : 'ISR10000014' , 'parent' :  '#' , 'text' : 'Vinegriffin Back' } ,
            { 'id' : 'ISR10000014' , 'parent' :  '#' , 'text' : 'Spangleheron Chest' } ,
            { 'id' : 'ISR10000014' , 'parent' :  '#' , 'text' : 'Cookiellama Talon' } ,
            { 'id' : 'ISR10000014' , 'parent' :  '#' , 'text' : 'Firelf Friend' } ,
            { 'id' : 'ISR10000013' , 'parent' :  '#' , 'text' : 'Swiftgoose Minnow' } ,
            { 'id' : 'ISR10000012' , 'parent' :  '#' , 'text' : 'Hickorybite Hound' } ,
            { 'id' : 'ISR10000011' , 'parent' :  'ISR10000001' , 'text' : 'Junglesoarer Zebra' } ,
            { 'id' : 'ISR10000010' , 'parent' :  'ISR10000014' , 'text' : 'Rattlefoe Lynx' } ,
            { 'id' : 'ISR10000009' , 'parent' :  'ISR10000014' , 'text' : 'Rippleswoop Lifter' } ,
            { 'id' : 'ISR10000008' , 'parent' :  'ISR10000014' , 'text' : 'Glenbird Stallion' } ,
            { 'id' : 'ISR10000007' , 'parent' :  'ISR10000009' , 'text' : 'Rainbowking Whip' } ,
            { 'id' : 'ISR10000006' , 'parent' :  'ISR10000009' , 'text' : 'Quivermole Knave' } ,
            { 'id' : 'ISR10000005' , 'parent' :  'ISR10000006' , 'text' : 'Baldcrest Finger' } ,
            { 'id' : 'ISR10000004' , 'parent' :  'ISR10000006' , 'text' : 'Bushwarrior Toucan' } ,
            { 'id' : 'ISR10000003' , 'parent' :  'ISR10000006' , 'text' : 'Legendelk Sight' } ,
            { 'id' : 'ISR10000002' , 'parent' :  'ISR10000006' , 'text' : 'Vineraptor Condor' }
            ] } });
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