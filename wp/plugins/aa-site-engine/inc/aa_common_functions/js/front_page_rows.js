jQuery(document).ready(function() {

	var rowCount, rowHtml, newRowHtml, $this, nameattr, $allRows = jQuery('div.rows');
	
	rowHtml = jQuery('div.row-prototype').html();
	jQuery('div.row-prototype').remove();
	
	
	//remove row, and set new order
	$allRows.on('click', '.removerow', function() {
		
		var c = confirm("Remove row?");
		if(c == true) {
			
			var $thisRow = jQuery(this).parents('.row');
				
				$thisRow.remove();
				setArrayOrder();
		}
		
	});
	
	//change row size class
	$allRows.on('change', 'select.size', function() {
	
		var $thisRow = jQuery(this).parents('.row');
			
			if(this.value == 'half') {
				$thisRow.addClass('half');
			} else {
				$thisRow.removeClass('half');
			}
	});
	
	//change column type class
	$allRows.on('change', 'select.type', function() {
	
		var $thisRow = jQuery(this).parents('.col');
			
			$thisRow.removeClass('project projectx2');
			if(this.value != '') {
				$thisRow.addClass(this.value);
			}
	});
	
	//Add new row
	jQuery('#addnewrow').on('click', function(e) {
		
		e.preventDefault();
		rowCount = jQuery('div.rows div.row').length;
				
		var newRowString = rowHtml.replace(/%init%/g, rowCount).replace(/%init\+1%/g, (rowCount+1) );
	
		$allRows.append(newRowString);
		
	});
	
	//reorder with dragndrop
	function setArrayOrder() {
		
		$allRows.find('.row').each(function(i){
			
			var $this = jQuery(this);
			$this.attr('data-i', i);
			$this.find('span.rownumber').text( (i+1) );
			$this.find('select').each(function(){
				
				var $this2 = jQuery(this);
				var dataName = $this2.attr('data-name');
				nameattr = 'aa_to_front_page[rows][' + i + ']' + dataName;
				$this2.attr('name', nameattr);
				
			});
			
		});
		
	};
	
	jQuery('div.rows').sortable({
		handle: 'h4',
		update: function (e, ui) {
			setArrayOrder();
		}
	});
	
});