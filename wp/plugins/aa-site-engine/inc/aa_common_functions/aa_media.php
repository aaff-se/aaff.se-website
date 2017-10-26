<?php 

function aa_jpeg_quality_function( $quality, $context ) {
	return 98;
}
add_filter( 'jpeg_quality', 'aa_jpeg_quality_function', 10, 2 );

//add_theme_support( 'post-thumbnails' );

add_image_size( 'micro', 33, 9999, false );
add_image_size( 's612', 612, 9999, false ); // auto resized for mobile
add_image_size( 's918', 918, 9999, false ); // auto resized for mobile
add_image_size( 's1224', 1224, 9999, false ); // auto resized for mobile
add_image_size( 's1836', 1836, 9999, false );
add_image_size( 's2448', 2448, 9999, false ); 
add_image_size( 's3060', 3060, 9999, false ); //maximum size w/o retina
add_image_size( 's3672', 3672, 9999, false ); 
add_image_size( 's4896', 4896, 9999, false ); // retina full width - maybe just get the full image?



//add background-color-metadata to media files:

/* For adding custom field to gallery popup */
function aa_add_image_attachment_fields_to_edit($form_fields, $post) {
  // $form_fields is a an array of fields to include in the attachment form
  // $post is nothing but attachment record in the database
  //     $post->post_type == 'attachment'
  // attachments are considered as posts in WordPress. So value of post_type in wp_posts table will be attachment
  // now add our custom field to the $form_fields array
  // input type="text" name/id="attachments[$attachment->ID][custom1]"
  $form_fields["color"] = array(
    "label" => __("Color"),
    "input" => "html",
    'html' => '<input type="text" name="attachments['.$post->ID.'][color]" id="attachments-'.$post->ID.'-color" value="'.get_post_meta($post->ID, "color", true).'"><br><div style="background: '.get_post_meta($post->ID, "color", true).'; height: 2em; width: 2em; float:left;">'
  );
   return $form_fields;
}
// now attach our function to the hook
//add_filter("attachment_fields_to_edit", "aa_add_image_attachment_fields_to_edit", null, 2);

function aa_add_image_attachment_fields_to_save($post, $attachment) {
  // $attachment part of the form $_POST ($_POST[attachments][postID])
        // $post['post_type'] == 'attachment'
  if( isset($attachment['color']) ){
    // update_post_meta(postID, meta_key, meta_value);
    update_post_meta($post['ID'], 'color', $attachment['color']);
  }
  return $post;
}
// now attach our function to the hook.
//add_filter("attachment_fields_to_save", "aa_add_image_attachment_fields_to_save", null , 2);



// define the wp_generate_attachment_metadata callback 
function aa_add_micro_inlined_metadata($meta) {
	

	$file = wp_upload_dir();
	$file = trailingslashit($file['url']).$meta['sizes']['micro']['file'];
	
	$type = pathinfo($file, PATHINFO_EXTENSION);
	$data = file_get_contents($file);
	
	$meta['micro_inlined'] = 'data:image/' . $type . ';base64,' . base64_encode($data);
	unset($file);

	return $meta;

}

// add the filter 
add_filter( 'wp_generate_attachment_metadata', 'aa_add_micro_inlined_metadata', 20, 1 );