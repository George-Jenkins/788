(function(){

//unset last login
localStorage.removeItem('k');
localStorage.removeItem('i');

var lastEmail = localStorage.getItem('email')
if(lastEmail) $('#email').val(lastEmail)

$('#login-form').submit(function(e){

	e.preventDefault()

	var email = $('#email').val().trim()
	var password = $('#password').val()
	
	if(!email || !password) return;	
	
	$('#form-loader').removeClass('hide')
	$('#form-message-text').html('')
	
	if(mobile) platform = 'mobile';
	else platform = '';
	
	var path = getPostPath('http://witzkey.com/')
	
	$.post(path+'queries/login.php',{email:email, password:password, platform:platform},function(data){
		
		$('#form-loader').addClass('hide')
		
		switch(data.status){
			case 'error': 
			$('#form-message-text').html('Wrong login info'); 
			break;
			case 'done':
			var i = sjcl.encrypt(data.k,data.i)
			//set localStorage
			localStorage.setItem('k',data.k);
			localStorage.setItem('i',i);
			if(mobile) localStorage.setItem('email',email)
			//if on page before logged out
			var lastPage = sessionStorage.getItem('lastPage')
			if(lastPage){ sessionStorage.removeItem('lastPage'); window.location = lastPage; }
			
			else window.location = "login/"+data.memberType+".html";
			break;
		}//switch
		
	},'json')//post	
	
})//submit

})();