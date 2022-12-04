const ButtonResetCookies = document.getElementById("reset-cookies");

ButtonResetCookies.addEventListener("click", () => {
    consentPopup.classList.remove('hidden');
    localStorage.setItem("cookie-consent", false);
    console.log("test");
    console.log(localStorage.getItem("cookie-consent"));
});