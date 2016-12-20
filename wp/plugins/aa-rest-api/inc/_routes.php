<?php 

// Initialise our routes
add_action('rest_api_init', function() {
	
/*
	register_rest_route('aa/v1', 'global/footer', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_footer',
	));
*/

	register_rest_route('aa/v1', 'global/contact', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_contact',
	));

	register_rest_route('aa/v1', 'global/nav', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_nav',
	));

	register_rest_route('aa/v1', 'global/meta', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_meta',
	));
	
	register_rest_route('aa/v1', 'home', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_home',
	));

	register_rest_route('aa/v1', 'about-contact', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_about_contact',
	));

	register_rest_route('aa/v1', 'work/(?P<slug>[a-z0-9\-]+)', array(
		'methods' => 'GET',
		'callback' => 'aa_rest_work',
	));
	
});