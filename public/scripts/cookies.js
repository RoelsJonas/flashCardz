const consentPopup = document.querySelector('.cookie-banner');
const acceptBtn = document.querySelector('.cookie-banner-accept');
const declineBtn = document.querySelector('.cookie-banner-decline');
const removeBtns = document.querySelectorAll('.cookie-banner-close');
const flashcard = document.querySelector('.cookie-banner');
const flashcard_container = flashcard.querySelector(".cookie-banner-inside");
const editBtns = document.querySelectorAll('.cookie-banner-edit');
const cookieImage = document.querySelector('.cookie-banner-image');


window.onload = () => {

    consentPropertyName = "cookie-consent";

    function acceptCookies(){
      localStorage.setItem(consentPropertyName, true)
      consentPopup.classList.add('hidden');
    }

    function declineCookies(){
      localStorage.setItem(consentPropertyName, false)
      consentPopup.classList.add('hidden');
    }

    function closeCookies(){
      consentPopup.classList.add('hidden');
    }
    
    declineBtn.addEventListener('click', declineCookies);
    for (i = 0; i < removeBtns.length; ++i) {
      removeBtns[i].addEventListener('click', closeCookies);
    }

    if (!localStorage.getItem(consentPropertyName)) {
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
        }, 1000);
    }

    // const token = await jwt.sign({ username: user.username }, SECRET);
    // let options = {
    //     maxAge: 1000 * 60 * 60 * 24 * 180, // would expire after half a year
    // }
    // res.cookie("consent", token, options);

  };

  // Eat a bit of cookie
  let increment = 1;
  cookieImage.addEventListener('click', eatCookie);
  
  function eatCookie(){
    increment++;
    if(increment >= 7){
      
      cookieImage.classList.toggle("reset");
      setTimeout(function(){
        increment=1;
        cookieImage.classList.toggle("reset");
        cookieImage.src = '/public/media/cookie1.png';
      }, 1000);
    }
    else{
      cookieImage.src = '/public/media/cookie'+increment+'.png';
    }
  };
  //Eat a bit of cookie every 3seconds
  autoEatCookie();
  function autoEatCookie(){
    setTimeout(function(){
      eatCookie();
      autoEatCookie();
    }, 3000);
  }

  function rotatecard(){
    flashcard_container.classList.toggle('rotate');
  } 

  flashcard.onmousemove = flashcard.onclick = function(e) {
    let xy = [e.clientX, e.clientY];
    let position = xy.concat([flashcard_container]);

    window.requestAnimationFrame(function(){
      transformElement(flashcard_container, position);
    });
  };

  for (i = 0; i < editBtns.length; ++i) {
    editBtns[i].addEventListener('click', rotatecard);
  }
  let constrain = 75;
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
