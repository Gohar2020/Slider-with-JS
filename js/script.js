const container = document.querySelectorAll(".slider-container");
constInnerSlider = document.querySelectorAll(".inner-slider");
const cards = document.querySelectorAll(".card");
const gridX = 20;
const numOfPages = cards.length;
let curPage = 1;
let winW = screen.width;
let winH = window.innerHeight;
let index = 0;
let startY = 0;
let deltaY = 0;

const staggerVal = 65;
const staggerStep = 4;
const changeAT = 0.5;
const waveStagger = 0.013;

const IMAGES = [
  "images/111.jpg",
  "images/222.jpg",
  "images/333.jpg",
  "images/444.jpg",
  "images/555.jpg",
];

function slice() {
  for (let j = 0; j < numOfPages; j++) {
    const w = cards[j].offsetWidth;
    const createParts = () => {
      for (let i = 1; i < gridX - 1; i++) {
        const part = document.createElement("div");
        const inner = document.createElement("div");
        part.appendChild(inner);
        cards[j].appendChild(part);

        const innerLeft = (w / gridX) * (1 - i);
        inner.style.left = innerLeft + "px";
        inner.className = "bg-part-inner";
        part.className = "bg-part-" + i;
        part.classList.add("part");
        part.style.width = w / gridX + "px";
        inner.style.backgroundImage = "url('" + IMAGES[j] + "')";
      }
    };
    createParts();
  }
}
slice();

window.addEventListener("resize", function () {
  winW = screen.width;
  winH = window.innerHeight;
  changePages();
});

function movePart(part, y) {
  const newY = y - (curPage - 1) * winH;
  TweenLite.to(part, changeAT, { y: newY, ease: Back.easeOut.config(4) });
}

function moveParts(y, index) {
  const leftMax = index - 1;
  const rightMin = index + 1;

  let stagLeft = 0;
  let stagRight = 0;
  let stagStepL = 0;
  let stagStepR = 0;
  let sign = y > 0 ? -1 : 1;
  const part = document.querySelectorAll(".bg-part-" + index);
  movePart(part, y);

  for (let i = leftMax; i > 0; i--) {
    let step = index - i;
    let sVal = staggerVal - stagStepL;
    stagStepL += step <= 15 ? staggerStep : 1;
    if (sVal < 0) sVal = 0;
    stagLeft += sVal;
    let nextY = y + stagLeft * sign;
    if (Math.abs(y) < Math.abs(stagLeft)) nextY = 0;
    const part = document.querySelectorAll(".bg-part-" + i);
    movePart(part, nextY);
  }

  for (let j = rightMin; j <= gridX; j++) {
    let step = j - index;
    let sVal = staggerVal - stagStepR;
    stagStepR += step <= 15 ? staggerStep : 1;
    if (sVal < 0) sVal = 0;
    stagRight += sVal;
    let nextY = y + stagRight * sign;
    if (Math.abs(y) < Math.abs(stagRight)) nextY = 0;
    const part = document.querySelectorAll(".bg-part-" + j);
    movePart(part, nextY);
  }
}

const mousemoveHandler = (e) => {
  let y = e.pageY;
  let x = e.pageX;
  index = Math.ceil((x / winW) * gridX);
  deltaY = y - startY;
  moveParts(deltaY, index);
};

function navigateUp() {
  if (curPage > 1) curPage--;
}

function navigateDown() {
  if (curPage < numOfPages) curPage++;
}
function changePages() {
  const y = (curPage - 1) * winH * -1;
  let leftMax = index - 1;
  let rightMin = index + 1;
  const part = document.querySelectorAll(".bg-part-" + index);
  TweenLite.to(part, changeAT, { y: y });

  for (let i = leftMax; i > 0; i--) {
    const d = (index - i) * waveStagger;
    const part = document.querySelectorAll(".bg-part-" + i);
    TweenLite.to(part, changeAT - d, { y: y, delay: d });
  }

  for (let j = rightMin; j <= gridX; j++) {
    const d = (j - index) * waveStagger;
    const part = document.querySelectorAll(".bg-part-" + j);
    TweenLite.to(part, changeAT - d, { y: y, delay: d });
  }
}
const swipeEndHandler = () => {
  document.removeEventListener("mousemove", mousemoveHandler);
  document.removeEventListener("mouseup", swipeEndHandler);

  if (!deltaY) return;
  if (deltaY / winH >= 0.5) navigateUp();
  if (deltaY / winH <= -0.5) navigateDown();

  changePages();
};

document.addEventListener("mousedown", function (e) {
  startY = e.pageY;
  deltaY = 0;

  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("mouseup", swipeEndHandler);
});
