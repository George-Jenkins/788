(function(){

//load form
var z = getZ()

var path = getPostPath('http://witzkey.com/login/')

$.post(path+'queries/settings.php',{z:z},function(data){
	
	$('#name-field').val(data.name)
	$('#email-field').val(data.email)
	
},'json')
$('#message-text').html('Saved!')
//save settings
$('#form').submit(function(e){
	
	e.preventDefault()
	
	var z = getZ()
	
	$('#form-z').val(z)
	
	var formData = $('form').serialize()
	
	$('#form-loader').removeClass('hide')
	$('#form-message-text').html('')
	
	var path = getPostPath('http://witzkey.com/login/')
	
	$.ajax({
		
		url:path+'queries/settings.php',
		type:'POST',
		data:formData,
		dataType:'json',
		success:function(data){
			$('#form-loader').addClass('hide')
			if(data.error=='email'){$('#form-message-text').html('That email is taken'); return}
			$('#form-message-text').html('Saved!')
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			
		},
		complete:function(data){
			$('#form-z').val('')
		}
	})//ajax
	
})//submit

//delete account page
$('#yes-delete').click(function(){
	$('#form-loader').removeClass('hide')
	if(typeof checkIDInterval!=='undefined') clearInterval(checkIDInterval)
	var z = getZ()
	
	var path = getPostPath('http://witzkey.com/login/')
	
	$.post(path+'queries/settings.php',{z:z,deleting:'deleting'},function(data){
	if(data.deleted) window.location = '../index.html';	
	},'json')//post
	
})//click
	
})();