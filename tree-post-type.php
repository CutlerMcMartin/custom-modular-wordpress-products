<?php

//Adds Custom Cat Tree Post Type

function cat_tree_post_type() {

    //Custom Cat Tree Post Type

    register_post_type('tree-design', array(
        'supports' => array('title', 'editor', 'thumbnail'),
        'rewrite' => array('slug' => 'tree-designs'),
        'has_archive' => true,
        'public' => true,
        'labels' => array(
            'name' => 'Tree Designs',
            'add_new_item' => 'Add New Tree',
            'edit_item' => 'Edit Tree',
            'all_items' => 'All Tree Designs',
            'singular_name' => 'Tree'
        ),
        'menu_icon' => 'dashicons-smiley'
    ));

}

add_action('init', 'cat_tree_post_type');

// Add custom field for the JSON string

//Custom Post Field Code from TeamTreeHouse: https://blog.teamtreehouse.com/create-your-first-wordpress-custom-post-type

function tree_design_custom_fields(){
    add_meta_box('tree_design_meta', 'Tree Design JSON', 'tree_designs_meta', 'tree-design', 'normal', "low");
}
  
function tree_designs_meta() {
    global $post;
    $custom = get_post_custom($post->ID);
    $treeDesignJSON = $custom['tree_design_JSON'][0];
    ?>
    <textarea cols='50' rows='1' name='tree_design_JSON'><?php echo $treeDesignJSON; ?></textarea></p>
    <?php
  }
  
add_action('admin_init', 'tree_design_custom_fields');

function tree_design_save_details(){
    global $post;
    update_post_meta($post->ID, 'tree_design_JSON', $_POST['tree_design_JSON']);
}

add_action('save_post', 'tree_design_save_details');