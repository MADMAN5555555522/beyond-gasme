
class Item{
	constructor(){
		// defualt to fire spell image
		this.icon = Images.fireSpellBook;
		this.level = 1;
		this.title = "level "+this.level+" fire spell"
	}
	/**
	* called whenever the player uses this item
	*/
	use(){
	}
}

export default Item;