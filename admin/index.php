<?php
/*
	SIMPLE AUTHENTICATION SYSTEM
	Authentication data are simply hardcoded in this PHP... Fill with appropriate data for production!
	Passwords are generated using following code. Store the result in $users under key username
		password_hash('password', PASSWORD_DEFAULT);
*/

$users = [
	//---DEVELOPMENT---   This is a testing admin - DO **NOT** ALLOW THIS IN PRODUCTION!!! Password = default
	'test' => '$2y$10$yXUD98aMy6aDGEKYiyY6IeTzetydP.plZ6J/FrmmZPCQs4mCbHTIy'
];

$warning = '';
//user is already logged in, receiving cookie with username and password hash, which are simply compared with $users
if(isset($_COOKIE['user']) && isset($_COOKIE['pass'])) {
	$u = urldecode($_COOKIE['user']);
	$h = urldecode($_COOKIE['pass']);
	//it either serves frontend application or login screen
	if(
		isset($users[$u]) && $h === $users[$u]
	) {
		include 'includes/main.php';
	}
	else {
		$warning = 'Bad cookie, access denied! This is an application fault, it shouldn\'t be happening. Clear your cookies and log in again.';
		include 'includes/login.php';
	}
}

//user has just submited username and password, which are received as plaintext. Therefore, password verify is used to compare with $users
else if(isset($_POST['user']) && isset($_POST['pass'])) {
	$u = $_POST['user'];
	$p = $_POST['pass'];
	//it either sets cookies for 30 days and reloads the page, or it serves login screen with warning
	if(
		isset($users[$u]) && password_verify($p, $users[$u])
	) {
		setcookie('user', $u);
		setcookie('pass', $users[$u]);
		echo '<script>window.location = window.location.href;</script>';
	}
	else {
		$warning = 'Access denied!';
		include 'includes/login.php';
	}
}

//first landing, login screen is served
else {
	include 'includes/login.php';
}
