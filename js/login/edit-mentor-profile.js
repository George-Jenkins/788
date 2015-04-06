(function(){

//change profile image
$('#image-input').change(function(){
	//clear feedback
	$('#profile-image-message').html('')
	//add z to form
	var z = getZ()
	$('#z1').val(z)
	$('#image-change-loader').removeClass('hide')
	$('#profile-image-form').submit()
})//change

imageFeedBack = function(message,action){
	$('[name="z"]').val('')
	$('.image-loader').addClass('hide')
	
	switch(message){
		case 'not image': 
		$('#'+action).html('Not an image');
		
		break;
		case 'done': 
		$('#profile-image').css("background-image","url("+action+")");
		
		break;
	}//switch
	
}//function

//edit profession
$('#edit-profession').click(function(){
	openEdit('profession')
})//click
$('#done-edit-profession').click(function(){
	var z = getZ()
	var input = $('#profession-input').val()
	var field = 'profession';
	var path = getPostPath('http://witzkey.com/login/')
	$.post(path+'queries/edit-profile.php',{z:z, input:input, field:field},function(data){
	},'json')//post
	finishEdit('profession')
})//click
$('#cancel-edit-profession').click(function(){
	cancelEdit('profession')
})//click
	
//edit practice location
$('#edit-practice-location').click(function(){
	openEdit('practice-location')
})//click
$('#done-edit-practice-location').click(function(){
	var z = getZ()
	var input = $('#practice-location-input').val()
	var field = 'practice_location';
	var path = getPostPath('http://witzkey.com/login/')
	$.post(path+'queries/edit-profile.php',{z:z, input:input, field:field},function(data){
	
	},'json')//post
	finishEdit('practice-location')
})//click
$('#cancel-edit-practice-location').click(function(){
	cancelEdit('practice-location')
})//click

//edit background
$('#edit-background').click(function(){
	openEdit('background')
})//click
$('#done-edit-background').click(function(){
	var z = getZ()
	var input = $('#background-input').val()
	var field = 'background';
	var path = getPostPath('http://witzkey.com/login/')
	$.post(path+'queries/edit-profile.php',{z:z, input:input, field:field},function(data){
		
	},'json')//post
	finishEdit('background')
})//click
$('#cancel-edit-background').click(function(){
	cancelEdit('background')
})//click

function openEdit(target){
	var currentInput = $('#'+target).html()
	$('#'+target).addClass('hide')
	$('#edit-'+target).addClass('hide');
	$('#done-edit-'+target).removeClass('hide')
	$('#cancel-edit-'+target).removeClass('hide')
	$('#'+target+'-input').val(currentInput.replace(/<br\s*\/?>/g, '\n')).removeClass('hide')	
}//function
function finishEdit(target){
	var input = $('#'+target+'-input').val()
	$('#'+target).html(input.replace(/\n/g, '<br />')).removeClass('hide')
	$('#edit-'+target).removeClass('hide')
	$('#done-edit-'+target).addClass('hide')
	$('#cancel-edit-'+target).addClass('hide')
	$('#'+target+'-input').val('').addClass('hide')
}//function
function cancelEdit(target){
	$('#'+target).removeClass('hide')
	$('#edit-'+target).removeClass('hide')
	$('#done-edit-'+target).addClass('hide')
	$('#cancel-edit-'+target).addClass('hide')
	$('#'+target+'-input').val('').addClass('hide')
}//function
	
	
if(mobile){
	
$('#image-input').click(function(e){
	
e.preventDefault()	
	
navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
	sourceType : Camera.PictureSourceType.PHOTOLIBRARY 
});
function onSuccess(imageData) {
	$('#image-change-loader').removeClass('hide')
	uploadImage(imageData)
}
function onFail(message) {
    //alert('Failed because: ' + message);
}
<!--upload image-->
function uploadImage(imageData){
var z = getZ();
var options = new FileUploadOptions();
options.fileKey = "image";
options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
options.mimeType = "image/jpeg";
var params = {z:z};
options.params = params;

var win = function (r) {//this is success callback for FileTranser

checkMobileUpload('profile-image','image-change-loader','profile-image-message','z1')

}
var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
}	         
var ft = new FileTransfer();
ft.upload(imageData, encodeURI('http://witzkey.com/login/queries/change-profile-image.php'), win, fail, options);
}//uploadImage function	
})//click
}//if mobile	
	
})();

