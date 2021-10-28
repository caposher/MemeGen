'use strict';
const MOVEMENT_STEP = 10;
const FONT_SIZE_STEP = 5;
const STORAGE_KEY = 'memes';
const RECT_PADDING = 10; //TODO: need to be dynamic
let gElCanvas;
let gCanvas;
let gLastImg;
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

let gMemes;
const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [_createMeme()],
};

init();
//init-----------------------------------------------------------------------
function init() {
  gMemes = loadFromStorage(STORAGE_KEY);
  if (!gMemes) gMemes = [];
}

function createCanvas() {
  // change canvas size
  gElCanvas = GetCanvas();
  gElCanvas.width = 500;
  gElCanvas.height = 500; //TODO: do dynamic calc

  gCanvas = gElCanvas.getContext('2d');
  renderCanvas();
}

//renders-----------------------------------------------------------------------
function renderCanvas(showSelector = true, target = '') {
  let image = new Image();
  image.onload = function () {
    gCanvas.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
    renderText();
    if (showSelector) {
      renderSelected();
    } else if (target === 'download') {
      const elLink = document.querySelector('.silent-link');
      elLink.href = gElCanvas.toDataURL('image/jpag');
      elLink.click();
    } else if (target === 'share') {
      uploadImg();
    } else if (target === 'save') {
      gMemes.push(gElCanvas.toDataURL('image/jpag'));
      saveToStorage(STORAGE_KEY, gMemes);
    }
  };
  image.src = getCurrImg();
}

function renderText() {
  if (gMeme.lines.length) {
    gMeme.lines.forEach((meme) => {
      gCanvas.beginPath();
      gCanvas.lineWidth = 2;
      gCanvas.strokeStyle = meme.strokeColor;
      gCanvas.fillStyle = meme.fillColor;
      gCanvas.textAlign = meme.align;
      gCanvas.font = `${meme.size}px ${meme.font}`;

      gCanvas.fillText(meme.txt, _textPosition(meme), meme.coordinate.y + meme.size);
      gCanvas.strokeText(meme.txt, _textPosition(meme), meme.coordinate.y + meme.size);
    });
  }
}

function renderSelected() {
  const selected = getSelected();
  if (selected) {
    selected.rectSize.height = selected.size + RECT_PADDING;
    selected.rectSize.width = gElCanvas.width - 2 * RECT_PADDING;
    if (!selected.txt) {
      //set the line in defferent location depending on the order
      selected.coordinate.y = _getYAxis();
      selected.coordinate.x = RECT_PADDING;
    }
    gCanvas.beginPath();
    gCanvas.rect(selected.coordinate.x, selected.coordinate.y, selected.rectSize.width, selected.rectSize.height);
    gCanvas.strokeStyle = 'white';
    gCanvas.stroke();
  }
}

//buttons-----------------------------------------------------------------------
//text box manipulation-----------------------------------
function moveSelectedUp() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.y -= MOVEMENT_STEP;
    renderCanvas();
  }
}

function moveSelectedDown() {
  const selected = getSelected();
  if (selected) {
    selected.coordinate.y += MOVEMENT_STEP;
    renderCanvas();
  }
}

function createTextBox() {
  gMeme.selectedLineIdx = gMeme.lines.length;
  gMeme.lines.push(_createMeme());
  changeBtnsColor('black', 'white');
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
  const selected = getSelected();
  changeBtnsColor(selected.strokeColor, selected.fillColor);
  renderCanvas();
}

//text manipulation-----------------------------------
function changeFontSize(isBiggerFont) {
  if (isBiggerFont) {
    getSelected().size += FONT_SIZE_STEP;
  } else {
    getSelected().size -= FONT_SIZE_STEP;
  }
  renderCanvas();
}

function changeAlignment(direction) {
  getSelected().align = direction;
  renderCanvas();
}

function changeFontType(font) {
  getSelected().font = font;
  renderCanvas();
}

function setStrokeColor(color) {
  getSelected().strokeColor = color;
  renderCanvas();
}

function setFontColor(color) {
  getSelected().fillColor = color;
  renderCanvas();
}

//getters and setters-----------------------------------

function getImgs(isFromStorage = false) {
  let imgs = gImgs;
  if (isFromStorage) {
    imgs = gMemes.map((url, idx) => {
      return { url: url };
    });
  }
  return imgs;
}

function setEditorImg(id) {
  gMeme.selectedImgId = id;
}

function getCurrImg() {
  return gImgs.find((img) => img.id === gMeme.selectedImgId).url;
}

function saveCanvas() {
  renderCanvas(false, 'save');
}

function shareCanvas() {
  renderCanvas(false, 'share');
}

function downloadCanvas() {
  renderCanvas(false, 'download');
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

//share to facebook--------------------------------------------------------------------
function uploadImg() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg');

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`,
      '_blank'
    );

    // document.querySelector('.share-container').innerHTML = `
    //   <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
    //      Share
    //   </a>`;
  }
  doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData();
  formData.append('img', imgDataUrl);

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.text())
    .then((url) => {
      console.log('Got back live url:', url);
      onSuccess(url);
    })
    .catch((err) => {
      console.error(err);
    });
}

//private functions --------------------------------------------------------------------
function _createMeme() {
  return {
    txt: '',
    size: 50,
    align: 'center',
    strokeColor: 'black',
    fillColor: 'white',
    font: 'Impact',
    coordinate: {
      x: 0,
      y: 0,
    },
    rectSize: {
      width: 0,
      height: 0,
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

function _textPosition(meme) {
  let textPosX;
  switch (meme.align) {
    case 'center':
      textPosX = gElCanvas.width / 2;
      break;
    case 'left':
      textPosX = meme.coordinate.x + RECT_PADDING;
      break;
    case 'right':
      textPosX = meme.coordinate.x + meme.rectSize.width - RECT_PADDING;
      break;
  }
  return textPosX;
}
