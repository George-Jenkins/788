<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$email = validateUser();

$id = $_POST['id'];

if($id){
	$query = mysql_query("SELECT * FROM members WHERE id='$id'");
	$get = mysql_fetch_assoc($query);
	$email = $get['email'];
}//if

$code2 = getCode2($email);

//get name
$query = mysql_query("SELECT * FROM members WHERE email='$email' AND validated!='pending'");
$get = mysql_fetch_assoc($query);
$return['name'] = ucwords($get['name']);

//get profile image
$query = mysql_query("SELECT * FROM member_images WHERE code2='$code2'");
$get = mysql_fetch_assoc($query);
$folder = $get['folder'];
$imageJson = $get['images_json'];
$imageArray = json_decode($imageJson,true);
$image = $imageArray['profile'];

$domain = getDomain();

if($image) $path = $domain."/pics/".$folder."/".$image;
else $path = $domain."/pics/profile-icon.png";

$return['image'] = $path;

$query = mysql_query("SELECT * FROM member_info WHERE code2='$code2'");
$get = mysql_fetch_assoc($query);
$return['profession'] = $get['profession'];
$return['location'] = $get['practice_location'];
$return['background'] = nl2br($get['background']);
$schoolJson = $get['school'];

$schoolArray = json_decode($schoolJson,true);
$return['inSchool'] = $schoolArray['in school'];
$return['school'] = $schoolArray['school'];

echo json_encode($return);

?>