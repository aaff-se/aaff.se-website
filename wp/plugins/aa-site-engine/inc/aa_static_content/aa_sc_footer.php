<?php 
	
// Init plugin options to white list our options
add_action('admin_init', 'register_setting_aa_sc_footer' );
function register_setting_aa_sc_footer(){
	register_setting(
		'settings_aa_sc_footer', //option group
		'aa_sc_footer', //option name
		'sanitize_aa_sc_footer' //sanitizer (optional, but good to have)
	);
}

// Add link to admin menu
add_action('admin_menu', 'add_menu_page_aa_sc_footer');

function add_menu_page_aa_sc_footer() {
	add_menu_page(
		'Contact info', //page title
		'Contact info', //menu title
		'manage_options', //capability
		'footercontent', //page slug
		'page_function_aa_sc_footer', //page content function
		'dashicons-phone', //icon
		101 //menu position (higher number = lower priority)
	);
}

//Validate save input
function sanitize_aa_sc_footer($input) {
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
function page_function_aa_sc_footer() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	//wp_enqueue_script('jquery');
	//wp_enqueue_media();
	//wp_enqueue_script('jquery-ui-core');
	//wp_enqueue_script('jquery-ui-sortable');
	
	?>

	<div class="wrap">
		
		<h2>Contact info</h2>
		
		<p>Contact info used throughout the site</p>
		
		<form method="post" action="options.php">
			
			<?php settings_fields('settings_aa_sc_footer'); ?>
			<?php $options = get_option('aa_sc_footer'); ?>
			
			<table class="form-table">
				
				<tr valign="top">
					
					<td><h3>Email text</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[email_text]" value="<?php echo esc_html($options['email_text']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>Email href</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[email_href]" value="<?php echo esc_html($options['email_href']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>Phone text</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[phone_text]" value="<?php echo esc_html($options['phone_text']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>Phone href</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[phone_href]" value="<?php echo esc_html($options['phone_href']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>instagram link</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[instagram]" value="<?php echo esc_html($options['instagram']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>facebook link</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[facebook]" value="<?php echo esc_html($options['facebook']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>linkedIn link</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[linkedin]" value="<?php echo esc_html($options['linkedin']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>twitter link</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[twitter]" value="<?php echo esc_html($options['twitter']); ?>"></td>
					
				</tr>
				<tr valign="top">
					
					<td><h3>github link</h3></td>
					<td><input class="widefat" type="text" name="aa_sc_footer[github]" value="<?php echo esc_html($options['github']); ?>"></td>
					
				</tr>
				
			</table>
			
			<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
			</p>
			
		</form>

	</div>

	<?php 	
}