function favorite(star){
    event.preventDefault();

    // Get the current status of the course, favorited or not
    var icon = star.querySelector("i")
    var favorited;
    var newClass;
    if(icon.className == "bx bxs-star"){
        newClass = "bx bx-star";
        favorited = false;
    }
    else{
        newClass = "bx bxs-star";
        favorited = true;
    }

    // Sent a http request to post this course under the current user's favorites
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        // Check if any error has occured, if not toggle the icon the corresponding one
        if(xhttp.status === 200) {
            icon.className = newClass;
        }
        else{
            console.log("Something went wrong while trying to add to favorites");
        }
    }
    xhttp.open("POST", `/courses/favorite/${star.getAttribute("data-path")}`,true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify({favorited: favorited}));
}


