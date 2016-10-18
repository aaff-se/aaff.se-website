<?php 
	
function aa_archive_agency_function($post=false){
	
	if(!$post) { echo 'no $post included'; return false; }
	
	wp_nonce_field( 'aa_archive_agency', 'aa_archive_agency_nonce' );
	
	$data = get_post_meta($post->ID, 'agency', true);
	
	echo '<p><input class="widefat" type="text" name="agency" value="'.$data.'" placeholder="agency"></p>';

}

function aa_archive_year_function($post=false){
	
	if(!$post) { echo 'no $post included'; return false; }
	
	wp_nonce_field( 'aa_archive_year', 'aa_archive_year_nonce' );
	
	$data = get_post_meta($post->ID, 'year', true);
	
	echo '<p><input class="widefat" type="text" name="year" value="'.$data.'" placeholder="Year"></p>';
}

function aa_archive_info_function($post=false){
	
	if(!$post) { echo 'no $post included'; return false; }
	
	wp_nonce_field( 'aa_archive_info', 'aa_archive_info_nonce' );
	
	$data = get_post_meta($post->ID, 'info', true);
	
	echo '<p><textarea class="widefat" rows="5" name="info" placeholder="Info">'.esc_textarea($data).'</textarea></p>';

}


function aa_archive_link_function($post=false){
	
	if(!$post) { echo 'no $post included'; return false; }
	
	wp_nonce_field( 'aa_archive_link', 'aa_archive_link_nonce' );
	
	$link = get_post_meta($post->ID, 'link', true);
	$link_dead = get_post_meta($post->ID, 'link_dead', true);
	
	echo '<p><input class="widefat" type="text" name="link" value="'.$link.'" placeholder="http://..."></p>';
	echo '<p><input type="checkbox" name="link_dead" value="1"'.($link_dead ? 'checked="checked"':'').'> Link dead</p>';

}