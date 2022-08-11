<?php

function wdig_save_product_shortcode( $atts = array() ) {

    // set up default attributes
    $atts = shortcode_atts( array(
        'product_id' => 0
    ), $atts );
    return "<button id='save-product-button' class='shortcode-save-product-button' value='" . $atts["product_id"] . "' >Save Product</button>";
}

function register_shortcodes(){
    add_shortcode('wdig-save-product', 'wdig_save_product_shortcode');
}

add_action( 'init', 'register_shortcodes');

?>