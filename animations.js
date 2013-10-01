function Frame (widht, height, depth) {
	this.width = width;
	this.height = height;
	this.depth = depth;

}
// Explode
function explode_loop (side, distance, scale, speed, state) {
	if (speed === undefined) { speed = 1 };
	if (state === undefined) { state = 0 };
	this.side = side;
	this.distance = distance
	this.scale = scale;
	this.speed = speed/100;
	}
explode_loop.prototype.processPoint = function (frame, point, obj_scale) {
	for (var i=0; i < point.length - 1;	 i+=1) {
			if (point[i] > this.side*obj_scale/2) {
				point[i] = point[i] + this.scale*this.state;
			} 
			else if (point[i] == this.side*obj_scale/2) {}
			else {
				point[i] = point[i] - this.scale*this.state;
			}
		}
	if (this.distance > this.state) {
		this.state += 1*this.speed;
	}
	else {
		this.state = 0;
	}
	return point;
}

function explode_infinite (side, distance, scale, speed, state) {
	if (speed === undefined) { speed = 1 };
	if (state === undefined) { state = 0 };
	this.side = side;
	this.distance = distance
	this.scale = scale;
	this.speed = speed/100;
	}
explode_infinite.prototype.processPoint = function (frame, point, obj_scale) {
	for (var i=0; i < point.length - 1;	 i+=1) {
			if (point[i] > this.side*obj_scale/2) {
				point[i] = point[i] + this.scale*this.state;
			} 
			else if (point[i] == this.side*obj_scale/2) {

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

function house_fly (model, speed, range, origin, slave) {
	if (slave === undefined) {slave = false}
	this.model = model;
	this.speed = speed;
	this.range = range;
	this.origin = origin;
	this.slave = slave;
}

house_fly.prototype.processPoint = function (frame, point, obj_scale) {
	// FREE gravatate away from center and limits 
	if (this.slave == false) {
		for (var i = 0; i < point.length - 1; i+=1){
			var dist = frame[i] - point[i];
				if(dist < frame[i]*Math.random()) {
					point[i] = point[i] + this.speed;
				}
			
		}
	}
	return point;
}