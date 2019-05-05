<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>PWN 2 admin</title>
	</head>
	<body>
		<h1>PWN administration system</h1>
		<form action="/admin/auth.php" method="post">
			Username: <input type="text" name="user"><br>
			Password: <input type="password" name="pass"><br>
			<input type="submit" value="Login!">
		</form>
		<?php echo $warning;?>
	</body>
</html>