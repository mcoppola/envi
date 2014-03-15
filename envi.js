// -------------- ENVI ------------------------------------------------ //
//
// 3D Canvas Enviroment, keeps dimentions 
// and calculates scale of objects
//
// TODO
// - get imgGrid height width 
// - imgGrid doesn't work with kandinsky3?
// 		- it does but only with <img> height and width specified
// - optimize asset.draw()
function Envi (context, width, height, depth, dummyContext) {
	if (depth === undefined) { depth = 500; }
	this.depth = depth;  // z
	this.context = context;  // canvas context
	this.dummyContext = dummyContext; // dummy for imgGrid
	this.width = width;  // canvas pixel dimmentions
	this.height = height;
	this.shiftX = 1;  // perspÏective shift
	this.shiftY = 1;  // starting conditions
	this.font = 'sans-serif';
	this.fontMax = 50; 
	this.fontStyle = ''; // include space at end if using
	this.frame = [this.width, this.height, this.depth];
	this.printStyle = 'fill'; // not using, TODO: use!
	this.resolutionFactor = 16;
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
Envi.prototype.charToSize = function (z) {
	if (z < this.depth){
		var fontSize = this.fontMax*((this.depth - z)/this.depth);
		var fontString = Math.round(fontSize).toString() + 'px ';
		return [this.fontStyle + fontString + this.font];
	} else { return [this.fontStyle + '0px' + this.font]; }
}

// Scene contains all objects(assets)
function Scene (envi, assets) {
	if (assets === undefined) { assets = []; }
	this.envi = envi;
	this.assets = assets;
}
Scene.prototype.add = function (newAsset) {
	if (typeof(newAsset) === Array) {
		this.assets = this.assets + newAsset;
	} else {
		this.assets[this.assets.length] = newAsset;
	}
}
// Main game function
Scene.prototype.play = function () {
	// draw all assets in scene
	this.envi.context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < this.assets.length; i+=1) {
		this.assets[i].draw(this.envi);
	}
}

// -------------- ASSETS ----------------------------------------------- //
//
// Objects of Scene
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
	this.width = undefined;  // for img Grid objects
	this.height = undefined;
}

Asset.prototype.draw = function (envi) {
	this.doSceneAnimation(envi.frame);
	var point = [];
	for (i = 0; i < this.geo.length; i+=1) {
		point = this.setModelScale(this.geo[i]);
		point = envi.doModelAnimation(point, this);
		point = this.moveToScenePos(point);
		var xy = envi.pointTo3D(point);
		var charWithFont = [point[3], envi.charToSize(point[2])];
		envi.context.font = charWithFont[1];
		envi.context.fillStyle = this.geo[i][4]; 
		// TODO: make option for stroke or fill text
		envi.context.fillText(charWithFont[0], xy[0], xy[1]);
	}
}
Asset.prototype.setModelScale = function (point) {
	return [point[0]*this.scale, point[1]*this.scale, point[2]*this.scale, point[3]];
}
Asset.prototype.moveToScenePos = function (point) {
	return [this.pos[0] + point[0], this.pos[1] + point[1], this.pos[2] + point[2], point[3], point[4]];
}
Asset.prototype.doSceneAnimation = function (frame) {
	for (var i = 0; i < this.sceneAttributes.length; i+=1) {
		this.sceneAttributes[i].processPoint(this, frame);
	}
}


// -------------- IMAGE GRID ----------------------------------------------- //
//
// An asset sub class to encorperate image files
//
// TODO
// - optimization 
//		we know the grid has a point for every x and y, we dont have to read the array

function ImageGrid ( envi, file ) { 
	this.envi = envi;
	this.img = null;
	this.grid = {};
	this.sourceFile = file;
	this.data = this.makeData();
	this.geo = this.makeGeo();
	this.asset;
}

// Extends ImageGrid to psuedo subclass Asset
// (Contains all methods of Assets optimized for ImageGrid)
ImageGrid.prototype.toAsset = function (x, y, z, scale) {
	this.xpos = x;
	this.ypos = y;
	this.zpos = z;
	this.pos = [x, y, z];
	this.scale = scale;
	this.modelAttributes = [];	
	this.sceneAttributes = [];
	this.width = this.img.width;
	this.height = this.img.height;

	// For ImageGrid we will make scale and position static
	// thus eliminating the need to recalculate at every frame
	var point, temp;
	for (i = 0; i < this.geo.length; i+=1) {

		point = this.geo[i];
		// SET SCALE
		temp = [point[0]*this.scale, point[1]*this.scale, point[2]*this.scale, point[3]];
		// SET POSITION
		temp = [this.xpos + temp[0], this.ypos + temp[1], this.zpos + temp[2], point[3], point[4]];
		this.geo[i] = temp;
	}
	
	this.draw = function () {
		// Dynamic functions here
		var tempPoint = [];  // don't rewrite point data, we need to keep original for doing animations
		for (i = 0; i < this.geo.length; i+=1) {
			tempPoint = this.geo[i];
			/*for(var j = 0; j < this.modelAttributes.length; j+=1){
				tempPoint = this.modelAttributes[i].processPoint(this.envi.frame, tempPoint, this);
			}*/
			var xy = this.envi.pointTo3D(tempPoint);
			var charWithFont = [tempPoint[3], this.envi.charToSize(tempPoint[2])];
			this.envi.context.font = charWithFont[1];
			this.envi.context.fillStyle = tempPoint[4]; 
			this.envi.context.fillText(charWithFont[0], xy[0], xy[1]);
		}
	}
}

	
ImageGrid.prototype.makeData = function () {
	// get source file
	this.img = new Image();
	this.img.src = this.sourceFile;
	this.grid.width = this.img.width/this.envi.resolutionFactor;
	this.grid.height = this.img.height/this.envi.resolutionFactor; 
	// print it to dummy Canvas
	envi.dummyContext.width = this.img.width;
	envi.dummyContext.height = this.img.height;
	envi.dummyContext.drawImage(this.img, 0, 0);
	// get the data
	var data = [];
	for (var i = 1; i < this.grid.width; i+=1) { 
		for(var j = 1; j < this.grid.height; j+=1) {
			data[i*j] = envi.dummyContext.getImageData(i*this.envi.resolutionFactor, j*this.envi.resolutionFactor, 1, 1).data;  // hard coded ratio (1/24). fix!!!
		}
	}
	return data;
}

ImageGrid.prototype.makeGeo = function (asci) {
	if(typeof(asci) === 'undefined'){
		asci = 'o';
	}
	var geo = []
	for (var i = 1; i < this.grid.width; i+=1) {
		for(var j = 1; j < this.grid.height; j+=1) {

/*			if(Math.random() > .2){ asci='.'}
				else if (Math.random() < .2){ asci='o'}
					else if (Math.random() < .2){ asci='a'}
						else if (Math.random() < .2){ asci='e'}
							else if (Math.random() < .2){ asci='u'}
								else if (Math.random() > .2){ asci='*'}
									else { asci='#'}*/
			// plug ins for z
			// this.grid.width/Math.abs(i - this.grid.width/2)  =  convex shape x
			// this.grid.height/Math.abs(j - this.grid.height/2) = convex shape y
			geo[geo.length] = ([i, j, 1, asci, this.rgbToHex(this.data[i*j])])
		}
	}
	return geo;
}

ImageGrid.prototype.rgbToHex = function ( rgbaArray ) {
    return "#" + this.componentToHex(rgbaArray[0]) + this.componentToHex(rgbaArray[1]) + this.componentToHex(rgbaArray[2]);
    
}
ImageGrid.prototype.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
