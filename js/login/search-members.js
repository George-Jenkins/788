(function(){
//get ip
cb = function(o){
	localStorage.setItem('ip',o.ip)
}
//fill in location on load
var path = getPostPath('http://witzkey.com/login/')
path += pathToRoot()

var z = getZ()
if(z){//get practice location if logged in
	$.post(path+'login/queries/search-members.php',{load:'load',z:z},function(data){
	if(!$('#search-area-input').val()) $('#search-area-input').val(data.location)
	},'json')
}//if
else{//else get ip
	var ip = localStorage.getItem('ip')
	$.post(path+'login/queries/search-members.php',{load:'load',ip:ip},function(data){
		if(!$('#search-area-input').val()) $('#search-area-input').val(data.location)	
	},'json')//post
}//else


$('#submit-form').click(function(){
		
	var path = getPostPath('http://witzkey.com/login/')
	path += pathToRoot()	
		
	var searchArea = $('#search-area-input').val()
	var profession = $('#profession-input').val()
	
	if(!searchArea || !profession) return;
	
	$('#form-loader').removeClass('hide')
		
	$.post(path+'login/queries/search-members.php',
	{searchArea:searchArea,
	profession:profession},
	function(data){
		
		$('#form-loader').addClass('hide')	
		$('html, body').animate({scrollTop:$('.general-form-container').offset().top},200)
		$('#search-results-div').html(data.result)
		showProfile()
	},'json')
		
})//click

$(window).scroll(function(){
	showProfile()
})//scroll

//shows profile picture if in view
function showProfile(){
	var screenHeight = window.innerHeight
	var windowOffset = $(window).scrollTop()
	$('.list-profile-image').each(function(){
		var objectOffset = $(this).offset().top - windowOffset//must subtract window's scrollTop from objects offset (distance to top of page) to get object's scrollTop
		if(objectOffset<screenHeight) $(this).removeClass('no-background')
	})	
}
	
})();