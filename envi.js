// 3D Canvas Enviroment, keeps dimentions 
// and calculates scale of objects
function Envi (context, width, height, size) {
	if (size === undefined) { size = 500; }
	this.depth = size;  // dimention of cubic area
	this.context = context;  // canvas context
	this.width = width;  // canvas pixel dimmentions
	this.height = height;
	this.shiftX = 1;  // perspective shift
	this.shiftY = 1.5;  // starting conditions

	this.font = 'sans-serif';
	this.fontMax = 50; 
	this.fontStyle = ''; // include space at end if using
}

// Vanishing Point Perspective convertion
Envi.prototype.pointTo3D = function (point) {
	var x = (point[0] + ((point[2]/this.depth)*((this.width*this.shiftX/2)-point[0])));
	var y = (point[1] + ((point[2]/this.depth)*((this.height*this.shiftY/2)-point[1])));
	return [x, y];
}

// Returns Array of Char and Font String
Envi.prototype.charToSize = function (char, z) {
	var fontSize = this.fontMax*((this.depth - z)/this.depth);
	var fontString = Math.round(fontSize).toString() + 'px ';
	return [String(char), String(this.fontStyle + fontString + this.font)];
}

// Scene contains all objects(assets)
function Scene (envi, assets) {
/*	if (assets === undefined) { assets = []; }*/
	this.envi = envi;
	this.assets = assets;
}

// Main game function
Scene.prototype.play = function () {
	// draw all assets in scene
	this.envi.context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < this.assets.length; i+=1) {
		this.assets[i].draw(this.envi);
	}
}

// Object of Scene
function Asset (id, x, y, z, geometry, scale) {
/*	if (geometry === undefined) { geometry = []; }
	if (x === undefined) { x = 0; }
	if (y === undefined) { y = 0; }
	if (z === undefined) { z = 0; }  */
	if (scale === undefined) { scale = 1; }
	this.id = id;
	this.geo = geometry;  //array of geometric coordinates and character value
	this.xpos = x;
	this.ypos = y;
	this.zpos = z;
	this.scale = scale;	
}

Asset.prototype.draw = function (envi) {
	for (i = 0; i < this.geo.length; i+=1) {
		var point = this.geo[i];
		var newPoint = [];
		newPoint[0] = this.xpos + point[0]*this.scale; // xpos + geometry
		newPoint[1] = this.ypos + point[1]*this.scale; // ypos + geometry
		newPoint[2] = this.zpos + point[2]*this.scale; // zpos + geometry
		newPoint[3] = point[3];

		var xy = envi.pointTo3D(newPoint);
		var charWithFont = envi.charToSize(newPoint[3], newPoint[2]);
		envi.context.font = String(charWithFont[1].toString());
		envi.context.strokeText(charWithFont[0], xy[0], xy[1])

	}

}
