<?php

function filter_the_content_in_the_main_loop( $content ) {

    /* Get html from file */
    $login_element = file_get_contents( plugin_dir_path( __FILE__ ) . 'login-element.php' );
 
    // Check if we're inside the main loop in a single Post.
    if ( is_singular() && in_the_loop() && is_main_query() ) {
        return $content . $login_element;
    }
 
    return $content;
}

add_filter( 'the_content', 'filter_the_content_in_the_main_loop', 1 );


 
function troublshootingg_output( $content ) {

    return $content .get_post_type( get_the_ID());
}

add_filter( 'the_content', 'troublshootingg_output', 50 );


?>