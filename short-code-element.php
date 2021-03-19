<?php

// Making the shortcode and putting out the added html
function mod_prod_designer_shortcode() {
    
    if (get_post_custom_values('modular_product_design_JSON')[0] != null) {
        
    $mod_prod_design_code = json_decode(stripslashes( get_post_custom_values('modular_product_design_JSON')[0]));

    ?> 
    
    <container class="mod-prod-designer-app">
        
        <!-- This needs to have a loop displaying how many options/elements there are. Example:
        
        <div class="mod-prod-display-area">
            <?php foreach ($variable as $key => $value) { ?>
                <div id="<?php echo $mod_prod_form ?>" class="mod-prod-svg-ele" plat_post = 'plat' position = '4' option ="<?php echo $mod_prod_design_code->{"plat3"}; ?>"><img src="" alt=""></div>    
            <?php } ?>
        </div>
        -->

        <div class="mod-prod-display-area">
            <div id="plat3" class="mod-prod-svg-ele" plat_post = 'plat' position = '4' option ="<?php echo $mod_prod_design_code->{"plat3"}; ?>"><img src="" alt=""></div>
            <div id="post2" class="mod-prod-svg-ele" plat_post = 'post' position = '3' option ="<?php echo $mod_prod_design_code->{"post2"}; ?>"><img src="" alt=""></div>
            <div id="plat2" class="mod-prod-svg-ele" plat_post = 'plat' position = '2' option ="<?php echo $mod_prod_design_code->{"plat2"}; ?>"><img src="" alt=""></div>
            <div id="post1" class="mod-prod-svg-ele" plat_post = 'post' position = '1' option ="<?php echo $mod_prod_design_code->{"post1"}; ?>"><img src="" alt=""></div>
            <div id="plat1" class="mod-prod-svg-ele" plat_post = 'plat' position = '0' option ="<?php echo $mod_prod_design_code->{"plat1"}; ?>"><img src="" alt=""></div>
        </div>

        <div class="mod-prod-arrow-selector-wrapper">
            <div class="horizontal-arrow-selectors">
                <div id="left-arrow-selector" class="mod-prod-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>    
                <div id="right-arrow-selector" class="mod-prod-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>
            </div>
            <div class="mod-prod-component-options"></div>
            <div class="vert-arrow-selectors">
                <div id="up-arrow-selector" class="mod-prod-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>    
                <div id="down-arrow-selector" class="mod-prod-svg-arrows"><img src="<?php echo plugin_dir_url( __FILE__ ) . "assets/arrows/arrow-right.svg"?>" alt=">"></div>
            </div>
        </div>
        
        <form id="ajax-input-form" method="post">
            <input type='button' id='submit-parent-config' name='submit' value='Save Product Build' post_id='<?php echo get_the_ID() ?>'/>
            <input type='button' id='buy-mod-prod' name='buy' value='Save & Buy Product Build' post_id='<?php echo get_the_ID() ?>'/>
        </form>
        
        

    </container>
    
    <p class="yeet">Page Load JSON: <?php echo stripslashes( get_post_custom_values('modular_product_design_JSON')[0] ) ?> </p>
    

    <?php

    }

}

function register_shortcodes(){
    add_shortcode('mod-prod-designer', 'mod_prod_designer_shortcode');
}

add_action( 'init', 'register_shortcodes');

// Loading the javascript file
function short_code_script_load(){
    if ( get_post_type( get_the_ID() ) == 'mod-prod-design' ) {
        wp_enqueue_script( 'short-code-elements', plugin_dir_url( __FILE__ ) . 'short-code-element.js', array( 'jquery' ) );
        wp_localize_script( 'short-code-elements', 'localized_variables', array( 'ajaxurl' => admin_url( 'admin-ajax.php'), 'pluginsUrl' => plugins_url(), 'siteurl' => get_option('siteurl')));
    }
}

add_action( 'wp_enqueue_scripts', 'short_code_script_load' );

// This is the submissions of the form to save the product build design without reloading the page
function ajax_form(){
    global $wpdb;
    $wpdb->update( 
        'wp_postmeta', 
        array('meta_value' => $_POST['mod_prod_json_input']),
        array('post_ID' => $_POST['post_id'], 'meta_key' => 'modular_product_design_JSON')
    );
    exit();
}

add_action('wp_ajax_ajax_form', 'ajax_form');
add_action('wp_ajax_nopriv_ajax_form', 'ajax_form');



// Adding the stylesheet
function add_cat_mod_prod_stylesheet() {
    wp_register_style('mod-prod-stylesheet', plugin_dir_url( __FILE__ ) . 'style-sheet.css');
    wp_enqueue_style('mod-prod-stylesheet');
}
add_action( 'wp_print_styles', 'add_cat_mod_prod_stylesheet' );