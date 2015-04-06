<!DOCTYPE html>
<html><!-- InstanceBegin template="/Templates/template1.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
<!-- InstanceBeginEditable name="EditRegion4" -->
<title>Validate</title>
<!-- InstanceEndEditable -->
<link href='css/all-pages.css' type='text/css' rel='stylesheet'/>
<link href='css/forms.css' type='text/css' rel='stylesheet'/>
<link href='css/nav-bar.css' type='text/css' rel='stylesheet'/>
<link href='fonts/ptsans/stylesheet.css' type='text/css' rel='stylesheet'/>
<link href='pics/favicon.png' rel='icon' />
<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1'/>
<!-- InstanceBeginEditable name="head" -->
<!-- InstanceEndEditable -->
</head>
<body>


<div id='menu'>
	<div id='menu-items-div' class='text2 relative'>
    	<img src='pics/menu-icon.png' id='menu-icon' class='pointer'/>
		<a href='index.html'><img id='logo' src='pics/witzkey-logo.png'/></a>
        <div id='menu-links-div'>
        	<a href='search-members.html' class='black-text-link'>Search Mentors</a>
        	<a href='member-login.html' class='black-text-link'>Login</a>
        </div>
    </div>
</div><!--menu-->

<div id='mobile-dropdown' class='weak-hide text2'>
	<a href='search-members.html' class='black-text-link'>Search Mentors</a>
    <a href='member-login.html' class='black-text-link'>Login</a>
</div><!--mobile-dropdown-->

<div id='container'>

<div id='bottom-menu' class='text2 weak-hide'>
	<a href='search-members.html' class='black-text-link'><img src='pics/search-icon.png'/></a>
    <a href='member-login.html' class='black-text-link'><img src='pics/login-arrow.png' /></a>
</div><!--bottom-menu-->
<!-- InstanceBeginEditable name="EditRegion1" -->
<?php

include('connect/connect.php');
include('connect/functions.php');
dbConnect('members');

$code = $_GET['code'];
$email = $_GET['email'];

$query = mysql_query("SELECT * FROM members WHERE email='$email' AND code2='$code' AND validated!='true'");
$numrows = mysql_num_rows($query);
if(!$numrows){
	echo "
	<div class='text2' style='line-height:24px;max-width:500px;margin:10px auto;'>
	Sorry there was an error. Please follow the link in your email again and if that doesn't work
try <a href='index.html'>regisering</a> again.
</div>
";
	return;
}//if

//make email as it is in db before puting it into login_id
$get = mysql_fetch_assoc($query);
$email = $get['email'];
$type = $get['type'];

//remove any unvalidated user with this email if that user doesn't have a pending
$query = mysql_query("SELECT * FROM members WHERE email='$email' AND code2!='$code'");
while($get_array = mysql_fetch_array($query)){
	$code2Invalid = $get_array['code2'];
	mysql_query("DELETE FROM member_info WHERE code2='$code2Invalid'");
	$query2 = mysql_query("SELECT * FROM member_images WHERE code2='$code2Invalid'");//remove images
	$get2 = mysql_fetch_assoc($query2);
	$folder = $get2['folder'];
	$imageFolder = scandir("pics/".$folder);
	foreach($imageFolder as $image){
		unlink("pics/".$folder."/".$image);
	}//foreach
	rmdir("pics/".$folder);
	mysql_query("DELETE FROM member_images WHERE code2='$code2Invalid'");
}//while
mysql_query("DELETE FROM members WHERE email='$email' AND code2!='$code'");
mysql_query("DELETE FROM login_id WHERE email='$email'");

mysql_query("UPDATE members SET validated='true' WHERE email='$email'");

//create login id
while(true){
	$loginID = hash('sha256',mt_rand(1,1000000));
	$key = hash('sha256',mt_rand(1,1000000));
	$query = mysql_query("SELECT * FROM login_id WHERE login_id='$loginID' AND _key='$key'");
	$numrows = mysql_num_rows($query);
	if(!$numrows){
		mysql_query("INSERT INTO login_id VALUES ('','$email','$loginID','$key','')");
		mysql_query("INSERT INTO login_id VALUES ('','$email','$loginID','$key','mobile')");//for mobile
		break;
	}//if
}//while

$return['i'] = $loginID;
$return['k'] = $key;

echo "
<script src='sjcl-master/sjcl.js'></script>

<script>
var i = sjcl.encrypt('".$key."','".$loginID."')
//set localStorage
localStorage.setItem('k','".$key."');
localStorage.setItem('i',i);

if('".$type."'=='mentor') localStorage.setItem('mentorInstruction','true')

window.location = 'login/".$type.".html';
</script>
";

?>

<!-- InstanceEndEditable -->
</div><!--container-->


</body>
<script src='js/jquery.js'></script>
<script src='js/fastclick.js'></script>
<script src='js/functions.js'></script>
<script src='sjcl-master/sjcl.js'></script>
<script src='js/nav-bar.js'></script>
<script src='phonegap.js'></script>
<!-- InstanceBeginEditable name="EditRegion2" -->

<!-- InstanceEndEditable -->
<!-- InstanceEnd --></html>