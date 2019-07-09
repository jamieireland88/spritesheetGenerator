var dropzone;
var frames = [];
var imgFiles = [];
function setup()
{
	noCanvas();
	background(0);
	dropzone = document.getElementById('dropzone');

	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	  dropzone.addEventListener(eventName, preventDefaults, false)
	});

	['dragenter', 'dragover'].forEach(eventName => {
	  dropzone.addEventListener(eventName, highlight, false)
	});

	['dragleave', 'drop'].forEach(eventName => {
	  dropzone.addEventListener(eventName, unhighlight, false)
	});
	dropzone.addEventListener('drop', handleDrop, false)

	document.getElementById('generateButton').addEventListener('click', handleGenerate, false);
}

function highlight()
{
	$(dropzone).css({
		background: '#c0c0c0',		
	});
}

function unhighlight()
{
	$(dropzone).css({
		background: 'transparent',		
	});
}

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

function handleFiles(files)
{
	for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!file.type.startsWith('image/')){ continue }
    
	const img = document.createElement("img");    
    img.file = file;
    img.addEventListener('load', function(){ 
    	var canvas = document.createElement('canvas'); 
    	canvas.setAttribute('width', img.width); 
    	canvas.setAttribute('height', img.height);    	
    	//document.body.append(canvas);
    	var ctx = canvas.getContext('2d');  	
    	ctx.drawImage(img, 0, 0);
    	frames.push(canvas);
    });

    const reader = new FileReader();
    reader.onload = (function(aImg) 
    { 
    	return function(e) 
    	{ 
    		aImg.src = e.target.result; 
    		imgFiles.push(e.target.result);
    		handleUI();
    	}; 
	})(img);

    reader.readAsDataURL(file);
  }
}

function handleUI()
{

	document.getElementById('numOfRows').value = 1;
	document.getElementById('numOfCols').value = imgFiles.length;
	document.getElementById('numOfFrames').value = imgFiles.length;
}

function handleGenerate()
{
	if(document.getElementById('numOfFrames').value <= 0)
	{
		alert('No frames loaded');
		return;
	}

	if(document.getElementById('numOfRows').value * document.getElementById('numOfCols').value != document.getElementById('numOfFrames').value)
	{
		alert('Invalid Rows/Cols arrangement');
		return;
	}

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var width = 0;
	var height = 0;
	var pos = [];
	frames.forEach(function(content, index){	
		pos.push({x: width, y: 0});	
		width += parseInt(content.getAttribute('width'));
		if(parseInt(content.getAttribute('height')) > height)
			height = parseInt(content.getAttribute('height'));	
	});

	canvas.setAttribute('width', width); 
    canvas.setAttribute('height', height);

	frames.forEach(function(content, index){
		ctx.drawImage(content, pos[index].x, pos[index].y);
	});	
	
	var d=canvas.toDataURL("image/png");
	var w=window.open('about:blank');
	w.document.write("<img src='"+d+"' alt='from canvas'/>");	
}






