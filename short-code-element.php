<?php

// Making the shortcode and putting out the added html
function cat_tree_designer_shortcode() {
    
    if (get_post_custom_values('tree_design_JSON')[0] != null) {
        
    $tree_design_code = json_decode(stripslashes( get_post_custom_values('tree_design_JSON')[0]));

    ?> 
    
    <container class="cat-tree-designer-app">
        
        <div class="cat-tree-display-area">
            <div id="plat3" class="cat-tree-svg-ele" plat_post = 'plat' position = '4' option ="<?php echo $tree_design_code->{"plat3"}; ?>"><img src="" alt=""></div>
            <div id="post2" class="cat-tree-svg-ele" plat_post = 'post' position = '3' option ="<?php echo $tree_design_code->{"post2"}; ?>"><img src="" alt=""></div>
            <div id="plat2" class="cat-tree-svg-ele" plat_post = 'plat' position = '2' option ="<?php echo $tree_design_code->{"plat2"}; ?>"><img src="" alt=""></div>
            <div id="post1" class="cat-tree-svg-ele" plat_post = 'post' position = '1' option ="<?php echo $tree_design_code->{"post1"}; ?>"><img src="" alt=""></div>
            <div id="plat1" class="cat-tree-svg-ele" plat_post = 'plat' position = '0' option ="<?php echo $tree_design_code->{"plat1"}; ?>"><img src="" alt=""></div>
        </div>

        <div class="cat-tree-arrow-selector-wrapper">
            <div class="horizontal-arrow-selectors">
                <div id="left-arrow-selector" class="cat-tree-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>    
                <div id="right-arrow-selector" class="cat-tree-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>
            </div>
            <div class="tree-component-options"></div>
            <div class="vert-arrow-selectors">
                <div id="up-arrow-selector" class="cat-tree-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>    
                <div id="down-arrow-selector" class="cat-tree-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>
            </div>
        </div>
        
        <form id="ajax-input-form" method="post">
            <input type='button' id='submit-tree' name='submit' value='Save Tree' post_id='<?php echo get_the_ID() ?>'/>
            <input type='button' id='buy-tree' name='buy' value='Save & Buy Tree' post_id='<?php echo get_the_ID() ?>'/>
        </form>
        
        

    </container>
    
    <p class="yeet">Page Load JSON: <?php echo stripslashes( get_post_custom_values('tree_design_JSON')[0] ) ?> </p>
    

    <?php

    }

}

function register_shortcodes(){
    add_shortcode('cat-tree-designer', 'cat_tree_designer_shortcode');
}

add_action( 'init', 'register_shortcodes');

// Loading the javascript file
function short_code_script_load(){
    if ( get_post_type( get_the_ID() ) == 'tree-design' ) {
        wp_enqueue_script( 'short-code-elements', plugin_dir_url( __FILE__ ) . 'short-code-element.js', array( 'jquery' ) );
        wp_localize_script( 'short-code-elements', 'localized_variables', array( 'ajaxurl' => admin_url( 'admin-ajax.php'), 'pluginsUrl' => plugins_url(), 'siteurl' => get_option('siteurl')));
    }
}

add_action( 'wp_enqueue_scripts', 'short_code_script_load' );

// This is the submissions of the form to save the tree design without reloading the page
function ajax_form(){
    global $wpdb;
    $wpdb->update( 
        'wp_postmeta', 
        array('meta_value' => $_POST['tree_json_input']),
        array('post_ID' => $_POST['post_id'], 'meta_key' => 'tree_design_JSON')
    );
    exit();
}

add_action('wp_ajax_ajax_form', 'ajax_form');
add_action('wp_ajax_nopriv_ajax_form', 'ajax_form');



// Adding the stylesheet
function add_cat_tree_stylesheet() {
    wp_register_style('cat-tree-stylesheet', plugin_dir_url( __FILE__ ) . 'style-sheet.css');
    wp_enqueue_style('cat-tree-stylesheet');
}
add_action( 'wp_print_styles', 'add_cat_tree_stylesheet' );