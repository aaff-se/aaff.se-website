<?php 
function aa_set_dashboard_widgets() {
	// Get Dashboard widgets array
	global $wp_meta_boxes;
	
	// Unset unwanted widgets
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_right_now']);
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']);  
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_activity']);
	unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);  
	unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);    
	unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_recent_drafts']);
	unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']);
	unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary']);
} 

add_action('wp_dashboard_setup', 'aa_set_dashboard_widgets' );

function aa_hide_menus(){
	remove_menu_page( 'edit.php' );                   //Posts
	remove_menu_page( 'edit.php?post_type=page' );    //Pages
	remove_menu_page( 'edit-comments.php' );          //Comments
}

add_action( 'admin_menu', 'aa_hide_menus' );

function showMessage($message, $errormsg = false){
    if ($errormsg) {
        echo '<div id="message" class="error">';
    } else {
        echo '<div id="message" class="updated fade">';
    }
    echo "<p>$message</p></div>";
}
function blogPublicAdminNotice(){
    if(!get_option( 'blog_public' ))
        showMessage('Search engines are discouraged from indexing this site, <a href="/wp-admin/options-reading.php">change this setting.</a>', true);
}
add_action('admin_notices', 'blogPublicAdminNotice');

function aa_set_admin_footer () {
    echo 'Built by <a href="http://www.aaff.se" title="Anton Andersson" target="_blank">Anton Andersson Form & Funktioner</a> using <a href="http://www.wordpress.org" title="WordPress" target="_blank">WordPress</a>';
} 
add_filter('admin_footer_text', 'aa_set_admin_footer');
