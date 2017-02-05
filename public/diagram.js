var dataToDraw = [];
var dataObjects = [];

//ajax query for diagram data
function executeQuery() {
	$.ajax({
		url: "http://localhost:8081/get",
		success: function(data) {
			onData(data);			
		},
		error: function(reason) {
			onError(reason);
		}
	});
	setTimeout(executeQuery, 1000);
};

//on successfull query
var onData = function(data) {
	//json array to objects
	var tempDataObjects = eval(data);
	tempDataObjects.reverse();
	var lastPointIndex = checkNewData(tempDataObjects);
	
	//is there any new data
	if(lastPointIndex == 0) {
		dataObjects = tempDataObjects.slice();
		dataToDraw = tempDataObjects;
	}
	else {
		pushDataToQue(lastPointIndex, tempDataObjects);
	}
	
	tempDataObjects = [];
};

var onError = function(reason) {
	console.log("Error: " + reason);
};

//find index where new data begins
var checkNewData = function(tempDataObjects) {
	var len = dataObjects.length-1;
	var  index = 0;

	if(len > 0) {
		while(tempDataObjects[index].time != dataObjects[len].time) {
			index += 1;
		};	
	}

	return index;
};

//add objects that haven't been drawn yet to que
var pushDataToQue = function(lastPointIndex, tempDataObjects) {
	var i = 0;
	var len = tempDataObjects.length;

	for(i=lastPointIndex+1; i<len; i++) {
		dataToDraw.push(tempDataObjects[i]);
	}

	dataObjects=tempDataObjects.slice();
};

// run first time query
$(document).ready(function() {
  setTimeout(executeQuery, 2000);
});

//get canvas object and graphic context
var canvas = document.getElementById('diagram');
var c = canvas.getContext('2d');

//create new path, points will be added to form a diagram
var path = new Path();
path.strokeColor = 'green';
var start = new Point(0,100);
path.moveTo(start);

//canvas events
path.onMouseEnter = function (event) {
	path.selected = true;
};

path.onMouseLeave = function (event) {
	path.selected = false;
};

var positionX = 0;
var CANVAS_WIDTH = 998;
var X_STEP = 2;

//drawing diagram
function onFrame(event) {
	if(dataToDraw[0]) {
		var objToDraw = dataToDraw.shift();
		var value = objToDraw.value;

		if(positionX < CANVAS_WIDTH) {
			path.add(positionX, value);
			positionX += X_STEP;		
		}
		else {
			path.removeSegments(0, 1);
			path.position -= new Point(X_STEP, 0);
			path.add(CANVAS_WIDTH, value);
		}
	}
};
