
const cardbody = document.querySelector('.cardbody');
const flashcard = document.querySelector('.flashcard');
const title_front = document.getElementById("title_front");
const title_back = document.getElementById("title_back");
const flashcard_container = flashcard.querySelector(".flashcard_container");
const counter = document.getElementById("amount-label");
const front = document.getElementById("front");
const back = document.getElementById("back");
const answers = document.querySelector(".div-answers");
const results = document.querySelector('.results');
const testDiv = document.querySelector(".test");
const setupDiv = document.querySelector('.setup');
const countdown = document.querySelector('.countdown');

var cards;
var index = 0;
var side = true;
var timeout;
var score = 0; 
var countdownTimer;
var countdownInterval;

flashcard.addEventListener('click', rotatecard);
function rotatecard(){
    flashcard_container.classList.toggle('rotate');
    side = !side;
    if(timeout == null){
        timeout = setTimeout(() => {
            nextFlashcard();
            timeout = null;
        }, 10000);
    }
    answers.classList.remove("hidden");
    clearInterval(countdownInterval);
}

function wrongAnswer(){
    clearTimeout(timeout);
    timeout = null;
    nextFlashcard();
}
function rightAnswer(){
    score++;
    clearTimeout(timeout);
    timeout = null;
    nextFlashcard();
}

function nextFlashcard(){
    answers.classList.add("hidden");
    cardbody.classList.add("closed");

    if(index == cards.length - 1) {
        endTest();
        return;
    }
    index++;

    setTimeout(() => {
        title_front.innerHTML = cards[index].title;
        title_back.innerHTML = cards[index].title;
        setCounter();
        if(side) {
            front.innerHTML = cards[index].front.replace(/\r?\n/g, '<br />');
            back.innerHTML = cards[index].back.replace(/\r?\n/g, '<br />');
        }
        else {
            front.innerHTML = cards[index].back.replace(/\r?\n/g, '<br />');
            back.innerHTML = cards[index].front.replace(/\r?\n/g, '<br />');
        }
        cardbody.classList.remove("closed");
        resetCountdown();
    }, 1000);

}

function endTest(){
    results.classList.remove("hidden");
    cardbody.remove();
    countdown.remove();
    counter.remove();
    if(score / cards.length >= 0.5){
        results.querySelector(".resultsMention").innerHTML = "Congrats!"
        startConfetti();
    }
    else{
        results.querySelector(".resultsMention").innerHTML = "Next time better, keep trying!"
    }
    results.querySelector(".resultScore").innerHTML = "<b>" + score + "</b> out of " + cards.length;
}

function startTest(){
    var number = document.querySelector("#quantity").value;
    loadCards(number);
    setupDiv.classList.add("hidden");
    testDiv.classList.remove("hidden");
    
    countdownTimer = document.querySelector("#countdownTimer").value;
    if(countdownTimer > 0){
        countdown.classList.remove("hidden");
        setCountdown();
    }
}


function loadCards(number) {
    const xhttp = new XMLHttpRequest();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    xhttp.onload = function() {
        cards = JSON.parse(this.response)
        if(cards.length > 0) {
            title_front.innerHTML = cards[0].title;
            title_back.innerHTML = cards[0].title;
            front.innerHTML = cards[0].front.replace(/\r?\n/g, '<br />');
            back.innerHTML = cards[0].back.replace(/\r?\n/g, '<br />');
            setCounter();

        }
        else{
            front.innerHTML = "No questions where found";
            back.innerHTML = "No questions where found";
        }
    }
    xhttp.open("GET", "/courses/cards/" + urlParams.get("course_id")+"/"+number, true);
    xhttp.send();
}

function setCounter() {
    let count = index + 1;
    counter.innerHTML = count + " / " + cards.length;
}

function setCountdown(){
    var passed = 0;
    document.querySelector(".countdownTime").innerHTML = countdownTimer
    countdownInterval = setInterval(function() {
        passed++;
        document.querySelector(".countdownTime").innerHTML = countdownTimer - passed;
        if(countdownTimer - passed == 0) {
            clearInterval(countdownInterval);
            document.querySelector(".countdownTime").innerHTML = "Stop";
            countdownPassed();
        }
    }, 1000);
}
function resetCountdown(){
    clearInterval(countdownInterval);
    setCountdown();
}
function countdownPassed(){
    flashcard_container.classList.toggle('rotate');
    flashcard_container.style.transform  = transforms.apply(null, [0,0, flashcard_container]);
    side = !side;
    setTimeout(() => {
        nextFlashcard();
    }, 3000);
}




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
