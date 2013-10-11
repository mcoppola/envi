function Frame (widht, height, depth) {
	this.width = width;
	this.height = height;
	this.depth = depth;

}
// ------------------------------------------------------------------------ //
// MODEL ANIMATIONS
// ------------------------------------------------------------------------ //

function explode_infinite (side, distance, scale, speed, state) {
	if (speed === undefined) { speed = 1 };
	if (state === undefined) { state = 0 };
	this.side = side;
	this.distance = distance
	this.scale = scale;
	this.speed = speed/100;
	}
explode_infinite.prototype.processPoint = function (frame, point, asset) {
	for (var i=0; i < point.length - 1;	 i+=1) {
			if (point[i] > this.side*asset.scale/2) {
				point[i] = point[i] + this.scale*this.state;
			} 
			else if (point[i] == this.side*asset.scale/2) {

			}
			else {
				point[i] = point[i] - this.scale*this.state;
			}
		}
	if (10000000 > this.state) {
		this.state += 1*this.speed;
	}
	else {
		this.state = 0;
	}
	return point;
}



// ------------------------------------------------------------------------ //
// SCENE ANIMATIONS
// ------------------------------------------------------------------------ //


function house_fly (speed, range, slave) {
	if (slave === undefined) {slave = false}
	this.speed = speed;
	this.range = range;
	this.slave = slave;
	this.direction = [1, 1, 1];
}
// Scene Animation requires (asset, frame)
house_fly.prototype.processPoint = function (asset, frame) {
	// FREE gravatate away from center and limits 
	if (this.slave == false) {
		for (var i = 0; i < asset.pos.length; i+=1){
			var dist = Math.abs(frame[i]/2 - asset.pos[i]);
				if (dist < (frame[i]/2)*Math.max(.4, Math.random())) {
					asset.pos[i] = asset.pos[i] + (Math.random()*this.speed)*this.direction[i];
				}
				else {
					this.direction[i] = this.direction[i]*(-1);
				}
		}
	// save position
	}
}