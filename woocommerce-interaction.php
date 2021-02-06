<?php

// This adds the 
function woo_mod_prod_custom_field(){
    add_meta_box('mod_prod_design_object', 'Tree Design Object', 'woo_mod_prod_designs_meta', 'product', 'normal', "low");
}
  
function woo_mod_prod_designs_meta() {
    global $post;
    $custom = get_post_custom($post->ID);
    $modProdDesignJSON = $custom['mod_prod_design_object_ID'][0];
    ?>
    <textarea cols='50' rows='1' name='mod_prod_design_object_ID'><?php echo $modProdDesignJSON; ?></textarea></p>
    <?php
  }
  
add_action('admin_init', 'woo_mod_prod_custom_field');

function woo_cat_mod_prod_save_details(){
    global $post;
    update_post_meta($post->ID, 'mod_prod_design_object_ID', $_POST['mod_prod_design_object_ID']);
}

add_action('save_post', 'woo_cat_mod_prod_save_details');

// Adding the custom field for option name to the Rest API
function add_mod_prod_element_to_json() {
 
    register_rest_field(
        'product', //the post type of your choice
        'mod_prod_design_object_ID', //the name for your json element
        array(
            'get_callback'    => 'cat_mod_prod_return_type', //the function that creates the content 
        )
    );
}

add_action( 'rest_api_init', 'add_mod_prod_element_to_json' );
 
function cat_mod_prod_return_type( $object, $field_name, $request ) {
    global $post;
    $mod_prod_design_object_ID = get_post_meta($post->ID, 'mod_prod_design_object_ID', true); 
    return $mod_prod_design_object_ID; //multiple selections are possible here but in this use case I only want the first one
}

// This function allow multiple products to be added to the cart. Maybe make this into its own plugin
function woocommerce_maybe_add_multiple_products_to_cart() {
    // Make sure WC is installed, and add-to-cart qauery arg exists, and contains at least one comma.
    if ( ! class_exists( 'WC_Form_Handler' ) || empty( $_REQUEST['add-to-cart'] ) || false === strpos( $_REQUEST['add-to-cart'], ',' ) ) {
        return;
    }
    
    // Remove WooCommerce's hook, as it's useless (doesn't handle multiple products).
    remove_action( 'wp_loaded', array( 'WC_Form_Handler', 'add_to_cart_action' ), 20 );
    
    $product_ids = explode( ',', $_REQUEST['add-to-cart'] );
    $quantities = explode( ',', $_REQUEST['quantities'] );
    
    $count       = count( $product_ids );
    $number      = 0;
    
    foreach ( $product_ids as $product_id ) {
        if ( ++$number === $count ) {
            // Ok, final item, let's send it back to woocommerce's add_to_cart_action method for handling.
            $_REQUEST['add-to-cart'] = $product_id;
    
            return WC_Form_Handler::add_to_cart_action();
        }
    
        $product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $product_id ) );
        $was_added_to_cart = false;
        $adding_to_cart    = wc_get_product( $product_id );
    
        if ( ! $adding_to_cart ) {
            continue;
        }
    
        $add_to_cart_handler = apply_filters( 'woocommerce_add_to_cart_handler', $adding_to_cart->product_type, $adding_to_cart );
    
        /*
         * Sorry.. if you want non-simple products, you're on your own.
         *
         * Related: WooCommerce has set the following methods as private:
         * WC_Form_Handler::add_to_cart_handler_variable(),
         * WC_Form_Handler::add_to_cart_handler_grouped(),
         * WC_Form_Handler::add_to_cart_handler_simple()
         *
         * Why you gotta be like that WooCommerce?
         */
        if ( 'simple' !== $add_to_cart_handler ) {
            continue;
        }
    //         $_REQUEST['quantity'] = ! empty( $id_and_quantity[1] ) ? absint( $id_and_quantity[1] ) : 1;
    $_REQUEST['quantity'] = ! empty( $quantities[$number] ) ? absint( $quantities[$number] ) : 1;
        $quantity          = empty( $quantities[$number - 1] ) ? 1 : wc_stock_amount(  $quantities[$number - 1] );
    //     $quantity          = empty( $_REQUEST['quantity'] ) ? 1 : wc_stock_amount( $_REQUEST['quantity'] );
        $passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
    
        if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity ) ) {
            wc_add_to_cart_message( array( $product_id => $quantity ), true );
        }
    }
}
    
// Fire before the WC_Form_Handler::add_to_cart_action callback.
add_action( 'wp_loaded',        'woocommerce_maybe_add_multiple_products_to_cart', 15 );
// remove "added to cart" notice
add_filter( 'wc_add_to_cart_message_html', '__return_false' );