<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$email = validateUser();
$input = cleanInput($_POST['input']);
$field = cleanInput($_POST['field']);

$code2 = getCode2($email);

if($field=='school'){//add school to json
	$query = mysql_query("SELECT * FROM member_info WHERE code2='$code2'");
	$get = mysql_fetch_assoc($query);
	$schoolJson = $get['school'];
	$schoolArray = json_decode($schoolJson,true);
	unset($schoolArray['school']);
	if($input=='no school'){//not in school was selected by user
		$schoolArray['in school'] = 'no';
	}//if
	else{
		$schoolArray['school'] = $input;
		$schoolArray['in school'] = 'yes';
	}
	$schoolJson = json_encode($schoolArray);
	$input = $schoolJson;
}//if

if($field=='practice_location'){//format location 
	$inputArray = explode(',',$input);
	$city = trim($inputArray[0]);
	$state = trim($inputArray[1]);
	$input = $city.', '.$state;
	
	//get long and lat
	$query = mysql_query("SELECT * FROM member_info WHERE practice_location='$input' AND lat!='' AND lon!=''");//if coordinates are in db already get that
	$numrows = mysql_num_rows($query);
	if($numrows){
	$get = mysql_fetch_assoc($query);
	$long = $get['lon'];
	$lat = $get['lat'];	
	}
	else{//else use google's api
	$input2 = str_ireplace(' ','+',$city).',+'.str_ireplace(' ','+',$state);
	$longLatJson = file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$input2.'&sensor=false');
	$longLatArray = json_decode($longLatJson,true);
	$long = $longLatArray['results'][0]['geometry']['location']['lng'];
	$lat = $longLatArray['results'][0]['geometry']['location']['lat'];
	}//else
	mysql_query("UPDATE member_info SET practice_location='$input', lat='$lat', lon='$long' WHERE code2='$code2'");
}//if

mysql_query("UPDATE member_info SET ".$field."='$input' WHERE code2='$code2'");

$return['result'] = 'done';

echo json_encode($return);

?>