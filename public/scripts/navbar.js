let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
// let themes = document.querySelectorAll('[name="theme"]');
let themes = [document.querySelector("#light"), document.querySelector("#dark")];
let sunIcon = document.querySelector("#sun");
let moonIcon = document.querySelector("#moon");

sunIcon.addEventListener("click", () => {
    themes[0].checked = true;
    storeTheme(themes[0].id);
});

moonIcon.addEventListener("click", () => {
    themes[1].checked = true;
    storeTheme(themes[1].id);
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
    themes.forEach((theme) => {
        if(theme.id == selected) {
            theme.checked = true;
        }
    });
}

    


closeBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
});

let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
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
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    }
    else {
        closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
    }
}

