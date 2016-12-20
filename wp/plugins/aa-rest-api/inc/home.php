<?php

//content is an array with title, image, link to each project

function aa_rest_home($data){
	
	$work_posts = aa_get_work_posts();
	$pruned_work_posts = array();
	if($work_posts)
		foreach ($work_posts as $work_post) {
			$pruned_work_posts[] = aa_get_work_post_link_item($work_post);
		}
		
	unset($work_post);
	unset($work_posts);
	
	
	$array = array(
		'content' => array(
			'slug' => 'home',
			'content' => $pruned_work_posts,
/*
			'seo' => array(
				'title' => html_entity_decode(get_bloginfo('name')),
				'desc' => html_entity_decode(get_bloginfo('description'))
			),
*/
/*
			'meta' => array(
				'title' => html_entity_decode(get_bloginfo('name')),
				'desc' => html_entity_decode(get_bloginfo('description'))
			)
*/

		)
	);
	
	unset($pruned_work_posts);
	
	return (object) $array;
}