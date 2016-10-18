jQuery(document).ready(function() {

	var addMediaFunction = function addMediaFunction() {
		var send_attachment_bkp = wp.media.editor.send.attachment;
		var $button = jQuery(this);
		_custom_media = true;
		wp.media.editor.send.attachment = function(props, attachment){
			
			if ( _custom_media ) {
				$button.siblings('input.mediaid').val(attachment.id);
				
				if(attachment.type == 'image') {
					var $oldImg = $button.siblings('img');
					
					if($oldImg.length) {
						$oldImg.attr({
							'src': attachment.sizes.medium.url,
							'width': attachment.sizes.medium.width,
							'height': attachment.sizes.medium.height,
						});
					} else {
						$button.after('<img class="uploadedmedia" src="'+ attachment.sizes.medium.url +'" width="'+ attachment.sizes.medium.width +'" height="'+ attachment.sizes.medium.height +'">');
					}
				}
			} else {
				return _orig_send_attachment.apply( this, [props, attachment] );
			};
			
			wp.media.editor.send.attachment = send_attachment_bkp;
		};
		
		wp.media.editor.open($button);
		return false;
	}
	
	var removeMediaFunction = function removeMediaFunction() {
		var $button = jQuery(this);
			
		$button.siblings('input.mediaid').val(0);
		
		var $oldImg = $button.siblings('img');
		
		if($oldImg.length) {
			$oldImg.remove();
		}
		return false;
	}

	var rowCount, rowHtml, newRowHtml, $this, nameattr, _custom_media = true, _orig_send_attachment = wp.media.editor.send.attachment, $allRows = jQuery('div.rows');
	
	rowHtml = jQuery('div.row-prototype').html();
	jQuery('div.row-prototype').remove();
	
	//add image src to url-input
	$allRows.on('click', 'a.addmedia', addMediaFunction );
	$allRows.on('click', 'a.removemedia', removeMediaFunction );
	
	jQuery('div.aaupload').on('click', 'a.addmedia', addMediaFunction );
	jQuery('div.aaupload').on('click', 'a.removemedia', removeMediaFunction );
			
	//remove row, and set new order
	$allRows.on('click', '.removerow', function() {
		var c = confirm("Remove row?");
		if(c == true) {
			var $thisRow = jQuery(this).parents('.row');
			$thisRow.remove();
			setArrayOrder();
		}
		
	});
	
	//change column type class
	$allRows.on('change', 'select.type', function() {
		var $thisRow = jQuery(this).parents('.row');
		$thisRow.removeClass('text media');
		
		if(this.value != '') {
			$thisRow.addClass(this.value);
		}
	});
	
	//Add new row
	jQuery('a.addnewrow').on('click', function(e) {
		e.preventDefault();
		rowCount = jQuery('div.rows div.row').length;
		var newRowString = rowHtml.replace(/%init%/g, rowCount).replace(/%init\+1%/g, (rowCount+1) );
		
		if(jQuery(this).hasClass('top-add')) {
			$allRows.prepend(newRowString);
			setArrayOrder();
			rowCount = 0;
		} else {
			$allRows.append(newRowString);
		}
	});
	
	//reorder with dragndrop
	function setArrayOrder() {
		$allRows.find('.row').each(function(i){
			var $this = jQuery(this);
			$this.attr('data-i', i);
			$this.attr('id', 'row' + i);
			$this.find('span.rownumber').text( (i+1) );
			$this.find('input, textarea, select').each(function(){
				
				var $this2 = jQuery(this);
				var dataName = $this2.attr('data-name');
				nameattr = 'rows[' + i + ']' + dataName;
				$this2.attr('name', nameattr);
			  	
			});
		});
		
	};
	
	$allRows.sortable({
		handle: 'h4',
		update: function (e, ui) {
			setArrayOrder();
		}
	});

});