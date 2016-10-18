<?php 

function aa_jpeg_quality_function( $quality, $context ) {
	return 100;
}
add_filter( 'jpeg_quality', 'aa_jpeg_quality_function', 10, 2 );

//add_theme_support( 'post-thumbnails' );

add_image_size( 'xxs', 612, 9999, false ); // auto resized for mobile
add_image_size( 'xs', 1224, 9999, false ); // auto resized for mobile
add_image_size( 's', 1836, 9999, false );
add_image_size( 'm', 2448, 9999, false ); 
add_image_size( 'l', 3060, 9999, false ); //maximum size w/o retina
add_image_size( 'xl', 3672, 9999, false ); 
add_image_size( 'xxl', 4896, 9999, false ); // retina full width - maybe just get the full image?



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
add_filter("attachment_fields_to_edit", "aa_add_image_attachment_fields_to_edit", null, 2);

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
add_filter("attachment_fields_to_save", "aa_add_image_attachment_fields_to_save", null , 2);