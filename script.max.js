var levelConfig = {
	size: 5
}

var squares = [];

function newLevel( size, colorMap ) {
	var playArea = $( '#playArea' );
	playArea.data( 'width', size );
	for (var i = 0; i < size; i++) {
		squares[i] = [];
		for (var j = 0; j < size; j++) {
			var positionString = i + ',' + j;
			var DOMElement = $( '<div class="square blue" data-position="' + positionString + '">' );
			playArea.append( DOMElement );
			squares[i][j] = new Square( DOMElement, i, j );
		}
		playArea.append( '<br>' );
	}
}

function newFlip( shape ) {
	var flipArea = $( '#flipArea' );
	flipArea.append( shape.DOMElement );
}

function hoverFlip( shape ) {
	var squares = $( '.square' );
	squares.each( function() {
		var i = parseInt( $( this ).data( 'position' ).split(',')[0], 10 );
		var j = parseInt( $( this ).data( 'position' ).split(',')[1], 10 );
		
		if ( i + shape.height <= levelConfig.size && j + shape.width <= levelConfig.size ) {
			$( this ).on( 'mouseenter.placeShape mouseleave.placeShape', function() {
				toggleColorShape( shape, i, j );
			});
			
			$( this ).on( 'click.placeShape', function() {
				applyShape( shape, i, j );
			});
		}
	});
}


function applyShape( shape, i, j ) {
	var squares = $( '.square' );
	squares.each( function() { 
		$( this ).off( '.placeShape' ) 
	});
}

function toggleColorShape( shape, iStart, jStart ) {
	for (var i = 0; i < shape.height; i++) {
		for (var j = 0; j < shape.width; j++) {
			if ( shape.valueMap[ i ][ j ] ) {
				squares[ (iStart + i) ][ (jStart + j) ].flipColor();
			}
		}
	}
}










function Square( DOMElement, i, j ) {
	var self = this;
	this.i = i;
	this.j = j;
	this.DOMElement = DOMElement;
	
	this.color = 'blue';
}

Square.prototype.flipColor = function() {
	this.color = (this.color == 'blue') ? 'red' : 'blue';
	this.DOMElement.toggleClass( 'blue' );
	this.DOMElement.toggleClass( 'red' );
};










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

newLevel( levelConfig.size );
var testShape = new Shape( [ [1, 1, 1], [0, 1, 0] ] );
newFlip( testShape );