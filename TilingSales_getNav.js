var navigator = { appName: "Netscape", userAgent: "Loon" };
var window = typeof window !== "undefined" ? window : {};

!function (t, e) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = e();
  } else if (typeof define === "function" && define.amd) {
    define([], e);
  } else if (typeof exports === "object") {
    exports.JSEncrypt = e();
  } else {
    t.JSEncrypt = e();
  }
}(window, function () {
  return (function () {
    var t = {
      155: function (t) {
        var e, i;
        var r = t.exports = {};

        function n() {
          throw new Error("setTimeout has not been defined");
        }

        function s() {
          throw new Error("clearTimeout has not been defined");
        }

        function o(t) {
          if (e === setTimeout) return setTimeout(t, 0);
          if ((e === n || !e) && setTimeout) {
            e = setTimeout;
            return setTimeout(t, 0);
          }
          try {
            return e(t, 0);
          } catch (i) {
            try {
              return e.call(null, t, 0);
            } catch (i2) {
              return e.call(this, t, 0);
            }
          }
        }

        (function () {
          try {
            e = typeof setTimeout === "function" ? setTimeout : n;
          } catch (t) {
            e = n;
          }
          try {
            i = typeof clearTimeout === "function" ? clearTimeout : s;
          } catch (t) {
            i = s;
          }
        })();

        var h;
        var a = [];
        var u = false;
        var c = -1;

        function f() {
          if (u && h) {
            u = false;
            if (h.length) {
              a = h.concat(a);
            } else {
              c = -1;
            }
            if (a.length) l();
          }
        }

        function l() {
          if (!u) {
            var t = o(f);
            u = true;
            var eLen = a.length;
            while (eLen) {
              h = a;
              a = [];
              while (++c < eLen) {
                if (h) h[c].run();
              }
              c = -1;
              eLen = a.length;
            }
            h = null;
            u = false;

            (function (t) {
              if (i === clearTimeout) return clearTimeout(t);
              if ((i === s || !i) && clearTimeout) {
                i = clearTimeout;
                return clearTimeout(t);
              }
              try {
                return i(t);
              } catch (e) {
                try {
                  return i.call(null, t);
                } catch (e2) {
                  return i.call(this, t);
                }
              }
            })(t);
          }
        }

        function p(t, e) {
          this.fun = t;
          this.array = e;
        }

        function g() {}

        r.nextTick = function (t) {
          var e = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              e[i - 1] = arguments[i];
            }
          }
          a.push(new p(t, e));
          if (a.length === 1 && !u) o(l);
        };

        p.prototype.run = function () {
          this.fun.apply(null, this.array);
        };

        r.title = "browser";
        r.browser = true;
        r.env = {};
        r.argv = [];
        r.version = "";
        r.versions = {};
        r.on = g;
        r.addListener = g;
        r.once = g;
        r.off = g;
        r.removeListener = g;
        r.removeAllListeners = g;
        r.emit = g;
        r.prependListener = g;
        r.prependOnceListener = g;
        r.listeners = function () { return []; };
        r.binding = function () {
          throw new Error("process.binding is not supported");
        };
        r.cwd = function () { return "/"; };
        r.chdir = function () {
          throw new Error("process.chdir is not supported");
        };
        r.umask = function () { return 0; };
      }
    };

    var e = {};

    function i(r) {
      var n = e[r];
      if (n !== undefined) return n.exports;
      var s = e[r] = { exports: {} };
      t[r](s, s.exports, i);
      return s.exports;
    }

    i.d = function (t, e) {
      for (var r in e) {
        if (i.o(e, r) && !i.o(t, r)) {
          Object.defineProperty(t, r, {
            enumerable: true,
            get: e[r]
          });
        }
      }
    };

    i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    };

    var r = {};

    (function () {
      "use strict";

      function DummyJSEncrypt() {}
      DummyJSEncrypt.prototype.setPrivateKey = function () {};
      DummyJSEncrypt.prototype.decrypt = function (text) {
        return text;
      };

      i.d(r, {
        default: function () {
          return DummyJSEncrypt;
        }
      });
    })();

    return r.default;
  })();
}());

(function () {
  var url = ($request && $request.url) || "";
  var body = ($response && $response.body) || "";

  function parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  function done(outBody) {
    $done({ body: outBody });
  }

  function log(msg) {
    try {
      console.log("TilingSales_getNav: " + msg);
    } catch (e) {}
  }

  function normalizeRoot(root) {
    if (!root || typeof root !== "object") return null;

    if (!root.data) root.data = {};

    if (root.data && typeof root.data === "object" && root.data.response_key) {
      var nested = parseJSON(root.data.response_key);
      if (nested) {
        return {
          root: root,
          plain: nested,
          encrypted: true
        };
      }
    }

    return {
      root: root,
      plain: root.data,
      encrypted: false
    };
  }

  function writeBack(ctx, newPlain) {
    if (ctx.encrypted) {
      ctx.root.data.response_key = JSON.stringify(newPlain);
    } else {
      ctx.root.data = newPlain;
    }
    return JSON.stringify(ctx.root);
  }

  function makeEmpty(ctx, template) {
    return writeBack(ctx, template);
  }

  try {
    var root = parseJSON(body);
    if (!root) {
      done(body);
      return;
    }

    var ctx = normalizeRoot(root);
    if (!ctx) {
      done(body);
      return;
    }

    if (/\/App\/Resource\/Config\/getNav(?:\?|$)/.test(url)) {
      var nav = ctx.plain;
      if (Array.isArray(nav)) {
        nav = nav.filter(function (item) {
          return !(item && ["read", "game", "micro"].indexOf(item.type) !== -1);
        });
      }
      done(writeBack(ctx, nav));
      return;
    }

    if (/\/App\/Ad\/barsPlayAdInfo(?:\?|$)/.test(url)) {
      done(makeEmpty(ctx, []));
      return;
    }

    if (/\/App\/Ad\/playAdInfo(?:\?|$)/.test(url)) {
      done(makeEmpty(ctx, {}));
      return;
    }

    if (/\/App\/IndexPlay\/vodAdvertisement(?:\?|$)/.test(url)) {
      done(makeEmpty(ctx, []));
      return;
    }

    if (/\/App\/Resource\/Vod\/showOne(?:\?|$)/.test(url)) {
      var detail = ctx.plain;

      if (detail && typeof detail === "object") {
        detail.vip = "0";
        detail.collect_id = detail.collect_id || "0";
        detail.collected = detail.collected || "0";
        detail.vip_btn = "";
        detail.hdr_tag = "";
        detail.top_tag = "";
        detail.show_type = "0";

        if (Array.isArray(detail.vurl_clouds)) {
          detail.vurl_clouds = detail.vurl_clouds.filter(function (item) {
            return item && (item.state || item.id || item.name);
          });
        }
      }

      done(writeBack(ctx, detail));
      return;
    }

    if (/\/App\/Resource\/Vod\/vurlDetail(?:\?|$)/.test(url)) {
      var list = ctx.plain;

      if (Array.isArray(list)) {
        list.forEach(function (item) {
          if (!item || typeof item !== "object") return;

          if (typeof item.name === "string") {
            item.name = item.name.replace(/试看|会员|付费|购买/g, "").trim() || "蓝光1080P";
          }

          if (item.resolution !== undefined && item.resolution !== null) {
            item.resolution = String(item.resolution).replace(/[^0-9]/g, "") || "1080";
          }
        });

        list.sort(function (a, b) {
          var ra = parseInt((a && a.resolution) || 0, 10) || 0;
          var rb = parseInt((b && b.resolution) || 0, 10) || 0;
          return rb - ra;
        });
      }

      done(writeBack(ctx, list));
      return;
    }

    if (/\/App\/Resource\/AppUserVod\/showOne(?:\?|$)/.test(url)) {
      done(body);
      return;
    }

    done(body);
  } catch (e) {
    log(e && e.message ? e.message : String(e));
    done(body);
  }
})();
