<?php
	
function aa_rest_work($data) {
	$post = get_page_by_path($data['slug'], OBJECT, 'aa_work');
	
	//dont send draft or pending posts to the public site
	//both drafts and pending can be viewed on the stg site, but only pending shows up on the front page
	if($post->post_status != 'publish' && !isset($_GET['dev']) )
		$post = null;
	
	if(!$post) 
		return (object) array(
			'statusCode' => 404,
			'content' => array(
				'slug' => $data['slug'],
				'content' => array()
			)
		);
	
	$all_work_posts = aa_get_work_posts();
	
	$next_post = false;
	$get_next_post = false;
	$prev_post = false;
	foreach ($all_work_posts as $all_work_post) {
		if($get_next_post) {
			$next_post = array(
				'title' => get_post_meta($all_work_post->ID, 'client', true) . ' - ' . get_post_meta($all_work_post->ID, 'type', true),
				'link' => '/' . $all_work_post->post_name . '/',
				'text' => 'Next Project'
			);
			break;
		}
		if($all_work_post->ID === $post->ID) {
			$get_next_post = true;
			continue;
		}
		
		$prev_post = array(
				'title' => get_post_meta($all_work_post->ID, 'client', true) . ' - ' . get_post_meta($all_work_post->ID, 'type', true),
				'link' => '/' . $all_work_post->post_name . '/',
				'text' => 'Previous Project'
		);
	}

	$client = get_post_meta($post->ID, 'client', true);
	$type = get_post_meta($post->ID, 'type', true);
	$seodesc = get_post_meta($post->ID, 'seodesc', true);
	$meta_image_id = get_post_meta($post->ID, 'thumb-main', true);
	$meta_image = wp_get_attachment_image_src($meta_image_id, 'm');
	$raw_content = get_post_meta($post->ID, 'rows', true);
	$content = aa_prepare_work_rows($raw_content);
	unset($raw_content);
	
	$seo = array();
	$seo['title'] = $post->post_title . ' - AAFF';
	if($seodesc) $seo['desc'] = $seodesc;
	if($meta_image) $seo['image'] = $meta_image[0];
	$seo['twittercard'] = 'summary_large_image';
	
	$array = array(
		'content' => array(
			'slug' => $data['slug'],
			'content' => $content,
			'client' => $client,
			'type' => $type,
			'seo' => $seo,
			'maintitle' => $client,
			'subtitle' => $type
		)
	);
	
	if($prev_post) $array['content']['prevpost'] = $prev_post;
	if($next_post) $array['content']['nextpost'] = $next_post;

	return (object) $array;
}