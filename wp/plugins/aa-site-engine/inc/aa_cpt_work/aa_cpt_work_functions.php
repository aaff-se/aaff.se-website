<?php 
	
function aa_work_rows_function($post=false) {
	
	if(!$post) { echo 'no $post included'; return false; }
	
	wp_nonce_field( 'aa_work_rows', 'aa_work_rows_nonce' );

	$data = get_post_meta($post->ID, 'rows', true);
	
	$html = '';

	$html .= '<a class="button top-add addnewrow" href="#">Add row</a>';

	$html .= '<div class="rows">';
	
	if($data)
		foreach ($data as $k => $row) {
			
			$html .= aa_work_row_function(($k+1), $row);
			
		}
		
	$html .= '</div>';
	
	$html .= '<a class="button addnewrow" href="#">Add row</a>';
	
	$html .= '<div class="row-prototype" style="display:none">' . aa_work_row_function() . '</div>';
	
	echo $html;
}

function aa_work_row_function($i=false, $row=false){
	if($i === false) $i = '%init%'; else  $i--;
	
	if(!$row) {
		$row = array(
			'content' => array(
				'type' => '',
				'text' => '',
				'media_id_1' => '',
				'media_id_2' => '',
			)
		);
	}
	
	$html = '';

	$html .= '<div id="row'.$i.'" class="row'.($row['content']['type'] ? ' '.$row['content']['type'] : ' text').'" data-i="'.$i.'">';

		$html .= '<h4>Row <span class="rownumber">'.($i === '%init%' ? '%init+1%' : ($i+1) ).'</span></h4>';
		$html .= '<span class="removerow dashicons dashicons-no"></span>';
	
		$html .= '<div class="typewrap">'; 
		
			$html .= '<select class="type" name="rows['.$i.'][content][type]" data-name="[content][type]">';
				$html .= '<option' . ( !$row['content']['type'] || ($row['content']['type'] == 'text') ? ' selected="selected"':'') . ' value="text">Text</option>';
				$html .= '<option' . ($row['content']['type'] == 'media' ? ' selected="selected"':'') . ' value="media">Image</option>';
			$html .= '</select>';
			
		$html .= '</div>';
		
		$html .= '<div class="text">';
		
			$html .='<textarea class="code" rows="16" class="widefat" name="rows['.$i.'][content][text]" data-name="[content][text]">'.esc_textarea($row['content']['text']).'</textarea>';
			
		$html .= '</div>';

		$html .= '<div class="media">';
			
			$html .= '<h5>Main image</h5>';
			
			$html .= '<a class="button addmedia" href="#" >Add or change image</a>';
				
			$html .= '<a class="button removemedia" href="#" >Remove image</a>';
			
			$html .= aa_get_attached_media_html($row['content']['media_id_1']);
				
			$html .= '<input class="mediaid" type="hidden" name="rows['.$i.'][content][media_id_1]" data-name="[content][media_id_1]" value="'.esc_html($row['content']['media_id_1']).'">';

		
		$html .= '</div>';
		

		$html .= '<div class="media">';
			
			$html .= '<h5>Alternate image</h5>';
			$html .= '<p><em>Optional, if present this image will be used for mobile portrait orientation, good for restructuring image content</em></p>';
			
			$html .= '<a class="button addmedia" href="#" >Add or change image</a>';
				
			$html .= '<a class="button removemedia" href="#" >Remove image</a>';

			$html .= aa_get_attached_media_html($row['content']['media_id_2']);
				
			$html .= '<input class="mediaid" type="hidden" name="rows['.$i.'][content][media_id_2]" data-name="[content][media_id_2]" value="'.esc_html($row['content']['media_id_2']).'">';

		$html .= '</div>';
				
		$html .= '<div class="clear"></div>';
		
	$html .= '</div>';

	return $html;
}