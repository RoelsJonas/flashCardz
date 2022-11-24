const shareQrButton = document.getElementById("btn-share-qr");
const shareLinkButton = document.getElementById("btn-share-link");
const shareDiv = document.getElementById("share");
const courseName = document.getElementById("course-name").innerText;
const copiedLabel = document.getElementById("lbl-copied");

shareQrButton.addEventListener("click", () => {
    shareDiv.innerHTML = '<img src="https://qrtag.net/api/qr_transparent_12.svg?url=' + window.location.href + '"" alt="qrCode">';
});

shareLinkButton.addEventListener('click', () => {
    navigator.clipboard.writeText("Start studying " + courseName + " now at: " + window.location.href)
    copiedLabel.style = "scale: 1";
    copiedLabel.style = "transition: opacity .5s ease-in 2s; opacity: 0;";
});