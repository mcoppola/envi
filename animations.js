function Animations () {

}
// PULSE SCALE 
function pulse_scale (distance, scale, speed, state) {
	if (speed === undefined) { speed = 0 };
	if (state === undefined) { state = 0 };
	this.distance = distance
	this.scale = scale;
	this.speed = speed;
	}
pulse_scale.prototype.processPoint = function (point) {
	for (var i=0; i < point.length - 1;	 i+=1) {
				point[i] = point[i] + this.speed*this.state;
			}
			if (this.speed > this.state) {
				this.state += 1;
			}
			else {
				this.state = 0;
			}
	return point;
}