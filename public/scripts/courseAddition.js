var limit = 9;
var additions = 0;
var startCount = 3;

var list = document.querySelector(".courseList");
var more = document.querySelector(".courseShowMore");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var radioItems = Array.from(document.querySelector(".categoryItems").querySelectorAll('input[type="radio"]'));
var radioTypes = Array.from(document.querySelector(".categoryTypes").querySelectorAll('input[type="radio"]'));

var searchType = urlParams.get("searchType");
var searchItem = urlParams.get("searchItem");

setTypes();
setItems();

function setTypes(){
    for(var i = 0; i < radioTypes.length; i++){
        var radio = radioTypes[i];
        if(radio.value == searchType){
            radio.checked = true;
            return;
        }
    }
    radioTypes[0].checked = true;
}
function setItems(){
    for(var i = 0; i < radioItems.length; i++){
        var radio = radioItems[i];
        if(radio.value == searchItem){
            radio.checked = true;
            return;
        }
    }
    radioItems[0].checked = true;
}

more.addEventListener("click", ()=>{
    event.preventDefault();
    
    // Sent a http request to post this course under the current user's favorites
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        
        // Check if succesfully received a valid response
        if(this.readyState == 4) {
            if(this.status == 200) {
                // Get data out of response
                var data = JSON.parse(this.responseText);
                var html = "";

                // If all data is fetched stop
                additions++;
                if(additions * limit + startCount >= count){
                    more.style.display = "none";
                }

                // Appending all returned data in a variable called html
                for(var i = 0; i < data.length; i++) {
                    var course = data[i];
                    var favorited;                                          
                    if(favorites.find(f => f.course == course._id))
                        favorited =`<i class="bx bxs-star"></i>`
                    else 
                        favorited =`<i class="bx bx-star"></i>`

                    var image = ""
                    if(course.image){
                        image = "<img src='image/"+course.image+"' class='courseImage'></img>"
                    }

                    html +=`<li class="courseItem hidden" data-id=${course._id}>
                                <div onclick="loadModal(this)", class="courseLink"> 
                                    <div class="courseBox">
                                        <span class="courseName"> ${course.name} </span>
                                        <span class="courseSchool">${course.school} </span>
                                        <ul class="courseDetails">
                                            <li>
                                                <i class="bx bxs-collection"></i>
                                                <span> ${course.numCards}</span>
                                            </li>
                                            <li>
                                                <i class="bx bxs-star"></i>
                                                <span> ${course.numFavorites}</span>
                                            </li>
                                            <li>
                                                <i class="fa-solid fa-eye"></i>
                                                <span> ${course.numVisits}</span>
                                            </li>
                                        </ul>
                                        <div class="courseFavorite" onclick="favorite(this)">
                                            ${favorited}
                                        </div>
                                    </div>
                                    ${image}
                                </a>
                            </li>`
                }
                list.innerHTML += html;

                // Adding a small animation
                var start = (additions - 1) * limit + startCount;
                var courses = Array.from(document.querySelectorAll(".courseList .courseItem"));
                for(var i = start; i < start + limit; i++) {
                        setTimeout(function(j){
                            courses[j].classList.remove("hidden");
                        }, 200 * (i + 1 - start), i);
                }
            }
        }
    }
    xhttp.open("POST", `/courses/public/load-more`,true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify({skip: limit*additions+startCount, limit: limit, searchType: searchType, searchItem: searchItem, search: urlParams.get("search")}));
});
