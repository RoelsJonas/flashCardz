const consentPopup = document.querySelector('.cookie-banner');
const acceptBtn = document.querySelector('.cookie-banner-accept');
const declineBtn = document.querySelector('.cookie-banner-decline');
const removeBtns = document.querySelectorAll('.cookie-banner-close');
const flashcard = document.querySelector('.cookie-banner');
const flashcard_container = flashcard.querySelector(".cookie-banner-inside");
const editBtns = document.querySelectorAll('.cookie-banner-edit');
const cookieImage = document.querySelector('.cookie-banner-image');



window.onload = () => {

    // Setup google analythics gtag
    var ss = document.createElement('script'); 
    ss.type = "text/javascript"
    ss.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-E91YF32R8C');`
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(ss, x);

    consentPropertyName = "cookie-consent";

    function acceptCookies(){

      // Get cookie input
      var input = getCookieForm();

      localStorage.setItem(consentPropertyName, input)
      consentPopup.classList.add('hidden');

      enabledAnalythics(input);
  }

    function declineCookies(){
      localStorage.setItem(consentPropertyName, JSON.stringify({tpc:false,analythics:false,other:false}))
      consentPopup.classList.add('hidden');
    }

    function closeCookies(){
      consentPopup.classList.add('hidden');
    }

    function getCookieForm(){
      var form = document.querySelector("#cookieForm");
      var tpc = form.querySelector("#tpc");
      var analythics = form.querySelector("#analythics");
      var other = form.querySelector("#other");
      return JSON.stringify({
        tpc: tpc.value == "on" ? true : false,
        analythics: analythics.value == "on" ? true : false,
        other: other.value == "on" ? true : false
      })
    }

    function enabledAnalythics(consent){
      consent = JSON.parse(consent)
      // Enable google analythics if third party cookies and analythics are enabled
      if(consent.analythics && consent.tpc){
        console.log("Enabled google analythics");
        var s = document.createElement('script');
        s.type = "text/javascript"
        s.async = "true";
        s.src = "https://www.googletagmanager.com/gtag/js?id=G-E91YF32R8C";
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      }
    }
    
    declineBtn.addEventListener('click', declineCookies);
    for (i = 0; i < removeBtns.length; ++i) {
      removeBtns[i].addEventListener('click', closeCookies);
    }
    
    if (!localStorage.getItem(consentPropertyName)) {
        setTimeout(() => {
            consentPopup.classList.remove('hidden');
            autoEatCookie();
        }, 1000);
    }
    else{
      var consent = localStorage.getItem(consentPropertyName);
      enabledAnalythics(consent);
    }

    acceptBtn.addEventListener('click', acceptCookies);
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
  function autoEatCookie(){
    setTimeout(function(){
      if(!consentPopup.classList.contains('hidden')){
        eatCookie();
        autoEatCookie();
      }
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
