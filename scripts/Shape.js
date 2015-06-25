function Shape( valueMap ) {
	var self = this;
	this.height = valueMap.length;
	this.width = valueMap[0].length;
	this.valueMap = valueMap;
	
	
	this.DOMElement = $( this.getHTML() );
	
	this.DOMElement.click( function() {
		$(this).toggleClass( 'active' );
		hoverFlip( self );
	});
}

Shape.prototype.getHTML = function() {
	var HTML = '<div class="shape">';
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			HTML += '<div class="shapeDot ';
			HTML += ( this.valueMap[i][j] ) ? 'active' : 'inactive';
			HTML += '"></div>';
		}
		HTML += '<br>';
	}
	HTML += '</div>';
	
	return HTML;
};