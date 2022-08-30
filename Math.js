
/**
* generates a random number that can be negative
* @param {number} range - the range of the random number to be generated
* @returns {number}
*/
function random(range){
	return (Math.random()*range*2)-range;
}


/**
* returns the distance between two position vectors
* @param {Vector} a - first position vector 
* @param {Vector} b - second posiiton vector
* @returns {number}
*/
function getDist(a, b){
	return Math.sqrt( Math.pow((a.x-b.x), 2) + Math.pow((a.y-b.y), 2) );
}

/**
credit for seeded random algorithim
https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
**/

function fixedrandom(p){
    const seed = 43758.5453123;
    return (Math.abs(Math.sin(p)) * seed)%1;
}