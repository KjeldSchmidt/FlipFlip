function Square( i, j, value ) {
	var self = this;
	this.i = i;
	this.j = j;
	this.DOMElement = $( this.getHTML() );
	this.changeValue( value );
}

Square.prototype.getHTML = function() {
	var positionString = this.i + ',' + this.j;
	return '<div class="square blue" data-position="' + positionString + '">';
}

Square.prototype.changeValue = function( value ) {
	this.value = value;
	this.DOMElement.attr( 'data-value', value );
}

Square.prototype.flipDown = function() {
	if ( this.value > 0) {
		this.changeValue( this.value - 1 );
	} else {
		this.changeValue( 1 );
	}
}

Square.prototype.flipUp = function() {
	this.changeValue( this.value + 1 );
}

Square.prototype.startFlipPreview = function() {
	this.DOMElement.attr( 'data-value', this.value - 1 );
}

Square.prototype.endFlipPreview = function() {
	this.DOMElement.attr( 'data-value', this.value );
}