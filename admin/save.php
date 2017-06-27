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
			//authentication successful 
			file_put_contents('../data/config.json', json_encode($data['config']));
			file_put_contents('../data/classes.json', json_encode($data['classes']));
			file_put_contents('../data/map.json', json_encode($data['map']));
			file_put_contents('../data/textures.json', json_encode($data['textures']));
		}
		else {$code = 401;}
	}
	else {$code = 401;}
}
else {$code = 403;}

http_response_code($code);
