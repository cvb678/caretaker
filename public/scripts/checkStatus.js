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
		}
		if(segment.point.y != 100) {
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
	pulse = API.getPulse();

	// CHECKING STATE
	if(!ecg && !breath) {
		stateBox.removeClass("alive");
		stateBox.addClass("dead");
		stateBox.text("Nie żyje");
		pulse = 0;
	}
	
	if(ecg && breath) {
		stateBox.removeClass("dead");
		stateBox.addClass("alive");
		stateBox.text("Żyje");
	}
	
	pulseBox.text(pulse);

	setTimeout(checkStatus, 3000);
}

$(document).ready(function() {
  checkStatus();
});
