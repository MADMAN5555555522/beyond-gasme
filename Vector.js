class Vector{
	constructor(x, y){
		this.x = x ?? 0;
		this.y = y ?? 0;
	}
	add(v){
		this.x+=v.x;
		this.y+=v.y;
	}
	scale(s){
		this.x*=s;
		this.y*=s;
	}
	zero(){
		this.x = 0;
		this.y = 0;
	}
	magnitude(){
		return Math.sqrt(this.x*this.x+this.y*this.y)
	}
	normalize(){
		var mag = this.magnitude();
		this.x /= mag;
		this.y /= mag;
	}
	square(){
		this.x*=this.x;
		this.y*=this.y;
	}
	static multiply(a, b){
		return new Vector(a.x*b.x, a.y*b.y)
	}
	static truncate(vec){
		var x = Math.trunc(vec.x);
		var y = Math.trunc(vec.y);
		return new Vector(x, y);
	}
	static subtract(a, b){
		return new Vector(
			a.x-b.x,
			a.y-b.y,
		);
	}
	static scale(a, b){
		return new Vector(
			a.x*b,
			a.y*b
		)
	}
}

export default Vector;