<?php
include('../../connect/connect.php');
include('../../connect/functions.php');
dbConnect('members');

$email = validateUser();

$imageName = $_FILES['image']['name'];
$imageTmpName = $_FILES['image']['tmp_name'];
$imageError = $_FILES['image']['error'];

$code2 = getCode2($email);

if($imageError>0 || getimagesize($imageTmpName)===FALSE){
	echo "
	<script>
	parent.imageFeedBack('not image','profile-image-message')
	</script>
	";
	return;
}//if

$folder = getImageFolder($email);

//rename image
while(true){
	$extension = end(explode('.',$imageName));
	$newName = mt_rand().mt_rand().'.'.$extension;
	$contents = scandir('../../pics/'.$folder);
	$match = false;
	foreach($contents as $image){
		if($image==$newName) $match = true;
	}
	if($match==false) break;
}//while

//add image to db
$query = mysql_query("SELECT * FROM member_images WHERE code2='$code2'");
$get = mysql_fetch_assoc($query);
$imagesJson = $get['images_json'];
$imagesArray = json_decode($imagesJson,true);
unlink("../../pics/".$folder."/".$imagesArray['profile']);//delete old image in folder
unset($imagesArray['profile']);//remove old profile
$imagesArray['profile'] = $newName;
$imagesJson = json_encode($imagesArray);
mysql_query("UPDATE member_images SET images_json='$imagesJson' WHERE code2='$code2'");

//add image to folder
$path = '../../pics/'.$folder.'/'.$newName;
move_uploaded_file($imageTmpName,$path);
//resize image
ak_img_resize($path,$path, 400, 400, $extension);

echo "
<script>
parent.imageFeedBack('done','../pics/".$folder."/".$newName."')
</script>
";

?>