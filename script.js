var Game = {
	playArea: $( '#playArea' ),
	flipArea: $( '#flipArea' ),
	currentLevel: {},
};


function newLevel( level ) {
	Game.currentLevel = level;

	buildBoard( level.size, level.map );
	newFlip( level.shape );
}

function buildBoard( size, map ) {
	squares = Game.currentLevel.squares;

	for (var i = 0; i < size; i++) {
		squares[i] = [];
		for (var j = 0; j < size; j++) {
			squares[i][j] = new Square( i, j, map[i][j] );
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
	var size = Game.currentLevel.size;

	squares.forEach( function( elem ) {
		var i = elem.i;
		var j = elem.j;
		
		if ( i + shape.height <= size && j + shape.width <= size ) {
			elem.DOMElement.on( 'mouseenter.placeShape', function() {
				startFlipPreview( shape, i, j );
			});

			elem.DOMElement.on( 'mouseleave.placeShape', function() {
				endFlipPreview( shape, i, j );
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

	flipShape( shape, i, j );

	Game.activeShape.changeState( 'used' );
	Game.activeShape = undefined;
}


function startFlipPreview( shape, iStart, jStart ) {
	for (var i = 0; i < shape.height; i++) {
		for (var j = 0; j < shape.width; j++) {
			if ( shape.valueMap[ i ][ j ] ) {
				squares[ (iStart + i) ][ (jStart + j) ].startFlipPreview();
			}
		}
	}
}

function endFlipPreview( shape, iStart, jStart ) {
	for (var i = 0; i < shape.height; i++) {
		for (var j = 0; j < shape.width; j++) {
			if ( shape.valueMap[ i ][ j ] ) {
				squares[ (iStart + i) ][ (jStart + j) ].endFlipPreview();
			}
		}
	}
}

function flipShape( shape, iStart, jStart ) {
	for (var i = 0; i < shape.height; i++) {
		for (var j = 0; j < shape.width; j++) {
			if ( shape.valueMap[ i ][ j ] ) {
				squares[ (iStart + i) ][ (jStart + j) ].flipDown();
			}
		}
	}
}

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

function flatten( array )  {
	return array.reduce(function(a, b) {
		return a.concat(b);
	});
}

var levelConfig = {

	size: 5,

	map: [
		[0, 0, 0, 0, 0],
		[1, 1, 2, 1, 1],
		[0, 1, 0, 1, 0],
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