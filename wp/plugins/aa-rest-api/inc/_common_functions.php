<?php
	
function get_post_by_slug($post_name) {
	global $wpdb;
	$post = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_name = %s", $post_name));

	return $post ? get_post($post) : false;
}



function aa_get_work_post_link_item($post=false){
	if(!$post) return 'aa_get_work_post_link_item error: no $post supplied';
	
	$images = array();
	
	$main_image_id = get_post_meta($post->ID, 'thumb-main', true);
	$alternative_image_id = get_post_meta($post->ID, 'thumb-alternative', true);
	
	if($main_image_id)
		$images['main'] = aa_get_image_data($main_image_id);
	if($alternative_image_id)
		$images['alternative'] = aa_get_image_data($alternative_image_id);
	
	$return = array();
	
	$return['id'] = $post->ID;
	$return['link'] = '/' . $post->post_name . '/';
	$return['client'] = get_post_meta($post->ID, 'client', true);
	$return['type'] = get_post_meta($post->ID, 'type', true);
	$return['image'] = $images;
	
	return $return;
}

function aa_get_image_data($id){
	if(!$id) return false;
	
	$image_post = get_post($id);
	
	$color = get_post_meta($id, 'color', true);
	if(!$color) $color = '#ffffff';
	
	$all_images = array();
	
	$image_sizes = array('s612','s918','s1224','s1836','s2448','s3060','s3672','s4896');
	foreach ($image_sizes as $image_size) {
		
		$temp_image = wp_get_attachment_image_src($id, $image_size);
		//check if resized - or if it is the last one - if so we want the full image if needed
		if($temp_image)
			if($temp_image[3])
				$all_images[] = array(
					'src' => $temp_image[0],
					'width' => $temp_image[1]
				);
	}
	
	if($temp_image[3]) {
		$full_image = wp_get_attachment_image_src($id, 'full');
	} else {
		$full_image = $temp_image;
	}
	
	unset($temp_image);

	
	$meta = wp_get_attachment_metadata($id);
	$base64 = $meta['micro_inlined'];
	
	//if thumbnail rebuild have screwed up our metadata...
	if($base64 === 'data:image/jpg;base64,' || !trim($base64)) {
		$temp_image = wp_get_attachment_image_src($id, 'micro');
		if($temp_image) {

			$file = wp_upload_dir();
			$file = trailingslashit($file['url']).$meta['sizes']['micro']['file'];
			
			$type = pathinfo($file, PATHINFO_EXTENSION);

			$imagedata = file_get_contents($temp_image[0]);
			$imagedataencoded = base64_encode($imagedata);
			$base64 = 'data:image/' . $type . ';base64,'.$imagedataencoded;
			$meta['micro_inlined'] = $base64;
			wp_update_attachment_metadata($id,$meta);
		}
	}
	
	$return = array();
	
	$return['alt'] = $image_post->post_title;
	$return['color'] = $color;
	$return['inlined'] = $base64;
	$return['data'] = $all_images;
	$return['width'] = $full_image[1];
	$return['height'] = $full_image[2];
	unset($color);
	unset($image_post);
	unset($all_images);
	unset($full_image);
	
	return $return;
}

// Good to have a function if we change the fetch order somehow
// Now we fetch pending projects to the development server, good for previewing!
function aa_get_work_posts(){
	
	$post_status = array('publish');
	if( isset($_GET['dev']) )
		$post_status = array('publish', 'pending');

	$args = array(
		'post_type' => 'aa_work',
		'posts_per_page' => -1,
		'post_status' => $post_status
		
	);
	$work_posts = get_posts($args);
	
	return $work_posts;
}

function aa_prepare_work_rows($content){
	if(!$content) return array();
		
	$return = array();
	
	foreach ($content as $row) {
		
		if(is_array($row['content']))
		$row = $row['content'];
		
		$this_row = array();
		
		if($row['type'] == 'text') {
			
			$this_row['type'] = 'text';

			if(trim($row['text']))
				$this_row['text'] = trim($row['text']);
				
		} else if($row['type'] == 'media') {
			
			$this_row['type'] = 'image';
			
			$this_row['image'] = array();

			if($row['media_id_1'])
				$this_row['image']['main'] = aa_get_image_data($row['media_id_1']);

			if($row['media_id_2'])
				$this_row['image']['alternative'] = aa_get_image_data($row['media_id_2']);
			
		}
		
		$return[] = $this_row;
		
	}
	unset($row);
	unset($content);
	unset($this_row);
	
	return $return;
}
