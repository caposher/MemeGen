'use strict';

function init() {
  renderGallery();
  // renderEditor();
  // createCanvas();
}

function GetCanvas() {
  const elCanvas = document.querySelector('.canvas');
  return elCanvas;
}

function renderGallery(isMyMemes = false) {
  const elMain = document.querySelector('main');
  const imgs = getImgs(isMyMemes);
  let strHTML = '<div class="img-grid main-layout grid">';

  strHTML += imgs
    .map((img) => {
      let imgHTML = `<div class="img" `;
      if (!isMyMemes) {
        imgHTML += `onclick="onMemeSelected(${img.id})"  `;
      }
      imgHTML += `style="background-image: url('${img.url}');"></div>`;
      return imgHTML;
    })
    .join('');

  strHTML += '</div>';
  elMain.innerHTML = strHTML;
}

function renderEditor() {
  const elMain = document.querySelector('main');
  let strHTML = `
  <div class="editor-container main-layout flex">
  <canvas class="canvas"></canvas>
  <div class="panel-container flex">
    <div class="panel grid">
      <input
        class="txt-input"
        type="text"
        placeholder="Text Line"
        onfocus="this.value=''"
        oninput="onText(this.value)"
      />
      <div class="move-up mouse-react" onclick="onMoveUp()"></div>
      <div class="move-down mouse-react" onclick="onMoveDown()"></div>
      <div class="switch-txt mouse-react" onclick="onChangeTextBox()"></div>
      <div class="add-txt mouse-react" onclick="onAddText()"></div>
      <div class="delete-txt mouse-react" onclick="onDeleteText()"></div>
      <div class="font-up mouse-react" onclick="onchangeFontSize(true)"></div>
      <div class="font-down mouse-react" onclick="onchangeFontSize(false)"></div>
      <div class="left-align mouse-react" onclick="onAlignment('left')"></div>
      <div class="center-align mouse-react" onclick="onAlignment('center')"></div>
      <div class="right-align mouse-react" onclick="onAlignment('right')"></div>

      <select class="font-family" name="font-family" onchange="onChangeFont(this.value)">
        <option value="impact">Impact</option>
        <option value="courier">Courier</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="cursive">Cursive</option>
      </select>
      <div class="stroke-color">
        <input
          class="color-input mouse-react"
          type="color"
          name="stroke-color"
          onchange="onStrokeColor(this.value)"
        />
      </div>
      <div class="font-color">
        <input
          class="color-input mouse-react"
          type="color"
          name="font-color"
          onchange="onFontColor(this.value)"
        />
      </div>

      <a class="save editor-link" href="#" onclick="onSave()">SAVE</a>
      <a class="share editor-link" href="#" onclick="onShare()">SHARE</a>
      <a class="download editor-link" href="#" onclick="onDownLoad()">Download</a>
    </div>
    </div>
    <a class="silent-link" href="" download="take-that-shit.jpg"></a>
  </div>
  `;

  elMain.innerHTML = strHTML;
}

function onMemeSelected(imgId) {
  setEditorImg(imgId);
  renderEditor();
  createCanvas();
}

function onText(txt) {
  setText(txt);
}

function onMoveUp() {
  moveSelectedUp();
}

function onMoveDown() {
  moveSelectedDown();
}

function onAddText() {
  createTextBox();
  document.querySelector('.txt-input').focus();
}

function onDeleteText() {
  deleteSelected();
}

function onChangeTextBox() {
  changeTextBox();
}

function onSave() {
  saveCanvas();
}
function onShare() {
  shareCanvas();
}

function onDownLoad() {
  downloadCanvas();
}

function onchangeFontSize(isBiggerFont) {
  changeFontSize(isBiggerFont);
}

function onChangeFont(font) {
  changeFontType(font);
}

function onAlignment(direction) {
  changeAlignment(direction);
}

function onStrokeColor(color) {
  const elStrokeBtn = document.querySelector('.stroke-color');
  elStrokeBtn.style.backgroundColor = color;
  setStrokeColor(color);
}

function onFontColor(color) {
  const elFontBtn = document.querySelector('.font-color');
  elFontBtn.style.backgroundColor = color;
  setFontColor(color);
}

function changeBtnsColor(strockColor, fillColor) {
  document.querySelector('.stroke-color').style.backgroundColor = strockColor;
  document.querySelector('.font-color').style.backgroundColor = fillColor;
}
