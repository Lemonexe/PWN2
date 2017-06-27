<?php
/*
	LOGIN TO THE SYSTEM
*/

include 'includes/users.php';

//user has just submited username and password, which are received as plaintext. Therefore, password verify is used to compare with $users
if(isset($_POST['user']) && isset($_POST['pass'])) {
	$u = $_POST['user'];
	$p = $_POST['pass'];
	//it either sets cookies for 30 days and reloads the page, or it serves login screen with warning
	if(
		isset($users[$u]) && password_verify($p, $users[$u])
	) {
		setcookie('user', $u);
		setcookie('pass', $users[$u]);
		header('Location: index.php');
	}
	else {
		header('Location: index.php?err');
	}
}
else {
	http_response_code(403);
}
