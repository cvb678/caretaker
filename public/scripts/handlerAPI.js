var handleAPI = function() {

	var dataToDraw = [];
	var dataObjects = [];
	var lastDrawn = [];

	//ajax query for diagram data
	var executeQuery = function() {
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
		if(lastPointIndex === 0) {
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

	//getter for current object
	var getDataToDraw = function(type) {

		var objToDraw = dataToDraw.shift();
		var value = 100;

		if(objToDraw) {
			if(type === "ECG") {
				value = objToDraw.value;
			}
			if(type === "CO") {
				value = objToDraw.value2;
			}
		}

		return value;
	};

	var getPulse = function() {
		var len = dataObjects.length-1;
		var value = 0;

		if(len > 0) {
			value = dataObjects[len].pulse;
		}

		return value;
	};

	var getLastDrawn = function() {
		return lastDrawn;
	};

	var setLastDrawn = function(path) {
		lastDrawn = path.slice();
	};

	return {
		executeQuery: executeQuery,
		getDataToDraw: getDataToDraw,
		getPulse: getPulse,
		getLastDrawn: getLastDrawn,
		setLastDrawn: setLastDrawn
	};
};


var API = handleAPI();

// run first time query
$(document).ready(function() {
	API.executeQuery();
});
