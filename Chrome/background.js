var list;

chrome.storage.local.get('storageObjectName', function (data) {
    if (data.storageObjectName != null) {
        list = data.storageObjectName;
        
        chrome.webRequest.onBeforeRequest.addListener(
            function(details) {
                url = details.url.split("/");
                return {
                    redirectUrl : chrome.runtime.getURL("blockedPage.html"+ "?site=" + url[2]),
                }
            },
            { urls: list },
            ["blocking"]
        )
    }
});

window.onload = () => {
    chrome.storage.local.get('storageObjectName', function (data) {
        list = data.storageObjectName;

        if (data.storageObjectName == null) {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + "0" + "</u>" + "<hr>";

            document.getElementById("empty").innerHTML = "Your list is currently empty. Add website to the list or import your own list.";
        } else {
            document.getElementById("totalItems").innerHTML = "Total Items: " + "<u>" + data.storageObjectName.length + "</u>" + "<hr>";

            displayList(data.storageObjectName);
        }

        document.getElementById('buttonAdd').addEventListener('click', function () {
            var value = document.getElementById('textAreaUserInput').value;
            var userInput = value.split(/\r?\n/);
            addToList(list, userInput)
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

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        title: "Click to add link to blacklist",
        contexts:["selection"],
        onclick: function(textData) {
            chrome.storage.local.get('storageObjectName', function (data) {
                addToListByContextMenu(data.storageObjectName, textData);
            });
        }
    });
});

function displayList(list) {
    for(var i =  list.length - 1; i > -1; i--) {
        var text = list[i];
        var newText = text.substring(6);
        var displayText = newText.slice(0, -2);
        document.getElementById('blacklist').innerHTML += '<h3>' + displayText + '</h3>' + '<hr />';
    }
}

function addToList(list, userInput) {
    if (list == null) {
        list = [];
    }

    if (userInput.length < 1 || userInput == "") {
        alert("You did not enter any websites.\n\nPlease enter in some websites into the textarea and try again.");
    } else {
        for (var i = 0; i < userInput.length; i++) {
            var prefix = "*://*.";
            var suffix = "/*";
            var result = prefix.concat(userInput[i]);
            var final_result = result.concat(suffix);

            if ((list.includes(final_result) != true)  && (userInput[i].replace(/\s/g, '').length)) {
                list.push(final_result);

                chrome.storage.local.set({'storageObjectName': list}, function () {
        
                });
            }
        }
        alert("Website has been added. Page will reload shortly.\n\nNote duplicate items and strings that only contain whitespaces will not be added.");

        location.reload();
    }
}

function addToListByContextMenu(list, input) {
    if (list == null) {
        list = [];
    }

    var website = input.selectionText;

    if(website.length <= 2) {
        alert("You tried to add an invalid website.\n\nPlease Try again.");
    } else if (website == "" || website == null) {
        alert("You did not enter any websites.\n\nPlease enter in some websites into the textarea and try again.");
    } else {
        var prefix = "*://*.";
        var suffix = "/*";
        var result = prefix.concat(website);
        var final_result = result.concat(suffix);

        if (list.includes(final_result) != true) {
            list.push(final_result);

            chrome.storage.local.set({'storageObjectName': list}, function () {
    
            });

            alert("Website has been added.\n\nPage will reload shortly.");

            location.reload();
        } else {
            alert("Item seems to already be in your list.\n\nPlease try again.")
        }
    }
}

function clearList() {
    var value = confirm("Are you sure you want to clear the current list?\n\nYou should consider saving your current list before doing so.");

    if (value == true) {
        chrome.storage.local.clear(function() {
        
        });
    
        alert("List has been cleared.\n\nPage will reload shortly.");

        location.reload();
    } else {
        alert("List will not be cleared.");
    }
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
    var value = confirm("Are you sure you want to import the list?\n\nYour current list will be overwritten with the imported list.");

    if (value == true) {
        reader.addEventListener('load', function (e) {
            list = e.target.result.split(",");
            chrome.storage.local.set({'storageObjectName': list}, function () {
        
            });
        });
    
        reader.readAsBinaryString(file);
    
        alert("Text file has successfully imported.\n\nPage will reload shortly.");

        location.reload();
    } else {
        alert("List will not be imported.\n\nPage will reload shortly.");

        location.reload();
    }
}