/* eslint-disable */

if (!_sf_async_config && !window._sf_async_config && -1 === document.location.href.indexOf("template=iframe")) try {
  var _sf_async_config = {
    uid: 19624,
    domain: "washingtonpost.com"
  };
  _sf_async_config.sections = wp_channel, _sf_async_config.path = document.location.pathname, _sf_async_config.useCanonical = !0, _sf_async_config.title = document.title.replace(" - The Washington Post", ""), $(document).ready(function() {
    $.getScript("http://static.chartbeat.com/js/chartbeat.js")
  })
} catch (e) {}

function checkGDPRPremium() {
  var e, t, a, o, n, i = (t = "rplampr=", a = null, o = 0, n = 0, (e = "" + document.cookie).length > 0 && -1 !== (o = e.indexOf(t)) && (o += t.length, -1 === (n = e.indexOf(";", o)) && (n = e.length), a = unescape(e.substring(o, n))), a);
  i && i.indexOf("Premium") > -1 && (document.documentElement.className += " gdpr-premium")
}

function getParameters(e) {
  var t, a, o = [],
    n = {};
  if ((e = void 0 === e || "" === e ? document.URL : e) && -1 !== e.indexOf("?") && (o = e.split("?")[1])) {
    t = o.indexOf("&") ? o.split("&") : [o];
    for (var i = 0; i < t.length; i++) - 1 !== t[i].indexOf("=") && (n[(a = t[i].split("="))[0]] = unescape(a[1]))
  }
  return n || null
}
TWP.Util.toTitleCase = function(e) {
    for (var t = "", a = e.split(" "), o = 0; o < a.length; o++) t += a[o].substr(0, 1).toUpperCase() + a[o].substr(1), t += o < a.length - 1 ? " " : "";
    return t
  }, checkGDPRPremium(),
  function(e) {
    var t;
    e(document).ready(function() {
      t = e("#nav"), e("#main-container"),
        function() {
          var t = e("link[rel=canonical]").attr("href"),
            a = e("link[rel=shorturl]").attr("href"),
            o = e('meta[name="twitter:title"]').attr("content"),
            n = e('meta[name="twitter:site"]').attr("content"),
            i = "mailto:?subject=" + o + " " + t;
          e("#dd-share-em a").attr("href", i);
          var r = "https://facebook.com/dialog/feed?app_id=41245586762&link=" + t + "&name=" + o + "&redirect_uri=" + t;
          e("#dd-share-fb a").attr("href", r);
          var s = "http://twitter.com/intent/tweet?text=" + encodeURI(o + " " + a + " via " + n);
          e("#dd-share-tw a").attr("href", s)
        }(), t.find("li.share").on("mouseenter", function() {
          e(this).find(".dropdown-menu").addClass("show-dd-menu"), e(this).find(".dropdown-menu").show()
        }).on("mouseleave", function() {
          e(this).find(".dropdown-menu").removeClass("show-dd-menu"), e(this).find(".dropdown-menu").hide()
        }).on("click", function(t) {
          e(this).hasClass("show-dd-menu") ? (e(this).removeClass("show-dd-menu"), e(this).find(".dropdown-menu").hide()) : 1 !== mobile_browser && 1 !== ipad_browser || (e(this).addClass("show-dd-menu"), e(this).find(".dropdown-menu").show())
        }), t.find("li.share").children("a").on("click", function(e) {
          e.preventDefault()
        });
      var a = getParameters(document.URL);
      a.template && "iframe" === a.template && (e("body").addClass("iframe").show().css("display", "block"), e("#main-container .main-content").siblings().hide())
    })
  }(jQuery),
  function(e, t, a, o, n) {
    e[o] = e[o] || [], e[o].push({
      "gtm.start": (new Date).getTime(),
      event: "gtm.js"
    });
    var i = t.getElementsByTagName(a)[0],
      r = t.createElement(a);
    r.async = !0, r.src = "https://www.googletagmanager.com/gtm.js?id=GTM-WHNNX8B", i.parentNode.insertBefore(r, i)
  }(window, document, "script", "dataLayer");
var PREV_PAGE_KEY = "wapo_prev_page";

function hasLocalStorage() {
  try {
    var e = (new Date).toString();
    window.localStorage.setItem(e, e);
    var t = window.localStorage.getItem(e) === e;
    return window.localStorage.removeItem(e), t
  } catch (e) {
    return !1
  }
}

function getPreviousPage(e) {
  if (!hasLocalStorage()) return null;
  var t = window.localStorage.getItem(PREV_PAGE_KEY);
  return t === e ? null : t
}

function setPreviousPage(e) {
  hasLocalStorage() && window.localStorage.setItem(PREV_PAGE_KEY, e)
}

function getCookie(e) {
  var t = ("; " + document.cookie).split("; " + e + "=");
  if (2 == t.length) return t.pop().split(";").shift()
}

function isSubFromActmgmtCookie() {
  const cookieValue = getCookie("wapo_actmgmt");
  if (cookieValue) {
    const isub = cookieValue
      .split("|")
      .filter((item) => /^isub:/.test(item))[0];
    if (isub) {
      return !!parseInt(isub.charAt(isub.length - 1), 10);
    }
  }
  return false;
};

function getUrlVars() {
  var e = {};
  return window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(t, a, o) {
    e[a] = o
  }), e
}

if (getUrlVars()['no_nav'] === 'true'){
  document.querySelector('.pbHeader').style.display = 'none';
}

function sendAnalytics() {
  window.pageData.cookiesHit = `rplampr=${getCookie("rplampr")};wp_variant=${getCookie("wp_variant")}`, window.pageData.loginTypeHit = getCookie("wapoProvider") || "", window.pageData.userAgentHit = navigator.userAgent || "", window.pageData.pageViewType = "load", window.pageData.platformType = "custom", window.pageData.itid = getUrlVars().itid || "", window.pageData.previousPage = getPreviousPage(wp_proj_directory) || "", window.pageData.language = "en", window.pageData.property = "website", window.pageData.event = "classicPageView", window.muteErrors || (window.pageData.meterReason = pwapiPaywallResponse.data.mtr, window.pageData.meterCount = pwapiPaywallResponse.data.mtrct, window.pageData.meterWeight = pwapiPaywallResponse.data.mtrw, window.dataLayer.push(window.pageData)), setPreviousPage(wp_proj_directory)
}
window.dataLayer = window.dataLayer || [], window.pageData || (window.pageData = window.pageData || {}, window.pageData = {
  pageName: wp_proj_directory,
  arcId: wp_proj_directory.replace(/\//g,'').replace(/-/g,'').substr(0,26),
  section: window.pubCommercialNode || commercialNode,
  subsection: window.pubSubNode || window.pubCommercialNode || commercialNode,
  contentType: "enhanced-template",
  contentSource: "the washington post",
  authorName: window.wp_author ? window.wp_author : "(not set)",
  seoKeywords: document.querySelector('[name="keywords"]').attributes.content.value.replace(",", ";"),
  contentTags: "old-template",
  publishDate: document.querySelector('[itemprop="datePublished"]') ? document.querySelector('[itemprop="datePublished"]').attributes.content.value : ""
}), window.pwapiPaywallResponse ? sendAnalytics() : document.addEventListener("onTwpMeterComplete", sendAnalytics);
var target = document.getElementsByClassName("pg-mostRead");
if (0 === target.length && (target = document.getElementsByClassName("pgRelatedCoverage")), 0 === target.length && (target = document.getElementsByClassName("comments-wrapper")), 0 === target.length && (target = document.getElementsByClassName("side-articles")), target.length > 0) {
  var targetEl = target[target.length - 1],
    termsOfUseSring = '<div style="clear:both; max-width:600px; margin-left:auto;margin-right:auto;"><p class="pg-label--wBar"><strong>Terms of use</strong></p><ul style="list-style-type:none;padding-left:0;margin-left:0;"> <li style="padding-bottom: 6px;"><a style="color:#333" href="/policies-and-standards/">Policies and Standards</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/terms-of-sale-for-digital-products/2014/05/06/b7763844-cbf9-11e3-93eb-6c0037dde2ad_story.html">Digital Products Terms of Sale</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/terms-of-sale-for-print-products/2014/05/08/d60c4bc8-d6c0-11e3-aae8-c2d44bd79778_story.html">Print Products Terms of Sale</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/terms-of-service/2011/11/18/gIQAldiYiN_story.html">Terms of Service</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/privacy-policy/2011/11/18/gIQASIiaiN_story.html">Policies and Standards</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/policies-and-standards/">Privacy Policy</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/news/ask-the-post/discussion-and-submission-guidelines/">Submissions and Discussion Policy</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/rss-terms-of-service/2012/01/16/gIQAadFYAQ_story.html">RSS Terms of Service</a></li> <li style="padding-bottom: 6px;"><a style="color:#333" href="/how-can-i-opt-out-of-online-advertising-cookies/2011/11/18/gIQABECbiN_story.html">Ad Choices</a></li><li style="padding-bottom: 6px;"><a id="pg-ccpa" style="color:#333" href="/my-post/privacy-settings">Do Not Sell My Info</a></li></ul></div>';
  if (targetEl.insertAdjacentHTML("beforeend", termsOfUseSring), localStorage && null != localStorage.getItem("wapo_identity")) {
    var xIdent = JSON.parse(window.localStorage.getItem("wapo_identity"));
    "CA" !== xIdent.geoState && "CA" !== xIdent.addressState && (document.getElementById("pg-ccpa").style.display = "none")
  }
}

if(isSubFromActmgmtCookie()){
  $('.pb-f-page-subscription-promo, #nav-subscribe').remove();
  $('.endCap').remove();
}
