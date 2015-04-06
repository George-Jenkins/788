(function(){
	
$('#submit-form').click(function(){
	
	var path = getPostPath('http://witzkey.com/')
	
	var email = $('#email-for-password').val()
	
	if(!email) return;
	
	$('#form-loader').removeClass('hide');
	$('#form-message-text').html('');
	
	$.post(path+'queries/forgot-password/forgot-password.php',{email:email},function(data){
		
		$('#form-loader').addClass('hide');
		
		switch(data.status){
			case 'email': 
			$('#form-loader').addClass('hide');
			$('#form-message-text').html('Wrong email');
			break;
			case 'done': 
			$('#form-loader').addClass('hide');
			$('#form-message-text').html('Check your email');
			break;
		}//switch
		
	},'json')//post
	
})//click

})();