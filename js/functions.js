function getZ(){
	var k = localStorage.getItem('k')	
	var i = localStorage.getItem('i')
	if(k && i){
	var z = sjcl.decrypt(k,i)
	return z	
	}
	else return ''	
}
function getK(){
	var k = localStorage.getItem('k')
	return k
}
function showMessage(message,close,background){
	$('#dark-background').removeClass('hide')
	$('#message-canvas-container').removeClass('hide')
	$('#message-text').html(message); 
	$('#message-canvas').addClass(background+'-background'); 
	if(close) $('#close-x').removeClass('hide')
}
function hideMessage(){
	$('#dark-background').addClass('hide')
	$('#message-canvas-container').addClass('hide')
	$('#message-text').html(''); 
	$('#message-canvas').removeClass(); 
	$('#close-x').addClass('hide')
}
function pathToRoot(){
	path = document.location.href
	//if in login folder
	if(path.indexOf('/login')>0){
		path = path.split('/login')[1]
		path = path.split('?')[0]//clean it
		position = path.match(/\//g).length;
		x=1;
		truePosition = '';
		while(x<=position){
			truePosition += '../';
			x++
		}//while
		return truePosition
	}//if
	else return '';
}
$('#close-x').click(function(){
	
	$('#dark-background').addClass('hide')
	$('#message-canvas-container').addClass('hide')
	$('#close-x').addClass('hide')
	$('#message-canvas').removeClass()
	$('#message-text').html('')
	
})//click

function getPostPath(path){
	if(mobile) postPath = path;
	else postPath = '';
	return postPath;
} 

function checkMobileUpload(imageDiv,loader,messageDiv,zDiv){
	var z = getZ()
	var x = 0
	var currentImageUrl = $('#'+imageDiv).css('background-image')
	var currentImageArray = currentImageUrl.split('/')
	var currentImage = currentImageArray[currentImageArray.length-1].replace(')','');

	var checkInterval = setInterval(function(){
	var currentImageUrl = $('#'+imageDiv).css('background-image')
	var currentImageArray = currentImageUrl.split('/')
	var currentImage = currentImageArray[currentImageArray.length-1].replace(')','');	

	$.post('http://brainbagel.com/login/queries/check-mobile-upload.php',
	{z:z,image:'profile'},
	function(data){
	
	if(currentImage!=data.profileImage){
		$('#'+imageDiv).css('background-image','url(../pics/'+data.folder+'/'+data.profileImage+')')
		$('#'+loader).addClass('hide')
		clearInterval(checkInterval)
	}//if
	
	},'json')
	x++
	if(x==15){
	$('#'+messageDiv).html('Error')
	$('#'+loader).addClass('hide')
	$('#'+zDiv).val('')
	clearInterval(checkInterval)
	}//if
	},1000)//setInterval
}//function

var mobile = '';
mobile = true;