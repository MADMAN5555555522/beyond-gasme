import Vector from './Vector.js'

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

class Entity{
	constructor(){
		// position vector for this entity
		this.position = new Vector();
		// scale vector
		this.scale = new Vector(100,100);
		// rotation
		this.rotation = 0;
		// asset to be rendered for this entity
		this.asset = Images.test;

        this.collider = 'Circle';

		// radius of collision with other entities
		this.collisionRadius = 1;

		// unique ID to identify this entity
		this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16)+Entity.prototype._count;
		Entity.prototype._count++;
	}
	
	/**
	* default rendering function
	* @param {Vector} offset - camera offset of the tilemap
	*/
	update(offset){
		ctx.drawImage(
			this.asset,
			this.position.x*Settings.tileWidth-(offset.x*Settings.tileWidth)-(this.scale.x/2),
			this.position.y*Settings.tileWidth-(offset.y*Settings.tileWidth)-(this.scale.y/2), 
			this.scale.x,
			this.scale.y
		);
	}
	
	/**
	* collision event
	* @param {Object} other - entity this entity is currently colliding with
	*/
	onCollision(other)
	{
	}
	
	/**
	* player collision event
	* @param {Object} player - player object to be modified in collision event
	*/
	onPlayerCollision(player)
	{
	}
}

// number of entities that have been created
Entity.prototype._count = 0;

export default Entity;