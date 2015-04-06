<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$email = validateUser();
$code2 = getCode2($email);
$message = $_POST['message'];

if($message){//else if message
	
	$query = mysql_query("SELECT * FROM members WHERE email='$email'");
	$get = mysql_fetch_assoc($query);
	$name = $get['name'];
	$type = $get['type'];
	$id = $get['id'];
	
	$profilePage = "http://WitzKey.com/login/".$type."?id=".$id;
	
	$subject = 'User contact';

	include('../../sendgrid/fonts.php');
	
	$body_html = "<div style='".$font1."'>
	<p>".$name." (".$email.") sent you the message below.</p>
	<p>Profile: <a href='".$profilePage."'>WitzKey.com</a></p>
	<p>".nl2br($message)."</p>
	</div>";
	
	$body_text = "<div style='".$font1."'>
	<p>".$name." (".$email.") sent you the message below.</p>
	<p>Profile: <a href='".$profilePage."'>WitzKey.com</a></p>
	<p>".nl2br($message)."</p>
	</div>";
	
	include('../../sendgrid/SendGrid_loader.php');
	include('../../sendgrid/sendEmail.php');
	
	$return['status'] = 'done';
	echo json_encode($return);
}

?>