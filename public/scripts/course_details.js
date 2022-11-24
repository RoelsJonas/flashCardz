const shareButton = document.getElementById("btn-share");
const shareDiv = document.getElementById("share");

shareButton.addEventListener("click", () => {
    shareDiv.innerHTML = '<img src="https://qrtag.net/api/qr_transparent_12.svg?url=' + window.location.href + '"" alt="qrCode">';
});