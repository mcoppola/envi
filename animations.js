function Animations () {

}
// PULSE SCALE 
function pulse_scale (distance, scale, speed, state) {
	if (scale ===)
	if (state === undefined) { state = 0 };
	this.distance = distance
	this.scale = scale;
	this.speed = speed;
	}
pulse_scale.prototype.processPoint = function (point) {
	for (var i=0; i < point.length;	 i+=1) {
				point[i] = point[i] + this.speed*this.state;
			}
			if (this.speed > this.state]) {
				this.state += 1;
			}
			else {
				this.state = 0;
			}
}