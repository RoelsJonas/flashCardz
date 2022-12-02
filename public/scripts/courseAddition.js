var limit = 9;
var additions = 1;

var list = document.querySelector(".courseList");
var more = document.querySelector(".courseShowMore");

more.addEventListener("click", ()=>{
    event.preventDefault();
    
    // Sent a http request to post this course under the current user's favorites
    const xhttp = new XMLHttpRequest();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    xhttp.onreadystatechange = function () {
        
        // Check if succesfully received a valid response
        if(this.readyState == 4) {
            if(this.status == 200) {
                // Get data out of response
                var data = JSON.parse(this.responseText);
                var html = "";

                // If all data is fetched stop
                additions++;
                if(additions * limit >= count){
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

                    html +=`<li class="courseItem" data-id=${course._id}>
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
            }
        }
    }
    xhttp.open("POST", `/courses/public/load-more`,true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify({skip: limit*additions, limit: limit, filter: "name", search: urlParams.get("search")}));
});


