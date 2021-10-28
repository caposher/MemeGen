'use strict';
const MOVEMENT_STEP = 10;
const RECT_PADDING = 10; //TODO: need to be dynamic
let gElCanvas;
let gCanvas;
let gLastImg;
let gTxtAlignment = 'center';
let gIsRenderEnd = true;

// var gKeywords = { happy: 12, 'funny puk': 1 };
const gImgs = [
  { id: 1, url: 'img/meme-imgs/1.jpg', keywords: [] },
  { id: 2, url: 'img/meme-imgs/2.jpg', keywords: [] },
  { id: 3, url: 'img/meme-imgs/3.jpg', keywords: [] },
  { id: 4, url: 'img/meme-imgs/4.jpg', keywords: [] },
  { id: 5, url: 'img/meme-imgs/5.jpg', keywords: [] },
  { id: 6, url: 'img/meme-imgs/6.jpg', keywords: [] },
  { id: 7, url: 'img/meme-imgs/7.jpg', keywords: [] },
  { id: 8, url: 'img/meme-imgs/8.jpg', keywords: [] },
  { id: 9, url: 'img/meme-imgs/9.jpg', keywords: [] },
  { id: 10, url: 'img/meme-imgs/10.jpg', keywords: [] },
  { id: 11, url: 'img/meme-imgs/11.jpg', keywords: [] },
  { id: 12, url: 'img/meme-imgs/12.jpg', keywords: [] },
  { id: 13, url: 'img/meme-imgs/13.jpg', keywords: [] },
  { id: 14, url: 'img/meme-imgs/14.jpg', keywords: [] },
  { id: 15, url: 'img/meme-imgs/15.jpg', keywords: [] },
  { id: 16, url: 'img/meme-imgs/16.jpg', keywords: [] },
  { id: 17, url: 'img/meme-imgs/17.jpg', keywords: [] },
  { id: 18, url: 'img/meme-imgs/18.jpg', keywords: [] },
];

const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [_createMeme()],
};

function createCanvas() {
  // change canvas size
  gElCanvas = GetCanvas();
  gElCanvas.width = 550;
  gElCanvas.height = 550; //TODO: do dynamic calc

  //add image
  gCanvas = gElCanvas.getContext('2d');
  renderCanvas();
}

function renderCanvas(doDownload = false) {
  let image = new Image();
  image.onload = function () {
    gCanvas.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
    renderText();
    if (doDownload) {
      const elLink = document.querySelector('.silent-link');
      elLink.href = gElCanvas.toDataURL('image/jpag');
      elLink.click();
    } else {
      renderSelected();
    }
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
      gCanvas.textAlign = gTxtAlignment;
      gCanvas.font = `${meme.size}px impact`;

      // debugger;
      gCanvas.fillText(meme.txt, gElCanvas.width / 2, meme.coordinate.sY + meme.size);
      gCanvas.strokeText(meme.txt, gElCanvas.width / 2, meme.coordinate.sY + meme.size);

      // gCanvas.fillText(meme.txt, meme.coordinate.sX + RECT_PADDING, meme.coordinate.sY + meme.size);
      // gCanvas.strokeText(meme.txt, meme.coordinate.sX + RECT_PADDING, meme.coordinate.sY + meme.size);
    });
  }
}

function renderSelected() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.eY = selected.size + RECT_PADDING;

    //if empty text, rectangle size and location will change
    if (!selected.txt) {
      selected.coordinate.eX = gElCanvas.width - 2 * RECT_PADDING;

      //set the line in defferent location depending on the order
      selected.coordinate.sY = _getYAxis();
      selected.coordinate.sX = RECT_PADDING;
    } else {
      let { xStart, xEnd } = _getXAxis();
      selected.coordinate.sX = xStart;
      selected.coordinate.eX = xEnd;
      // selected.coordinate.sX = gCanvas.measureText(selected.txt).width - 2 * RECT_PADDING;
      // selected.coordinate.eX = gCanvas.measureText(selected.txt).width + 2 * RECT_PADDING;
    }

    gCanvas.beginPath();
    gCanvas.rect(selected.coordinate.sX, selected.coordinate.sY, selected.coordinate.eX, selected.coordinate.eY);
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

function getImgs() {
  return gImgs;
}

function setEditorImg(id) {
  gMeme.selectedImgId = id;
}

function getCurrImg() {
  // debugger;
  return gImgs.find((img) => img.id === gMeme.selectedImgId).url;
}

function downloadCanvas() {
  renderCanvas(true);
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
    size: 50,
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

function _getYAxis() {
  let YAxis;
  switch (gMeme.selectedLineIdx) {
    case 0:
      YAxis = RECT_PADDING;
      break;
    case 1:
      YAxis = gElCanvas.height - getSelected().size - 2 * RECT_PADDING;
      break;
    default:
      YAxis = gElCanvas.height / 2 - getSelected().size;
      break;
  }
  return YAxis;
}

function _getXAxis() {
  let selected = getSelected();
  let xStart;
  let xEnd;
  switch (gTxtAlignment) {
    case 'center':
      xStart = gElCanvas.width / 2 - gCanvas.measureText(selected.txt).width / 2 - RECT_PADDING;
      xEnd = gCanvas.measureText(selected.txt).width + 2 * RECT_PADDING;
      // debugger;
      break;
    case 'left':
      break;
    case 'right':
      break;
  }
  return { xStart, xEnd };
}
