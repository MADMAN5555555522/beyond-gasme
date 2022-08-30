
function shrink(size, time){
	return size-(time*size);
}

const FireBall = {
	particle: {
		asset: Images.fireParticle,
		lifetime: 10,
		lifetimeVariation: 100,
		velocityVariation: 0.1,
		speed: 0.1,
		size: 20,
		sizeVariation: 0,
		scaleFunction: shrink,
		initialPositionVariation: 0.1,
	},
	radius: 0.1,
	damage: 5,
	knockBack: 1,
	loop: true,
	emitanceRate: 10,
	lifetime: 2000,
	collides: true,
}

export default FireBall;