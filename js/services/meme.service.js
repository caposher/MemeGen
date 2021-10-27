'use strict';
const MOVEMENT_STEP = 10;
const RECT_PADDING = 10;
let gElCanvas;
let gCanvas;

// var gKeywords = { happy: 12, 'funny puk': 1 };
var gImgs = [{ id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['happy'] }];
var gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [_createMeme()],
};

function createCanvas() {
  // change canvas size
  gElCanvas = document.querySelector('.canvas');
  gElCanvas.width = window.innerWidth / 2;
  gElCanvas.height = window.innerHeight / 2;

  //add image
  gCanvas = gElCanvas.getContext('2d');
  renderCanvas(getCurrImg());
}

function renderCanvas() {
  let image = new Image();
  image.onload = function () {
    gCanvas.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
    const location = getCurrCoord();
    renderText(location.x, location.y);
    renderSelected();
  };
  image.src = getCurrImg();
}

function renderText(x, y) {
  gCanvas.beginPath();
  gCanvas.lineWidth = 2;
  gCanvas.strokeStyle = 'black';
  gCanvas.fillStyle = 'white';
  const { size, txt } = getSelected();
  gCanvas.font = `${size}px impact`;
  gCanvas.fillText(txt, x, y);
  gCanvas.strokeText(txt, x, y);
}

function renderSelected() {
  gCanvas.beginPath();

  const selected = getSelected();
  let rectCoord = { x: selected.coordinate.x - RECT_PADDING, y: selected.coordinate.y - selected.size };
  const rectLength = gCanvas.measureText(selected.txt).width + 2 * RECT_PADDING;
  const rectHeight = RECT_PADDING;
  gCanvas.rect(rectCoord.x, rectCoord.y, rectLength, selected.size + RECT_PADDING);
  // gCanvas.rect(rectCoord.x, rectCoord.y, rectCoord.x + rectLength, rectCoord.y + rectHeight);
  gCanvas.strokeStyle = 'white';
  gCanvas.stroke();
}

function getSelected() {
  return gMeme.lines[gMeme.selectedLineIdx];
}

function setText(txt) {
  const selected = getSelected();
  selected.txt = txt;
  renderCanvas();
}

function moveSelectedUp() {
  const selectedCoord = getCurrCoord();
  selectedCoord.y -= MOVEMENT_STEP;
  renderCanvas();
}

function moveSelectedDown() {
  const selectedCoord = getCurrCoord();
  selectedCoord.y += MOVEMENT_STEP;
  renderCanvas();
}

function getCurrImg() {
  return gImgs.find((img) => (img.id = gMeme.selectedImgId)).url;
}

function getCurrCoord() {
  return getSelected().coordinate;
}

//private functions --------------------------------------------------------------------
function _createMeme() {
  return {
    txt: 'osher',
    size: 40,
    align: 'left',
    color: 'red',
    coordinate: {
      x: 200,
      y: 100,
    },
  };
}
