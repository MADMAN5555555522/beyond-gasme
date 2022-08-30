import Entity from './Entity.js';
import Vector from './Vector.js'

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

class Particle{
	constructor(position, config){
		this.position = new Vector(
			position.x+random(config.initialPositionVariation), 
			position.y+random(config.initialPositionVariation)
		);

		//config
		this.size = config.size+random(config.sizeVariation);
		this.originalSize = this.size;
		this.rotation = 0;
		this.velocity = new Vector(random(1), random(1));
		this.velocity.normalize();
		this.velocity.scale((Math.random()*config.velocityVariation)*config.speed);
		this.asset = config.asset ?? Images.fireParticle;
		this.lifetime = config.lifetime+(Math.random()*config.lifetimeVariation);

		this.scaleFunction = config.scaleFunction;

		this.elapsedTime = 0;
		this.startTime = Date.now();

		this.dead = false;

		this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16)+Particle.prototype._count;
		Particle.prototype._count++;
	}
	update(offset){
		this.elapsedTime = Date.now()-this.startTime;
		
		this.size = this.scaleFunction(this.originalSize, this.elapsedTime/this.lifetime);

		if(this.elapsedTime > this.lifetime){
			this.dead = true;
		}

		this.position.add(this.velocity);
		this.draw(offset);
	}
	draw(offset){
		ctx.drawImage(
			this.asset,
			this.position.x*Settings.tileWidth-(offset.x*Settings.tileWidth)-(this.size/2),
			this.position.y*Settings.tileWidth-(offset.y*Settings.tileWidth)-(this.size/2), 
			this.size,
			this.size
		);
	}
}
Particle.prototype._count = 0;

class ParticleEffect extends Entity{
	constructor(position, config){
		super();
		this.position = new Vector(position.x, position.y);
		this.velocity = new Vector();
		this.particles = {};
		this.config = config;

		this.elapsedTime = 0;
		this.startTime = Date.now();

		this.notEmitting = false;

		this.collisionRadius = config.radius;
		this.knockBack = config.knockBack
	}
	add(particle){
		this.particles[particle.id] = particle;
	}
	remove(particle){
		delete this.particles[particle.id];
	}
	update(offset){
		this.elapsedTime = Date.now()-this.startTime;
		if(this.elapsedTime > this.config.lifetime){
			this.notEmitting = true;
		}

		//check collision
		if(this.config.collides && Settings.solidTiles.includes(tileMap.getCollidingTile(this.position)) ){
			this.velocity = new Vector();
			this.notEmitting = true;
		}

		this.position.add(this.velocity);

		//add new particles
		if(!this.notEmitting){
			for(var i = 0; i < this.config.emitanceRate; i++){
				this.add(new Particle(this.position, this.config.particle));
			}
		}else if(Object.keys(this.particles).length == 0){
			tileMap.remove(this);
		}

		//update particles
		for(var id in this.particles){
			var particle = this.particles[id];
			particle.update(offset);

			if(particle.dead){
				this.remove(particle);
			}
		}
	}
	onCollision(ent){
		if(this.notEmmitting){return}
		ent.health -= this.config.damage;
		this.notEmitting = true;
	}
}

export default ParticleEffect;