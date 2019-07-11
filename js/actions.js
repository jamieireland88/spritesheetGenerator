var dropzone;
var frames = [];
var imgFiles = [];
var finalCanvas;
var previewImage;
function setup()
{
	noCanvas();
	background(0);
	dropzone = document.getElementById('dropzone');

	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	  dropzone.addEventListener(eventName, preventDefaults, false);
	});
	document.getElementById('viewer').addEventListener('contextmenu', preventDefaults, false);

	['dragenter', 'dragover'].forEach(eventName => {
	  dropzone.addEventListener(eventName, highlight, false);
	});

	['dragleave', 'drop'].forEach(eventName => {
	  dropzone.addEventListener(eventName, unhighlight, false);
	});
	dropzone.addEventListener('drop', handleDrop, false);

	document.getElementById('generateButton').addEventListener('click', handleGenerate, false);

	document.getElementById('numOfRows').addEventListener('change', handleRowChange, false);
	document.getElementById('numOfCols').addEventListener('change', handleColChange, false);
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
  setTimeout(generatePreview, 500);
}

function handleUI()
{
	document.getElementById('numOfRows').value = 1;
	document.getElementById('numOfCols').value = imgFiles.length;
	document.getElementById('numOfFrames').value = imgFiles.length;
}

function handleRowChange()
{
	if(document.getElementById('numOfFrames').value <= 0)
	{
		alert('No frames loaded');
		document.getElementById('numOfCols').value = 0;
		document.getElementById('numOfRows').value = 0;
		return;
	}
	var newVal = parseInt(document.getElementById('numOfRows').value);

	if(newVal >= parseInt(document.getElementById('numOfFrames').value))
	{
		newVal = parseInt(document.getElementById('numOfFrames').value);
		document.getElementById('numOfRows').value = document.getElementById('numOfFrames').value;
	}

	var newColVal = parseInt(document.getElementById('numOfFrames').value) / newVal;
	document.getElementById('numOfCols').value = newColVal;
	generatePreview();
}

function handleColChange()
{
	if(document.getElementById('numOfFrames').value <= 0)
	{
		alert('No frames loaded');
		document.getElementById('numOfCols').value = 0;
		document.getElementById('numOfRows').value = 0;
		return;
	}
	var newVal = parseInt(document.getElementById('numOfCols').value);
	
	if(newVal >= parseInt(document.getElementById('numOfFrames').value))
	{
		newVal = parseInt(document.getElementById('numOfFrames').value);		
		document.getElementById('numOfCols').value = document.getElementById('numOfFrames').value;
	}

	var newRowVal = parseInt(document.getElementById('numOfFrames').value) / newVal;
	document.getElementById('numOfRows').value = newRowVal;
	generatePreview();
}

function generatePreview()
{
	finalCanvas = document.createElement('canvas');
	var ctx = finalCanvas.getContext('2d');
	var width = parseInt(frames[0].getAttribute('width'));
	var height = parseInt(frames[0].getAttribute('height'));;
	var cols = parseInt(document.getElementById('numOfCols').value);
	var rows = parseInt(document.getElementById('numOfRows').value);
	var pos = [];
	var currTop = 0;
	var currLeft = 0;
	frames.forEach(function(content, index){

		if(index % cols == 0)
		{
			currLeft = 0;
			if(index != 0)
				currTop += height;
		}	

		pos.push({x: currLeft, y: currTop});
		currLeft += width;						
	});

	finalCanvas.setAttribute('width', width * cols); 
    finalCanvas.setAttribute('height', height * rows);

	frames.forEach(function(content, index){
		ctx.drawImage(content, pos[index].x, pos[index].y);
	});	
	
	if(previewImage)
		$(previewImage).remove();

	var d=finalCanvas.toDataURL("image/png");
	previewImage = document.createElement('img');
	previewImage.setAttribute('src', d);
	previewImage.setAttribute('id', 'previewImage');
	document.getElementById('viewer').append(previewImage);		
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

	var d=finalCanvas.toDataURL("image/png");
	var w=window.open('about:blank');
	w.document.write("<img src='"+d+"' alt='from canvas'/>");
}






