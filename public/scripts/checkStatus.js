var checkStatus = function () {

	var lastSegments = API.getLastDrawn();
	var breath = false;
	var ecg = false;
	var pulse = 0;

	var pulseBox = $("#pulse");
	var stateBox = $("#state");
	var breathBox = $("#breath");

	lastSegments.forEach(function(segment) {
		if(segment.point.y != 100) {
			ecg = true;
			breath = true;
		}
		/* only one segment for now
		if(segment2.point.y != 100) {
			breath = true;
		}*/
	});

	//CHECKING BREATH
	if(!breath) {
		breathBox.removeClass("alive")
			.addClass("dead")
			.text("Nie oddycha");
	}
	else {
		breathBox.removeClass("dead")
			.addClass("alive")
			.text("Oddycha");
	}

	//CHECKING PULSE
	pulse = API.getPulse();

	// CHECKING STATE
	if(!ecg && !breath) {
		stateBox.removeClass("alive")
			.addClass("dead")
			.text("Nie żyje");
		pulse = 0;
	}

	if(ecg && breath) {
		stateBox.removeClass("dead")
			.addClass("alive")
			.text("Żyje");
	}

	pulseBox.text(pulse);

	setTimeout(checkStatus, 3000);
}

$(document).ready(function() {
	checkStatus();
});
