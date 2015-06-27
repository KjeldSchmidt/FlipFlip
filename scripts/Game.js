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