Test Instructions and Helpful Tips
----------------------------------

This folder contains sample data structures and information used to test the rendering capabilities of the "Render" folder in the directory above. In order to execute the test: 

1) Make sure that you have not changed any file locations or directory structure. If you have simply make sure you edit the import paths for the scripts in the RenderModule.js for the web worker import and the Bejeweled.html for the javascript imports. Read step 2 to set up your root directory. All import paths are relative to the root.

2) The Bejeweled.html must be opened through a localhost server. This is because the web worker components of HTML5 must be run through a server otherwise they will throw an error. A localhost server like XAMPP will work perfectly. Simply download and install it from here: http://www.apachefriends.org/en/xampp.html and run the Apache server. Then navigate to your configuration file which will be stored in your installation directory under apache\conf. The file will be called httpd.conf. Open this file and change line 238 and 239 which is the DocumentRoot directory and <Directory> tag. You will change these to the root directory of this project. Make sure both lines are changed to the same directory. Add the "Options All" option to the Directory tag as well.

Eg. DocumentRoot "D:\Users\Akram Kassay\Programs\GitHub\ProjectJewel"
    <Directory D:\Users\Akram Kassay\Programs\GitHub\ProjectJewel>
    	Options All
	AllowOverride All
	Require all granted
    </Directory>

These are just helpful guidelines to get you a configuration that I know worked for me. You may not have to go through all this trouble, at the same time you may have to go through more. Google any errors you may get.

3) Make sure the browser you are using is HTML5 compatible. Majority modern day browsers have built in support for HTML5 which contains the web workers. If by chance your browser can not use HTML5 because it is out of date, please update it. The latest version of Google Chrome and Mozilla Firefox will work.

Notes: - In order to start the render module from code, import the RenderModule.js script and call RenderModule.init(windowSize,data). Sample implementation can be seen in the Bejeweled.html file.
	   - The window size is in pixels and bubble data is an ARRAY of any objects which implements a draw() and requestDraw() method.
	   - If the screen frame rate is to be altered, open the RenderTimer.js file and adjust the FPS constant to the desired number of frames per second, by default it is set to 30.