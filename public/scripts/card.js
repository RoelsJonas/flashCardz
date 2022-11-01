
const flashcard = document.querySelector('.flashcard');
const title_front = document.getElementById("title_front");
const title_back = document.getElementById("title_back");
const flashcard_container = flashcard.querySelector(".flashcard_container");
const next_button = document.getElementById("btn-next");
const prev_button = document.getElementById("btn-prev");
const counter = document.getElementById("amount-label");
const front = document.getElementById("front");
const back = document.getElementById("back");

loadCards();
var cards;
var index = 0;
var side = true;

function rotatecard(){
    flashcard_container.classList.toggle('rotate');
    side = !side;
    // setTimeout(() => {
    //   moveFallingThing(flashcard, 0.2, window.innerHeight);
    // }, 2000);
}
flashcard.addEventListener('click', rotatecard);

next_button.addEventListener('click', () => {
    if(index < cards.length - 1) {
        index++;
        title_front.innerHTML = cards[index].title;
        title_back.innerHTML = cards[index].title;
        setCounter();
        if(side) {
            front.innerHTML = cards[index].front;
            back.innerHTML = cards[index].back;
        }
        else {
            front.innerHTML = cards[index].back;
            back.innerHTML = cards[index].front;
        }
        prev_button.disabled = false;
    }
    if(index == cards.length - 1) {
        next_button.disabled = true;
    }

});

prev_button.addEventListener('click', () => {
    if(index > 0) {
        index--;
        title_front.innerHTML = cards[index].title;
        title_back.innerHTML = cards[index].title;
        setCounter();
        if(side) {
            front.innerHTML = cards[index].front;
            back.innerHTML = cards[index].back;
        }
        else {
            front.innerHTML = cards[index].back;
            back.innerHTML = cards[index].front;
        }
        next_button.disabled = false;
    }
    if(index == 0) {
        prev_button.disabled = true;
    }
});


let constrain = 50;
function transforms(x, y, el) {
  let box = el.getBoundingClientRect();
  let calcX, calcY;
  if(el.classList.contains("rotate")){
    calcX = -(y - box.y - (box.height / 2)) / constrain;
    calcY = 180 + (x - box.x - (box.width / 2)) / constrain;
  }
  else{
    calcX = -(y - box.y - (box.height / 2)) / constrain;
    calcY = (x - box.x - (box.width / 2)) / constrain;
  }

  
  return "rotateX("+ calcX +"deg) "
    + "   rotateY("+ calcY +"deg) ";
};

 function transformElement(el, xyEl) {
  el.style.transform  = transforms.apply(null, xyEl);
}

flashcard.onmousemove = flashcard.onclick = function(e) {
  let xy = [e.clientX, e.clientY];
  let position = xy.concat([flashcard_container]);

  window.requestAnimationFrame(function(){
    transformElement(flashcard_container, position);
  });
};


function loadCards() {
    const xhttp = new XMLHttpRequest();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    xhttp.onload = function() {
        cards = JSON.parse(this.response)
        console.log(cards);
        if(cards.length > 0) {
            title_front.innerHTML = cards[0].title;
            title_back.innerHTML = cards[0].title;
            front.innerHTML = cards[0].front;
            back.innerHTML = cards[0].back;
            setCounter();

        }
        else{
            front.innerHTML = "No questions where found";
            back.innerHTML = "No questions where found";
        }
    }
    xhttp.open("GET", "/courses/cards/" + urlParams.get("course_id"), true);
    xhttp.send();
}

function setCounter() {
    let count = index + 1;
    counter.innerHTML = count + " / " + cards.length;
}