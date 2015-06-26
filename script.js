var Game = {
	playArea: $( '#playArea' ),
	flipArea: $( '#flipArea' ),
	currentLevel: {},
};


function newLevel( level ) {
	Game.currentLevel = level;

	buildBoard( level.size );
	newFlip( level.shape );
}

function buildBoard( size ) {
	squares = Game.currentLevel.squares;

	for (var i = 0; i < size; i++) {
		squares[i] = [];
		for (var j = 0; j < size; j++) {
			squares[i][j] = new Square( i, j );
			Game.playArea.append( squares[i][j].DOMElement );
		}
		Game.playArea.append( '<br>' );
	}
}


function newFlip( shape ) {
	Game.flipArea.append( shape.DOMElement );
}


function hoverFlip( shape ) {
	var squares = flatten( Game.currentLevel.squares );

	squares.forEach( function( elem ) {
		var i = elem.i;
		var j = elem.j;
		
		if ( i + shape.height <= levelConfig.size && j + shape.width <= levelConfig.size ) {
			elem.DOMElement.on( 'mouseenter.placeShape mouseleave.placeShape', function() {
				toggleColorShape( shape, i, j );
			});
			
			elem.DOMElement.on( 'click.placeShape', function() {
				applyShape( shape, i, j );
			});
		}
	});
}


function applyShape( shape, i, j ) {
	var squares = flatten( Game.currentLevel.squares );

	squares.forEach( function( elem ) { 
		elem.DOMElement.off( '.placeShape' );
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

function Shape( valueMap ) {
	var self = this;
	this.height = valueMap.length;
	this.width = valueMap[0].length;
	this.valueMap = valueMap;
	this.state = 'unused',
	
	
	this.DOMElement = $( this.getHTML() );
	
	this.DOMElement.click( function() {
		switch ( self.state  ) {
			case 'unused':
				self.changeState( 'active' );
				hoverFlip( self );
				break;
			case 'active':
				self.changeState( 'unused' );
				break;
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
			break;

	}
}

function flatten( array )  {
	return array.reduce(function(a, b) {
		return a.concat(b);
	});
}

var levelConfig = {

	size: 5,

	map: [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	],

	squares: [],

	shape: new Shape( [ [1, 1, 1], [0, 1, 0] ] )
};



// @koala-prepend "scripts/Game.js"
// @koala-prepend "scripts/Square.js"
// @koala-prepend "scripts/Shape.js"
// @koala-prepend "scripts/utility.js"

newLevel( levelConfig );