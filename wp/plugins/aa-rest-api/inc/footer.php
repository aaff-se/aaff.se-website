<?php
	
function aa_rest_footer($data){
	
	$footer_data = array('content' => get_option('aa_sc_footer') ); 
	
	return (object) $footer_data;
		
}