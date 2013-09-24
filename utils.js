var utils = {};

utils.captureMouse = function (element) {
	var mouse = {x: 0, y: 0};

	element.addEventListener('mousemove', function (event) {
		var x, y;
		if (event.pageX || event.pageY){
			x = event.pageX;
			y = event.pageY;
		} else {
			x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= element.offsetLeft;
		y -= element.offsetTop;

		mouse.x = x;
		mouse.y = y;
	}, false);

	return mouse;
};

utils.captureTouch = function (element) {
	var touch = {x: null, y: null, ispressed: false};

	element.addEventListener('touchstart', function (event) {
		touch.ispressed = true;
	}, false);

	element.addEventListener('touchend', function (event) {
		var x, y, 
			touch_event = event.touches[0]; 

		if(touch_event.pageX || touch_event.pageY) {
			x = touch_event.pageX;
			y = touch_event.pageY;
		} else {
			x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;		
		}
		x -= offsetLeft;
		y -= offsetTop;

		touch.x = x;
		touch.y = y;
	}, false);
	return touch;
};

utils.getAnimationFrame = function () {
	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
										window.mozRequestAnimationFrame ||
										window.oRequestAnimationFrame ||
										window.msRequestAnimationFrame ||
										function (callback) {
											return window.setTimeout(callback, 1000/60)
										});
	}
};

utils.setCanvas = function (window) {
	window.addEventListener(
		'load',
		function () {
			var canvas = document.getElementsByTagName('canvas')[0];

			fullscreenify(canvas);
		},
		false
		);

	function fullscreenify(canvas) {
		var style = canvas.getAttribute('style') || '';
		window.addEventListener('resize', function () {resize(canvas);}, false);

		resize(canvas);

		function resize(canvas) {
/*			var scale = {x: 1, y: 1};
			scale.x = (window.innerWidth - 10) / canvas.width;
			scale.y = (window.innerHeight - 10) / canvas.height;
			if (scale.x < 1 || scale.y < 1) {
				scale = '1, 1';
			} else if (scale.x < scale.y) {
				scale = scale.x + ', ' + scale.x;
			} else {
				scale = scale.y + ', ' + scale.y;
			}*/
			if(window.innerWidth > window.innerHeight) {
				canvas.width  = Math.min(600, window.innerHeight - 60);
				canvas.height = Math.min(600, window.innerHeight - 60);
			}
			else {
				canvas.width = Math.min(600, window.innerWidth - 60);
				canvas.height = Math.min(600, window.innerWidth - 60);
			}

		}
	}
}

utils.doKeyDown = function (evt) {
	switch (evt.keyCode) {
		case 38:  /* Up arrow was pressed */
			if (y - dy > 0){
			y -= dy;
			}
		break;
		case 40:  /* Down arrow was pressed */
			if (y + dy < HEIGHT){
			y += dy;
			}
		break;
		case 37:  /* Left arrow was pressed */
			if (x - dx > 0){
			x -= dx;
			}
		break;
		case 39:  /* Right arrow was pressed */
			if (x + dx < WIDTH){
			x += dx;
			}
		break;
	}
}