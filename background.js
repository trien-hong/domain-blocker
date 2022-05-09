var list;
var blockedPages = ["blockedPage1.html", "blockedPage2.html", "blockedPage3.html", "blockedPage4.html", "blockedPage5.html", "blockedPage6.html", "blockedPage7.html", "blockedPage8.html", "blockedPage9.html", "blockedPage10.html"];

chrome.storage.local.get('storageObjectName', function (data) {
    if (data.storageObjectName != null) {
        list = data.storageObjectName;

        chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                blockedPage = blockedPages[Math.floor(Math.random() * 10)];
                return { 
                    redirectUrl : chrome.extension.getURL("blockedPages/"+ blockedPage),
                }
            },
            { urls: list },
            ["blocking"]
        )
    }
});

window.onload=function() {
    chrome.storage.local.get('storageObjectName', function (data) {
        list = data.storageObjectName;

        if (data.storageObjectName == null) {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + "0" + "</u>" + "<hr>";

            document.getElementById("empty").innerHTML = "Your list is currently empty. Add website to the list or import your own list.";
        } else {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + data.storageObjectName.length + "</u>" + "<hr>";

            for(var i =  0; i < data.storageObjectName.length; i++) {
                text = data.storageObjectName[i];
                newText = text.substring(6);
                newText = newText.slice(0, -2);
                document.getElementById('blacklist').innerHTML += '<h3>' + newText + '</h3>' + '<hr />';
            }
        }

        document.getElementById('buttonAdd').addEventListener('click', function () {
            if (list == null) {
                list = [];
            }

            var website = prompt("ENTER WEBSITE TO BLOCK");

            if (website != null) {
                var prefix = "*://*."
                var suffix = "/*"
                var result = prefix.concat(website)
                var final_result = result.concat(suffix)

                if (list.includes(final_result) != true) {
                    list.push(final_result)

                    chrome.storage.local.set({'storageObjectName': list}, function () {
    
                    });

                    alert("Website has been added.\n\nPage will reload shorly.");

                    location.reload();
                } else {
                    alert("Website seems to already be in your list.\n\nPlease try again.")
                }
            } else {
                alert("Item seems to be invalid.\n\nPlease try again.")
            }
        });
    });

    document.getElementById('buttonClear').addEventListener('click', function () {
        chrome.storage.local.clear(function() {
        
        });

        alert("List has been cleared.\n\nPage will reload shortly.");

        location.reload();
    });

    document.getElementById('buttonDownload').addEventListener('click', function () {
        var saveData = (function () {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';

            return function (fileName) {
                blob = new Blob([list], {type: 'octet/stream'}),
                url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());


        var today = new Date();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var dd = String(today.getDate()).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = mm + '-' + dd + '-' + yyyy;

        var fileName = "blacklistExport" + "_" + today + ".txt";

        saveData(fileName);
    });

    var input = document.getElementById("file");

    input.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            var file = this.files[0];
            var reader = new FileReader();
    
            reader.addEventListener('load', function (e) {
            list = e.target.result.split(",")
            chrome.storage.local.set({'storageObjectName': list}, function () {
    
            });
        });    
        reader.readAsBinaryString(file);
        }
        alert("Text file has successfully imported.\n\nPage will reload shortly.");
        location.reload();
    });
}

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "Click to add link to blacklist",
        contexts:["selection"],
        onclick: function(textData) {
            chrome.storage.local.get('storageObjectName', function (data) {
                list = data.storageObjectName;

                if (list == null) {
                    list = [];
                }

                var website = textData.selectionText;

                if (website != null) {
                    var prefix = "*://*."
                    var suffix = "/*"
                    var result = prefix.concat(website)
                    var final_result = result.concat(suffix)

                    if (list.includes(final_result) != true) {
                        list.push(final_result)

                        chrome.storage.local.set({'storageObjectName': list}, function () {
    
                        });

                        alert("Website has been added.");

                        location.reload();
                    } else {
                        alert("Website seems to already be in your list.\n\nPlease try again.")
                    }
                } else {
                    alert("Item seems to be invalid.\n\nPlease try again.")
                }
            });
        }
    });
});