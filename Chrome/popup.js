window.onload = () => {
    document.getElementById('buttonAdd').addEventListener('click', function () {
        addToList();
    });

    document.getElementById('buttonEFR').addEventListener('click', function() {
        chrome.runtime.reload();
    });

    document.getElementById('buttonH').addEventListener('click', function () {
        chrome.tabs.create({ url: "options.html" });
    });

    document.getElementById('buttonA').addEventListener('click', function () {
        chrome.tabs.create({ url: "about.html" });
    });

    document.getElementById('buttonI').addEventListener('click', function () {
        chrome.tabs.create({ url: "knownIssues.html" });
    });

    displayDomain();
}

function addToList() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        var newUrl = url.replace("www.", "");
        var website = newUrl.split("/");

        chrome.runtime.sendMessage({type: "addToList", addToList:website[2]});

        chrome.tabs.update({ url: "blockedPage.html"+ "?site=" + website[2] });

        window.close();
    });
}

function displayDomain() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        var newUrl = url.replace("www.", "");
        if (newUrl.includes("?site=") == true) {
            var website = newUrl.split("=");
            var image = document.createElement("img");
            image.setAttribute("src", "images/x-mark.png");
            image.setAttribute("height", "40");
            image.setAttribute("width", "40");
            document.getElementById('allow-block-image').appendChild(image);
            document.getElementById('allow-block-msg').innerHTML = "<h2>&nbsp&nbspDomain is blocked.</h2>"
            document.getElementById("domain").innerHTML = "<h2>DOMAIN: <u>" + website[website.length - 1] + "</u></h2>";
        } else {
            var website = newUrl.split("/");
            var image = document.createElement("img");
            image.setAttribute("src", "images/c-mark.png");
            image.setAttribute("height", "40");
            image.setAttribute("width", "40");
            document.getElementById('allow-block-image').appendChild(image);
            document.getElementById('allow-block-msg').innerHTML = "<h2>&nbsp&nbspDomain is not blocked.</h2>"
            document.getElementById("domain").innerHTML = "<h2>DOMAIN: <u>" + website[2] + "</u></h2>";
        }
    });
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload();
    }
});