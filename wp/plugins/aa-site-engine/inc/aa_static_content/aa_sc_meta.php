<?php 
	
// Init plugin options to white list our options
add_action('admin_init', 'register_setting_aa_sc_meta' );
function register_setting_aa_sc_meta(){
	register_setting(
		'settings_aa_sc_meta', //option group
		'aa_sc_meta', //option name
		'sanitize_aa_sc_meta' //sanitizer (optional, but good to have)
	);
}

// Add link to admin menu
add_action('admin_menu', 'add_menu_page_aa_sc_meta');

function add_menu_page_aa_sc_meta() {
	add_menu_page(
		'Meta Content', //page title
		'Meta Content', //menu title
		'manage_options', //capability
		'metacontent', //page slug
		'page_function_aa_sc_meta', //page content function
		'dashicons-share', //icon
		101 //menu position (higher number = lower priority)
	);
}

//Validate save input
function sanitize_aa_sc_meta($input) {
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
function page_function_aa_sc_meta() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	wp_enqueue_script('jquery');
	wp_enqueue_media();

	wp_register_script( 'meta_rows_js', _PLUGIN_DIR_URL . 'inc/aa_common_functions/js/meta_rows.js');
	wp_enqueue_script( 'meta_rows_js');
	
	wp_register_style( 'meta_rows_css', _PLUGIN_DIR_URL . 'inc/aa_common_functions/css/meta_rows.css' );
	wp_enqueue_style( 'meta_rows_css' );
	
	?>

	<div class="wrap">
		
		<h2>About content</h2>
		
		<p>This is some of the fallack meta data used throughout the site. The main title and Description is fetched from the standard WordPress functions found in "Settings" -> "General"</p>
		
		<form method="post" action="options.php">
			
			<?php settings_fields('settings_aa_sc_meta'); ?>
			<?php $options = get_option('aa_sc_meta'); ?>
			
			<table class="form-table">
				

				<tr valign="top">
					
					<td><h3>Short title</h3> <p><em>used as ending on all subpages</em></p></td>
					<td><input type="text" class="widefat" name="aa_sc_meta[short_title]" value="<?php echo esc_html($options['short_title']); ?>"></td>
					
				</tr>

				<tr valign="top">
					
					<td><h3>Meta Image</h3></td>
					<td>
					
					<?php 
					
					$html = '<div class="aaupload">';
					
						$html .= '<a class="button addmedia" href="#" >Add or change image</a>';
							
						$html .= '<a class="button removemedia" href="#" >Remove image</a>';
				
						$html .= aa_get_attached_media_html($options['img']);
							
						$html .= '<input class="mediaid" type="hidden" name="aa_sc_meta[img]" value="'.esc_html($options['img']).'">';
						
					$html .= '</div>';
						
					echo $html;

					?>
					
					</td>
					
				</tr>
				
			</table>
			
			<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
			</p>
			
		</form>

	</div>

	<?php 	
}