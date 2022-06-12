window.onload = () => {
    getBlockedPage();
}

function getBlockedPage() {
    var url = window.location.href;
    var url2 = url.replace("www.", "");
    var domain = url2.split("=");
    var img = (Math.floor(Math.random() * 10) + 1);

    document.body.style.backgroundImage = 'url(images/blockedPage' + img + '.jpg)';
    document.getElementById("message").innerHTML = "<h1><b><u><img src=\"../images/error_icon1.png\">Sorry, \"" + domain[domain.length - 1] + "\" has been blocked.<img src=\"../images/error_icon2.png\"></u></b></h1>";
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload();
    }
});