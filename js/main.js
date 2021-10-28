'use strict';

function init() {
  // renderGallery();
  createCanvas();
}

function GetCanvas() {
  const elCanvas = document.querySelector('.canvas');
  return elCanvas;
}

function renderGallery() {
  const elMain = document.querySelector('main');
  const imgs = getImgs();
  let strHTML = '<div class="img-grid main-layout grid">';

  strHTML += imgs
    .map((img) => {
      return `<div class="img" onclick="onMemeSelected(${img.id})"  style="background-image: url('${img.url}');"></div>`;
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
      </div>
    </div>
  </div>`;

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
