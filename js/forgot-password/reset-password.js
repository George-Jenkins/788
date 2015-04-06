(function(){

$('#submit-form').click(function(){
	
	var email = $('#email').val()
	var password = $('#new-password').val()
	var repeatPassword = $('#repeat-password').val()
	var code = $('#code').val()
	var error = false;
	
	if(!password || !repeatPassword) return;
	
	if(!code || !email){ $('#form-message-text').html('Error'); return}
	
	//reset everything 
	$('#password-div').html('Password').removeClass('red-text')
	$('#repeat-password-div').html("Repeat password").removeClass('red-text');
	
	if(password.length<6){ $('#password-div').html('At least 6 characters please').addClass('red-text'); error=true}
	if(password!=repeatPassword){ $('#repeat-password-div').html("Passwords don't match").addClass('red-text'); error=true}
	
	if(error==true) return;
	
	$('#form-loader').removeClass('hide');
	$('#form-message-text').html('');
	
	var path = getPostPath('http://witzkey.com/')
	
	$.post(path+'queries/forgot-password/reset-password.php',{email:email, password:password, code:code},function(data){
		
		$('#form-loader').addClass('hide');
		
		switch(data.status){
			case 'code': 
			$('#form-loader').addClass('hide');
			$('#form-message-text').html("Error. Try the link in your email again.");
			break;
			case 'done': 
			$('#form-loader').addClass('hide');
			$('#form-message-text').html('Success!');
			$('#new-password').val('')
			$('#repeat-password').val('')
			break;
		}//switch
		
	},'json')//post
	
})//click
	
})();