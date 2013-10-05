function WindowManager()
{
	var windowSize = 600;
	var borderThickness = 0;

	this.getWindowSize = function()
	{
		return windowSize;
	}

	this.getBorderThickness = function()
	{
		return borderThickness;
	}
}

function PlayWindowManager()
{
	var bubbleColCount = 15;
	var radius;
	var bubblesList = new Array();

	radius = Math.floor(this.getWindowSize() / bubbleColCount) / 2;

	this.initPlayWindow = function()
	{
		log.info("Returned from init window");
		for (var i = 0; i < bubbleColCount; i++)
		{
			for (var j = 0; j < bubbleColCount; j++)
			{
				var colorID = Math.floor(Math.random() * 6) + 1;
				var point = new GridPoint(2 * j * radius + radius, 2 * i * radius + radius);
				var colorName = Color.prototype.getColorNameByID(colorID);
				var bubble = new Bubble(new Color(colorName), point, radius);

				bubblesList[point.hash()] = bubble;
				log.info("Coordinate: " + j + "," + i + " ColorID: " + colorID + " ColorName: " + colorName);
			}
		}
	}

	this.getConnectedBubblesList = function(bubble)
	{
		var queue = [];
		var connectedBubblesList = [];
		var gridPoint = bubble.getGridPoint();
		var colorID = bubble.getColor().getColorID();
		var bubbleCountPerRow = playWindowManager.getNumOfBubblesPerRow();

		queue.push(bubble);
		connectedBubblesList.push(bubble);

		while(queue.length > 0)
		{
			for (var i = gridPoint.gridX - 1; i <= gridPoint.gridX + 1; i++)
			{
				for (var j = gridPoint.gridY - 1; j <= gridPoint.gridY + 1; j++)
				{
					// Check if looking at initially selected point
					if(i == gridPoint.gridX && j == gridPoint.gridY)
					{
						continue;
					}

					// Check for outside game window
					if(i < 0 || j < 0 || i > bubbleCountPerRow - 1 || j > bubbleCountPerRow - 1)
					{
						continue;
					}

					// Check to make sure not checking a diagonal bubble
					var result = Math.abs(gridPoint.gridX - i) + Math.abs(gridPoint.gridY - j);
					if(result > 1)
					{
						continue;
					}

					var tempBubble = playWindowManager.getBubbleList()[GridPoint.prototype.hash(i,j)];

					// If this bubble has already been removed from the game
					if(tempBubble == undefined)
					{
						continue;
					}

					if(tempBubble.getColor().getColorID() == colorID)
					{
						var exit = false;
						for(var k = 0; k < connectedBubblesList.length; k++)
						{
							if(connectedBubblesList[k].equals(tempBubble))
							{
								exit = true;
								break;
							}
						}

						if(exit)
						{
							continue;
						}

						queue.push(tempBubble);
						connectedBubblesList.push(tempBubble);
					}
				}
			}

			queue.shift();
			if(queue.length > 0)
			{
				gridPoint = queue[0].getGridPoint();
			}
		}

		if(connectedBubblesList.length < 3)
		{
			while(connectedBubblesList.length > 0)
			{
				connectedBubblesList.pop();
			}
		}

		return connectedBubblesList;
	}

	this.getBubbleRadius = function()
	{
		return radius;
	}

	this.getBubbleList = function()
	{
		return bubblesList;
	}

	this.getBubbleListArray = function()
	{

	}

	this.getNumOfBubblesPerRow = function()
	{
		return bubbleColCount;
	}
}
PlayWindowManager.prototype = new WindowManager();

function InputManager() {}
InputManager.prototype.lastMouseClickObj = null;
InputManager.prototype.onMouseClick = function(e)
{
	var windowSize = playWindowManager.getWindowSize();
	if(e.pageX <= windowSize && e.pageY <= windowSize)
	{
		InputManager.prototype.lastMouseClickObj = e;
		var gridPoint = new GridPoint(e.pageX,e.pageY);
		var bubble = playWindowManager.getBubbleList()[gridPoint.hash()];
		var bubblesConnected = playWindowManager.getConnectedBubblesList(bubble);
		for(var i = 0; i < bubblesConnected.length; i++)
		{
			bubblesConnected[i].erase();
		}
	}
}
window.onclick = InputManager.prototype.onMouseClick;

function Bubble(colorIn, pointIn, radiusIn)
{
	var radius = radiusIn;
	var color = colorIn;
	var point = pointIn;
	var active = true;
	var requestDraw = true;

	this.getRadius = function()
	{
		return radius;
	}

	this.getColor = function()
	{
		return color;
	}

	this.getGridPoint = function()
	{
		return point;
	}

	this.requestDraw = function() {
		return requestDraw;
	}

	this.draw = function(playCanvas)
	{
		if(active)
		{
			playCanvas.fillStyle = color.getColor();
			playCanvas.beginPath();
			playCanvas.arc(point.x, point.y, radius, 0, 2*Math.PI, true);
			playCanvas.closePath();
			playCanvas.fill();
		}
		else
			playCanvas.clearRect(point.x - radius, point.y - radius, 2 * radius, 2 * radius);

		requestDraw = false;
	}

	this.erase = function()
	{
		active = false;
		requestDraw = true;
	}

	this.equals = function(bubble)
	{
		return (color.getColorName() == bubble.getColor().getColorName()) && point.equals(bubble.getGridPoint());
	}
}

function Color(name)
{
	var colorString = '#FF0000';
	var colorID;
	var colorName = name;

	colorID = Color.prototype.getColorIDByName(name);
	colorString = Color.prototype.getColorStringByName(name);

	this.getColor = function()
	{
		return colorString;
	}

	this.getColorID = function()
	{
		return colorID;
	}

	this.getColorName = function()
	{
		return colorName;
	}
}

Color.prototype.getColorNameByID = function(colorID)
{
	var name;
	switch(colorID)
	{
		case 1: name = 'blue'; break;
		case 2: name = 'red'; break;
		case 3: name = 'green'; break;
		case 4: name = 'purple'; break;
		case 5: name = 'yellow'; break;
		case 6: name = 'orange';  break;
		default : name = 'white'; break;
	}

	log.info("Picked color with ID " + colorID + " and name: " + name);

	return name;
}

Color.prototype.getColorIDByName = function(name)
{
	var colorID;
	switch(name)
	{
		case 'blue': colorID = 1; break;
		case 'red': colorID = 2; break;
		case 'green': colorID = 3; break;
		case 'purple': colorID = 4; break;
		case 'yellow': colorID = 5; break;
		case 'orange': colorID = 6;  break;
		default: colorID = 0; break;
	}

	return colorID;
}

Color.prototype.getColorStringByName = function(name)
{
	var colorString;
	switch(name)
	{
		case 'blue': colorString = '#0000FF'; break;
		case 'red': colorString = '#FF0000'; break;
		case 'green': colorString = '#00FF00'; break;
		case 'purple': colorString = '#800080'; break;
		case 'yellow': colorString = '#FFFF00'; break;
		case 'orange': colorString = '#FF8500';  break;
		default: colorString = '#FFFFFF'; break;
	}

	return colorString;
}

function GridPoint(x, y)
{
	this.gridX = 999999;
	this.gridY = 999999;
	this.x = x;
	this.y = y;
	var windowSize = playWindowManager.getWindowSize();
	var bubbleCountPerRow = playWindowManager.getNumOfBubblesPerRow();
	var radius = playWindowManager.getBubbleRadius();
	var hashHistory = [];

	this.gridX = Math.floor(this.x * bubbleCountPerRow / windowSize);
	this.gridY = Math.floor(this.y * bubbleCountPerRow / windowSize);

	this.hash = function()
	{
		var hash = this.gridX + "," + this.gridY;
		return hash;
	}

	hashHistory.push(this.hash());

	this.changeLocationByPixelPoint = function(x, y)
	{
		var windowSize = playWindowManager.getWindowSize();
		if(e.pageX <= windowSize && e.pageY <= windowSize)
		{
			this.x = x;
			this.y = y;
			this.gridX = Math.floor(this.x * bubbleCountPerRow / windowSize);
			this.gridY = Math.floor(this.y * bubbleCountPerRow / windowSize);

			hashHistory.push(this.hash());
		}
	}

	this.changeLocationByGridPoint = function(x, y)
	{
		if (x < bubbleCountPerRow && y < bubbleCountPerRow)
		{
			this.gridX = x;
			this.gridY = y;
			this.x = 2 * radius * x + radius;
			this.y = 2 * radius * y + radius;

			hashHistory.push(this.hash());
		}
	}

	this.getHashHistory = function()
	{
		return hashHistory;
	}

	this.equals = function(point)
	{
		return (this.gridX == point.gridX && this.gridY == point.gridY);
	}
}
GridPoint.prototype.hash = function(x,y)
{
	return x + "," + y;
}


// Quick accessor functions just for test
function getBubbleList()
{
	playWindowManager.initPlayWindow();
	var bubbleArray = [];
	var bubbleList = playWindowManager.getBubbleList();

	for(var bubble in bubbleList)
	{
		bubbleArray.push(bubbleList[bubble]);
	}

	return bubbleArray;
}

function getWindowSize() {
	return playWindowManager.getWindowSize();
}

var playWindowManager = new PlayWindowManager();