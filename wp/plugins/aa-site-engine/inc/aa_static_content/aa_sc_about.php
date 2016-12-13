<?php 
	
// Init plugin options to white list our options
add_action('admin_init', 'register_setting_aa_sc_about' );
function register_setting_aa_sc_about(){
	register_setting(
		'settings_aa_sc_about', //option group
		'aa_sc_about', //option name
		'sanitize_aa_sc_about' //sanitizer (optional, but good to have)
	);
}

// Add link to admin menu
add_action('admin_menu', 'add_menu_page_aa_sc_about');

function add_menu_page_aa_sc_about() {
	add_menu_page(
		'About Content', //page title
		'About Content', //menu title
		'manage_options', //capability
		'aboutcontent', //page slug
		'page_function_aa_sc_about', //page content function
		'dashicons-media-text', //icon
		101 //menu position (higher number = lower priority)
	);
}

//Validate save input
function sanitize_aa_sc_about($input) {
	// Our first value is either 0 or 1
	//$input['option1'] = ( $input['option1'] == 1 ? 1 : 0 );
	
	// Say our second option must be safe text with no HTML tags
	//$input['sometext'] =  wp_filter_nohtml_kses($input['sometext']);
	
	if(is_array($input)){
		foreach ($input as $k => $v) {
			$input[$k] = trim($v);
		}
	}
	
	return $input;
}

//the actual page content
function page_function_aa_sc_about() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	//wp_enqueue_script('jquery');
	//wp_enqueue_media();
	//wp_enqueue_script('jquery-ui-core');
	//wp_enqueue_script('jquery-ui-sortable');
	
	?>

	<div class="wrap">
		
		<h2>About content</h2>
		
		<p>This content is on the about page</p>
		
		<form method="post" action="options.php">
			
			<?php settings_fields('settings_aa_sc_about'); ?>
			<?php $options = get_option('aa_sc_about'); ?>
			
			<table class="form-table">
				
				<tr valign="top">
					
					<td><h3>SEO desc</h3></td>
					<td><textarea rows="5" class="widefat" type="text" name="aa_sc_about[seo]"><?php echo esc_textarea($options['seo']); ?></textarea></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>Main text</h3></td>
					<td><textarea rows="5" class="widefat" type="text" name="aa_sc_about[text]"><?php echo esc_textarea($options['text']); ?></textarea></td>
					
				</tr>
				
			</table>
			
			<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
			</p>
			
		</form>

	</div>

	<?php 	
}