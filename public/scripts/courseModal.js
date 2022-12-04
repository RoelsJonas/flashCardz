const modal = document.querySelector('.courseModal');
const modal_container = modal.querySelector(".courseModal-inside");
const courseCloseBtns = document.querySelectorAll(".courseModal-close");
const courseModalImage = document.querySelector(".courseModalImage");
const courseModalTitle = document.querySelector(".courseModalTitle");
const courseModalVisits = document.querySelector(".courseModalVisits");
const courseModalFavorites = document.querySelector(".courseModalFavorites");
const courseModalNumcards = document.querySelector(".courseModalNumcards");
const courseModalSchool = document.querySelector(".courseModalSchool");
const courseModalCreator = document.querySelector(".courseModalCreator");
const courseModalCode = document.querySelector(".courseModalCode");
const courseModalDescription = document.querySelector(".courseModalDescription");
const courseModalTest = document.querySelector("#courseModalTest");
const courseModalShare = document.querySelector(".courseModal-share");
const courseModalBack = document.querySelector(".courseModal-back");
const courseModalQR = document.querySelector(".courseModalQR");
const courseModalDetails = document.querySelector(".courseModalDetails");
const courseModalLink = document.querySelector("#courseModalLink");
const courseModalEdit = document.querySelector("#courseModalEdit");

function loadModal(course){
    
    // Sent a http request to get the data
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        // Check if succesfully received a valid response
        if(this.readyState == 4) {
            if(this.status == 200) {
                // Check if any error has occured, if not toggle the icon the corresponding one
                var data = JSON.parse(this.responseText);
                setModal(data);
            }
        }
    }
    var id = course.closest("li").getAttribute("data-id");
    xhttp.open("GET", `/courses/course_details/${id}/${user._id}`,true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhttp.send();
}

function setModal(data){
    var course = data.course;
    var creator = data.creator;

    courseModalImage.src = "image/" + course.image;
    courseModalTitle.innerHTML = course.name;
    courseModalVisits.innerHTML = course.numVisits;
    courseModalFavorites.innerHTML = course.numFavorites;
    courseModalNumcards.innerHTML = course.numCards;
    courseModalSchool.innerHTML = course.school;
    courseModalCreator.innerHTML = creator;
    courseModalCode.innerHTML = course.code;
    courseModalDescription.innerHTML = course.description;
    courseModalTest.href = "/cards?course_id=" + course._id;
    courseModalLink.addEventListener('click', function(){
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard.writeText("Start studying " + course.name + " now at: " + courseModalTest.href);
        courseModalLink.innerHTML = "Copied ✓";
    });
    var alreadyImage = courseModalQR.querySelector("img");
    if(alreadyImage){
        alreadyImage.remove();
    }
    courseModalQR.insertAdjacentHTML('afterbegin', '<img class="div-share", src="https://qrtag.net/api/qr_transparent_12.svg?url=' + courseModalTest.href + '"" alt="qrCode">');
    
    if(creator == user.username){
        courseModalEdit.href = "/courses/"+ course._id +"/update";
        courseModalEdit.classList.remove("hidden");
    }
    else{
        courseModalEdit.classList.add("hidden");
    }

    modal.classList.remove('hidden');
}


for (i = 0; i < courseCloseBtns.length; ++i) {
    courseCloseBtns[i].addEventListener('click', function(){
        event.preventDefault();
        event.stopPropagation();
        modal.classList.add('hidden');
        modal_container.classList.remove('rotate');
        courseModalLink.innerHTML = "Get link";
    });
}
modal.addEventListener('click', rotatecard);
courseModalShare.addEventListener('click', function(){
    event.preventDefault();
    courseModalDetails.classList.add("hidden");
    courseModalQR.classList.remove("hidden");
    rotatecard();
});
courseModalBack.addEventListener('click', function(){
    event.preventDefault();
    rotatecard();
});

function rotatecard(){
    modal_container.classList.toggle('rotate');
    if(!modal_container.classList.contains("rotate")){
        courseModalDetails.classList.remove("hidden");
        courseModalQR.classList.add("hidden");
        courseModalLink.innerHTML = "Get link";
    }
} 

modal.onmousemove = modal.onclick = function(e) {
let xy = [e.clientX, e.clientY];
let position = xy.concat([modal_container]);

window.requestAnimationFrame(function(){
    transformElement(modal_container, position);
});
};

let modalConstrain = 75;
function transforms(x, y, el) {
let box = el.getBoundingClientRect();
let calcX, calcY;
if(el.classList.contains("rotate")){
    calcX = -(y - box.y - (box.height / 2)) / modalConstrain;
    calcY = 180 + (x - box.x - (box.width / 2)) / modalConstrain;
}
else{
    calcX = -(y - box.y - (box.height / 2)) / modalConstrain;
    calcY = (x - box.x - (box.width / 2)) / modalConstrain;
}


return "rotateX("+ calcX +"deg) "
    + "   rotateY("+ calcY +"deg) ";
};

function transformElement(el, xyEl) {
el.style.transform  = transforms.apply(null, xyEl);
}
