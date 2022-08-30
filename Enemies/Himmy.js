import Entity from '../Entity.js';


class Himmy extends Entity{
    constructor(x, y){
        super();

        this.position.x = x+0.5;
        this.position.y = y;

        this.scale.x = Settings.tileWidth;
        this.scale.y = Settings.tileWidth*2;
    }
}

export default Himmy;