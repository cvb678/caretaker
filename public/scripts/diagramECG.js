var CANVAS_WIDTH = 998;
var X_STEP = 2;

var positionX = 0;

//create new path, points will be added to form a diagram
var path = new Path();
path.strokeColor = 'green';

var start = new Point(0,100);
path.moveTo(start);

//path events
path.onMouseEnter = function (event) {
	path.selected = true;
};

path.onMouseLeave = function (event) {
	path.selected = false;
};

//drawing event
function onFrame(event) {
	var value = API.getDataToDraw("ECG");
	if(positionX < CANVAS_WIDTH) {
		path.add(positionX, value);
		positionX += X_STEP;
	}
	else {
		//shift left
		path.removeSegments(0, 1);
		path.position -= new Point(X_STEP, 0);
		path.add(CANVAS_WIDTH, value);
	}

	if(event.count%60 === 0) {
		API.setLastDrawn(
			path.segments.slice(
				Math.max(path.segments.length - 20, 1)
			)
		);
	};
};
