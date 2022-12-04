let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let themes = [document.querySelector("#light"), document.querySelector("#dark")];
let sunIcon = document.querySelector("#sun");

sunIcon.addEventListener("click", () => {
    if(themes[0].checked === true) {
        sunIcon.classList.add("bx-moon");
        sunIcon.classList.remove("bx-sun");
        themes[0].checked = false;
        themes[1].checked = true;
        storeTheme(themes[1].id);
        document.body.classList.remove("dark");
    }
    else {
        sunIcon.classList.remove("bx-moon");
        sunIcon.classList.add("bx-sun");
        themes[0].checked = true;
        themes[1].checked = false;
        storeTheme(themes[0].id);
        document.body.classList.add("dark");
    }
    
});

setTheme();

themes.forEach((theme) => {
    theme.addEventListener("click", () => {
        storeTheme(theme.id);
    });
});

function storeTheme(themeId) {
    localStorage.setItem("theme", themeId);
};

function setTheme() {
    var selected = localStorage.getItem("theme");
    if(selected == themes[1].id) {
        sunIcon.classList.add("bx-moon");
        sunIcon.classList.remove("bx-sun");
        themes[0].checked = false;
        themes[1].checked = true;
        storeTheme(themes[1].id);
        document.body.classList.remove("dark");
    }
    else {
        sunIcon.classList.remove("bx-moon");
        sunIcon.classList.add("bx-sun");
        themes[0].checked = true;
        themes[1].checked = false;
        storeTheme(themes[0].id);
        document.body.classList.add("dark");
    }
}

// RUN ON START
// If there is already a nabarStatus stored check if it is true, JSON.Parse because this is stored as a string and not a bool
// if so open the navbar, if not just initiate the sessionstorage navbarstatus.
if(sessionStorage.navbarStatus) {
    var value = JSON.parse(sessionStorage.navbarStatus) === true;
    if(value == true){

        sidebar.classList.toggle("open");
        menuBtnChange();
    }
} 
else {
    sessionStorage.navbarStatus = false;
}

// Note we disable all transitions for the because otherwise it wont look very good and activate it here again
setTimeout(function () {
    document.body.classList.remove("preload")
}, 500);



closeBtn.addEventListener("click", ()=>{
    if($(window).width() > 768) {
        // Get inverted boolean and set new value in storage
        var value = JSON.parse(sessionStorage.navbarStatus) === false;
        sessionStorage.navbarStatus = value;
    }

    // Toggle the navbars visuals
    sidebar.classList.toggle("open");
    menuBtnChange();
});

let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
        let subMenuLinks = arrowParent.querySelector(".sub-menu").querySelectorAll("a");

        for(let j = 0; j < subMenuLinks.length; j++){
            setTimeout(function () {
                subMenuLinks[j].classList.toggle("closed");
            }, 50 * j);
        }
    });
}

// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if(sidebar.classList.contains("open")){
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }
    else {
        closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
    }
}

