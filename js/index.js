(function(){	

//send to profile if logged in
var type = localStorage.getItem('type')
if(mobile && getZ() && type && typeof type!=='undefined') window.location = 'login/'+type+'.html'

if(!mobile) $('#app-store-link').removeClass('hide')

//get user's ip
cb = function(o){
	localStorage.setItem('ip',o.ip)
	$('[name="IPAddress"]').val(o.ip)
}
	
$('#register').submit(function(e){
	e.preventDefault()	
	
	var name = $('[name="name"]').val().trim()
	var email = $('[name="email"]').val().trim()
	var password = $('[name="password"]').val()
	var repeatPassword = $('[name="repeat-password"]').val()
	var memberType = '';
	if($('#mentee-select').is(':checked')) memberType = 'mentee';
	if($('#mentor-select').is(':checked')) memberType = 'mentor';
	var error = false;
	
	//reset everything
	$('#register span').removeClass('red-text')
	$('#email-span').html('Email')
	$('#password-span').html('Password')
	$('#repeat-password-span').html('Repeat Password')
	hideMessage()
	
	if(!name && !email && !password && !repeatPassword) return;
	
	if(!name){ $('#name-span').addClass('red-text'); error=true}
	if(!email){ $('#email-span').addClass('red-text'); error=true}
	if(email && !email.match(/^[_a-z0-9-]+(\.[_a-z0-9+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)){ $('#email-span').html('Email not valid').addClass('red-text'); error=true}
	if(!password){ $('#password-span').addClass('red-text'); error=true}
	if(password && password.length<6){ $('#password-span').html('Must be at least 6 characters').addClass('red-text'); error=true}
	if(!repeatPassword){ $('#repeat-password-span').addClass('red-text'); error=true}
	if(repeatPassword && repeatPassword!=password){ $('#repeat-password-span').html("Passwords don't match").addClass('red-text'); error=true}
	if(!memberType){ $('#which-kind-span').addClass('red-text'); error=true}
	
	if(error == true) showMessage("Please correct error(s)",true,'white')
	if(error == false){
		showMessage("<img src='pics/ajax-loader3.gif' id='register-loader'/>",false,'')
		
		var formData = $('form').serialize()
		
		var path = getPostPath('http://witzkey.com/')
		
		$.ajax({
			
			url:path+'queries/register.php',
			type:'POST',
			data:formData,
			dataType:'json',
			success:function(data){
		
				switch(data.status){
					case 'email':
					showMessage("That email is in use",true,"white")
					break;
					case 'check email':
					showMessage("Please check your email",true,"white")
					break;
					case 'done':
					//this makes sure mentors know what to do when then sign up
					if(memberType=='mentor') localStorage.setItem('mentorInstruction','true')
					var i = sjcl.encrypt(data.k,data.i)
					//set localStorage
					localStorage.setItem('k',data.k);
					localStorage.setItem('i',i);
					if(mobile) localStorage.setItem('email',email)
					window.location = 'login/'+memberType+'.html';
					break;
				}//switch
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				
			}
		})//ajax
		
	}//if error == false

})//submit	
	
})();