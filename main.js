const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let image = null;

function canvasSetup() {
  c.width = 500;
  c.height = 500;

  ctx.fillStyle = "grey"
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.font="36px Impact";
  ctx.textAlign = "center";
  ctx.fillStyle = "white"
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
}
canvasSetup();

//Event listeners
const randomImg = document.getElementById("random-button");
randomImg.addEventListener( 'click', getRandomMeme);

const upload = document.getElementById("file");
upload.addEventListener( 'change', handleFileSelect, false);

const urlInput = document.getElementById("url");
urlInput.addEventListener('input', () => drawImage(urlInput.value));

const topText = document.getElementById("top-text");
topText.addEventListener('input', redrawMeme);
const bottomText = document.getElementById("bottom-text");
bottomText.addEventListener('input', redrawMeme);

const download = document.getElementById("download");
download.addEventListener('click', downloadMeme);


function drawImage(url) {
  image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  image.onload = () => redrawMeme();
}

function getRandomMeme() {
  fetch("https://api.imgflip.com/get_memes")
    .then( res => res.json())
    .then( data => {
      const meme = data.data.memes[Math.floor(Math.random() * 100)];
      drawImage(meme.url);
    })
}

function handleFileSelect(evt) {
  const file = evt.target.files[0]
  let reader = new FileReader();
  reader.readAsDataURL(file)

  reader.onload = (fileObject) => {
    const data = fileObject.target.result;
    drawImage(data);
  }
}

function redrawMeme() {
  //Clear the screen
  ctx.fillRect(0, 0, c.width, c.height);

  //Redraw the image
  if (image != null)
    ctx.drawImage(image, 0, 0, c.width, c.height);

  //Draw top and bottom text
  ctx.fillText( topText.value, c.width / 2, 40);
  ctx.strokeText( topText.value, c.width / 2, 40);
  ctx.fillText( bottomText.value, c.width / 2, c.height - 20);
  ctx.strokeText( bottomText.value, c.width / 2, c.height - 20);

}

function downloadMeme() {
  const link = document.getElementById('link');
  link.download = 'meme.png';
  link.href = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
  link.click();
}
