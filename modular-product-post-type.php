<?php

//Adds Custom Modular Product Post Type  (This Section Works)

function modular_product_post_type() {

    //Custom Modular Product Post Type
    register_post_type('mod-prod-design', array(
        'supports' => array('title', 'editor', 'thumbnail'),
        'rewrite' => array('slug' => 'mod-prod-designs'),
        'has_archive' => true,
        'public' => true,
        'labels' => array(
            'name' => 'Modular Product Designs',
            'add_new_item' => 'Add New Modular Product',
            'edit_item' => 'Edit Modular Product',
            'all_items' => 'All Modular Product Designs',
            'singular_name' => 'Modular Product'
        ),
        'menu_icon' => 'dashicons-smiley',
        'menu_position' => 55
    ));

}

add_action('init', 'modular_product_post_type');

// Add custom field for the JSON string (This Section Works)
//Custom Post Field Code from TeamTreeHouse: https://blog.teamtreehouse.com/create-your-first-wordpress-custom-post-type

function modular_product_design_custom_fields(){
    add_meta_box('modular_product_design_meta', 'Modular Product Design JSON', 'modular_product_designs_meta', 'mod-prod-design', 'normal', "low");
}
  
function modular_product_designs_meta() {
    global $post;
    $custom = get_post_custom($post->ID);
    $modProdDesignJSON = $custom['modular_product_design_JSON'][0];
    ?>
    <textarea cols='50' rows='1' name='modular_product_design_JSON'><?php echo $modProdDesignJSON; ?></textarea></p>
    <?php
  }
  
add_action('admin_init', 'modular_product_design_custom_fields');

function modular_product_design_save_details(){
    global $post;
    update_post_meta($post->ID, 'modular_product_design_JSON', $_POST['modular_product_design_JSON']);
}

add_action('save_post', 'modular_product_design_save_details');