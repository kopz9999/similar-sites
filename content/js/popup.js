var server = {version: "4.1.1", "server": "https://t.similarsites.com"};
var url = "blank", curDomain = "";

$("body").on("click", ".item-detail", function () {
    var url = $(this).attr("data-url");
    window.open(url, "_blank");
    $(document).click();
});

$("body").on("click", "a", function (e) {
  e.preventDefault();
  if (this.href) {
    window.parent.SimilarSitesApp.instance.openTab( this.href );
  }
});

/*
$("body").on("click", ".item-detail", function () {
    openUrl($(this).attr("data-url"));
});

$("body").on("click", "a", function (e) {
    e.preventDefault();
    openUrl($(this).attr("href"));
});*/


function openUrl(url) {
    addon.postMessage({cmd: "openUrl", url: url});
}

// Processes similiar site XML
function processSimiliarXML(xml, url) {
    var cnt;
    $(".InnerContainer").html("").css("overflow-y", "auto");
    try {
        var info = $($.parseXML(xml)), status = info.find("status").text();
        if (status == 0) {
            var curDomain = info.find("search_site url").text();
            $(".toWord").fadeIn("fast");
            $(".siteName").text(curDomain);
            $("#similarTitle a").attr("href", " http://www.similarsites.com/site/" + curDomain);
            info.find("site").each(function (i) {
                if (i < 9) {
                    var name = $(this).find("title").text(),
                        url = $(this).find("url").text(),
                        icon = $(this).find("icon").text(),
                        image = $(this).find("image").text(),
                        description = $(this).find("description").text(),
                        title = $(this).find("title").text();
                    url = 'http://' + url;
                    addSiteButton(name, url, icon, image, description, title);
                    cnt = cnt + 1;
                }
            });
        }
        if (status == 1 || cnt == 0) {
            showErrorInfo(url);
        }
    }
    catch (ex) {
    }
}

function showErrorInfo(url) {
    $(".siteName").html("<b style='color: red; padding-left: 15px'>Error...</b>");
    $(".siteName").parent("a").attr("href", "http://www.similarsites.com/");
    var errResult =
        '<div class="container" style="height: 100%">' +
        '<p class="no-results-para">Unable to locate results for: <span class="site">' + get_hostname(url) + '</span></p>' +
        '<p class="no-results-para">Please check the URL or try again later.</p>' +
        '</div>';
    $('.InnerContainer').html(errResult).css("overflow-y", "hidden");
    $("#error-img").click(function () {
        t.create({url: "http://www.similarsites.com/"});
    });
}


// Adds a site button.
function addSiteButton(name, url, icon, image, description, title) {
    var hostUrl = getHost(url);
    var button = createButton(name, hostUrl, icon, image, description, title);
    $('.InnerContainer').append(button);
    return button;
}

// Creates a site button element
function createButton(name, url, icon, image, description, title) {
    if (name == null)         name = '';
    if (url == null)          url = '';
    if (icon == null)         icon = '';
    if (image == null)        image = '';
    if (description == null)  description = '';
    var finalStr = '\
    <div class="item itemCss">\
        <div class="item-billboard item-billboard-css">\
            <div class="item-billboard-img">\
                <img alt="' + name + '" src="' + image.replace("&t=0", "&t=1") + '" />\
            </div>\
             <div class="item-billboard-site">\
                <h3>\
                    <span class="js-linkout result-title" data-site="' + url + '" data-position="8"><a target="_blank"  href="http://' + url + '">' + capitaliseFirstLetter(title) + '</a></span>\
                </h3>\
            </div>\
        </div>\
        <div class="item-detail" data-url="http://' + url + '">\
            <div class="item-detail-desc">\
                <p>' + description + '</p>\
            </div>\
            <div class="item-detail-btn" title="click to visit the site">\
                 <img class="favicon" src="' + icon + '"><span class="title">' + url + '</span>\
            </div>\
        </div>\
    </div> \
    ';
    return finalStr;
}

function getHost(url) {
    var anchor = document.createElement('a');
    anchor.href = url;
    return anchor.hostname;
}

function get_hostname(url) {
    var result;
    if (!url) {
        return url;
    } else {
        result = url.match(/:\/\/(.[^/]+)/);
        if (result != null && result.length > 1) {
            return result[1];
        } else {
            return url
        }
    }
}

// Initiates the entire process of displaying recommendations and getting similiar sites
function updateRootSite(tab) {
    try {
        getSimiliarSites(tab.url);
    }
    catch (ex) {
    }
}

function capitaliseFirstLetter(string) {
    string = string.length > 40 ? string.substr(0, 38) + "..." : string;
    //return (string.charAt(0).toUpperCase() + string.slice(1)).substr(0, 45) + "...";
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function resetPage() {
    $(".toWord").hide();
    $(".siteName").text(" Retrieving Data...");
    $(".InnerContainer").html("");
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function validateUrl(url) {
    return url.indexOf("http") === 0 && url.indexOf("://localhost") === -1
}

function doRequest() {
  var url = getParameterByName("url");
  if (validateUrl(url)) {
    var similarQuery = server.server + "/related?s=5501&md=18&q=" + encodeURIComponent(url);
    $.ajax({
      url: similarQuery,
      type: 'GET',
      success: function( response ) {
        var domain = get_hostname(url);
        if (curDomain != domain) {
          curDomain = domain;
          var text = (new XMLSerializer()).serializeToString(response);
          processSimiliarXML(text, url);
        }
      }
    });
  } else {
    showErrorInfo(url);
  }
}

$(document).ready( function(){
  doRequest();
});
