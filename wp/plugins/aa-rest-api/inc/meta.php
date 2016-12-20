<?php 

function aa_rest_meta($data){
	
	$meta_options = get_option('aa_sc_meta');
	$meta_image = wp_get_attachment_image_src($meta_options['img'], 'full');
	if($meta_image) $meta_image = $meta_image[0];
	
	$meta_data = array('content' => array(
		'title' => html_entity_decode(get_bloginfo('name')),
		'desc' => html_entity_decode(get_bloginfo('description')),
		'image' => ($meta_image ? $meta_image : ''),
		'twittercard' => 'summary'

	) ); 
	
	return (object) $meta_data;

}