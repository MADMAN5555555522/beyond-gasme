import Vector from './Vector.js';

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

function endgame(){

    gameover = true;

    // draw gameover text
    ctx.font = '100px sans-serif';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', (canv.width/2)-250, (canv.height/2)-50);
}

class Player{
	constructor(){
		// define position and velocity
		this.position = new Vector(1,1);
		this.velocity = new Vector(0,0);
		this.force = new Vector();
		this.mass = 0.005;

		this.nextPosition = new Vector();

		//offset vector for tilemap
		this.offset = new Vector();

		//what the player is currently holding
		this.holding = null;

		//input variables
		this.right = false;
		this.left = false;
		this.up = false;
		this.down = false;

		// stores the tile the player is currently colliding with
		this.collidingWith = '/';
		this.collisionFunc;
		this.colliding = false;

		this.collider = [
            // outline
			new Vector(-0.45, -1.45),
			new Vector(-0.45, 0.45),
			new Vector(0.45, 0.45),
			new Vector(0.45, -1.45),

            // interior points
            new Vector(0.45, -0.5),
            new Vector(-0.45, -0.5),
		];

		this.health = 100;
		this.healthBarWidth = 0.4;

		//initialize things
		this.update();

        this.keyDownEvent = this.keyDown.bind(this);
        this.keyUpEvent = this.keyUp.bind(this);
        this.clickEvent = this.click.bind(this);

        this.debugMode = false;

        this.keySequence = [];

		//set event callbacks
		document.addEventListener('keydown', this.keyDownEvent);
		document.addEventListener('keyup', this.keyUpEvent);
		document.addEventListener('mousedown', this.clickEvent);
	}
	update(){
    
        // do some physics
		// this.physics();
        if(!this.debugMode){
            this.physics();
        }

		// calculate player movement with acceleration
		this.calculateMovement();

		// check collision with tiles
		if(!this.debugMode){
            this.checkCollision();
        }

		this.position.add(this.velocity);

		// calculate camera position offset
		this.calculateOffset();

		// if the player dies reload the page
		if(this.collidingWith == 'D'){
            endgame();
        }

        for(var i = 0; i < this.collider.length; i++){
            ctx.fillStyle = 'red';
            ctx.fillRect(
                ((this.collider[i].x+this.position.x)*Settings.tileWidth-(this.offset.x*Settings.tileWidth) )-5,
                ((this.collider[i].y+this.position.y)*Settings.tileWidth-(this.offset.y*Settings.tileWidth) )-5,
                10,
                10
            );
        }

        if(this.keySequence){
            var k = this.keySequence.slice(-8);
            console.log(k)
            if(k.length == 8 && JSON.stringify(k) == JSON.stringify(['up','up','right','right','down','down','left','left'])){
                console.log('sdfsdf')
                this.debugMode = true;
            }
        }
	}

	physics(){
		this.force.zero(); // set force to zero
        this.force.add(Vector.scale(Settings.gravity, this.mass));
        this.velocity.add(this.force);
	}
	checkCollision(){

		this.colliding = false;

		if(this.collisionFunc == null){
			return;
		}

		this.nextPosition.x = this.position.x;
		this.nextPosition.y = this.position.y;
		this.nextPosition.add(this.velocity);

		for(var i = 0; i < this.collider.length; i++){
			var p = this.collider[i];
			// X collision
			if(this.velocity.x !== 0){
				var tile = this.collisionFunc(this.nextPosition.x+p.x, this.position.y+p.y);
				if(tile == Settings.solidTiles[0]){
					this.velocity.x = 0;
				}
			}

			// Y collision
			if(this.velocity.y !== 0){
				var tile = this.collisionFunc(this.position.x+p.x, this.nextPosition.y+p.y);
				if(tile == Settings.solidTiles[0]){
					this.velocity.y = 0;
					this.colliding = true;
				}
			}
		}
	}
	calculateOffset(){
		// the number of visible tiles
		var visibletilesY = canv.height/Settings.tileWidth;
  		var visibletilesX = canv.width/Settings.tileWidth;
		
		//calculate offset
		this.offset.x = (this.position.x) - (Math.floor(visibletilesX) / 2);
  		this.offset.y = (this.position.y) - (Math.floor(visibletilesY) / 2);

		if(this.offset.x < 0){
			this.offset.x = 0;
		}
		if(this.offset.y < 0){
			this.offset.y = 0;
		}
	}
	keyDown(ev){
		switch(ev.keyCode) {
			case 37: // left
				this.left = true;
                this.keySequence.push('left')
            break;
          	case 38: // up
            	this.up = true;
                this.keySequence.push('up')
            break;
          	case 39: // right
            	this.right = true;
                this.keySequence.push('right')
            break;
          	case 40: // down 
           		this.down = true;
                this.keySequence.push('down')
            break;

			//WASD
			case 65: // left
				this.left = true;
                this.keySequence.push('left')
            break;
          	case 87: // up
            	this.up = true;
                this.keySequence.push('up')
            break;
          	case 68: // right
            	this.right = true;
                this.keySequence.push('right')
            break;
          	case 83: // down
           		this.down = true;
                this.keySequence.push('down')
            break;


            case 32: // up
           		this.up = true;
            break;

            case 81:
                this.removeEvents();
                resset();
            break;
            
        };
	}
	keyUp(ev){
		switch(ev.keyCode) {
			case 37: // left arrow
				this.left = false;
            break;
          	case 38: // up arrow
            	this.up = false;
            break;
          	case 39: // right arrow 
            	this.right = false;
            break;
          	case 40: // down arrow
           		this.down = false;
            break;

			//WASD
			case 65: // left
				this.left = false;
            break;
          	case 87: // up
            	this.up = false;
            break;
          	case 68: // right
            	this.right = false;
            break;
          	case 83: // down
           		this.down = false;
            break;

            case 32: // up
           		this.up = false;
            break;
        };
	}

    removeEvents(){
        document.removeEventListener('keydown', this.keyDownEvent);
		document.removeEventListener('keyup', this.keyUpEvent);
		document.removeEventListener('mousedown', this.clickEvent);
    }
	click(e){
		var pos = new Vector(e.clientX, e.clientY);
		if(this.holding){
			this.holding.use(pos);
		}
	}
	calculateMovement(){
		if(this.up && this.colliding){
            this.velocity.y-=0.2;
        }
        //horizontal
        if(this.left){
            this.velocity.x -= Settings.playerAcceleration*deltaTime;
            if(this.velocity.x < -Settings.playerSpeed){
                this.velocity.x = -Settings.playerSpeed;
            }
            this.dir = -1;
        }else if(this.right){
            this.velocity.x += Settings.playerAcceleration*deltaTime;
            if(this.velocity.x > Settings.playerSpeed){
                this.velocity.x = Settings.playerSpeed;
            }
            this.dir = 1;
        }else{
            if(this.velocity.x < 0){
                this.velocity.x += Settings.playerAcceleration*deltaTime;
                if(this.velocity.x >= 0){
                    this.velocity.x = 0;
                }
            }else{
                this.velocity.x -= Settings.playerAcceleration*deltaTime;
                if(this.velocity.x <= 0){
                    this.velocity.x = 0;
                }
            }
        }
        if(this.debugMode){
            this.velocity.y = 0;
            if(this.up){
                this.velocity.y = - Settings.playerSpeed;
            }else if(this.down){
                this.velocity.y = Settings.playerSpeed;
            }
        }
	}
}

export default Player;