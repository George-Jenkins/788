(function(){

$('#submit-form').click(function(){
	var message = $('#message-textarea').val()
	if(!message) return;
	
	$('#form-loader').removeClass('hide')
	$('#form-message-text').html('')
	
	var path = getPostPath('http://witzkey.com/login/')
	var z = getZ()
	$.post(path+'queries/contact.php',{z:z, message:message},function(data){
		
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