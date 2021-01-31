<?php

/**
 *
 * @link              https://marshalledmakers.com/
 * @since             1.0.0
 * @package           Cat Tree Design App
 *
 * @wordpress-plugin
 * Plugin Name:       Cat Tree Design
 * Plugin URI:        https://marshalledmakers.com/
 * Description:       Making it happen boiz
 * Version:           1.0
 * Author:            Cutler McMartin
 * Author URI:        https://marshalledmakers.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       cat-tree-design
 * Domain Path:       /legal
 */


//Requiring all the files that make up the behavior of the plugin

require_once plugin_dir_path( __FILE__ ) . 'tree-post-type.php';
require_once plugin_dir_path( __FILE__ ) . 'short-code-element.php';
require_once plugin_dir_path( __FILE__ ) . 'woocommerce-interaction.php';