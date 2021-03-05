<?php

/**
 *
 * @link              https://marshalledmakers.com/
 * @since             1.0.0
 * @package           Build Modular Products App
 *
 * @wordpress-plugin
 * Plugin Name:       Build Modular Products
 * Plugin URI:        https://marshalledmakers.com/
 * Description:       Integrates with WooCommerce to allow customers to make a complex product from simple parts. Includes a visual builder for the products on the front end.
 * Version:           1.0
 * Author:            Cutler McMartin
 * Author URI:        https://marshalledmakers.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       build-modular-products
 * Domain Path:       /legal
 */


//Requiring all the files that make up the behavior of the plugin

require_once plugin_dir_path( __FILE__ ) . 'modular-product-post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'short-code-element.php';
require_once plugin_dir_path( __FILE__ ) . 'woocommerce-interaction.php';
require_once plugin_dir_path( __FILE__ ) . 'modular-combination-managment.php';