chrome.browserAction.onClicked.addListener(function (tab) {
    removeAllCookiesFromDomain(tab.url);
});


function removeAllCookiesFromDomain(currentTabUrl) {
    var url = (new URL(currentTabUrl)).hostname;

    var splittedUrl = url.split('.');
    var urlPieces = splittedUrl.pop(); // *.de

    // Remove toplevel domains aswell (like localhost)
    if (splittedUrl.length == 0)
        getAndRemoveCookiesForDomain(url);

    // Remove cookies for every subdomain
    while (splittedUrl.length > 0) {
        urlPieces = splittedUrl.pop() + "." + urlPieces;
        getAndRemoveCookiesForDomain(urlPieces);
    }
}

function getAndRemoveCookiesForDomain(urlPieces) {
    // Without Dot
    chrome.cookies.getAll({domain: urlPieces}, function (cookies) {
        removeCookies(urlPieces, cookies);
    });

    // With dot
    chrome.cookies.getAll({domain: "." + urlPieces}, function (cookies) {
        removeCookies(urlPieces, cookies);
    });
}

function removeCookies(urlPieces, cookies) {
    for (var i = 0; i < cookies.length; i++) {
        var scheme = "http://";

        if (cookies[i].secure)
            scheme = "https://";

        chrome.cookies.remove({url: scheme + urlPieces + cookies[i].path, name: cookies[i].name});
    }
}
