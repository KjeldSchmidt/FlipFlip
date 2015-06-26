function Shape( valueMap ) {
	var self = this;
	this.height = valueMap.length;
	this.width = valueMap[0].length;
	this.valueMap = valueMap;	
	this.DOMElement = $( this.getHTML() );

	this.changeState( 'unused' );	
	
	this.DOMElement.click( function() {
		if ( !( self.state == 'used' ) ) {
			switch ( self.state  ) {
				case 'unused':
					self.changeState( 'active' );
					hoverFlip( self );
					break;
				case 'active':
					self.changeState( 'unused' );
					break;
			}
		}
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

Shape.prototype.changeState = function( newState ) {
	var oldState = this.state;

	switch ( newState ) {
		case 'unused':
			this.state = 'unused';
			this.DOMElement.attr( 'data-state', 'unused' );
			break;
		case 'used':
			this.state = 'used';
			this.DOMElement.attr( 'data-state', 'used' );
			break;
		case 'active':
			this.state = 'active';
			this.DOMElement.attr( 'data-state', 'active' );
			Game.activeShape = this;
			break;

	}
}