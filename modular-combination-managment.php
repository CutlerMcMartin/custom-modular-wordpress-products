<?php

function my_admin_menu() {
    add_menu_page(
        __( 'Modular Configurations', 'my-textdomain' ),
        __( 'Modular Configurations', 'my-textdomain' ),
        'manage_options',
        'modular-configurations',
        'my_admin_page_contents',
        'dashicons-schedule',
        55
    );
}

add_action( 'admin_menu', 'my_admin_menu' );


function my_admin_page_contents() {
    ?>
        <h1>
            <?php esc_html_e( 'Welcome to my custom admin page.', 'my-plugin-textdomain' ); ?>
        </h1>
    <?php
}