<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$loginID = $_POST['z'];
$ip = $_POST['ip'];

$searchArea = $_POST['searchArea'];
$profession = $_POST['profession'];

//get city state on load
if($_POST['load'] && $loginID){
	$email = getEmail();
	$code2 = getCode2($email);
	$query = mysql_query("SELECT * FROM member_info WHERE code2='$code2'");
	$get = mysql_fetch_assoc($query);
	$location = $get['practice_location'];
	if($location) $return['location'] = $location;
	else $return['location'] = 'City, State';
	echo json_encode($return);
	return;
}//if
elseif($_POST['load'] && $ip){
	$ch = curl_init('http://geoplugin.net/php.gp?ip='.$ip);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$locationArray = unserialize(curl_exec($ch));
	curl_close($ch);
	$city = $locationArray['geoplugin_city'];
	$state = $locationArray['geoplugin_region'];
	if($city && $state) $return['location'] = $city.', '.$state;
	else $return['location'] = 'City, State';
	echo json_encode($return);
	return;
}//if

//get long and lat
$query = mysql_query("SELECT * FROM member_info WHERE practice_location='$searchArea' AND lat!='' AND lon!=''");//if coordinates are in db already get that
$numrows = mysql_num_rows($query);
if($numrows){
	$get = mysql_fetch_assoc($query);
	$long = $get['lon'];
	$lat = $get['lat'];	
}
else{//else use google's api
	$searchArea2 = str_ireplace(' ','+',$searchArea);
	$longLatJson = file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$searchArea2.'&sensor=false');
	$longLatArray = json_decode($longLatJson,true);
	$long = $longLatArray['results'][0]['geometry']['location']['lng'];
	$lat = $longLatArray['results'][0]['geometry']['location']['lat'];
}//else

if($long && $lat){
	$minLat = $lat-2;
	$maxLat = $lat+2;
	$minLong = $long-2;
	$maxLong = $long+2;
	$query = mysql_query("SELECT * FROM member_info WHERE profession LIKE '%$profession%' AND type='mentor' AND lat>=$minLat AND lat<=$maxLat AND lon>=$minLong AND lon<=$maxLong");
}
else $query = mysql_query("SELECT * FROM member_info WHERE profession LIKE '%$profession%' AND type='mentor' AND practice_location='$searchArea'");

while($get_array = mysql_fetch_array($query)){
	
	$profession = $get_array['profession'];
	$practiceLocation = $get_array['practice_location'];
	
	$code2 = $get_array['code2'];
	$query2 = mysql_query("SELECT * FROM members WHERE code2='$code2'");
	$get2 = mysql_fetch_assoc($query2);
	$name = ucwords($get2['name']);
	$id = $get2['id'];
	
	//get profile image
	$query2 = mysql_query("SELECT * FROM member_images WHERE code2='$code2'");
	$get2 = mysql_fetch_assoc($query2);
	$folder = $get2['folder'];
	$imagesJson = $get2['images_json'];
	$imagesArray = json_decode($imagesJson,true);
	$profileImage = $imagesArray['profile'];
	$domain = getDomain();
	if($profileImage) $path = $domain."/pics/".$folder."/".$profileImage;
	else $path = $domain."/pics/profile-icon.png";
	
	$link = '../login/mentor.html?id='.$id;
	
	$result .= "
	<div class='member-list-div left'>
		<div class='inline list-profile-image standard-background no-background' style='background-image:url(".$path.")'></div>
		<div class='inline'>
			<div class='text'><a href='".$link."'>".$name."</a></div>
			<div class='text'>".$practiceLocation."</div>
			<div class='text'>".$profession."</div>
		</div>
	</div>
	"; 
}//while

if(!$result) $result = '<div class="text">No results</div>';

$return['result'] = $result;

echo json_encode($return);

?>