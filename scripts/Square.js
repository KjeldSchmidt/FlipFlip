function Square( i, j ) {
	var self = this;
	this.i = i;
	this.j = j;
	this.DOMElement = $( this.getHTML() );
	this.color = 'blue';
}

Square.prototype.flipColor = function() {
	this.color = (this.color == 'blue') ? 'red' : 'blue';
	this.DOMElement.toggleClass( 'blue' );
	this.DOMElement.toggleClass( 'red' );
};

Square.prototype.getHTML = function() {
	var positionString = this.i + ',' + this.j;
	return '<div class="square blue" data-position="' + positionString + '">';
}