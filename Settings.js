
var Settings = {
	FPS: 60,
	tileWidth: 40,
	playerSpeed: 0.20,
	playerAcceleration: 0.7,
	solidTiles: ['#'],
	itemSize: 1.5,
	itemPickUpRange: 4,
	itemPullForce: 0.1,
	gravity: {
		x: 0,
		y: 0.98, // rough estimate for gravity
	}
}

var deltaTime = 0;
var performance = 0;