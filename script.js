var Game = {
	playArea: $( '#playArea' ),
	flipArea: $( '#flipArea' ),
	currentLevel: {},

	stopHoverFlip: function() {
		if ( Game.currentLevel.squares ) {
			var squares = flatten( Game.currentLevel.squares );

			squares.forEach( function( elem ) { 
				elem.DOMElement.off( '.placeShape' );
			});
		}
	},

	setActiveShape: function( shape ) {
		if ( Game.activeShape ) {
			Game.activeShape.changeState( 'unused' );
		}

		Game.activeShape = shape;
	}
};


function newLevel( level ) {
	Game.currentLevel = level;

	buildBoard( level.size, level.map );
	
	level.shapes.forEach( function( elem ) {
		newFlip( elem );
	});
}

function nextLevel() {
	clearGameArea();
	var currentLevelNumber = Game.currentLevel.number;
	newLevel( levelData[ currentLevelNumber + 1 ] );
}

function clearGameArea() {
	Game.playArea.empty();
	Game.flipArea.empty();
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

	Game.stopHoverFlip();

	flipShape( shape, i, j );

	Game.activeShape.changeState( 'used' );
	Game.activeShape = undefined;

	if ( checkForWin() ) {
		nextLevel();
	}
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

function checkForWin() {
	var squares = flatten( Game.currentLevel.squares );
	var valueSum = squares.reduce( function(a, b) { return a + b.value; }, 0 );
	if ( valueSum == 0 ) {
		return true;
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
			Game.stopHoverFlip();
			break;
		case 'used':
			this.state = 'used';
			this.DOMElement.attr( 'data-state', 'used' );
			break;
		case 'active':
			this.state = 'active';
			this.DOMElement.attr( 'data-state', 'active' );
			Game.setActiveShape( this );
			hoverFlip( this );
			break;

	}
}

function flatten( array )  {
	return array.reduce(function(a, b) {
		return a.concat(b);
	});
}

var levelData = [
	{
		number: 0,
		size: 5,

		map: [
			[0, 0, 0, 0, 0],
			[1, 1, 2, 1, 1],
			[0, 1, 1, 1, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		],

		squares: [],

		shapes: [
			new Shape( [ [1, 1, 1], [0, 1, 0] ] ),
			new Shape( [ [1, 1, 1], [1, 1, 0] ] )

		]
	},

	{
		number: 1,
		size: 5,

		map: [
			[0, 1, 0, 0, 0],
			[1, 2, 2, 1, 1],
			[0, 2, 1, 1, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		],

		squares: [],

		shapes: [
			new Shape( [ [1, 1, 1], [0, 1, 0] ] ),
			new Shape( [ [1, 1, 1], [1, 1, 0] ] ),
			new Shape( [ [1], [1], [1] ] )

		]
	},

	{
		number: 2,
		size: 5,

		map: [
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1]
		],

		squares: [],

		shapes: [
			new Shape( [ [1, 0, 0], [0, 1, 0], [0, 1, 1] ] ),
			new Shape( [ [1, 0], [1, 1] ] ),
			new Shape( [ [1, 0, 0], [0, 0, 1] ] ),
			new Shape( [ [1, 1, 0], [0, 1, 1] ] ),
			new Shape( [ [1, 1, 0], [0, 1, 0], [1, 1, 1] ] ),
			new Shape( [ [0, 0, 0, 1], [1, 0, 0, 0] ] ),
			new Shape( [ [1], [0], [1] ] ),
			new Shape( [ [1], [1] ] )
		]
	 }
];

// @koala-prepend "scripts/Game.js"
// @koala-prepend "scripts/Square.js"
// @koala-prepend "scripts/Shape.js"
// @koala-prepend "scripts/utility.js"

// @koala-prepend "scripts/levelData.js"

newLevel( levelData[0] );