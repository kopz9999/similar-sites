SimiSitesApp = function() {
  this.button = null;
  this.panel = null;
};

SimiSitesApp.prototype.initElements = function () {
  this.button = document.getElementById('similarsites');
  this.panel = document.getElementById('similarsites-popup');
  this.iframe = document.getElementById('popup-iframe');
};

SimiSitesApp.prototype.handleButtonClick = function () {
  var url = 'chrome://xul-similar-sites/content/popup.html?url='+
    encodeURIComponent(gBrowser.contentDocument.location.href);
  //var url = 'chrome://xul-similar-sites/content/popup.html?url='+
    //encodeURIComponent( "https://www.google.com/?gws_rd=ssl" );
  this.panel.openPopup(this.button, 'after_start', 0, 0, false, false);
  this.iframe.setAttribute("src", url);
  this.iframe.contentWindow.gBrowser = gBrowser;
};

SimiSitesApp.instance = new SimiSitesApp();

// rest of overlay code goes here.
window.addEventListener( "load", function() {
  SimiSitesApp.instance.initElements();
}, false);
