const ButtonResetCookies = document.getElementById("reset-cookies");

ButtonResetCookies.addEventListener("click", () => {
    consentPopup.classList.remove('hidden');
    localStorage.setItem("cookie-consent", false);
});