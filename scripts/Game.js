var Game = {
	playArea: $( '#playArea' ),
	flipArea: $( '#flipArea' ),
	currentLevel: {
		squares: []
	},
};


function newLevel( level ) {
	var size = level.size;

	buildBoard( size );
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