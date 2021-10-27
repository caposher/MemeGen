'use strict';
const MOVEMENT_STEP = 10;
const RECT_PADDING = 10;
let gElCanvas;
let gCanvas;

// var gKeywords = { happy: 12, 'funny puk': 1 };
var gImgs = [{ id: 1, url: 'img/meme-imgs/6.jpg', keywords: ['happy'] }];
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
    renderText();
    renderSelected();
  };
  image.src = getCurrImg();
}

function renderText() {
  if (gMeme.lines.length) {
    gMeme.lines.forEach((meme) => {
      gCanvas.beginPath();
      gCanvas.lineWidth = 2;
      gCanvas.strokeStyle = 'black';
      gCanvas.fillStyle = 'white';
      gCanvas.font = `${meme.size}px impact`;
      gCanvas.fillText(meme.txt, meme.coordinate.sX + RECT_PADDING, meme.coordinate.sY + meme.size);
      gCanvas.strokeText(meme.txt, meme.coordinate.sX + RECT_PADDING, meme.coordinate.sY + meme.size);
    });
  }
}

function renderSelected() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.eY = selected.size + RECT_PADDING;
    // const rectHeight = selected.size + RECT_PADDING;
    let rectLength = 0;

    //if empty text, rectangle size and location will change
    if (!selected.txt) {
      selected.coordinate.eX = gElCanvas.width;
      // rectLength = gElCanvas.width;

      //set the line in defferent location depending on the order
      if (gMeme.selectedLineIdx === 1) {
        selected.coordinate.sY = gElCanvas.height - selected.size;
      } else if (gMeme.selectedLineIdx > 1) {
        selected.coordinate.sY = gElCanvas.height / 2 - selected.size;
      }
    } else {
      selected.coordinate.eX = gCanvas.measureText(selected.txt).width + 2 * RECT_PADDING;
      // rectLength = gCanvas.measureText(selected.txt).width + 2 * RECT_PADDING;
    }

    gCanvas.beginPath();
    gCanvas.rect(selected.coordinate.sX, selected.coordinate.sY, selected.coordinate.eX, selected.coordinate.eY);
    // gCanvas.rect(selected.coordinate.sX, selected.coordinate.sY, rectLength, rectHeight);
    gCanvas.strokeStyle = 'white';
    gCanvas.stroke();
  }
}

function moveSelectedUp() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.sY -= MOVEMENT_STEP;
    selected.coordinate.eY -= MOVEMENT_STEP;
    renderCanvas();
  }
}

function moveSelectedDown() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.sY += MOVEMENT_STEP;
    selected.coordinate.eY += MOVEMENT_STEP;
    renderCanvas();
  }
}

function createTextBox() {
  gMeme.lines.push(_createMeme());
  gMeme.selectedLineIdx++;
  renderCanvas();
}

function deleteSelected() {
  gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  if (gMeme.selectedLineIdx > -1) gMeme.selectedLineIdx--;
  renderCanvas();
}

function changeTextBox() {
  gMeme.selectedLineIdx++;
  gMeme.selectedLineIdx %= gMeme.lines.length;
  renderCanvas();
}

function getCurrImg() {
  return gImgs.find((img) => (img.id = gMeme.selectedImgId)).url;
}

function getSelected() {
  return gMeme.lines[gMeme.selectedLineIdx];
}

function setText(txt) {
  const selected = getSelected();
  if (selected) {
    selected.txt = txt;
    renderCanvas();
  }
}
//private functions --------------------------------------------------------------------
function _createMeme() {
  return {
    txt: '',
    size: 40,
    align: 'left',
    color: 'red',
    coordinate: {
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0,
    },
  };
}
