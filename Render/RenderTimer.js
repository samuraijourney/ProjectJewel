var RenderTimer = (function() {	
	var FPS = 30;
	var _frameCount = 0;

	function timerCountdown() {
		var interval = 1000 / FPS;
		_frameCount++;
		setTimeout(fireTimerTrigger,interval);
	}

	function fireTimerTrigger() {
		self.postMessage("");
	}

	return {
		countdown : timerCountdown
	}
})();

self.addEventListener('message', function(objEvent) {
	RenderTimer.countdown();
});
