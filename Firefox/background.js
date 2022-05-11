var list;

browser.storage.local.get('storageObjectName', function (data) {
    if (data.storageObjectName != null) {
        list = data.storageObjectName;

        browser.webRequest.onBeforeRequest.addListener(
            function(details) {
                blockedPage = (Math.floor(Math.random() * 10) + 1);
                return {
                    redirectUrl : browser.runtime.getURL("blockedPages/blockedPage" + blockedPage + ".html"),
                }
            },
            { urls: list },
            ["blocking"]
        )
    }
});

window.onload=function() {
    browser.storage.local.get('storageObjectName', function (data) {
        list = data.storageObjectName;

        if (data.storageObjectName == null) {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + "0" + "</u>" + "<hr>";

            document.getElementById("empty").innerHTML = "Your list is currently empty. Add website to the list or import your own list.";
        } else {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + data.storageObjectName.length + "</u>" + "<hr>";

            displayList(data.storageObjectName);
        }

        document.getElementById('buttonAdd').addEventListener('click', function () {
            addToList(list);
        });
    });

    document.getElementById('buttonClear').addEventListener('click', function () {
        clearList();
    });

    document.getElementById('buttonDownload').addEventListener('click', function () {
        saveList();
    });

    document.getElementById("file").addEventListener("change", function () {
        if (this.files && this.files[0]) {
            var file = this.files[0];
            var reader = new FileReader();
            importList(file, reader);
        } else {
            alert("There seems to be a problem with reading the file.");
        }
    });
}

browser.contextMenus.removeAll(function() {
    browser.contextMenus.create({
        title: "Click to add link to blacklist",
        contexts:["selection"],
        onclick: function(textData) {
            browser.storage.local.get('storageObjectName', function (data) {
                addToListByContextMenu(data.storageObjectName, textData);
            });
        }
    });
});

function displayList(list) {
    for(var i =  list.length - 1; i > -1; i--) {
        text = list[i];
        newText = text.substring(6);
        newText = newText.slice(0, -2);
        document.getElementById('blacklist').innerHTML += '<h3>' + newText + '</h3>' + '<hr />';
    }
}

function addToList(list) {
    if (list == null) {
        list = [];
    }

    var website = prompt("ENTER WEBSITE TO BLOCK");

    if (website != null) {
        var prefix = "*://*.";
        var suffix = "/*";
        var result = prefix.concat(website);
        var final_result = result.concat(suffix);

        if (list.includes(final_result) != true) {
            list.push(final_result)

            browser.storage.local.set({'storageObjectName': list}, function () {
    
            });

            alert("Website has been added.\n\nPage will reload shorly.");

            location.reload();
        } else {
            alert("Website seems to already be in your list.\n\nPlease try again.");
        }
    } else {
        alert("Item seems to be invalid.\n\nPlease try again.");
    }
}

function addToListByContextMenu(list, input) {
    if (list == null) {
        list = [];
    }

    var website = input.selectionText;

    if (website != null) {
        var prefix = "*://*."
        var suffix = "/*"
        var result = prefix.concat(website)
        var final_result = result.concat(suffix)

        if (list.includes(final_result) != true) {
            list.push(final_result)

            browser.storage.local.set({'storageObjectName': list}, function () {
    
            });

            alert("Website has been added.");

            location.reload();
        } else {
            alert("Website seems to already be in your list.\n\nPlease try again.")
        }
    } else {
        alert("Item seems to be invalid.\n\nPlease try again.")
    }
}

function clearList() {
    browser.storage.local.clear(function() {
        
    });

    alert("List has been cleared.\n\nPage will reload shortly.");

    location.reload();
}

function saveList() {
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
}

function importList(file, reader) {
    reader.addEventListener('load', function (e) {
        list = e.target.result.split(",")
        browser.storage.local.set({'storageObjectName': list}, function () {
    
        });
    });

    reader.readAsBinaryString(file);

    alert("Text file has successfully imported.\n\nPage will reload shortly.");

    location.reload();
}