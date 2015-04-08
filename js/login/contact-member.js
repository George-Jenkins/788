(function(){

//get member id
var url = document.location.href
var getArray = url.split("?")
var getString = getArray[1]
if(getString){
	var idArray = getString.split('id=')
	var id = idArray[1]
	var id = id.split('&')
	var id = id[0];	
}
else window.location = 'mentee.html';

var z = getZ()
//get profile info of member being contacted
var path = getPostPath('http://witzkey.com/login/')
$.post(path+'queries/contact-member.php',{z:z,id:id},function(data){
	$('#contact-name').html(data.contact)
	$('#profile-image-div').css('background-image','url('+data.imagePath+')')
},'json')//post

$('#submit-form').click(function(){
	var message = $('#message-textarea').val()
	if(!message) return;
	
	$('#form-loader').removeClass('hide')
	$('#form-message-text').html('')
	
	var path = getPostPath('http://witzkey.com/login/')
	
	$.post(path+'queries/contact-member.php',{z:z, id:id, message:message},function(data){
		
		$('#form-loader').addClass('hide')
		
		switch(data.status){
			case 'done':
			$('#form-message-text').html('Sent!')
			$('#message-textarea').val('');
			break;
		}//switch
		
	},'json')
})

})();