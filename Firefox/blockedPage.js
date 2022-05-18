browser.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    var newUrl = url.replace("www.", "");
    var website = newUrl.split("=");
    var img = (Math.floor(Math.random() * 10) + 1);

    if (website[website.length - 1].includes("//") == true) {
        document.body.style.backgroundImage = 'url(images/blockedPage' + img + '.jpg)';
        document.getElementById("message").innerHTML = "<h1><b><u><img src=\"../images/error_icon1.png\">Sorry, this ad has been blocked.<img src=\"../images/error_icon2.png\"></u></b></h1>";
    } else {
        document.body.style.backgroundImage = 'url(images/blockedPage' + img + '.jpg)';
        document.getElementById("message").innerHTML = "<h1><b><u><img src=\"../images/error_icon1.png\">Sorry, \"" + website[website.length - 1] + "\" has been blocked.<img src=\"../images/error_icon2.png\"></u></b></h1>";
    }
});

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload(true);
    }
});