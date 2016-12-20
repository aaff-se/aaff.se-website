<?php 

function aa_get_attached_media_html($id=false){
	if(!$id) return '';
	
	
	if( aa_is_attached_media_image($id) ) {
		
		$img = wp_get_attachment_image_src($id, 'medium');
		return '<img class="uploadedmedia" src="'.$img[0].'" width="'.$img[1].'" height="'.$img[2].'">';
		
	} else {
		
		$filename = basename( get_attached_file( $id ) );
		return '<p class="title">Current media: ' . $filename . '</p>';
		
	}

}

function aa_is_attached_media_image($id=false) {
	if(!$id) return false;
	
	$filename = basename( get_attached_file( $id ) );
	$filetype = wp_check_filetype($filename);

	if( strpos($filetype['type'],'image') !== false) return true;
	
	return false;
}

function aa_is_attached_media_video($id=false) {
	if(!$id) return false;
	
	$filename = basename( get_attached_file( $id ) );
	$filetype = wp_check_filetype($filename);

	if( strpos($filetype['type'],'video') !== false) return true;
	
	return false;
}


function aa_meta_textarea_function($post=false,$array) {
	
	if(!$post) { echo 'no $post included'; return false; }
	
	$name = $array['args'];

	wp_nonce_field( 'aa_meta_'.$name, 'aa_meta_'.$name.'_nonce' );
	
	$data = get_post_meta($post->ID, $name, true);
	
	$html = '<textarea rows="4" class="widefat"name="'.$name.'">'.esc_textarea( $data ).'</textarea>';
	
	echo $html;
}

function aa_meta_textinput_function($post=false,$array) {
	
	if(!$post) { echo 'no $post included'; return false; }

	$name = $array['args'];

	wp_nonce_field( 'aa_meta_'.$name, 'aa_meta_'.$name.'_nonce' );
	
	$data = get_post_meta($post->ID, $name, true);
	
	$html = '<input class="widefat" type="text" name="'.$name.'" value="'.esc_html($data).'">';

	echo $html;
}



function aa_meta_thumbnail_function($post=false,$array) {
	
	if(!$post) { echo 'no $post included'; return false; }

	$name = $array['args'];
	
	wp_nonce_field( 'aa_meta_'.$name, 'aa_meta_'.$name.'_nonce' );

	$data = get_post_meta($post->ID, $name, true);
	
	$html = '<div class="aaupload">';
	
		$html .= '<a class="button addmedia" href="#" >Add or change image</a>';
			
		$html .= '<a class="button removemedia" href="#" >Remove image</a>';

		$html .= aa_get_attached_media_html($data);
			
		$html .= '<input class="mediaid" type="hidden" name="'.$name.'"  value="'.esc_html($data).'">';
		
	$html .= '</div>';
		
	echo $html;
}