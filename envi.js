// 3D Canvas Enviroment, keeps dimentions 
// and calculates scale of objects
function Envi (context, width, height, size) {
	if (size === undefined) { size = 500; }
	this.depth = size;  // z depth
	this.context = context;  // canvas context
	this.width = width;  // canvas pixel dimmentions
	this.height = height;
	this.shiftX = 1;  // perspective shift
	this.shiftY = 1.5;  // starting conditions
	this.font = 'sans-serif';
	this.fontMax = 50; 
	this.fontStyle = ''; // include space at end if using
	this.frame = [this.width, this.height, this.depth];
}

// Vanishing Point Perspective convertion
Envi.prototype.pointTo3D = function (point) {
	var x = (point[0] + ((point[2]/this.depth)*((this.width*this.shiftX/2)-point[0])));
	var y = (point[1] + ((point[2]/this.depth)*((this.height*this.shiftY/2)-point[1])));
	return [x, y];
}
Envi.prototype.doModelAnimation = function (point, asset) {
	for (var i = 0; i < asset.modelAttributes.length; i+=1) {
		point = asset.modelAttributes[i].processPoint(this.frame, point, asset);
	}	
	return point;
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
	if (geometry === undefined) { geometry = []; }
	if (x === undefined) { x = 0; }
	if (y === undefined) { y = 0; }
	if (z === undefined) { z = 0; }  
	if (scale === undefined) { scale = 1; }
	this.id = id;
	this.geo = geometry;  //array of geometric coordinates and character value
	this.xpos = x;
	this.ypos = y;
	this.zpos = z;
	this.pos = [this.xpos, this.ypos, this.zpos];
	this.scale = scale;
	this.modelAttributes = [];	
	this.sceneAttributes = [];
}

Asset.prototype.draw = function (envi) {
	this.doSceneAnimation(envi.frame);
	for (i = 0; i < this.geo.length; i+=1) {
		var point = [];
		//console.log(this.geo[i][4]);
		point = this.setModelScale(this.geo[i]);
		point = envi.doModelAnimation(point, this);
		point = this.moveToScenePos(point);
		var xy = envi.pointTo3D(point);
		var charWithFont = envi.charToSize(point[3], point[2]);
		envi.context.font = String(charWithFont[1].toString());
		if (this.geo[i][4]) {
			envi.context.strokeStyle = this.geo[i][4].toString();}
		else {
			envi.context.strokeStyle = '#000000'
		}
		//envi.context.strokeStyle = String(point[4].toString());
		envi.context.strokeText(charWithFont[0], xy[0], xy[1]);

	}
}
Asset.prototype.setModelScale = function (point) {
	var newPoint = [];
	newPoint[0] = point[0]*this.scale; // geometry
	newPoint[1] = point[1]*this.scale; // geometry
	newPoint[2] = point[2]*this.scale; // geometry
	newPoint[3] = point[3];
	
/*	if (point[4] === undefined) {newPoint[4] = '#000000'}
		else { newPoint[4] = point[4] }*/
	
	return newPoint;
}
Asset.prototype.moveToScenePos = function (point) {
	var newPoint = [];
	for (var i = 0; i < this.pos.length; i+=1){ 
		newPoint[i] = this.pos[i] + point[i]; // pos + geometry
	}
	newPoint[3] = point[3];
	newPoint[4] = point[4];
	return newPoint;
}
Asset.prototype.doSceneAnimation = function (frame) {
	for (var i = 0; i < this.sceneAttributes.length; i+=1) {
		this.sceneAttributes[i].processPoint(this, frame);
	}
}
/*Asset.prototype.saveModelPos = function (pos) {
	//console.log("point 0 : " + point[0].toString());
	this.xpos = point[0]/this.scale;
	this.ypos = point[1]/this.scale;
	this.zpos = point[2]/this.scale;

}*/
