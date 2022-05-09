// TWP.Util graphics utilities
TWP.Util = TWP.Util || {};

// Returns the paramters as an object, key=>value pairs
TWP.Util.getParameters = function(url){
    var paramList = [], params = {}, kvPairs, tmp;
    url = (url !== '' && typeof url === 'string') ? url : document.URL;
    if(url){
        if(url.indexOf("?") !== -1){
            paramList = url.split("?")[1];
            if(paramList){
                if(paramList.indexOf("&")){
                    kvPairs = paramList.split("&");
                } else {
                    kvPairs = [paramList];
                }
                for(var a=0;a<kvPairs.length;a++){
                    if(kvPairs[a].indexOf("=") !== -1){
                        tmp = kvPairs[a].split("=");
                        params[tmp[0]] = unescape(tmp[1]);
                    }
                }
            }
        }
    }
    return (params) ? params : null;
};

// number rounding with suffix labels
TWP.Util.roundNumber = function(number, decimals, label){
    var p = [0, 0, 6, 9, 12, 15],
        n = parseInt(number),
        s = n.toString(),
        c = Math.floor((s.length-1)/3),
        d = Math.pow(10, p[c]),
        f = n/d,
        i = ['','','million','billion','trillion','quadrillion'];

    if (label == 'auto' || label == undefined){ label = n >= 1000000 ? ' ' + i[c] : ''; }
    else if (label == ''){ label = ''; }
    else {label = ' ' + label; }

    return TWP.Util.addCommas(f.toFixed(decimals)) + label;
};

// add commas to numbers
TWP.Util.addCommas = function(x) {
    return String(x).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")
};

// slugify 'Wilson Andrews' => wilson-andrews
TWP.Util.slugify = function(t) {
    return t.replace(/[^-a-zA-Z0-9\s]+/ig, '').replace(/-/gi, "_").replace(/\s/gi, "-").toLowerCase();
};

// capitalize the first letter of each word
TWP.Util.toTitleCase = function(t) {
    var txt = '';
    var split = t.split(' ');
    for (var i=0; i<split.length; i++) {
        txt += split[i].substr(0,1).toUpperCase() + split[i].substr(1);
        txt += i < split.length-1 ? ' ' : '';
    }
    return txt;
};

// #000000 => rgba(0,0,0,1)
TWP.Util.hex2rgba = function(hex,a) {
  if (hex[0]=="#") hex=hex.substr(1);
  if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
  }
  var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
  var alpha = a ? a : 1;
  return 'rgba('+parseInt(triplets[0],16) +','+ parseInt(triplets[1],16) +','+ parseInt(triplets[2],16) +','+ alpha +')';
};

// add Array.indexOf to IE
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
};

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    AndroidOld: function () {
        return navigator.userAgent.match(/Android 2.3.3/i) ? true : false;
    },
	AndroidTablet: function () {
        return (navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/Mobile/i))? true : false;
    },
    Kindle: function () {
        return navigator.userAgent.match(/Kindle/i) ? true : false;
    },
    KindleFire: function () {
        return navigator.userAgent.match(/KFOT/i) ? true : false;
    },
    Silk: function () {
        return navigator.userAgent.match(/Silk/i) ? true : false;
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    iPhone: function () {
        return navigator.userAgent.match(/iPhone|iPod/i) ? true : false;
    },
    iPad: function () {
        return navigator.userAgent.match(/iPad/i) ? true : false;
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    FirefoxOS: function () {
        return (navigator.userAgent.match(/Mozilla/i) && navigator.userAgent.match(/Mobile/i)) ? true : false;
    },
    Retina: function () {
        return (window.retina || window.devicePixelRatio > 1) ? true : false
    },
    any: function () {
        return (isMobile.Android() || isMobile.Kindle() || isMobile.KindleFire() || isMobile.Silk() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows() || isMobile.FirefoxOS());
    },
    all: function () {
        return (navigator.userAgent);
    },
    tablet: function() {
        return isMobile.AndroidTablet() || isMobile.iPad() || isMobile.Kindle() || isMobile.KindleFire() || isMobile.Silk()
    }
};


// Mobile global var
var mobile_browser = isMobile.any() ? 1 : 0,
    iphone_browser = isMobile.iPhone() ? 1 : 0,
    ipad_browser = isMobile.iPad() ? 1 : 0,
    android_browser = isMobile.Android() ? 1 : 0,
    android233_browser = isMobile.AndroidOld() ? 1 : 0,
    kindle_browser = isMobile.Kindle() ? 1 : 0,
    retina_browser = isMobile.Retina() ? 1: 0;