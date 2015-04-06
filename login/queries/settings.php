<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$email = validateUser();
$code2 = getCode2($email);

$return['email'] = $email;

$query = mysql_query("SELECT * FROM members WHERE email='$email'");
$get = mysql_fetch_assoc($query);
$return['name'] = $get['name'];

$newName = $_POST['name-field'];
$newEmail = $_POST['email-field'];

//update name
if($newName && $newName!=$return['name']) mysql_query("UPDATE members SET name='$newName' WHERE email='$email'");

//update email
if($newEmail && $email!=$newEmail){
	$query = mysql_query("SELECT * FROM members WHERE email='$newEmail'");
	$numrows = mysql_num_rows($query);
	if($numrows){
		$return['error'] = 'email';
		echo json_encode($return);
		return;
	}//if
	mysql_query("UPDATE members SET email='$newEmail' WHERE email='$email' AND validated!='pending'");
	mysql_query("UPDATE login_id SET email='$newEmail' WHERE email='$email'");
	
}//if

$return['saved'] = true; 

//delete account
if($_POST['deleting']){
	//delete images
	$query = mysql_query("SELECT * FROM member_images WHERE code2='$code2'");
	$get = mysql_fetch_assoc($query);
	$folder = $get['folder'];
	$imageFolder = scandir("../../pics/".$folder);
	foreach($imageFolder as $image){
		unlink("../../pics/".$folder."/".$image);
	}//foreach
	rmdir("../../pics/".$folder);
	mysql_query("DELETE FROM member_images WHERE code2='$code2'");
	mysql_query("DELETE FROM member_info WHERE code2='$code2'");
	mysql_query("DELETE FROM members WHERE email='$email' AND code2='$code2'");
	mysql_query("DELETE FROM login_id WHERE email='$email'");
	$return['deleted'] = true;
}//if

echo json_encode($return);

?>