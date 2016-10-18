<?php 
	
add_action('init', 'aa_work_register');
function aa_work_register() {
	
	$name = 'Work';
	$name_plural = 'Work';
	$slug = 'work';
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
	
	register_post_type('aa_work',$args);
	
	flush_rewrite_rules();
}

add_action( 'admin_enqueue_scripts', 'aa_work_admin_scripts' );
function aa_work_admin_scripts() {

	global $current_screen;
	if($current_screen->post_type != 'aa_work')
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

add_action("admin_init", "aa_work_admin_init");
function aa_work_admin_init(){
	
	add_meta_box("rows", "Main Content", "aa_work_rows_function", "aa_work", "normal", "low");
	add_meta_box("client", "Client", "aa_meta_textinput_function", "aa_work", "side", "low", 'client');
	add_meta_box("type", "Type", "aa_meta_textinput_function", "aa_work", "side", "low", 'type');
	add_meta_box("seodesc", "SEO page Description", "aa_meta_textarea_function", "aa_work", "side", "low", 'seodesc');
//	add_meta_box("seodesc", "SEO page Description", "aa_meta_seo_description_function", "aa_work", "side", "low");
	add_meta_box("thumb-main", "Main Thumbnail", "aa_meta_thumbnail_function", "aa_work", "side", "low", 'thumb-main');
	add_meta_box("thumb-alternative", "Alternative Thumbnail (optional - used for mobile if present)", "aa_meta_thumbnail_function", "aa_work", "side", "low", 'thumb-alternative');
	
}

// Make sure everything is saved to the database
add_action('save_post', 'aa_work_save_details');

function aa_work_save_details($post_id ){

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
		return;
	
	if ( !current_user_can( 'edit_post', $post_id ) )
		return;


	if ( wp_verify_nonce( $_POST['aa_work_rows_nonce'], 'aa_work_rows' ) )
		update_post_meta($post_id, "rows", $_POST["rows"]);

	if ( wp_verify_nonce( $_POST['aa_meta_seo_description_nonce'], 'aa_meta_seo_description' ) )
		update_post_meta($post_id, "seo_description", $_POST["seo_description"]);

	if ( wp_verify_nonce( $_POST['aa_meta_thumb-main_nonce'], 'aa_meta_thumb-main' ) )
		update_post_meta($post_id, "thumb-main", $_POST["thumb-main"]);

	if ( wp_verify_nonce( $_POST['aa_meta_thumb-alternative_nonce'], 'aa_meta_thumb-alternative' ) )
		update_post_meta($post_id, "thumb-alternative", $_POST["thumb-alternative"]);

	if ( wp_verify_nonce( $_POST['aa_meta_client_nonce'], 'aa_meta_client' ) )
		update_post_meta($post_id, "client", $_POST["client"]);

	if ( wp_verify_nonce( $_POST['aa_meta_type_nonce'], 'aa_meta_type' ) )
		update_post_meta($post_id, "type", $_POST["type"]);

	if ( wp_verify_nonce( $_POST['aa_meta_seodesc_nonce'], 'aa_meta_seodesc' ) )
		update_post_meta($post_id, "seodesc", $_POST["seodesc"]);


}

//wp admin listings
add_filter( 'manage_edit-aa_work_sortable_columns', 'aa_work_sortable_columns' );
function aa_work_sortable_columns( $columns ) {
	
	$columns['client'] = 'client';
//	$columns['order'] = 'order';
	
	return $columns;
}

add_filter("manage_aa_work_posts_columns", "aa_work_edit_columns");
function aa_work_edit_columns($columns){
	$columns = array(
		"cb" => "<input type=\"checkbox\" />",
		"title" => "Title",
		"client" => "Client",
//		"order" => "Order",
		"date" => "Date"
	);
	
	return $columns;
}

add_action( 'pre_get_posts', 'aa_work_orderby' );
function aa_work_orderby( $query ) {
    if( ! is_admin() )
        return;
	
    $orderby = $query->get( 'orderby');
 
    if( 'client' == $orderby ) {
        $query->set('meta_key','client');
        $query->set('orderby','meta_value');
    }
}


add_action("manage_aa_work_posts_custom_column", "aa_work_custom_columns");
function aa_work_custom_columns($column){
	global $post;
	
	switch ($column) {
		case "title":
			echo $post->post_title;
			break;
	
		case "client":
			$client = get_post_meta( $post->ID, 'client', true );
			
			echo ($client ? $client : '–');
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