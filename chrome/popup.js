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

    chrome.storage.local.get('isPause', function (data) {
        if (data.isPause == false || data.isPause == null) {
            document.getElementById('msg').innerHTML = "<h2>Extension is not paused.</h2>"
            document.getElementById('buttonPause').innerHTML = "<button id=\"buttonPause1\">PAUSE EXTENSION</button>"
            document.getElementById('buttonPause').addEventListener('click', function() {
                pauseOrUnpause(false);
            });
        } else {
            document.getElementById('msg').innerHTML = "<h2>Extension is paused.</h2>"
            document.getElementById('buttonPause').innerHTML = "<button id=\"buttonPause2\">UNPAUSE EXTENSION</button>"
            document.getElementById('buttonPause').addEventListener('click', function() {
                pauseOrUnpause(true);
            });
        }
    });

    displayDomain();
}

function pauseOrUnpause(status) {
    if (status == false) {
        //extension is not on puased so send msg to pause extension
        chrome.runtime.sendMessage({type: "pauseOrUnpauseExtension", pauseOrUnpauseExtension:true});
        
        location.reload();
    } else {
        //extension is paused so send msg to unpause extension
        chrome.runtime.sendMessage({type: "pauseOrUnpauseExtension", pauseOrUnpauseExtension:false});

        location.reload();
    }
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