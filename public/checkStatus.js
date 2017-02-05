var checkStatus = function () {
	
	console.log("CHECKING STATUS");
	var lastItems = API.getLastObjects();
	var breath = false;
	var ecg = false;
	var pulse = 0;
	
	var pulseBox = $("#pulse");
	var stateBox = $("#state");
	var breathBox = $("#breath");

	lastItems.forEach(function(item) {
		if(item.value != 100) {
			ecg = true;
		}
		if(item.value2 != 100) {
			breath = true;
		}
	});
	
	//CHECKING BREATH
	if(!breath) {
		breathBox.removeClass("alive");
		breathBox.addClass("dead");
		breathBox.text("Nie oddycha");
	}
	else {
		breathBox.removeClass("dead");
		breathBox.addClass("alive");
		breathBox.text("Oddycha");
	}

	//CHECKING PULSE
	var len = lastItems.length-1;

	if(lastItems[len]) {
		pulse = lastItems[len].pulse
	}

	pulseBox.text(pulse);


	// CHECKING STATE
	if(!ecg && !breath) {
		console.log(stateBox);
		stateBox.removeClass("alive");
		stateBox.addClass("dead");
		stateBox.text("Nie żyje!");
	}
	
	if(ecg && breath) {
		stateBox.removeClass("dead");
		stateBox.addClass("alive");
		stateBox.text("Żyje!");
	}

	setTimeout(checkStatus, 5000);
}

$(document).ready(function() {
  checkStatus();
});
