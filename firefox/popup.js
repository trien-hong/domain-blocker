window.onload = () => {
    document.getElementById('buttonAdd').addEventListener('click', function () {
        addToList();
    });

    document.getElementById('buttonEFR').addEventListener('click', function() {
        browser.runtime.reload();
    });

    document.getElementById('buttonH').addEventListener('click', function () {
        browser.tabs.create({ url: "options.html" });
    });

    document.getElementById('buttonA').addEventListener('click', function () {
        browser.tabs.create({ url: "about.html" });
    });

    document.getElementById('buttonI').addEventListener('click', function () {
        browser.tabs.create({ url: "knownIssues.html" });
    });

    displayDomain();
}

function addToList() {
    browser.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        var newUrl = url.replace("www.", "");
        var website = newUrl.split("/");

        browser.runtime.sendMessage({type: "addToList", addToList:website[2]});

        browser.tabs.update({ url: "blockedPage.html"+ "?site=" + website[2] });

        window.close();
    });
}

function displayDomain() {
    browser.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        var newUrl = url.replace("www.", "");
        if (newUrl.includes("?site=") == true) {
            var website = newUrl.split("=");
            var image = document.createElement("img");
            image.setAttribute("src", "images/x-mark.png");
            image.setAttribute("height", "40");
            image.setAttribute("width", "40");
            document.getElementById('allow-block-image').appendChild(image);
            document.getElementById('allow-block-msg').innerHTML = "<h3>&nbsp&nbspDomain is blocked.</h3>"
            document.getElementById("domain").innerHTML = "<h3>DOMAIN: <u>" + website[website.length - 1] + "</u></h3>";
        } else {
            var website = newUrl.split("/");
            var image = document.createElement("img");
            image.setAttribute("src", "images/c-mark.png");
            image.setAttribute("height", "40");
            image.setAttribute("width", "40");
            document.getElementById('allow-block-image').appendChild(image);
            document.getElementById('allow-block-msg').innerHTML = "<h3>&nbsp&nbspDomain is not blocked.</h3>"
            document.getElementById("domain").innerHTML = "<h3>DOMAIN: <u>" + website[2] + "</u></h3>";
        }
    });
}

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.type == "refresh") {
        location.reload(true);
    }
});