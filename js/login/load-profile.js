(function(){

//if mentor and first time signing in..
if(localStorage.getItem('mentorInstruction')){
	message = "Feel free to edit your profile page as you wait for mentees to contact you.";
	showMessage(message,true,'white')
	localStorage.removeItem('mentorInstruction')
}//if
//get member id
var url = document.location.href
var getArray = url.split("?")
var getString = getArray[1]
if(getString){
	var idArray = getString.split('id=')
	var id = idArray[1]
	var id = id.split('&')
	var id = id[0];
	$('#contact-button').attr('href','contact-member.html?id='+id).removeClass('hide')
}
else{ id = ''; $('.edit-option').removeClass('hide')}

var z = getZ()

var path = getPostPath('http://witzkey.com/login/')

$.post(path+'queries/load-profile.php',{z:z, id:id},function(data){
	$('#profile-name, #profile-name2').html(data.name)
	$('#profile-image').css('background-image','url('+data.image+')')
	$('#profession').html(data.profession)
	$('#practice-location').html(data.location)
	if(data.inSchool=='yes') $('#in-school-yes').click()
	if(data.inSchool=='no') $('#in-school-no').click()
	$('#school').html(data.school)
	$('#background').html(data.background)
},'json')//post
	
})();

