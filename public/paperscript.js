//get canvas object and graphic context
var canvas = document.getElementById('diagram');
var c = canvas.getContext('2d');

//create new path, points will be added to form a diagram
var path = new Path();
path.strokeColor = 'green';
var start = new Point(0,100);
path.moveTo(start);

//some variables
var dataObjects = [];
var tempDataObjects = [];
var i = 0;
var drawn = 0;
var time = 0;
var addToDiagram = false;
var lastDataIndex = 0;

//selecting diagram
path.onMouseEnter = function (event) {
	path.selected = true;
}

path.onMouseLeave = function (event) {
	path.selected = false;
}

//periodically get latest 500 data points from mongo
function executeQuery() {
  $.ajax({
    url: 'http://localhost:8081/get',
    success: function(data) {
		//json arrray to json objects
      	tempDataObjects = eval(data);
		tempDataObjects.reverse();
		//check if there is new data
	   	lastDataIndex = checkData();
		//drawing first 500 data points
		if (lastDataIndex == 499 || lastDataIndex == 0 || dataObjects.length < 499) {
			dataObjects = tempDataObjects;
		}
		else {
			var numOfSegments = 500-lastDataIndex;
			addToDiagram = true;
			path.removeSegments(0, numOfSegments);
			path.position -= new Point(2*numOfSegments, 0);
		}
    }
  });
  setTimeout(executeQuery, 10000);
}

$(document).ready(function() {
  // run the first time; all subsequent calls will take care of themselves
  setTimeout(executeQuery, 5000);
});

//drawing a point per frame
function onFrame (event) {
	if(dataObjects.length > 1 && i<500 && !addToDiagram) {
		if(i < dataObjects.length) {		
			var obj = dataObjects[i];
			path.add([time, obj.value]);
			i++;
			time+=2;
		}
	} //there is new data, after 500 data points
	else if (addToDiagram) {
		path.add([lastDataIndex*2, tempDataObjects[lastDataIndex].value]);
		dataObjects[lastDataIndex].time = tempDataObjects[lastDataIndex].time;
		dataObjects[lastDataIndex].value = tempDataObjects[lastDataIndex].value;
		lastDataIndex++;
		if(lastDataIndex == 500) {
			dataObjects = tempDataObjects;
			addToDiagram = false;
		}
	}
}

function checkData () {
	var index = 0;
	var length = dataObjects.length-1;
	if(length > 0) {
		tempDataObjects.forEach(function (obj) {
			if(obj.time == dataObjects[length].time) {
				console.log(index);
				lastDataIndex = index;
				return index;
			}
			index++;
		});
	}
	return index;
}
