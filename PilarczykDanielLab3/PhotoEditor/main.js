let photoCanvas;
let photoCanvasCtx;
let originalPixels;
let processedPixels;
let brightnessInput;
let contrastInput;

PreapreCanvas();
InitInputs();

document.getElementById('fileUpload').onchange = function(e) {
  var tgt = e.target || window.event.srcElement,
      files = tgt.files;
      if (FileReader && files && files.length) {
          var fr = new FileReader();
          fr.onload = function () {
            console.log(fr);
              document.getElementById('source').src = fr.result;
              setTimeout(function() {
                photoCanvasCtx.filter = 'none';
                photoCanvasCtx.drawImage(document.getElementById('source'), 0, 0, photoCanvas.width, photoCanvas.height);
                originalPixels = photoCanvasCtx.getImageData(0, 0, photoCanvas.width, photoCanvas.height).data;
              }, 300);
          }
          fr.readAsDataURL(files[0]);
      }
};

function PreapreCanvas() {
    photoCanvas = document.createElement('canvas');
    photoCanvas.id = 'canvas-scene';
    photoCanvas.width = 860;
    photoCanvas.height = 640;

    photoCanvasCtx = photoCanvas.getContext('2d');

    document.querySelector('#canvas-container').appendChild(photoCanvas);
}

function InitInputs() {
    brightnessInput = document.querySelector('#brightness');
    contrastInput = document.querySelector('#contrast');
}

function ApplyFilters() {
    processedPixels = [...originalPixels];

    ChangeBrightness();
    ChangeContrast();
}

function ChangeBrightness() {
    let brightness = brightnessInput.value;

    for (let i = 0; i < processedPixels.length; i += 4) {
        processedPixels[i] = processedPixels[i] * brightness;
        processedPixels[i + 1] = processedPixels[i + 1] * brightness;
        processedPixels[i + 2] = processedPixels[i + 2] * brightness;
    }

    const imageData = photoCanvasCtx.createImageData(photoCanvas.width, photoCanvas.height);
    imageData.data.set(processedPixels);
    photoCanvasCtx.putImageData(imageData, 0, 0);
}

function ChangeContrast() {
    let contrast = contrastInput.value;
    contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
    var factor = (255 + contrast) / (255.01 - contrast);  //add .1 to avoid /0 error

    for (var i = 0; i < processedPixels.length; i += 4)  //pixel values in 4-byte blocks (r,g,b,a)
    {
        processedPixels[i] = factor * (processedPixels[i] - 128) + 128;     //r value
        processedPixels[i + 1] = factor * (processedPixels[i + 1] - 128) + 128; //g value
        processedPixels[i + 2] = factor * (processedPixels[i + 2] - 128) + 128; //b value
    }

    const imageData = photoCanvasCtx.createImageData(photoCanvas.width, photoCanvas.height);
    imageData.data.set(processedPixels);
    photoCanvasCtx.putImageData(imageData, 0, 0);
}
