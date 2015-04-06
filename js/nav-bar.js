(function(){
	
$('#menu-icon').click(function(){
	if(!$('#mobile-dropdown').hasClass('clicked')) $('#mobile-dropdown').addClass('clicked')
	else $('#mobile-dropdown').removeClass('clicked')
	$('#mobile-dropdown').toggle('slide')
})//click

$('#container').click(function(){
	if($('#mobile-dropdown').hasClass('clicked')){
		$('#mobile-dropdown').toggle('slide');
		$('#mobile-dropdown').removeClass('clicked')
	}
})//click

$(window).resize(function(){
	var screenWidth = window.innerWidth
	if(screenWidth>588) $('#mobile-dropdown').removeClass('clicked').hide()
})

//iphone is having an issue where when user focuses on inout field fixed elements are ruined.
$('textarea, input[type=password], input[type=text]').focus(function(){
	
	system = navigator.platform;
	
	if(system === 'iPad' || system === 'iPhone' || system === 'iPod'){
		
		$('#menu').css('position','absolute').css('top',0);
		$('#bottom-menu').css('display','none')
		
	}//if	
})	
$('textarea, input[type=password], input[type=text]').blur(function(){
	
	system = navigator.platform;
	
	if(system === 'iPad' || system === 'iPhone' || system === 'iPod'){
		
	$('#menu').css('position','fixed').css('top',0);
	$('#bottom-menu').css('display','block')
	//scroll page alittle just to set it back. (Had to be done with iphone)
	var offSet = $(window).scrollTop()
	$('body').animate({scrollTop:offSet+1},1)
		
	}//if
})		

	
})();