<?php

/**
 *
 * @link              https://marshalledmakers.com/
 * @since             1.0.0
 * @package           What Do I Get App
 *
 * @wordpress-plugin
 * Plugin Name:       What Do I Get
 * Plugin URI:        https://marshalledmakers.com/
 * Description:       What Do I Get functioniality for the What Do I Get App.
 * Version:           1.0
 * Author:            Cutler McMartin
 * Author URI:        https://marshalledmakers.com/
 * License:           
 * License URI:       
 * Text Domain:       what-do-i-get-app
 * Domain Path:       /legal
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// Staring Session
session_start();

//Requiring all the files that make up the behavior of the plugin

require_once plugin_dir_path( __FILE__ ) . 'login-functionality.php';
require_once plugin_dir_path( __FILE__ ) . 'save-product-shortcode/save-product-button-shortcode.php';
require_once plugin_dir_path( __FILE__ ) . 'custom-post-functionality.php';

// Loading the jquery ui file and all the other scripts
function what_do_i_get_script_enqueue() {
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script( 'jquery-ui-slider' );
    wp_register_script('wdig_script', plugin_dir_url( __FILE__ ) . 'what-do-i-get-script.js', array( 'jquery' ) );
    wp_enqueue_script('wdig_script');
    wp_localize_script( 'wdig_script', 'localized_variables', array( 'pluginsUrl' => plugins_url(), 'siteurl' => get_option('siteurl'), 'userID' => $_SESSION["UserID"], 'sessionID' => $_SESSION["SessionID"] ) );
    wp_register_script('save_product_shortcode_script', plugin_dir_url( __FILE__ ) . 'save-product-shortcode/save-product-button-shortcode.js', array( 'jquery' ) );
    wp_enqueue_script('save_product_shortcode_script');
    wp_localize_script( 'save_product_shortcode_script', 'localized_variables', array( 'pluginsUrl' => plugins_url(), 'siteurl' => get_option('siteurl'), 'userID' => $_SESSION["UserID"], 'sessionID' => $_SESSION["SessionID"] ) );
}

add_action( 'wp_enqueue_scripts', 'what_do_i_get_script_enqueue' );