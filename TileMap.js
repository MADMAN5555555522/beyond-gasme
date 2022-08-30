import Vector from './Vector.js';
import Himmy from './Enemies/Himmy.js';

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

class TileMap{
	constructor(player){
		this.map = [];
		this.player = player;
		this.player.collisionFunc = this.getCollidingTile.bind(this);
		this.entities = {};
	}
	loadMap(source){
		// divide string into array of lines
		var lines = source.split('\n');

		// loop through lines and create a 2d array
		for(var y = 0; y < lines.length; y++){

			// make a 1d array out of this line
			var row = [];
			for(var x = 0; x < lines[y].length; x++){

                if(lines[y][x] == 'H'){
                    row.push('.');
                    var himmy = new Himmy(x, y);
                    this.add(himmy);
                }else{
                    row.push(lines[y][x]);
                }
                
			}
			
			// add that 1d array to the 2d array
			this.map.push(row);
		}
	}
	update(){

		// offset for all tiles for floating point values
		var tileoffx = (this.player.offset.x - Math.trunc(this.player.offset.x))*Settings.tileWidth;
  		var tileoffy = (this.player.offset.y - Math.trunc(this.player.offset.y))*Settings.tileWidth;

		// the total number of visible tiles on the X and Y axis
		var vy = Math.floor(canv.height/Settings.tileWidth);
  		var vx = Math.floor(canv.width/Settings.tileWidth);

		// loop through tiles and render
		for(var y = 0; y < vy+2; y++){
			for(var x = 0; x < vx+2; x++){
				
				if(this.getTileFromScreen(x, y) == '#'){
					
					// tile is stone
					// var location = this.getTileEdge('#', x, y);
					ctx.drawImage(
						Images.grass,
						Math.round((x*Settings.tileWidth)-tileoffx), 
						Math.round((y*Settings.tileWidth)-tileoffy), 
						Settings.tileWidth,
						Settings.tileWidth
					);
					
				}else if(this.getTileFromScreen(x, y) == '.'){
					
					// tile is a floor tile
					//var brightness = fixedrandom(((x+Math.trunc(this.player.offset.x+10))*(y+Math.trunc(this.player.offset.y+10)))+83492);
					//ctx.fillStyle = 'hsl(216, 28%, '+(14+brightness*5)+'%)'//"#1a222e";
                    ctx.fillStyle = '#03cffc';
					ctx.fillRect(
						Math.round((x*Settings.tileWidth)-tileoffx), 
						Math.round((y*Settings.tileWidth)-tileoffy), 
						Settings.tileWidth, 
						Settings.tileWidth
					);
					
				}else if(typeof this.getTileFromScreen(x, y) == 'number'){
					
					// tile is a number this is mainly for debuging purposes
					var b = this.getTileFromScreen(x, y);
					ctx.fillStyle = 'rgb('+b+','+b+','+b+')';
					ctx.fillRect(
						Math.round((x*Settings.tileWidth)-tileoffx), 
						Math.round((y*Settings.tileWidth)-tileoffy), 
						Settings.tileWidth, 
						Settings.tileWidth
					);
					
				}
			}
		}

		// draw player
		ctx.fillStyle = "red";
		// ctx.fillRect(
		// 	(this.player.position.x*Settings.tileWidth-(this.player.offset.x*Settings.tileWidth) )-(Settings.tileWidth/2),
		// 	(this.player.position.y*Settings.tileWidth-(this.player.offset.y*Settings.tileWidth))-(Settings.tileWidth/2), 
		// 	Settings.tileWidth,
		// 	Settings.tileWidth
		// );
  //       ctx.fillRect(
		// 	(this.player.position.x*Settings.tileWidth-(this.player.offset.x*Settings.tileWidth) )-(Settings.tileWidth/2),
		// 	((this.player.position.y-1)*Settings.tileWidth-(this.player.offset.y*Settings.tileWidth))-(Settings.tileWidth/2), 
		// 	Settings.tileWidth,
		// 	Settings.tileWidth
		// );

        ctx.drawImage(
            Images.TestBody,
            (this.player.position.x*Settings.tileWidth-(this.player.offset.x*Settings.tileWidth) )-(Settings.tileWidth/2),
			(this.player.position.y*Settings.tileWidth-(this.player.offset.y*Settings.tileWidth))-(Settings.tileWidth/2), 
			Settings.tileWidth,
			Settings.tileWidth
        );

        ctx.drawImage(
            Images.TestHead,
            (this.player.position.x*Settings.tileWidth-(this.player.offset.x*Settings.tileWidth) )-(Settings.tileWidth/2),
			((this.player.position.y-1)*Settings.tileWidth-(this.player.offset.y*Settings.tileWidth))-(Settings.tileWidth/2), 
			Settings.tileWidth,
			Settings.tileWidth
        );

		//draw item player is holding
		if(this.player.holding){
			ctx.drawImage(
				this.player.holding.icon,
				(this.player.position.x*Settings.tileWidth-(this.player.offset.x*Settings.tileWidth) )-(Settings.tileWidth/2),
				(this.player.position.y*Settings.tileWidth-(this.player.offset.y*Settings.tileWidth))-(Settings.tileWidth/2),
				Settings.tileWidth,
				Settings.tileWidth
			);
		}

		//draw entities and check collision
		this.updateEntities(this.entities);

		this.player.collidingWith = this.getCollidingTile(this.player.nextPosition);
	}
	/**
	* updates entities and checks collision
	* @param {array} entities - a list of entities to update
	*/
	updateEntities(entities){
		for(var id in entities){
			const ent = entities[id];

			//update entity
			entities[id].update(
				this.player.offset
			);

			//collision with other entities
			for(var otherId in entities){
				const otherEnt = entities[otherId];
                
    			if(ent.collider == 'Circle'){
                    if(
        					ent
        					&& getDist(ent.position, otherEnt.position) < ent.collisionRadius + otherEnt.collisionRadius 
        					&& otherId !== id
        				){
        					// these entities are colliding trigger the event
        					ent.onCollision(otherEnt);
        				}
        			}
        
        			//collision with player
        			if(
        				ent
        				&& getDist(ent.position, this.player.position) < ent.collisionRadius + 1
        			){
        				// this entity is colliding with the player
        				ent.onPlayerCollision(this.player);
        			}
                }
		}
	}
	getTileFromScreen(x, y){
		if(y + Math.floor(this.player.offset.y)<this.map.length && y + Math.floor(this.player.offset.y) >= 0){
			return this.map[y + Math.trunc(this.player.offset.y)][x + Math.trunc(this.player.offset.x)];
		}else{
			return null;
		}
	}
	toTileSpace(v){
		return new Vector(
			((v.x/Settings.tileWidth)+(this.player.offset.x)),
			((v.y/Settings.tileWidth)+(this.player.offset.y))
		);
	}
	toScreenSpace(x, y){
        return new Vector(((x*Settings.tileWidth)-(this.offset.x*Settings.tileWidth)), ((y*Settings.tileWidth)-(this.offset.y*Settings.tileWidth)));
    }
	getCollidingTile(vec, y){
		if(vec.constructor !== Vector){
			vec = new Vector(vec, y);
		}
		var v = Vector.truncate(vec);
		if(v.x<=0||v.y<=0||v.x>this.map[0].length-1||v.y>this.map.length-1){
			return '/'
		}
		return this.map[v.y][v.x];
	}
	getTileEdge(tile, x, y){
		var top = false;
		var bottom = false;
		var right = false;
		var left = false;
		var pos = new Vector(8,8);
		if(y+1<this.map.length && y+1>0){
			bottom = (this.getTileFromScreen(x, y+1) !== tile)
		}
		if(y-1<this.map.length && y-1>0){
			top = (this.getTileFromScreen(x, y-1) !== tile)
		}
		if(x+1<this.map.length && x+1>0){
			right = (this.getTileFromScreen(x+1, y) !== tile)
		}
		if(x-1<this.map.length && x-1>0){
			left = (this.getTileFromScreen(x-1, y) !== tile)
		}

		if(top&&!left&&!right){
			pos.x = 8;
			pos.y = 0;
		}else if(bottom&&!left&&!right){
			pos.x = 8;
			pos.y = 16;
		}else if(left&&!right&&!top&&!bottom){
			pos.x = 0;
			pos.y = 8;
		}else if(right&&!left&&!top&&!bottom){
			pos.x = 16;
			pos.y = 8;
		}else if(bottom&&left&&!right){
			pos.x = 0;
			pos.y = 16;
		}else if(bottom&&right&&!left){
			pos.x = 16;
			pos.y = 16;
		}else if(top&&left&&!right){
			pos.x = 0;
			pos.y = 0;
		}
		else if(top&&right&&!left){
			pos.x = 16;
			pos.y = 0;
		}
		return pos;
	}
	add(ent){
		this.entities[ent.id] = ent;
	}
	remove(ent){
		delete this.entities[ent.id];
	}
}

export default TileMap;