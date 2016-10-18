<?php 
	
add_action('init', 'aa_archive_register');
function aa_archive_register() {
	
	$name = 'Archive project';
	$name_plural = 'Archive projects';
	$slug = 'archive';
	$labels = array(
		'name' => $name,
		'singular_name' => $name,
		'add_new' => 'New ' . $name, $slug,
		'add_new_item' => 'New ' . $name . ' item',
		'edit_item' => 'Edit ' . $name,
		'new_item' => 'New ' . $name,
		'all_items' => 'All ' . $name_plural,
		'view_item' => 'Show ' . $name,
		'search_items' => 'Search ' . $name_plural,
		'not_found' =>  'No '. $name_plural . ' found',
		'not_found_in_trash' => 'No ' . $name_plural. ' found in thrash', 
		'parent_item_colon' => ':',
		'menu_name' => $name_plural
	);
	$args = array(
		'labels' => $labels,
		'public' => true,
		'publicly_queryable' => true,
		'show_ui' => true, 
		'show_in_menu' => true, 
		'query_var' => true,
		'menu_icon' => 'dashicons-portfolio',
		'rewrite' => array( 'slug' => $slug ),
		'capability_type' => 'post',
		'has_archive' => true, 
		'hierarchical' => false,
		'menu_position' => null,
		'supports' => array('title')
	); 
	
	register_post_type('aa_archive',$args);
	
	flush_rewrite_rules();
}

add_action( 'admin_enqueue_scripts', 'aa_archive_admin_scripts' );
function aa_archive_admin_scripts() {

	global $current_screen;
	if($current_screen->post_type != 'aa_archive')
		return;

	wp_enqueue_script('jquery');
	wp_enqueue_media();
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-ui-sortable');

	wp_register_script( 'meta_rows_js', _PLUGIN_DIR_URL . 'inc/aa_common_functions/js/meta_rows.js');
	wp_enqueue_script( 'meta_rows_js');
	
	wp_register_style( 'meta_rows_css', _PLUGIN_DIR_URL . 'inc/aa_common_functions/css/meta_rows.css' );
	wp_enqueue_style( 'meta_rows_css' );

}

add_action("admin_init", "aa_archive_admin_init");
function aa_archive_admin_init(){
	
	add_meta_box("agency", "Agency", "aa_archive_agency_function", "aa_archive", "normal", "low");
	add_meta_box("info", "Info", "aa_archive_info_function", "aa_archive", "normal", "low");
	add_meta_box("year", "Year", "aa_archive_year_function", "aa_archive", "normal", "low");
	add_meta_box("link", "Link", "aa_archive_link_function", "aa_archive", "normal", "low");
	
}

// Make sure everything is saved to the database
add_action('save_post', 'aa_archive_save_details');

function aa_archive_save_details($post_id ){

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
		return;
	
	if ( !current_user_can( 'edit_post', $post_id ) )
		return;

	if ( wp_verify_nonce( $_POST['aa_archive_agency_nonce'], 'aa_archive_agency' ) )
		update_post_meta($post_id, "agency", $_POST["agency"]);
		
	if ( wp_verify_nonce( $_POST['aa_archive_info_nonce'], 'aa_archive_info' ) )
		update_post_meta($post_id, "info", $_POST["info"]);

	if ( wp_verify_nonce( $_POST['aa_archive_year_nonce'], 'aa_archive_year' ) )
		update_post_meta($post_id, "year", $_POST["year"]);

	if ( wp_verify_nonce( $_POST['aa_archive_link_nonce'], 'aa_archive_link' ) )
		update_post_meta($post_id, "link", $_POST["link"]);
		
	if ( wp_verify_nonce( $_POST['aa_archive_link_nonce'], 'aa_archive_link' ) )
		update_post_meta($post_id, "link_dead", $_POST["link_dead"]);

}

//wp admin listings
add_filter( 'manage_edit-aa_archive_sortable_columns', 'aa_archive_sortable_columns' );
function aa_archive_sortable_columns( $columns ) {
	
	$columns['agency'] = 'agency';
	$columns['year'] = 'year';
//	$columns['order'] = 'order';
	
	return $columns;
}

add_filter("manage_aa_archive_posts_columns", "aa_archive_edit_columns");
function aa_archive_edit_columns($columns){
	$columns = array(
		"cb" => "<input type=\"checkbox\" />",
		"title" => "Title",
		"agency" => "Agency",
		"year" => "Year",
		"type" => "Type",
		"date" => "Date"
	);
	
	return $columns;
}

add_action( 'pre_get_posts', 'aa_archive_orderby' );
function aa_archive_orderby( $query ) {
    if( ! is_admin() )
        return;
	
    $orderby = $query->get( 'orderby');
 
    if( 'agency' == $orderby ) {
        $query->set('meta_key','agency');
        $query->set('orderby','meta_value');
    }
    if( 'year' == $orderby ) {
        $query->set('meta_key','year');
        $query->set('orderby','meta_value_num');
    }
}


add_action("manage_aa_archive_posts_custom_column", "aa_archive_custom_columns");
function aa_archive_custom_columns($column){
	global $post;
	
	switch ($column) {
		case "title":
			echo $post->post_title;
			break;
	
		case "agency":
			$agency = get_post_meta( $post->ID, 'agency', true );
			
			echo ($agency ? $agency : '–');
			break;

		case "year":
			$year = get_post_meta( $post->ID, 'year', true );
			
			echo ($year ? $year : '–');
			break;

		case "type":
			$design = get_post_meta( $post->ID, 'type_design', true );
			$dev = get_post_meta( $post->ID, 'type_develop', true );
			
			if($design && $dev) echo 'Design / Development';
			if($design && !$dev) echo 'Design';
			if(!$design && $dev) echo 'Development';
			if(!$design && !$dev) echo '–';
			break;


//		case "order":
//			$menu_order = $post->menu_order;
//			
//			echo ($menu_order ? $menu_order : '0');
//			break;

		case "date":
			break;
	}
}