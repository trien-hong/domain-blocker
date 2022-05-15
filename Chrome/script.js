chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    chrome.storage.local.get('storageObjectName', function (data) {
        list = data.storageObjectName;
        var url = tabs[0].url;
        var newUrl = url.replace("www.", "");
        var page = newUrl.split("=");
        var prefix = "*://*.";
        var suffix = "/*";
        var referrer = prefix.concat(page[page.length - 1]);
        referrer = referrer.concat(suffix);

        img = (Math.floor(Math.random() * 10) + 1);
        document.body.style.backgroundImage = 'url(images/blockedPage' + img + '.jpg)';
        document.getElementById("message").innerHTML = "<h1><b><u><img src=\"../images/error_icon1.png\">Sorry, \"" + page[page.length - 1]+ "\" has been blocked.<img src=\"../images/error_icon2.png\"></u></b></h1>";
    });
});