<?php
	
function aa_rest_about_contact($data){
	$post = get_page_by_path('about-contact');
	$options = get_option('aa_sc_about');
	$args = array(
		'post_type' => 'aa_archive',
		'posts_per_page' => -1
		
	);
	$project_archive_posts = get_posts($args);
	$pruned_project_archive_posts = array();
	if($project_archive_posts)
		foreach ($project_archive_posts as $project_archive_post) {
			$this_post = array();
			
			$this_post['id'] = $project_archive_post->ID;
			$this_post['title'] = $project_archive_post->post_title;
			$this_post['year'] = get_post_meta($project_archive_post->ID, 'year', true);
			$this_post['agency'] = get_post_meta($project_archive_post->ID, 'agency', true);
			$this_post['info'] = get_post_meta($project_archive_post->ID, 'info', true);
			$this_post['link'] = get_post_meta($project_archive_post->ID, 'link', true);
			$this_post['link_dead'] = get_post_meta($project_archive_post->ID, 'link_dead', true);
			
			$pruned_project_archive_posts[] = $this_post;
		}
		
	unset($project_archive_post);
	unset($this_post);
	unset($project_archive_posts);
	
	$array = array(
		'content' => array(
			'slug' => 'about-contact',
			'content' => $options['text'],
			'seo' => array(
				'title' => 'About / Contact - AAFF',
				'desc' => $options['seo']
			),
			'archive' => $pruned_project_archive_posts
		)
	);
	
	unset($pruned_project_archive_posts);
	unset($options);

	return (object) $array;
}