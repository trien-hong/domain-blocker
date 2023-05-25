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

    browser.storage.local.get('isPause', function (data) {
        if (data.isPause == false || data.isPause == null) {
            document.getElementById('msg').innerHTML = "<h3>Extension is not paused.</h3>"
            document.getElementById('buttonPause').innerHTML = "<button class=\"buttonPause1\">PAUSE EXTENSION</button>"
            document.getElementById('buttonPause').addEventListener('click', function() {
                pauseOrUnpause(false);
            });
        } else {
            document.getElementById('msg').innerHTML = "<h3>Extension is paused.</h3>"
            document.getElementById('buttonPause').innerHTML = "<button class=\"buttonPause2\">UNPAUSE EXTENSION</button>"
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
        browser.runtime.sendMessage({type: "pauseOrUnpauseExtension", pauseOrUnpauseExtension:true});
        
        location.reload();
    } else {
        //extension is paused so send msg to unpause extension
        browser.runtime.sendMessage({type: "pauseOrUnpauseExtension", pauseOrUnpauseExtension:false});

        location.reload();
    }
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