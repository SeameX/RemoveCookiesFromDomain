chrome.browserAction.onClicked.addListener(function (tab) {

    removeAllCookiesFromDomain(tab.url);
    chrome.tabs.reload(tab.id);
});

function removeAllCookiesFromDomain(currentTabUrl) {
    var url = (new URL(currentTabUrl)).hostname;
    // Don't split if domain is localhost
    if (url != 'localhost') {
      var splittedUrl = url.split('.');
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
    } else {
      // remove cookies for localhost
      chrome.cookies.getAll({domain: "localhost"}, function (cookies) {
          for (var i = 0; i < cookies.length; i++) {
              var scheme = "";
              if(cookies[i].secure)
                  scheme = "https://";

              // Protocol agnostic
              chrome.cookies.remove({url: scheme + "localhost" + cookies[i].path, name: cookies[i].name});
          }
      });
    }
}
