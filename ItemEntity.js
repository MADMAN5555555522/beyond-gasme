import Entity from './Entity.js';
import Vector from './Vector.js';

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

class ItemEntity extends Entity{
	constructor(position, item){
		super();
		this.position = position;
		this.item = item;
		this.asset = item.icon;

		this.velocity = new Vector();

		// set size defined in settings
		this.scale.x = Settings.tileWidth*Settings.itemSize;
		this.scale.y = Settings.tileWidth*Settings.itemSize;
	}

	update(offset){

		this.velocity = Vector.subtract(tileMap.player.position, this.position);
		var distanceFromPlayer = this.velocity.magnitude();

		if(distanceFromPlayer < Settings.itemPickUpRange){
			//collect item
			if(distanceFromPlayer < 0.5){
				tileMap.player.holding = this.item;
				tileMap.remove(this);
			}

			// draw item towards player
			this.velocity.normalize();
			this.velocity.scale(Settings.itemPullForce/distanceFromPlayer);
			this.position.add(this.velocity);
		}

		ctx.drawImage(
			this.asset,
			this.position.x*Settings.tileWidth-(offset.x*Settings.tileWidth)-(this.scale.x/2),
			this.position.y*Settings.tileWidth-(offset.y*Settings.tileWidth)-(this.scale.y/2), 
			this.scale.x,
			this.scale.y
		);
	}
}

export default ItemEntity;