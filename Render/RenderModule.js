var RenderModule = (function() {
	var _playWindowManager;
	var _playCanvas;
	var _renderWindow;
	var _renderIllustrator;
	var _data;

	// Timer declaration
	var _timerWorker = new Worker("../Render/RenderTimer.js");
	_timerWorker.addEventListener('message', function(objEvent) {
		refreshMap();
	});

	function RenderWindow(windowSize) {
		var _renderWindowSize = windowSize;
		
		this.initWindow = function() {
			var windows = document.getElementById("mainWindow");
			_playCanvas = windows.getContext('2d');
		    _playCanvas.fillRect(0,0,windowSize,windowSize);
			_playCanvas.clearRect(0,0,windowSize,windowSize);
		}

		this.getWindowSize = function() {
			return _renderWindowSize;
		}

		this.getPlayCanvas = function() {
			return _playCanvas;
		}
	}

	function RenderIllustrator() {

		this.renderItem = function(item) {
			item.draw(_renderWindow.getPlayCanvas());
		}
	}

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	function refreshMap() {
		for(var i = 0; i < Object.size(_data); i++) {
			if(_data[i].requestDraw()) {
				_renderIllustrator.renderItem(_data[i]);
			}
		}
		_timerWorker.postMessage("");
	}

	function initialize(windowSize, data) {
		_renderWindow = new RenderWindow(windowSize);
		_renderIllustrator = new RenderIllustrator();
		_data = data;

		_renderWindow.initWindow(); // Initialize play window
		_timerWorker.postMessage(""); // Start the timer
	}

	return {
		init: initialize
	};
})();