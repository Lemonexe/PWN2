<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>PWN 2 admin</title>
		<!--ADMIN APP scripts-->
<script>
<?php include 'main.js';?>
<?php include 'GUI.js';?>
</script>
		<!--Imported scripts from game-->
		<script src="../app/services/ascii.js" type="text/javascript"></script>
		<script src="../app/services/time.js" type="text/javascript"></script>
		<script src="../app/render.js" type="text/javascript"></script>
		<link rel="stylesheet" href="../style/game.css" type="text/css">
		<link rel="stylesheet" href="../style/admin.css" type="text/css">
	</head>
	<body>
		<div id="menu">
			<input type="button" onclick="logout();" value="logout"><br><br>
			<input type="button" onclick="AJAXsave();" value="SAVE"><br><br>
			<input type="button" onclick="GUI.view('config');" value="Config"><br>
			<input type="button" onclick="GUI.view('classes');GUI.subView('classesList');" value="Classes"><br>
			<input type="button" onclick="GUI.view('map');" value="Game map"><br>
			<input type="button" onclick="GUI.view('textures');GUI.subView('texturesList');" value="Textures">
		</div>
		<div id="content">
			<div id="intro" class="tab">
				<h2>PWN administration system</h2>
				On the left you can choose file to edit, they can be switched freely without losing any changes in data.<br>
				Closing the window or logging out will lose your changes, but you can use Ctrl + S to save them <b>locally</b> - if you reopen the app or log in again, they can be loaded.<br>
				If you want to save your changes to the server, use the SAVE button on the left.
			</div>

			<div id="config" class="tab">
				<h2>config.json</h2>
				Contains game initiation code - custom javascript code that will be executed when all data files are loaded.<br>
				It is saved automatically!<br>
				<textarea id="configInit"></textarea>
			</div>

			<div id="classes" class="tab">
				<h2>classes.json</h2>
				List of game classes. Filter:
				<select id="classesFilter" onchange="GUI.writeClasses();">
					<option value="">All</option>
					<option value="mapObject">Map object</option>
					<option value="item">Item</option>
					<option value="mob">Mob</option>
					<option value="charClass">charClass</option>
				</select><br>
				Changing the filter will reload the list<br>
				<input type="button" value="Add new class" onclick="GUI.subView('newClass');">
				<hr>

				<div id="classesList" class="subtab"></div>
				<div id="classEdit" class="subtab">
					<b id="classEditTitle"></b><br>
					<textarea id="classTextarea"></textarea><br>
					<input type="button" value="Save" onclick="GUI.parseClass();"><br><br>
					<input type="button" value="Delete" onclick="GUI.deleteClass();">
				</div>
				<div id="newClass" class="subtab">
					ID: <input type="text" id="newClassID"><br>
					Purposes:<br>
					<input type="checkbox" id="mapObject"> mapObject<br>
					<input type="checkbox" id="item"> item<br>
					<input type="checkbox" id="mob"> mob<br>
					<input type="checkbox" id="charClass"> charClass<br>
					<input type="button" value="Create" onclick="GUI.newClass();">
				</div>
			</div>

			<div id="map" class="tab">
				<h2>map.json</h2>
				Map
				<div id="map" class="general"></div>
			</div>

			<div id="textures" class="tab">
				<h2>textures.json</h2>
				<input type="button" value="Add new texture" onclick="GUI.newTexture();">
				<hr>
				<div id="texturesList" class="subtab"></div>
				<div id="textureEdit" class="subtab">
					<b id="textureEditTitle"></b><br>
					Width: <input type="text" id="textureWidth"><br>
					Height: <input type="text" id="textureHeight"><br>
					Interval: <input type="text" id="textureInt"> (miliseconds)<br>
					Reupload frame: <select id="textureFrame" onchange=""></select><br>
					<input type="button" value="Apply" onclick="GUI.applyTexture();"><br><br>
					<input type="button" value="Delete" onclick="GUI.deleteTexture();"><hr>
					<div id="texturePreview" class="general"></div>
				</div>
			</div>
		</div>

		<div id="hidden"></div>
	</body>
</html>
