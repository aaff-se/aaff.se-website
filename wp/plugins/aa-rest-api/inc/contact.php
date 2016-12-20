<?php 

function aa_rest_contact($data){
	
	$contact_data = array('content' => get_option('aa_sc_footer') ); 
	
	return (object) $contact_data;
		
}