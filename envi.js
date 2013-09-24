
// 3D Canvas Enviroment, keeps dimentions 
// and calculates scale of objects
function Envi (context, width, height, size) {
	if (size === undefined) { size = 500; }
	this.depth = size;  // dimention of cubic area
	this.context = context;  // canvas context
	this.width = width;  // canvas pixel dimmentions
	this.height = height;
	this.shiftX = 1;  // adjustable perspective shift
	this.shiftY = 1;

	
	this.font = 'sans-serif';
	this.fontMax = 24; 
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
	return [String(char), String(fontString + this.font)];
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
	for (i = 0; i < this.assets.length; i+=1) {
		this.assets[i].draw(this.envi);
	}
}

// Object of Scene
function Asset (x, y, z, geometry) {
/*	if (geometry === undefined) { geometry = []; }
	if (x === undefined) { x = 0; }
	if (y === undefined) { y = 0; }
	if (z === undefined) { z = 0; }*/
	this.geo = geometry;  //array of geometric coordinates and character value
	this.xpos = x;
	this.ypos = y;
	this.zpos = z;

}

Asset.prototype.draw = function (envi) {
	for (i = 0; i < this.geo.length; i+=1) {
		var point = this.geo[i];
		point[0] = this.xpos + point[0]; // xpos + geometry
		point[1] = this.ypos + point[1]; // ypos + geometry
		point[2] = this.zpos + point[2]; // zpos + geometry

		var xy = envi.pointTo3D(point);
		var charWithFont = envi.charToSize(point[3], point[2]);
		envi.context.font = String(charWithFont[1].toString());
		envi.context.strokeText(charWithFont[0], xy[0], xy[1])

	}

}
