<?php
/*
	SAVING CHANGES TO SERVER
*/

include 'includes/users.php';

$code = 200;
$data = json_decode(file_get_contents('php://input'), true);
if($data) {
	if(isset($_COOKIE['user']) && isset($_COOKIE['pass'])) {
		$u = urldecode($_COOKIE['user']);
		$h = urldecode($_COOKIE['pass']);
		if(isset($users[$u]) && $h === $users[$u]) {
			//authentication successful. Here is list of files: member of data => file address
			$files = [
				'config' => '../data/config.json',
				'classes' => '../data/classes.json',
				'map' => '../data/map.json',
				'textures' => '../data/textures.json'
			];

			//foreach file create backup and put contents
			foreach($files as $key => $value) {
				//---DEVELOPMENT---
				//copy($value, $value.'.bak');		UNCOMMENT FOR PRODUCTION
				file_put_contents($value, json_encode($data[$key]));
			}
		}
		else {$code = 401;}
	}
	else {$code = 401;}
}
else {$code = 403;}

http_response_code($code);
