SimilarSitesApp = function() {
  this.button = null;
  this.panel = null;
};

SimilarSitesApp.prototype.initElements = function () {
  this.button = document.getElementById('similarsites');
  this.panel = document.getElementById('similarsites-popup');
  this.iframe = document.getElementById('popup-iframe');
};

SimilarSitesApp.prototype.handleButtonClick = function () {
  var url = 'chrome://xul-similar-sites/content/popup.html?url='+
    encodeURIComponent(gBrowser.contentDocument.location.href);
  //var url = 'chrome://xul-similar-sites/content/popup.html?url='+
    //encodeURIComponent( "https://www.google.com/?gws_rd=ssl" );
  this.panel.openPopup(this.button, 'after_start', -16, 0, false, false);
  this.iframe.setAttribute("src", url);
};

SimilarSitesApp.prototype.openTab = function (url) {
  gBrowser.selectedTab = gBrowser.addTab(url);
  this.panel.hidePopup();
};

SimilarSitesApp.instance = new SimilarSitesApp();

// rest of overlay code goes here.
window.addEventListener( "load", function() {
  SimilarSitesApp.instance.initElements();
}, false);
