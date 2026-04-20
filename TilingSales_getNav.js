var navigator = { appName: "Netscape", userAgent: "Loon" };
var window = typeof window !== "undefined" ? window : {};

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.JSEncrypt=e():t.JSEncrypt=e()}(window,(()=>(()=>{var t={155:t=>{var e,i,r=t.exports={};function n(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function o(t){if(e===setTimeout)return setTimeout(t,0);if((e===n||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(i){try{return e.call(null,t)}catch(i){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:n}catch(t){e=n}try{i="function"==typeof clearTimeout?clearTimeout:s}catch(t){i=s}}();var h,a=[],u=!1,c=-1;function f(){u&&h&&(u=!1,h.length?a=h.concat(a):c=-1,a.length&&l())}function l(){if(!u){var t=o(f);u=!0;for(var e=a.length;e;){for(h=a,a=[];++c<e;)h&&h[c].run();c=-1,e=a.length}h=null,u=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===s||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{return i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t)}}function p(t,e){this.fun=t,this.array=e}function g(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)e[i-1]=arguments[i];a.push(new p(t,e)),1!==a.length||u||o(l)},p.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=g,r.addListener=g,r.once=g,r.off=g,r.removeListener=g,r.removeAllListeners=g,r.emit=g,r.prependListener=g,r.prependOnceListener=g,r.listeners=function(t){return[]},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,i),s.exports}i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var r={};return(()=>{"use strict";i.d(r,{default:()=>ct});var t="0123456789abcdefghijklmnopqrstuvwxyz";function e(e){return t.charAt(e)}function n(t,e){return t&e}function s(t,e){return t|e}function o(t,e){return t^e}function h(t,e){return t&~e}function a(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function u(t){for(var e=0;0!=t;)t&=t-1,++e;return e}var c,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l="=";function p(t){var e,i,r="";for(e=0;e+3<=t.length;e+=3)i=parseInt(t.substring(e,e+3),16),r+=f.charAt(i>>6)+f.charAt(63&i);for(e+1==t.length?(i=parseInt(t.substring(e,e+1),16),r+=f.charAt(i<<2)):e+2==t.length&&(i=parseInt(t.substring(e,e+2),16),r+=f.charAt(i>>2)+f.charAt((3&i)<<4));(3&r.length)>0;)r+=l;return r}function g(t){var i,r="",n=0,s=0;for(i=0;i<t.length&&t.charAt(i)!=l;++i){var o=f.indexOf(t.charAt(i));o<0||(0==n?(r+=e(o>>2),s=3&o,n=1):1==n?(r+=e(s<<2|o>>4),s=15&o,n=2):2==n?(r+=e(s),r+=e(o>>2),s=3&o,n=3):(r+=e(s<<2|o>>4),r+=e(15&o),n=0))}return 1==n&&(r+=e(s<<2)),r}var d,v={decode:function(t){var e;if(void 0===d){var i="= \f\n\r\t \u2028\u2029";for(d=Object.create(null),e=0;e<64;++e)d["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)]=e;for(d["-"]=62,d._=63,e=0;e<i.length;++e)d[i.charAt(e)]=-1}var r=[],n=0,s=0;for(e=0;e<t.length;++e){var o=t.charAt(e);if("="==o)break;if(-1!=(o=d[o])){if(void 0===o)throw new Error("Illegal character at offset "+e);n|=o,++s>=4?(r[r.length]=n>>16,r[r.length]=n>>8&255,r[r.length]=255&n,n=0,s=0):n<<=6}}switch(s){case 1:throw new Error("Base64 encoding incomplete: at least 2 bits missing");case 2:r[r.length]=n>>10;break;case 3:r[r.length]=n>>16,r[r.length]=n>>8&255}return r},re:/-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,unarmor:function(t){var e=v.re.exec(t);if(e)if(e[1])t=e[1];else{if(!e[2])throw new Error("RegExp out of sync");t=e[2]}return v.decode(t)}},m=1e13,y=function(){function t(t){this.buf=[+t||0]}return t.prototype.mulAdd=function(t,e){var i,r,n=this.buf,s=n.length;for(i=0;i<s;++i)(r=n[i]*t+e)<m?e=0:r-=(e=0|r/m)*m,n[i]=r;e>0&&(n[i]=e)},t.prototype.sub=function(t){var e,i,r=this.buf,n=r.length;for(e=0;e<n;++e)(i=r[e]-t)<0?(i+=m,t=1):t=0,r[e]=i;for(;0===r[r.length-1];)r.pop()},t.prototype.toString=function(t){if(10!=(t||10))throw new Error("only base 10 is supported");for(var e=this.buf,i=e[e.length-1].toString(),r=e.length-2;r>=0;--r)i+=(m+e[r]).toString().substring(1);return i},t.prototype.valueOf=function(){for(var t=this.buf,e=0,i=t.length-1;i>=0;--i)e=e*m+t[i];return e},t.prototype.simplify=function(){var t=this.buf;return 1==t.length?t[0]:this},t}(),b="…",T=/^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,S=/^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;function E(t,e){return t.length>e&&(t=t.substring(0,e)+b),t}var w,D=function(){function t(e,i){this.hexDigits="0123456789ABCDEF",e instanceof t?(this.enc=e.enc,this.pos=e.pos):(this.enc=e,this.pos=i)}return t.prototype.get=function(t){if(void 0===t&&(t=this.pos++),t>=this.enc.length)throw new Error("Requesting byte offset ".concat(t," on a stream of length ").concat(this.enc.length));return"string"==typeof this.enc?this.enc.charCodeAt(t):this.enc[t]},t.prototype.hexByte=function(t){return this.hexDigits.charAt(t>>4&15)+this.hexDigits.charAt(15&t)},t.prototype.hexDump=function(t,e,i){for(var r="",n=t;n<e;++n)if(r+=this.hexByte(this.get(n)),!0!==i)switch(15&n){case 7:r+="  ";break;case 15:r+="\n";break;default:r+=" "}return r},t.prototype.isASCII=function(t,e){for(var i=t;i<e;++i){var r=this.get(i);if(r<32||r>176)return!1}return!0},t.prototype.parseStringISO=function(t,e){for(var i="",r=t;r<e;++r)i+=String.fromCharCode(this.get(r));return i},t.prototype.parseStringUTF=function(t,e){for(var i="",r=t;r<e;){var n=this.get(r++);i+=n<128?String.fromCharCode(n):n>191&&n<224?String.fromCharCode((31&n)<<6|63&this.get(r++)):String.fromCharCode((15&n)<<12|(63&this.get(r++))<<6|63&this.get(r++))}return i},t.prototype.parseStringBMP=function(t,e){for(var i,r,n="",s=t;s<e;)i=this.get(s++),r=this.get(s++),n+=String.fromCharCode(i<<8|r);return n},t.prototype.parseTime=function(t,e,i){var r=this.parseStringISO(t,e),n=(i?T:S).exec(r);return n?(i&&(n[1]=+n[1],n[1]+=+n[1]<70?2e3:1900),r=n[1]+"-"+n[2]+"-"+n[3]+" "+n[4],n[5]&&(r+=":"+n[5],n[6]&&(r+=":"+n[6],n[7]&&(r+="."+n[7]))),n[8]&&(r+=" UTC","Z"!=n[8]&&(r+=n[8],n[9]&&(r+=":"+n[9]))),r):"Unrecognized time: "+r},t.prototype.parseInteger=function(t,e){for(var i,r=this.get(t),n=r>127,s=n?255:0,o="";r==s&&++t<e;)r=this.get(t);if(0==(i=e-t))return n?-1:0;if(i>4){for(o=r,i<<=3;0==(128&(+o^s));)o=+o<<1,--i;o="("+i+" bit)\n"}n&&(r-=256);for(var h=new y(r),a=t+1;a<e;++a)h.mulAdd(256,this.get(a));return o+h.toString()},t.prototype.parseBitString=function(t,e,i){for(var r=this.get(t),n="("+((e-t-1<<3)-r)+" bit)\n",s="",o=t+1;o<e;++o){for(var h=this.get(o),a=o==e-1?r:0,u=7;u>=a;--u)s+=h>>u&1?"1":"0";if(s.length>i)return n+E(s,i)}return n+s},t.prototype.parseOctetString=function(t,e,i){if(this.isASCII(t,e))return E(this.parseStringISO(t,e),i);var r=e-t,n="("+r+" byte)\n";r>(i/=2)&&(e=t+i);for(var s=t;s<e;++s)n+=this.hexByte(this.get(s));return r>i&&(n+=b),n},t.prototype.parseOID=function(t,e,i){for(var r="",n=new y,s=0,o=t;o<e;++o){var h=this.get(o);if(n.mulAdd(128,127&h),s+=7,!(128&h)){if(""===r)if((n=n.simplify())instanceof y)n.sub(80),r="2."+n.toString();else{var a=n<80?n<40?0:1:2;r=a+"."+(n-40*a)}else r+="."+n.toString();if(r.length>i)return E(r,i);n=new y,s=0}}return s>0&&(r+=".incomplete"),r},t}(),x=function(){function t(t,e,i,r,n){if(!(r instanceof R))throw new Error("Invalid tag value.");this.stream=t,this.header=e,this.length=i,this.tag=r,this.sub=n}return t.prototype.typeName=function(){switch(this.tag.tagClass){case 0:switch(this.tag.tagNumber){case 0:return"EOC";case 1:return"BOOLEAN";case 2:return"INTEGER";case 3:return"BIT_STRING";case 4:return"OCTET_STRING";case 5:return"NULL";case 6:return"OBJECT_IDENTIFIER";case 7:return"ObjectDescriptor";case 8:return"EXTERNAL";case 9:return"REAL";case 10:return"ENUMERATED";case 11:return"EMBEDDED_PDV";case 12:return"UTF8String";case 16:return"SEQUENCE";case 17:return"SET";case 18:return"NumericString";case 19:return"PrintableString";case 20:return"TeletexString";case 21:return"VideotexString";case 22:return"IA5String";case 23:return"UTCTime";case 24:return"GeneralizedTime";case 25:return"GraphicString";case 26:return"VisibleString";case 27:return"GeneralString";case 28:return"UniversalString";case 30:return"BMPString"}return"Universal_"+this.tag.tagNumber.toString();case 1:return"Application_"+this.tag.tagNumber.toString();case 2:return"["+this.tag.tagNumber.toString()+"]";case 3:return"Private_"+this.tag.tagNumber.toString()}};function ct(){return{}}})(),r.default})());

(function () {
  var url = $request.url || "";
  var body = $response.body || "";

  var PRIV = "-----BEGIN RSA PRIVATE KEY-----\n"
    + "MIICXQIBAAKBgQCM+iJdCeYFydG3DiFG0Ajr6IS0NENW1Bb2MSwrUdvLiI7nXHG+\n"
    + "zZZuyqewVUPUPQRdEvhSMCyTKjjX9QajRJ1Uv+xVnsOmxEQQIhAIUa1dsXsN30nL\n"
    + "GA+VuNHF7J1SE+Vh/46duR/0Q+Iq+3esSYlb3/PdN4wgK5ab+jKeR0JA2wIDAQAB\n"
    + "AoGAbst/CkPnRZFRgl5WhMKm4FDDSqTwb2MMELygjAMvjIxsUyRyOJR2r+gRViIM\n"
    + "xtaVgViRVHaL8bTzK7ZkWxhn1LEM7RpWB1zjKFvXxE+dzxPrYY/Qw7dobzAAMyQh\n"
    + "Z2+7PTO/plUYOxNgZPUzsvcoI44M3HRy1yFxGbF9z9LiMDECQQDTs5eXJnjEN1Jm\n"
    + "qbBotFw0III0/se/r0oDv4AvJdbxl64t64dZI2tS3BO7NL3OAOzf+WL14Pf2uADF\n"
    + "DZz9kzHPAkEAqnn7TBlZXc6L70TnCaggMAN9C+2Iuik2Q2dePfTBI9IyJiC54k4G\n"
    + "66iT+kQ5F6T4MGWf6jb7xUuUTk6AHck/NQJBALk+5oAh7v0rt5QUGkSUxjXq2GUN\n"
    + "KLbn6Ok8sisPfnVrF8Qg3A+4+ZnI8A8ZSJkxoBUgwWKMWA5w1mOX1O7i1WsCQHV0\n"
    + "qgHajUomnx9x18U9gz/Rh3yKYmPxNSPnunTxh4kIr+i5L5mOrRH9CkeqbbOuxBmE\n"
    + "S1PyIjHjSwFQ8NCU8ekCQQCwb4PirUbcqeHbjN0Nv6vm5pqsgJ29GhA9qiy2l+1W\n"
    + "b637STe9L2mEt7ImUd9FGy7k3Nnsn5eou/t2SV3OkGaU\n"
    + "-----END RSA PRIVATE KEY-----";

  function parseJSON(s) {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  }

  function getAESInfo(keysB64) {
    var JSE = window.JSEncrypt || JSEncrypt;
    var jse = new JSE();
    jse.setPrivateKey(PRIV);
    var dec = jse.decrypt(keysB64);
    return parseJSON(dec);
  }

  function decryptData(data) {
    var aes = getAESInfo(data.keys);
    if (!aes || !aes.key || !aes.iv) throw new Error("AES info parse failed");
    var key = CryptoJS.enc.Utf8.parse(aes.key);
    var iv = CryptoJS.enc.Utf8.parse(aes.iv);
    var pt = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(data.response_key)
      }),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    ).toString(CryptoJS.enc.Utf8);

    return {
      aes: aes,
      plain: parseJSON(pt)
    };
  }

  function encryptBack(obj, aes) {
    var key = CryptoJS.enc.Utf8.parse(aes.key);
    var iv = CryptoJS.enc.Utf8.parse(aes.iv);
    return CryptoJS.AES.encrypt(JSON.stringify(obj), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
  }

  function wrapEncrypted(root, newPlain, aes) {
    root.data.response_key = encryptBack(newPlain, aes);
    return JSON.stringify(root);
  }

  function makeEncryptedEmptyLike(root, template) {
    if (!root || !root.data || !root.data.keys) return body;
    var aes = getAESInfo(root.data.keys);
    root.code = 200;
    root.msg = root.msg || "请求成功";
    root.data.response_key = encryptBack(template, aes);
    return JSON.stringify(root);
  }

  try {
    var root = parseJSON(body);
    if (!root) {
      $done({ body: body });
      return;
    }

    if (/\/App\/Resource\/Config\/getNav(?:\?|$)/.test(url)) {
      var dec0 = decryptData(root.data);
      var arr0 = dec0.plain;
      if (Array.isArray(arr0)) {
        arr0 = arr0.filter(function (x) {
          return x && ["read", "game", "micro"].indexOf(x.type) === -1;
        });
      }
      $done({ body: wrapEncrypted(root, arr0, dec0.aes) });
      return;
    }

    if (/\/App\/Ad\/barsPlayAdInfo(?:\?|$)/.test(url)) {
      $done({ body: makeEncryptedEmptyLike(root, []) });
      return;
    }

    if (/\/App\/Ad\/playAdInfo(?:\?|$)/.test(url)) {
      $done({ body: makeEncryptedEmptyLike(root, {}) });
      return;
    }

    if (/\/App\/IndexPlay\/vodAdvertisement(?:\?|$)/.test(url)) {
      $done({ body: makeEncryptedEmptyLike(root, []) });
      return;
    }

    if (/\/App\/Resource\/Vod\/showOne(?:\?|$)/.test(url)) {
      var dec1 = decryptData(root.data);
      var obj1 = dec1.plain;

      if (obj1 && typeof obj1 === "object") {
        obj1.vip = "0";
        obj1.collect_id = obj1.collect_id || "0";
        obj1.collected = obj1.collected || "0";
        obj1.vip_btn = "";
        obj1.hdr_tag = "";
        obj1.top_tag = "";
        obj1.show_type = "0";

        if (obj1.vurl_clouds && obj1.vurl_clouds.length) {
          obj1.vurl_clouds = obj1.vurl_clouds.filter(function (x) {
            return x && (x.state || x.id);
          });
        }
      }

      $done({ body: wrapEncrypted(root, obj1, dec1.aes) });
      return;
    }

    if (/\/App\/Resource\/Vod\/vurlDetail(?:\?|$)/.test(url)) {
      var dec2 = decryptData(root.data);
      var list = dec2.plain;

      if (Array.isArray(list)) {
        list.forEach(function (x) {
          if (!x || typeof x !== "object") return;

          if (x.name && /试看|会员|付费|购买/.test(x.name)) {
            x.name = x.name.replace(/试看|会员|付费|购买/g, "").trim() || "蓝光1080P";
          }

          if (x.resolution) {
            x.resolution = String(x.resolution).replace(/[^0-9]/g, "") || "1080";
          }
        });

        list.sort(function (a, b) {
          var ra = parseInt((a && a.resolution) || 0, 10) || 0;
          var rb = parseInt((b && b.resolution) || 0, 10) || 0;
          return rb - ra;
        });
      }

      $done({ body: wrapEncrypted(root, list, dec2.aes) });
      return;
    }

    if (/\/App\/Resource\/AppUserVod\/showOne(?:\?|$)/.test(url)) {
      $done({ body: body });
      return;
    }

    $done({ body: body });
  } catch (e) {
    $done({ body: body });
  }
})();
