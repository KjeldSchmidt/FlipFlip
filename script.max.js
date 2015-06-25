var levelConfig = {

	size: 5,

	map: [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	],

	shape: new Shape( [ [1, 1, 1], [0, 1, 0] ] )
};



// @koala-prepend "scripts/Game.js"
// @koala-prepend "scripts/Square.js"
// @koala-prepend "scripts/Shape.js"

newLevel( levelConfig );