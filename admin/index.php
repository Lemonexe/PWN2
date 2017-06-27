<?php
/*
	SIMPLE AUTHENTICATION SYSTEM
	Authentication data are simply hardcoded in users.php... Fill with appropriate data for production!
*/

include __DIR__.'/includes/users.php';

$warning = '';
if(isset($_GET['err'])) {
	$warning = 'Access denied!';
}

//user is already logged in, receiving cookie with username and password hash, which are simply compared with $users
if(isset($_COOKIE['user']) && isset($_COOKIE['pass'])) {
	$u = urldecode($_COOKIE['user']);
	$h = urldecode($_COOKIE['pass']);
	//it either serves frontend application or login screen
	if(
		isset($users[$u]) && $h === $users[$u]
	) {
		include __DIR__.'/includes/main.php';
	}
	else {
		$warning = 'Bad cookie, access denied! This is an unexpected application fault, it shouldn\'t be happening. Clear your cookies and log in again. Sorry about this...';
		include __DIR__.'/includes/login.php';
	}
}

//first landing, login screen is served
else {
	include __DIR__.'/includes/login.php';
}
