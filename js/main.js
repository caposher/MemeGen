'use strict';

function init() {
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
