/***
 * 
***/

import TileMap from './TileMap.js';
import Player from './Player.js';
import Vector from './Vector.js';
import ItemEntity from './ItemEntity.js';
import Map from './maps/example map.js';

var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

var startButton = document.getElementById('startButton');
startButton.onclick = startGame;

canv.width = window.innerWidth;
canv.height = window.innerHeight;
document.body.style.margin = '0em';
document.body.style.overflow = 'hidden';

// make images scale to nearest
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// store time for performance data
var time = 0;
var debugLog = document.getElementById('debug');


function startGame(){
    resset();
    
    Music.overworld.play();
    //hide menu
    document.body.removeChild(document.getElementById('menu'));

    // reveal game
    canv.classList.remove('hidden')
    debugLog.classList.remove('hidden');
}

resset = function(){
    
    gameover = false;
    
    // creat player
    player = new Player();
    tileMap = new TileMap(player);
    
    // load the example tilemap
    tileMap.loadMap(Map);

    console.log(Settings)

    requestAnimationFrame(updateCallback)
}


updateCallback = function (){
    
	// calculate deltatime
	deltaTime = Date.now()-time;
    deltaTime/=1000;
    performance = 1/deltaTime;
    time = Date.now();

	// clear canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0,0, canv.width, canv.height);

	// update tilemap and player
	tileMap.update();
	player.update();

	// display FPS
	debugLog.innerHTML = 'FPS: '+Math.round(performance);

    if(!gameover){
        requestAnimationFrame(updateCallback)
    }
}