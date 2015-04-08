(function(){ 

//check if logged in
if(!getZ()){
	sessionStorage.setItem('lastPage',document.location.href);
	var path = pathToRoot() 
	window.location = path+"member-login.html"
	return;	
}

function checkLogin(){
	var z = getZ()
	var k = getK()
	var path = getPostPath('http://witzkey.com/')
	path += pathToRoot()
	
	//set link to profile
	$('.profile-link').attr('href',localStorage.getItem('type')+'.html')
	
	$.post(path+'login/queries/check-login.php',{k:k, z:z},function(data){
		//make sure link is set for profile
		localStorage.setItem('type',data.type)
		$('.profile-link').attr('href',data.type+'.html')
		
		
		if(data.login=='false'){
			
		showLoginMessage()
		
		}//if
	},'json')//post
}

//function to show message and clear interval
var showLoginMessage = function(){
	var path = pathToRoot()
	var message = "You aren't logged in <a href='"+path+"member-login.html' id='not-logged-in-message'>Click here</a>";
	showMessage(message,false,'white')
	clearInterval(checkIDInterval)
	sessionStorage.setItem('lastPage',document.location.href);
}

//check if logged in
checkLogin()

//keep checking login
checkIDInterval = setInterval(function(){
	checkLogin()
},1000)
	
})();