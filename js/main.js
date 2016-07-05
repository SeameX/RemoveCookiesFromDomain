chrome.browserAction.onClicked.addListener(function (tab) {
    removeAllCookiesFromDomain(tab.url);
});

function removeAllCookiesFromDomain(domain) {

    alert("d" + domain);

    var noDotDomain = domain.match(/:\/\/(.[^/:]+)/)[1];
    var domain = "." + noDotDomain;
    var mainDomain = domain;
    var mainDomainNoDot = noDotDomain;
    if (domain.indexOf('.www.') == 0) {
        mainDomain = '.' + domain.substr(5);
    }
    if (domain.indexOf('www.') == 0) {
        mainDomainNoDot = '.' + domain.substr(5);
    }

    //delete all host cookies
    chrome.cookies.getAll({domain: domain}, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({url: "http://" + domain + cookies[i].path, name: cookies[i].name});
        }
    });
    //and for the actual domain, if starts with www. (not sure that's really proper behavior?)
    chrome.cookies.getAll({domain: mainDomain}, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({url: "http://" + domain + cookies[i].path, name: cookies[i].name});
        }
    });
    //delete all host cookies (no dot version)
    chrome.cookies.getAll({domain: noDotDomain}, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({url: "http://" + noDotDomain + cookies[i].path, name: cookies[i].name});
        }
    });
    //and for the actual domain, no dots
    chrome.cookies.getAll({domain: mainDomainNoDot}, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({url: "http://" + mainDomainNoDot + cookies[i].path, name: cookies[i].name});
        }
    });

}