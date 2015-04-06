<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$loginID = $_POST['z'];
$key = $_POST['k'];

$query = mysql_query("SELECT * FROM login_id WHERE login_id='$loginID' AND _key='$key'");

$numrows = mysql_num_rows($query);

if($numrows) $return['login'] = 'true';
else $return['login'] = 'false';

//get member type
if($numrows){
	$get = mysql_fetch_assoc($query);
	$email = $get['email'];
	$query = mysql_query("SELECT * FROM members WHERE email='$email'");
	$get = mysql_fetch_assoc($query);
	$type = $get['type'];
	$return['type'] = $type;
}

echo json_encode($return);

?>