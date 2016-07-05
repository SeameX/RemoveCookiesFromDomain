chrome.browserAction.onClicked.addListener(function (tab) {

    removeAllCookiesFromDomain(tab.url);

    // Refresh tab
    chrome.tabs.executeScript(tab.id, {code: 'window.location.reload();'});
});

function removeAllCookiesFromDomain(currentTabUrl) {

    var splittedUrl = (new URL(currentTabUrl)).hostname.split('.');
    var urlPieces = splittedUrl.pop(); // *.de

    // Each time one more Subdomain
    while (splittedUrl.length > 0) {

        urlPieces = splittedUrl.pop() + "." + urlPieces; // first loop: seamex.de

        // Without Dot
        chrome.cookies.getAll({domain: urlPieces}, function (cookies) {
            for (var i = 0; i < cookies.length; i++) {
                var scheme = "http://";

                if(cookies[i].secure)
                    scheme = "https://";

                // Protocol agnostic
                chrome.cookies.remove({url: scheme + urlPieces + cookies[i].path, name: cookies[i].name});
            }
        });

        // With dot
        chrome.cookies.getAll({domain: "." + urlPieces}, function (cookies) {
            for (var i = 0; i < cookies.length; i++) {
                var scheme = "http://";

                if(cookies[i].secure)
                    scheme = "https://";

                // Protocol agnostic
                chrome.cookies.remove({url: scheme + urlPieces + cookies[i].path, name: cookies[i].name});
            }
        });
    }
}