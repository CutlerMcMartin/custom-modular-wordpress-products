jQuery(document).ready(function($){

    var platsAndPosts = [];
    var plugin_href = localized_variables.pluginsUrl; // The base plugin path to build on top of
    var site_hrf = localized_variables.siteurl;
    var plat_types = ['basic-plat','hex-plat','tri-plat']; // List of allowable platforms options
    var post_types = ['basic-post','house-post','wall-post']; // List of allowable posts options

    // This is the function that updates the element when a user picks the left or right arrows on screen
    function updateHorzTreeOption(direction){
        var new_option; // The variable that is going to hold the new element
        var post_plat_type = platsAndPosts[current_edit_pisition][2]; // This is determing if the elements of the tree are plats or posts. Determined by the current editing position.
        var option_element_array; // This holds the options that we could possibly be working with
        // This logic test determines which array we will be working with, posts or plats
        if (post_plat_type == 'plat') {
            option_element_array = plat_types;
        } else if (post_plat_type == 'post') {
            option_element_array = post_types;
        }
        // The nested logical tests determine the option we are using. Have to make sure that we aren't going off the array.
        if (direction == 'left'){
            if (option_element_array.indexOf(platsAndPosts[current_edit_pisition][1]) == 0) {
                new_option = option_element_array[option_element_array.length - 1] // Loops back to the back
            } else {
                new_option = option_element_array[option_element_array.indexOf(platsAndPosts[current_edit_pisition][1]) - 1] // Next option to the left
            }
        } else if (direction == 'right'){
            if (option_element_array.indexOf(platsAndPosts[current_edit_pisition][1]) == option_element_array.length - 1) {
                new_option = option_element_array[0] // Loops back to the beginning
            } else {
                new_option = option_element_array[option_element_array.indexOf(platsAndPosts[current_edit_pisition][1]) + 1] // Next option to the right
            }
        }
        platsAndPosts[current_edit_pisition][1] = new_option; // H 
        $('#' + platsAndPosts[current_edit_pisition][0]).attr('option', new_option); // Changing the option attribute on the html element to the new_option
        $('#' + platsAndPosts[current_edit_pisition][0]).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + post_plat_type + "s/" + new_option + ".svg"); // A terrible way to create the file path to the .svg file for the element
    }

    // Function that populates option box
    function populateOptionBox(position){
        $(".tree-component-options").empty();
        component_type = $(".cat-tree-svg-ele[position='" + position + "']").attr('plat_post')
        if (component_type == 'plat') {
            component_array = plat_types;
        } else if (component_type == 'post') {
            component_array = post_types;
        }
        component_array.forEach(element => {
            $(".tree-component-options").append("<img class='individual-component-tree-option' option='" + element + "' src='" + plugin_href + "/cat-tree-plugin/assets/tree-icons/" + component_type + "s/" + element + ".svg'>");
        });
    }

    // Running through all the elements that are posts and plats. This is meant to run right as the page starts up
    $(".cat-tree-svg-ele").each(function(){ 
        if ($(this).attr('plat_post') == "plat") { // Checking to see if the element is a plat
            if (plat_types.includes($(this).attr('option'))) { // Checking to see if the option is an option that we have
                platsAndPosts.push([$(this).attr('id'),$(this).attr('option'),$(this).attr('plat_post')]); // Adding the variable to the platsAndPosts array
                $(this).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + $(this).attr('plat_post') + "s/" + $(this).attr('option') + ".svg"); // A terrible way to create the file path to the .svg file for the element
            } else { // If the variable that was saved was not an option then force it to be the basic option
                platsAndPosts.push([$(this).attr('id'),'basic-plat',$(this).attr('plat_post')]); // Adding the variable to the platsAndPosts array
                $(this).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + $(this).attr('plat_post') + "s/basic-plat.svg"); // Setting the source to the basic option
            }
        }
        if ($(this).attr('plat_post') == "post") { // Checking to see if the element is a post
            if (post_types.includes($(this).attr('option'))) { // Checking to see if the option is an option that we have
                platsAndPosts.push([$(this).attr('id'),$(this).attr('option'),$(this).attr('plat_post')]); // Adding the variable to the platsAndPosts array
                $(this).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + $(this).attr('plat_post') + "s/" + $(this).attr('option') + ".svg"); // A terrible way to create the file path to the .svg file for the element        
            } else { // If the variable that was saved was not an option then force it to be the basic option
                platsAndPosts.push([$(this).attr('id'),'basic-post',$(this).attr('plat_post')]); // Adding the variable to the platsAndPosts array
                $(this).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + $(this).attr('plat_post') + "s/basic-post.svg"); // Setting the source to the basic option
            }
        }
    });

    // Reversing the order of the array, so that the first entry is the bottom platform. This makes everything less confusing sometimes and more confusing others
    platsAndPosts = platsAndPosts.reverse();

    //Setting it up that the current positions starts at the bottom
    var current_edit_pisition = 0; 
    populateOptionBox(current_edit_pisition);

    // Switching through the posts or plats options using the left arrow button
    $("#left-arrow-selector").click(function(){
        updateHorzTreeOption('left');
    });

    // Switching through the posts or plats options using the right arrow button
    $("#right-arrow-selector").click(function(){
        updateHorzTreeOption('right');
    });

    // Goin up from your position
    $("#up-arrow-selector").click(function(){
        if (current_edit_pisition < platsAndPosts.length - 1) {
            current_edit_pisition = current_edit_pisition + 1;
        }
        populateOptionBox(current_edit_pisition);
    });

    // Going down from your position
    $("#down-arrow-selector").click(function(){
        if (current_edit_pisition > 0) {
            current_edit_pisition = current_edit_pisition - 1;
        }
        populateOptionBox(current_edit_pisition);
    });
    
    // The button to save the tree
    $("#submit-tree").click(function(){
        //Take all the variables that are being controlled above and format them into a json variable
        var constructed_json_string = '{'
        platsAndPosts.forEach(element => {
            constructed_json_string = constructed_json_string + '"' + element[0] + '":"' + element[1] + '",'
        });
        constructed_json_string = constructed_json_string.slice(0,-1) + "}"
        jQuery.ajax({
            type: "POST", // Adding Post method
            url: localized_variables.ajaxurl, // Including ajax file
            data: {
                "action": "ajax_form", // Saying this is an ajax form
                "tree_json_input":constructed_json_string, // passing in the JSON element that is going to be saved under the tree_json_input column
                'post_id': $(this).attr('post_id')
            },
        });
    });

    // Save the tree and add the tree to the cart
    $("#buy-tree").click(function(){

        // Save the tree
        var constructed_json_string = '{'
        platsAndPosts.forEach(element => {
            constructed_json_string = constructed_json_string + '"' + element[0] + '":"' + element[1] + '",'
        });
        constructed_json_string = constructed_json_string.slice(0,-1) + "}"
        jQuery.ajax({
            type: "POST", // Adding Post method
            url: localized_variables.ajaxurl, // Including ajax file
            data: {
                "action": "ajax_form", // Saying this is an ajax form
                "tree_json_input":constructed_json_string, // passing in the JSON element that is going to be saved under the tree_json_input column
                'post_id': $(this).attr('post_id')
            },
        });

        var id_url_builder_array = []; // Holds the product IDs
        var quantity_url_builder_array = []; // Holds the quantity of each product
        var id_url_string_insert = ''; // The string of product IDs that are going to put into the url
        var quantity_url_string_insert = ''; // The string of quantities that are going to put into the url..... I'm trash at coding, stop looking at my code.
        // Getting product data from the REST API
        $.getJSON(site_hrf + '/wp-json/wp/v2/product', function(json_data){
            json_data.forEach(element => {
                for (let i = 0; i < platsAndPosts.length; i++) {
                    if (element.tree_design_object_ID == platsAndPosts[i][1]) {
                        if (id_url_builder_array.indexOf(element.id) != -1) {
                            quantity_url_builder_array[id_url_builder_array.indexOf(element.id)]++;
                        } else {
                            id_url_builder_array.push(element.id);
                            quantity_url_builder_array.push(1);
                        }
                    } 
                }
            });

            id_url_builder_array.forEach(element => { id_url_string_insert = id_url_string_insert + element + "," });
            id_url_string_insert = id_url_string_insert.slice(0,-1);
            quantity_url_builder_array.forEach(element => { quantity_url_string_insert = quantity_url_string_insert + element + "," });
            quantity_url_string_insert = quantity_url_string_insert.slice(0,-1);

            console.log(id_url_string_insert);
            console.log(quantity_url_string_insert);

            // Still won't add multiple of the same item
            // Template url: http://your-domain.com/cart/?add-to-cart=188,187,189&quantities=3,2,1
            jQuery.ajax({
                type: "POST", // Adding Post method
                url: site_hrf + "/cart/?add-to-cart=" + id_url_string_insert + "&quantities=" + quantity_url_string_insert
            });
        });
        
        
        
        // Add to cart with post IDs
    });

    // Clicking the element
    $(".cat-tree-svg-ele").click(function(){
        current_edit_pisition = $(this).attr('position');
        populateOptionBox(current_edit_pisition);
    });

    $(".tree-component-options").on("click", ".individual-component-tree-option", function(){
        var component_option = $(this).attr('option');
        console.log(current_edit_pisition);
        var post_plat_type = platsAndPosts[current_edit_pisition][2]; // This is determing if the elements of the tree are plats or posts. Determined by the current editing position.
        platsAndPosts[current_edit_pisition][1] = component_option;
        $('#' + platsAndPosts[current_edit_pisition][0]).attr('option', component_option); // Changing the option attribute on the html element to the new_option
        $('#' + platsAndPosts[current_edit_pisition][0]).children().attr('src', plugin_href + "/cat-tree-plugin/assets/tree-icons/" + post_plat_type + "s/" + component_option + ".svg"); // A terrible way to create the file path to the .svg file for the element
    });

});