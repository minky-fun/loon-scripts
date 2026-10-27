/*
免责声明：
1. 本脚本仅供学习、研究与技术交流使用，不保证其合法性、准确性、有效性或适用性，请自行判断并承担使用风险。
2. 本脚本仅供临时学习研究，下载或使用后请于 24 小时内从您的计算机、手机或其他存储设备中删除；因未及时删除或继续使用所产生的一切后果由使用者自行承担。
3. 请勿将本脚本用于任何商业用途、非法用途或侵犯第三方权益的行为；如违反相关规定，责任由使用者自行承担。
4. 本脚本涉及的应用、平台或服务均与本人无关；因使用本脚本导致的账号异常、隐私泄露、数据丢失或其他后果，本人不承担任何责任。
5. 本人不对脚本运行结果作任何承诺，也不承担因脚本错误、接口变更、使用不当等原因造成的任何直接或间接损失。
6. 如任何单位或个人认为本脚本可能侵犯其合法权益，请提供有效身份证明和权属证明并联系处理；核实后将及时删除或调整相关内容。
7. 凡直接或间接使用、查看、复制或传播本脚本者，均视为已阅读、理解并接受本免责声明；本人保留随时修改或补充本声明的权利。
*/

// 原作者：TG@ZenMoFiShi
// 来源：https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/Txvideoad.js
// Loon 适配：Minky，2026-10-27；二进制正文改用 body 与 Uint8Array。

// 在独立作用域中执行腾讯视频净化逻辑。
(() => {
  const TAB_DROP_KEYS = ["smallvideo_entrance", "goods_entrance"];
  const TAB_DROP_TITLES = ["短剧", "好物"];
  const TAB_CUT_WHITELIST = "0;2;4";
  const AD_ANY = ["AdResponseInfo", "InnerAdPromotionEventList", "InnerAdCommonPromotionEventActivityList", "LoadingConfig", "PreloadResourceInfo", "AdFeedInfo"];
  const DROP_MODULES = ["user_center_more_function"];
  const AD_MODULE_IDS = ["outerPaster"];
  const MARKERS = ["AdFeedInfo", "AdResponseInfo", "InnerAd", "LoadingConfig", "PreloadResourceInfo", "GetTabListRsp", "_ad", "teenager_popup_ctrl"].concat(DROP_MODULES);
  const BLOCK_FUNCS = [
    "/trpc.business_splash.ad_ssp_splash.splashService/GetSplashPreload",
    "/trpc.business_splash.ad_ssp_splash.splashService/GetSplashRealtimePoll",
    "/trpc.business_inside_video.ad_ssp_time_point.push_ad_point/GetPushAd",
    "/trpc.business_inside_video.ad_ssp_time_point.push_ad_point/GetPushAdPoint",
    "/trpc.business_inside_video.ad_ssp_widget.Widget/GetSpeedPanelAd",
    "/trpc.business_feeds.video_ad_ssp_feeds.ServerAdFeedsVideo/GetSlotAdData",
    "/trpc.business_feeds.video_ad_ssp_feeds.ServerAdFeedsVideo/GetSearchAdData",
    "/trpc.business_feeds.video_ad_ssp_feeds.ServerAdFeedsVideo/GetDownloadAdData",
    "/trpc.business_feeds.video_ad_ssp_feeds.Independent/GetAds",
    "/trpc.business_feeds.video_ad_ssp_feeds.Independent/GetUnifiedRefreshAds",
    "/trpc.vipcontent.promotional_slot.PromotionalSlot/InPlayTouchpoints",
    "/trpc.vip_ad_promotion.promotion.PromotionHub/GetPromotionHub",
    "/trpc.video_pay_ffgn.vipcenter.VCUpgradeDialogService/getUpgradeDialogData",
    "/trpc.activity.memberExperience.ActivityTcp/getHomeGrowPopupUrl",
    "/trpc.reward_ad_ssp.reward_judgment.pendant/GetRewardPendant",
    "/trpc.business_feeds.video_ad_ssp_feeds.ServerAdFeedsVideo/GetPersonalCenterAdData"
  ];
  const JCE_TEEN_CONFIG = 89738;
  const JCE_PLAY_TIPS = 126577;
  const JCE_ROLL_ADS = [129278, 130273];
  const DROP = {};

  // 将字符串编码为 UTF-8 字节。

  function utf8(s) {
    const e = encodeURIComponent(s), a = [];
    for (let i = 0; i < e.length; i++) {
      if (e[i] === "%") { a.push(parseInt(e.substr(i + 1, 2), 16)); i += 2; }
      else a.push(e.charCodeAt(i));
    }
    return new Uint8Array(a);
  }
  // 解码指定范围的 UTF-8 字节。
  function text(b, s, e) {
    let r = "";
    for (let i = s; i < e; i++) r += "%" + (b[i] < 16 ? "0" : "") + b[i].toString(16);
    try { return decodeURIComponent(r); } catch (x) { return null; }
  }
  // 读取指定范围的可打印 ASCII 文本。
  function ascii(b, s, e) {
    let r = "";
    for (let i = s; i < e; i++) { if (b[i] < 32 || b[i] > 126) return null; r += String.fromCharCode(b[i]); }
    return r;
  }
  // 按顺序合并字节数组。
  function concat(parts) {
    let n = 0;
    for (const p of parts) n += p.length;
    const o = new Uint8Array(n);
    let k = 0;
    for (const p of parts) { o.set(p, k); k += p.length; }
    return o;
  }
  // 在指定字节范围中查找目标序列。
  function find(h, n, s, e) {
    const f = n[0], m = n.length;
    outer: for (let i = s; i <= e - m; i++) {
      if (h[i] !== f) continue;
      for (let j = 1; j < m; j++) if (h[i + j] !== n[j]) continue outer;
      return i;
    }
    return -1;
  }
  // 读取大端无符号 32 位整数。
  function u32(b, p) { return ((b[p] << 24) >>> 0) + (b[p + 1] << 16) + (b[p + 2] << 8) + b[p + 3]; }
  // 写入大端 32 位整数。
  function put32(b, p, v) { b[p] = (v >>> 24) & 255; b[p + 1] = (v >>> 16) & 255; b[p + 2] = (v >>> 8) & 255; b[p + 3] = v & 255; }
  // 将已有二进制对象转换为字节视图。
  function toU8(x) {
    if (!x) return null;
    const tag = Object.prototype.toString.call(x);
    if (tag === "[object Uint8Array]") return x;
    if (tag === "[object ArrayBuffer]") return new Uint8Array(x);
    if (ArrayBuffer.isView(x)) return new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
    return null;
  }

  const LB = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  const LE = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  const DB = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  const DE = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  const CLO = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  // 根据码长构建 Huffman 解码表。
  function huff(len, n) {
    const count = new Uint16Array(16), offs = new Uint16Array(16), sym = new Uint16Array(n);
    for (let i = 0; i < n; i++) count[len[i]]++;
    count[0] = 0;
    for (let i = 1; i < 16; i++) offs[i] = offs[i - 1] + count[i - 1];
    for (let i = 0; i < n; i++) if (len[i]) sym[offs[len[i]]++] = i;
    return { count: count, sym: sym };
  }
  // 解压 DEFLATE 数据。
  function inflate(src, start) {
    let ip = start, bb = 0, bc = 0, op = 0, out = new Uint8Array(src.length * 4 + 4096);
    // 扩容解压输出缓冲区。
    function room(n) {
      if (op + n <= out.length) return;
      let l = out.length * 2;
      while (l < op + n) l *= 2;
      const o = new Uint8Array(l);
      o.set(out.subarray(0, op));
      out = o;
    }
    // 从压缩流读取指定位数。
    function bits(n) {
      while (bc < n) { if (ip >= src.length) throw new Error("inflate eof"); bb |= src[ip++] << bc; bc += 8; }
      const v = bb & ((1 << n) - 1);
      bb >>>= n; bc -= n;
      return v;
    }
    // 使用 Huffman 表解码一个符号。
    function dec(h) {
      let code = 0, first = 0, index = 0;
      for (let l = 1; l < 16; l++) {
        code |= bits(1);
        const c = h.count[l];
        if (code - c < first) return h.sym[index + (code - first)];
        index += c; first += c; first <<= 1; code <<= 1;
      }
      throw new Error("inflate code");
    }
    let fl = null, fd = null;
    for (;;) {
      const last = bits(1), type = bits(2);
      if (type === 0) {
        bb = 0; bc = 0;
        const n = src[ip] | (src[ip + 1] << 8);
        ip += 4;
        if (ip + n > src.length) throw new Error("inflate stored");
        room(n); out.set(src.subarray(ip, ip + n), op); op += n; ip += n;
      } else if (type === 1 || type === 2) {
        let hl, hd;
        if (type === 1) {
          if (!fl) {
            const l = new Uint8Array(288);
            for (let i = 0; i < 288; i++) l[i] = i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8;
            fl = huff(l, 288);
            const d = new Uint8Array(30).fill(5);
            fd = huff(d, 30);
          }
          hl = fl; hd = fd;
        } else {
          const nl = bits(5) + 257, nd = bits(5) + 1, nc = bits(4) + 4;
          const cl = new Uint8Array(19);
          for (let i = 0; i < nc; i++) cl[CLO[i]] = bits(3);
          const ch = huff(cl, 19), ls = new Uint8Array(nl + nd);
          for (let i = 0; i < nl + nd;) {
            const s = dec(ch);
            if (s < 16) ls[i++] = s;
            else {
              let r, v = 0;
              if (s === 16) { if (!i) throw new Error("inflate rep"); v = ls[i - 1]; r = 3 + bits(2); }
              else if (s === 17) r = 3 + bits(3);
              else r = 11 + bits(7);
              if (i + r > nl + nd) throw new Error("inflate rep");
              while (r--) ls[i++] = v;
            }
          }
          hl = huff(ls.subarray(0, nl), nl); hd = huff(ls.subarray(nl), nd);
        }
        for (;;) {
          let s = dec(hl);
          if (s < 256) { room(1); out[op++] = s; }
          else if (s === 256) break;
          else {
            s -= 257;
            if (s >= 29) throw new Error("inflate len");
            const len = LB[s] + bits(LE[s]), ds = dec(hd);
            if (ds >= 30) throw new Error("inflate dist");
            const dist = DB[ds] + bits(DE[ds]);
            if (dist > op) throw new Error("inflate back");
            room(len);
            for (let i = 0; i < len; i++, op++) out[op] = out[op - dist];
          }
        }
      } else throw new Error("inflate type");
      if (last) break;
    }
    return { data: out.subarray(0, op), end: ip };
  }
  // 读取 GZIP 头并解压正文。
  function gunzip(b) {
    if (b[0] !== 0x1f || b[1] !== 0x8b || b[2] !== 8) throw new Error("not gzip");
    const f = b[3];
    let p = 10;
    if (f & 4) p += 2 + (b[p] | (b[p + 1] << 8));
    if (f & 8) { while (b[p]) p++; p++; }
    if (f & 16) { while (b[p]) p++; p++; }
    if (f & 2) p += 2;
    const r = inflate(b, p);
    if (r.end + 8 > b.length) throw new Error("gzip trailer");
    const isize = (b[r.end + 4] | (b[r.end + 5] << 8) | (b[r.end + 6] << 16) | (b[r.end + 7] << 24)) >>> 0;
    if (isize !== (r.data.length >>> 0)) throw new Error("gzip size");
    return r.data;
  }
  let CRC = null;
  // 计算 GZIP 使用的 CRC32 校验值。
  function crc32(b) {
    if (!CRC) {
      CRC = new Uint32Array(256);
      for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; }
    }
    let c = 0xffffffff;
    for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  // 将字节数组封装为 GZIP 数据。
  function gzip(d) {
    const blocks = Math.max(1, Math.ceil(d.length / 65535));
    const o = new Uint8Array(10 + blocks * 5 + d.length + 8);
    o.set([0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 0, 255]);
    let p = 10;
    for (let i = 0; i < blocks; i++) {
      const s = i * 65535, n = Math.min(65535, d.length - s);
      o[p++] = i === blocks - 1 ? 1 : 0;
      o[p++] = n & 255; o[p++] = n >> 8; o[p++] = ~n & 255; o[p++] = (~n >> 8) & 255;
      o.set(d.subarray(s, s + n), p); p += n;
    }
    const c = crc32(d), z = d.length >>> 0;
    o[p++] = c & 255; o[p++] = (c >>> 8) & 255; o[p++] = (c >>> 16) & 255; o[p++] = c >>> 24;
    o[p++] = z & 255; o[p++] = (z >>> 8) & 255; o[p++] = (z >>> 16) & 255; o[p++] = z >>> 24;
    return o;
  }

  let VP = 0;
  // 读取 Protobuf 变长整数并更新游标。
  function rv(b, p, e) {
    let x = 0, m = 1, c;
    do {
      if (p >= e || m > 72057594037927936) return -1;
      c = b[p++];
      x += (c & 127) * m;
      m *= 128;
    } while (c & 128);
    VP = p;
    return x;
  }
  // 编码 Protobuf 变长整数。
  function ev(v) {
    const a = [];
    while (v >= 128) { a.push((v % 128) | 128); v = Math.floor(v / 128); }
    a.push(v);
    return new Uint8Array(a);
  }
  // 编码 Protobuf 长度分隔字段。
  function lenField(f, d) { return concat([ev(f * 8 + 2), ev(d.length), d]); }
  // 解析指定范围的 Protobuf 字段。
  function parse(b, s, e) {
    const out = [];
    let p = s;
    while (p < e) {
      const ts = p, k = rv(b, p, e);
      if (k < 8) return null;
      p = VP;
      const f = Math.floor(k / 8), w = k % 8;
      if (w === 0) {
        const v = rv(b, p, e);
        if (v < 0) return null;
        out.push({ f: f, w: w, s: ts, vs: p, e: VP, v: v });
        p = VP;
      } else if (w === 1 || w === 5) {
        const n = w === 1 ? 8 : 4;
        if (p + n > e) return null;
        out.push({ f: f, w: w, s: ts, vs: p, e: p + n });
        p += n;
      } else if (w === 2) {
        const l = rv(b, p, e);
        if (l < 0) return null;
        p = VP;
        if (p + l > e) return null;
        out.push({ f: f, w: w, s: ts, vs: p, e: p + l });
        p += l;
      } else return null;
    }
    return out;
  }
  // 依据字段编辑记录重建 Protobuf 数据。
  function rebuild(b, s, e, fields, edits) {
    const parts = [];
    let last = s, changed = false;
    for (const x of fields) {
      if (!edits.has(x)) continue;
      const r = edits.get(x);
      parts.push(b.subarray(last, x.s));
      if (r !== DROP) parts.push(r);
      last = x.e;
      changed = true;
    }
    if (!changed) return null;
    parts.push(b.subarray(last, e));
    return concat(parts);
  }

  const TYPE = utf8("type.googleapis.com/");
  let ANYV = 0;
  // 读取 Protobuf Any 类型名并记录值起点。
  function anyName(b, s, e) {
    if (b[s] !== 0x0a) return null;
    const l = rv(b, s + 1, e);
    if (l < 21 || VP + l > e) return null;
    const p = VP;
    if (find(b, TYPE, p, p + TYPE.length) !== p) return null;
    const t = ascii(b, p, p + l);
    if (!t) return null;
    ANYV = p + l;
    return t.slice(Math.max(t.lastIndexOf("."), t.lastIndexOf("/")) + 1);
  }

  let MARK = {}, ALL = [];
  // 建立广告标记的字节位置索引。
  function indexMarkers(b, s, e) {
    MARK = {}; ALL = [];
    for (const m of MARKERS) {
      const nb = utf8(m), arr = [];
      for (let p = s; (p = find(b, nb, p, e)) >= 0; p += nb.length) arr.push(p);
      MARK[m] = arr;
      ALL = ALL.concat(arr);
    }
    ALL.sort(/* 按字节位置升序排列。 */ (x, y) => x - y);
  }
  // 判断已排序的位置集合是否命中指定范围。
  function inRange(arr, s, e) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] < s) lo = mid + 1; else hi = mid; }
    return lo < arr.length && arr[lo] < e;
  }
  // 检查指定范围是否包含目标标记。
  function has(m, s, e) { return inRange(m ? MARK[m] || [] : ALL, s, e); }

  // 解析指定字段编号的子消息。

  function kidsOf(b, recs, f) {
    const r = [];
    for (const x of recs) if (x.f === f && x.w === 2) { const k = parse(b, x.vs, x.e); if (k) r.push(k); }
    return r;
  }
  // 沿原作者指定的字段路径识别广告。
  function adAtPath(b, kids) {
    let level = [kids];
    for (const f of [2, 5, 1]) {
      const next = [];
      for (const k of level) for (const c of kidsOf(b, k, f)) next.push(c);
      level = next;
      if (!level.length) return false;
    }
    for (const k of level) for (const x of k) if (x.f === 4 && x.w === 2 && anyName(b, x.vs, x.e) === "AdFeedInfo") return true;
    return false;
  }
  // 识别直接或嵌套的 Any 消息。
  function wrapsAny(b, k) {
    if (anyName(b, k.vs, k.e)) return true;
    const w = parse(b, k.vs, k.e);
    return !!w && w.some(/* 按原作者条件匹配字段或标记。 */ z => z.f === 2 && z.w === 2 && anyName(b, z.vs, z.e));
  }
  // 按原作者的类型与模块规则识别广告元素。
  function isAdElement(b, x, kids) {
    for (const k of kids) {
      if (k.w !== 2 || (k.f !== 1 && k.f !== 2 && k.f !== 10)) continue;
      if (k.f === 10 && has("AdFeedInfo", k.vs, k.e) && wrapsAny(b, k)) return true;
      const t = anyName(b, k.vs, k.e);
      if (t && AD_ANY.indexOf(t) >= 0) return true;
    }
    const f1 = kids.find(/* 按原作者条件匹配字段或标记。 */ k => k.f === 1 && k.w === 2), f2 = kids.find(/* 按原作者条件匹配字段或标记。 */ k => k.f === 2 && k.w === 2);
    if (f1 && f2 && f2.e - f2.vs > 3 && f2.e - f2.vs < 64) {
      const t = ascii(b, f2.vs, f2.e), id = ascii(b, f1.vs, f1.e);
      if (t && id && DROP_MODULES.indexOf(t) >= 0 && /\.\d+\.\d+$/.test(id)) return true;
      if (t && id !== null && /^[a-z0-9_]+$/.test(t) && /(^ad_|_ad_|_ad$)/.test(t) && (id === "" || /\.\d+\.\d+$/.test(id))) return true;
    }
    if ((!f1 || f1.e === f1.vs || AD_MODULE_IDS.indexOf(ascii(b, f1.vs, f1.e)) >= 0) && has("AdFeedInfo", x.vs, x.e) && adAtPath(b, kids)) return true;
    return false;
  }
  // 移除指定底栏入口并重排索引。
  function tabFix(b, x) {
    if (anyName(b, x.vs, x.e) !== "GetTabListRsp") return null;
    const rest = parse(b, ANYV, x.e);
    const v = rest && rest.find(/* 按原作者条件匹配字段或标记。 */ r => r.f === 2 && r.w === 2);
    if (!v) return null;
    const vf = parse(b, v.vs, v.e);
    if (!vf) return null;
    const items = vf.filter(/* 按原作者条件匹配字段或标记。 */ r => r.f === 1 && r.w === 2), drop = new Set();
    for (const it of items) {
      const ik = parse(b, it.vs, it.e);
      if (!ik) return null;
      let key = "", title = "";
      for (const r of ik) {
        if (r.f === 3 && r.w === 2) title = text(b, r.vs, r.e) || "";
        if (r.f === 22 && r.w === 2) {
          const rk = parse(b, r.vs, r.e), k1 = rk && rk.find(/* 按原作者条件匹配字段或标记。 */ z => z.f === 1 && z.w === 2);
          if (k1) key = ascii(b, k1.vs, k1.e) || "";
        }
      }
      if (TAB_DROP_KEYS.indexOf(key) >= 0 || TAB_DROP_TITLES.indexOf(title) >= 0) drop.add(it);
    }
    if (!drop.size) return null;
    const edits = new Map();
    let idx = 0;
    for (const it of items) {
      if (drop.has(it)) { edits.set(it, DROP); continue; }
      const ik = parse(b, it.vs, it.e), parts = [];
      if (idx > 0) parts.push(ev(16), ev(idx));
      for (const r of ik) if (!(r.f === 2 && r.w === 0)) parts.push(b.subarray(r.s, r.e));
      edits.set(it, lenField(1, concat(parts)));
      idx++;
    }
    const nv = rebuild(b, v.vs, v.e, vf, edits);
    return lenField(x.f, concat([b.subarray(x.vs, v.s), lenField(2, nv), b.subarray(v.e, x.e)]));
  }
  // 递归清理命中广告标记的消息。
  function clean(b, s, e, depth) {
    if (depth > 48 || !has(null, s, e)) return null;
    const fs = parse(b, s, e);
    if (!fs) return null;
    const edits = new Map();
    for (const x of fs) {
      if (x.w !== 2 || x.e - x.vs < 2 || !has(null, x.vs, x.e)) continue;
      const kids = parse(b, x.vs, x.e);
      if (!kids || !kids.length) continue;
      if (isAdElement(b, x, kids)) { edits.set(x, DROP); continue; }
      if (has("GetTabListRsp", x.vs, x.e)) {
        const t = tabFix(b, x);
        if (t) { edits.set(x, t); continue; }
      }
      const r = clean(b, x.vs, x.e, depth + 1);
      if (r) edits.set(x, lenField(x.f, r));
    }
    return rebuild(b, s, e, fs, edits);
  }
  const PC_PAGE = utf8("personal_center_page"), AD_FEED = utf8("pb.AdFeed");
  // 处理个人中心与弹窗配置后清理广告。
  function transform(b, s, e) {
    const top = parse(b, s, e);
    if (!top) return null;
    if (has("teenager_popup_ctrl", s, e)) {
      const isCtrl = top.some(/* 判断是否为目标弹窗控制消息。 */ x => {
        if (x.f !== 7 || x.w !== 2) return false;
        const k = parse(b, x.vs, x.e), v = k && k.find(/* 按原作者条件匹配字段或标记。 */ z => z.f === 2 && z.w === 2);
        return !!v && ascii(b, v.vs, v.e) === "teenager_popup_ctrl";
      });
      if (isCtrl) {
        const edits = new Map();
        for (const x of top) if (x.f === 1) edits.set(x, DROP);
        return rebuild(b, s, e, top, edits);
      }
    }
    if (find(b, PC_PAGE, s, e) >= 0) {
      const f5 = top.find(/* 按原作者条件匹配字段或标记。 */ x => x.f === 5 && x.w === 2 && find(b, PC_PAGE, x.vs, x.e) >= 0);
      if (f5) {
        const edits = new Map();
        for (const x of top) if (x.w === 2 && x !== f5 && find(b, AD_FEED, x.vs, x.e) >= 0) edits.set(x, DROP);
        if (edits.size) return rebuild(b, s, e, top, edits);
      }
    }
    return clean(b, s, e, 0);
  }
  // 校验 TRPC 帧并读取消息头边界。
  function trpcFrame(u8) {
    if (u8.length < 16 || u8[0] !== 0x09 || u8[1] !== 0x30) return null;
    const total = u32(u8, 4), hl = (u8[8] << 8) | u8[9];
    if (total !== u8.length || 16 + hl > total) return null;
    return { hs: 16, he: 16 + hl };
  }
  // 清理 TRPC 响应并更新帧长度。
  function onTrpcResponse(raw) {
    let u8 = raw, gz = false;
    if (u8[0] === 0x1f && u8[1] === 0x8b) { u8 = gunzip(u8); gz = true; }
    const fr = trpcFrame(u8);
    if (!fr) return null;
    indexMarkers(u8, fr.he, u8.length);
    const body = transform(u8, fr.he, u8.length);
    if (!body) return null;
    const out = concat([u8.subarray(0, fr.he), body]);
    put32(out, 4, out.length);
    return gz ? gzip(out) : out;
  }
  // 修改指定广告 RPC 方法名。
  function onTrpcRequest(raw) {
    let u8 = raw, gz = false;
    if (u8[0] === 0x1f && u8[1] === 0x8b) { u8 = gunzip(u8); gz = true; }
    const fr = trpcFrame(u8);
    if (!fr) return null;
    const hd = parse(u8, fr.hs, fr.he), fn = hd && hd.find(/* 按原作者条件匹配字段或标记。 */ x => x.f === 7 && x.w === 2);
    const func = fn ? ascii(u8, fn.vs, fn.e) : null;
    if (!func || BLOCK_FUNCS.indexOf(func) < 0) return null;
    const nb = utf8(func.slice(func.lastIndexOf("/") + 1)), out = u8.slice();
    for (let p = fr.hs; (p = find(out, nb, p, fr.he)) >= 0; p += nb.length) out[p] = out[p] === 0x58 ? 0x59 : 0x58;
    return gz ? gzip(out) : out;
  }

  // 读取 JCE 字段标签和类型。

  function jHead(b, p) {
    const c = b[p];
    let tag = c >> 4;
    const t = c & 15;
    p++;
    if (tag === 15) tag = b[p++];
    VP = p;
    return [tag, t];
  }
  // 读取 JCE 整数并更新游标。
  function jInt(b, p) {
    const h = jHead(b, p);
    p = VP;
    let v;
    if (h[1] === 12) v = 0;
    else if (h[1] === 0) { v = (b[p] << 24) >> 24; p += 1; }
    else if (h[1] === 1) { v = ((b[p] << 24) >> 16) | b[p + 1]; p += 2; }
    else if (h[1] === 2) { v = u32(b, p) | 0; p += 4; }
    else if (h[1] === 3) { v = u32(b, p) * 4294967296 + u32(b, p + 4); p += 8; }
    else throw new Error("jce int");
    VP = p;
    return v;
  }
  // 跳过一个 JCE 字段并检查边界。
  function jSkip(b, p, t, e) {
    let q;
    switch (t) {
      case 0: q = p + 1; break;
      case 1: q = p + 2; break;
      case 2: case 4: q = p + 4; break;
      case 3: case 5: q = p + 8; break;
      case 6: q = p + 1 + b[p]; break;
      case 7: q = p + 4 + u32(b, p); break;
      case 8: case 9: {
        const n = jInt(b, p) * (t === 8 ? 2 : 1);
        q = VP;
        if (n < 0) throw new Error("jce count");
        for (let i = 0; i < n; i++) { const h = jHead(b, q); q = jSkip(b, VP, h[1], e); }
        break;
      }
      case 10: {
        q = p;
        for (;;) {
          const h = jHead(b, q);
          q = VP;
          if (h[1] === 11) break;
          q = jSkip(b, q, h[1], e);
        }
        break;
      }
      case 11: case 12: q = p; break;
      case 13: {
        jHead(b, p);
        const n = jInt(b, VP);
        q = VP + n;
        break;
      }
      default: throw new Error("jce type " + t);
    }
    if (q > e) throw new Error("jce overflow");
    return q;
  }
  // 解析指定范围的 JCE 字段。
  function jFields(b, s, e) {
    const out = [];
    let p = s;
    while (p < e) {
      const h = jHead(b, p), vs = VP;
      if (h[1] === 11) throw new Error("jce end");
      const q = jSkip(b, vs, h[1], e);
      out.push({ tag: h[0], t: h[1], s: p, vs: vs, e: q });
      p = q;
    }
    if (p !== e) throw new Error("jce tail");
    return out;
  }
  // 编码 JCE 字段标签和类型。
  function jHeadEnc(tag, t) { return tag < 15 ? [(tag << 4) | t] : [0xf0 | t, tag]; }
  // 按数值范围编码 JCE 整数。
  function jIntEnc(tag, v) {
    if (v === 0) return new Uint8Array(jHeadEnc(tag, 12));
    if (v >= -128 && v <= 127) return new Uint8Array(jHeadEnc(tag, 0).concat([v & 255]));
    if (v >= -32768 && v <= 32767) return new Uint8Array(jHeadEnc(tag, 1).concat([(v >> 8) & 255, v & 255]));
    return new Uint8Array(jHeadEnc(tag, 2).concat([(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]));
  }
  // 编码 JCE 字节列表。
  function jSimpleList(tag, d) { return concat([new Uint8Array(jHeadEnc(tag, 13).concat([0])), jIntEnc(0, d.length), d]); }
  // 读取 JCE ASCII 字符串。
  function jStr(b, x) {
    if (x.t === 6) return ascii(b, x.vs + 1, x.e);
    if (x.t === 7) return ascii(b, x.vs + 4, x.e);
    return null;
  }
  // 依据字段编辑记录重建 JCE 数据。
  function jRebuild(b, s, e, fields, edits) {
    const parts = [];
    let last = s, changed = false;
    for (const x of fields) {
      if (!edits.has(x)) continue;
      parts.push(b.subarray(last, x.s));
      const r = edits.get(x);
      if (r !== DROP) parts.push(r);
      last = x.e;
      changed = true;
    }
    if (!changed) return null;
    parts.push(b.subarray(last, e));
    return concat(parts);
  }
  // 按原作者规则处理青少年弹窗配置。
  function fixTeenConfig(b, s, e) {
    const fs = jFields(b, s, e);
    const code = fs.find(/* 按原作者条件匹配字段或标记。 */ x => x.tag === 9);
    const sc = code ? jStr(b, code) : null;
    if (!sc || !/^[0-9A-F]{32,}$/.test(sc)) return null;
    const edits = new Map();
    for (const x of fs) {
      if (x.tag === 4 && x.t !== 12) edits.set(x, jIntEnc(4, 0));
      if ((x.tag === 6 || x.tag === 10) && x.t === 10) edits.set(x, DROP);
    }
    return jRebuild(b, s, e, fs, edits);
  }
  // 移除播放提示中的运营信息。
  function fixPlayTips(b, s, e) {
    const fs = jFields(b, s, e), m = fs.find(/* 按原作者条件匹配字段或标记。 */ x => x.tag === 1 && x.t === 8);
    if (!m) return null;
    const n = jInt(b, m.vs);
    let q = VP;
    const keep = [];
    let dropped = 0;
    for (let i = 0; i < n; i++) {
      const st = q;
      const hk = jHead(b, q), kvs = VP, ke = jSkip(b, kvs, hk[1], e);
      const key = jStr(b, { t: hk[1], vs: kvs, e: ke });
      const hv = jHead(b, ke), ve = jSkip(b, VP, hv[1], e);
      if (key === "4_operator_info") dropped++;
      else keep.push(b.subarray(st, ve));
      q = ve;
    }
    if (q !== m.e || !dropped) return null;
    const enc = concat([new Uint8Array(jHeadEnc(1, 8)), jIntEnc(0, keep.length)].concat(keep));
    const edits = new Map();
    edits.set(m, enc);
    return jRebuild(b, s, e, fs, edits);
  }
  // 清空命中直播广告标记的滚动列表。
  function fixRollAds(b, s, e) {
    const fs = jFields(b, s, e), l = fs.find(/* 按原作者条件匹配字段或标记。 */ x => x.tag === 2 && x.t === 9);
    if (!l || jInt(b, l.vs) <= 0 || find(b, utf8("livemsg"), l.vs, l.e) < 0) return null;
    const edits = new Map();
    edits.set(l, concat([new Uint8Array(jHeadEnc(2, 9)), jIntEnc(0, 0)]));
    return jRebuild(b, s, e, fs, edits);
  }
  // 解包指定 JCE 响应并重建压缩数据。
  function onJce(raw) {
    const b = raw, n = b.length;
    if (n < 100 || b[0] !== 0x13 || u32(b, 1) !== n || b[n - 1] !== 0x03) return null;
    const cmd = (b[8] << 16) | (b[9] << 8) | b[10];
    const fix = cmd === JCE_TEEN_CONFIG ? fixTeenConfig : cmd === JCE_PLAY_TIPS ? fixPlayTips : JCE_ROLL_ADS.indexOf(cmd) >= 0 ? fixRollAds : null;
    if (!fix) return null;
    const gz = find(b, new Uint8Array([0x1f, 0x8b, 0x08]), 60, Math.min(n, 140));
    if (gz < 4) return null;
    const inner = gunzip(b.subarray(gz, n - 1));
    const m = inner.length;
    if (u32(b, gz - 4) !== m || m < 18 || inner[0] !== 0x26 || u32(inner, 1) !== m || inner[m - 1] !== 0x28) return null;
    const top = jFields(inner, 16, m - 1), body = top.find(/* 按原作者条件匹配字段或标记。 */ x => x.tag === 1 && x.t === 13);
    if (!body) return null;
    jHead(inner, body.vs);
    const bl = jInt(inner, VP), bs = VP;
    if (bs + bl !== body.e) return null;
    const nb = fix(inner, bs, bs + bl);
    if (!nb) return null;
    const ni = concat([inner.subarray(0, body.s), jSimpleList(1, nb), inner.subarray(body.e, m)]);
    put32(ni, 1, ni.length);
    const head = b.slice(0, gz);
    put32(head, gz - 4, ni.length);
    const out = concat([head, gzip(ni), new Uint8Array([0x03])]);
    put32(out, 1, out.length);
    return out;
  }

  const SIMPLE_KEY = "simple_mode_config";
  // 修改精简模式和底栏裁剪配置。
  function patchSimpleMode(js) {
    let o;
    try { o = JSON.parse(js); } catch (x) { return null; }
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const fc = o.feature_config && typeof o.feature_config === "object" ? o.feature_config : {};
    if (o.enable === 1 && fc.enable === 1 && fc.tab_bar_cut_enable === 1 && fc.tab_bar_cut_whitelist === TAB_CUT_WHITELIST) return null;
    fc.enable = 1;
    fc.tab_bar_cut_enable = 1;
    fc.tab_bar_cut_whitelist = TAB_CUT_WHITELIST;
    o.enable = 1;
    o.feature_config = fc;
    return JSON.stringify(o);
  }

  // 生成原作者定义的精简模式配置。

  function simpleModeJson() {
    return JSON.stringify({ enable: 1, launch_config: { enable: 1, delay_create_tab_enable: 1, delay_create_tab_whitelist: "" }, feature_config: { enable: 1, tab_bar_cut_enable: 1, tab_bar_cut_whitelist: TAB_CUT_WHITELIST } });
  }
  // 编码精简模式远程配置项。
  function simpleModeEntry() {
    const v = concat([lenField(1, utf8(simpleModeJson())), ev(16), ev(11276), lenField(4, utf8(SIMPLE_KEY))]);
    return concat([lenField(1, utf8(SIMPLE_KEY)), lenField(2, v)]);
  }
  // 关闭配置中明确存在的 QUIC 开关。
  function patchNoQuic(js) {
    let o;
    try { o = JSON.parse(js); } catch (x) { return null; }
    const q = o && o.quic;
    if (!q || typeof q !== "object" || (q.enabled === false && q.allPbReqEnabled === false && q.allJceReqEnabled === false)) return null;
    q.enabled = false;
    q.allPbReqEnabled = false;
    q.allJceReqEnabled = false;
    return JSON.stringify(o);
  }
  // 关闭原作者指定的预解析配置。
  function patchNoPreResolve(js) {
    let o;
    try { o = JSON.parse(js); } catch (x) { return null; }
    if (!o || typeof o !== "object" || Array.isArray(o) || (o.enablePreResolve === false && o.enableNac === false && o.enableHdns === false)) return null;
    o.enablePreResolve = false;
    o.enableNac = false;
    o.enableHdns = false;
    return JSON.stringify(o);
  }
  const AB_PATCH = { simple_mode_config: patchSimpleMode, ios_nx_netframework_compatible: patchNoQuic, ios_nx_netframework_compatible_bbtf: patchNoQuic, network_resolve_config: patchNoPreResolve };
  const AB_NEEDLES = [utf8(SIMPLE_KEY), utf8("ios_nx_netframework_compatible"), utf8("network_resolve_config")];
  // 修改远程配置并保留原有压缩格式。
  function onAbConfig(raw) {
    let u8 = raw, gz = false;
    if (u8[0] === 0x1f && u8[1] === 0x8b) { u8 = gunzip(u8); gz = true; }
    const top = parse(u8, 0, u8.length);
    if (!top) return null;
    const edits = new Map();
    let found = false;
    for (const x of top) {
      if (x.f !== 3 || x.w !== 2 || !AB_NEEDLES.some(/* 按原作者条件匹配字段或标记。 */ kb => find(u8, kb, x.vs, x.e) >= 0)) continue;
      const ef = parse(u8, x.vs, x.e);
      const k = ef && ef.find(/* 按原作者条件匹配字段或标记。 */ z => z.f === 1 && z.w === 2), v = ef && ef.find(/* 按原作者条件匹配字段或标记。 */ z => z.f === 2 && z.w === 2);
      const key = k && v ? ascii(u8, k.vs, k.e) : null;
      if (!key || !Object.prototype.hasOwnProperty.call(AB_PATCH, key)) continue;
      const vf = parse(u8, v.vs, v.e), j = vf && vf.find(/* 按原作者条件匹配字段或标记。 */ z => z.f === 1 && z.w === 2);
      if (!j) continue;
      if (key === SIMPLE_KEY) found = true;
      const js = text(u8, j.vs, j.e), nj = js ? AB_PATCH[key](js) : null;
      if (!nj) continue;
      const vm = new Map();
      vm.set(j, lenField(1, utf8(nj)));
      const nv = rebuild(u8, v.vs, v.e, vf, vm);
      const em = new Map();
      em.set(v, lenField(2, nv));
      edits.set(x, lenField(3, rebuild(u8, x.vs, x.e, ef, em)));
    }
    let out = rebuild(u8, 0, u8.length, top, edits);
    if (!out && !found && top.some(/* 按原作者条件匹配字段或标记。 */ x => x.f === 1 && x.w === 0 && x.v === 100) && top.some(/* 按原作者条件匹配字段或标记。 */ x => x.f === 3 && x.w === 2)) out = concat([u8, lenField(3, simpleModeEntry())]);
    if (!out) return null;
    return gz ? gzip(out) : out;
  }

  // 按请求阶段和域名处理 Loon 正文。

  function main() {
    const url = $request.url || "", host = (url.split("/")[2] || "").split(":")[0];
    const isResp = typeof $response !== "undefined" && $response !== null;
    try {
      if (!isResp) {
        const b = host === "i.video.qq.com" ? toU8($request.body) : null;
        const r = b && b.length ? onTrpcRequest(b) : null;
        $done(r ? { body: r } : {});
        return;
      }
      if (host === "rdelivery.qq.com") {
        const s = typeof $response.body === "string" ? $response.body : "";
        const o = /"tab_gray"\s*:\s*true/.test(s) ? s.replace(/("tab_gray"\s*:\s*)true/, "$1false") : null;
        $done(o ? { body: o } : {});
        return;
      }
      const b = toU8($response.body);
      let r = null;
      if (b && b.length) {
        if (host === "i.video.qq.com") r = onTrpcResponse(b);
        else if (host === "iacc.qq.com") r = onJce(b);
        else if (host === "config.ab.qq.com" && url.split("?")[0].endsWith("/tab/GetTabRemoteConfig")) r = onAbConfig(b);
      }
      $done(r ? { body: r } : {});
    } catch (e) {
      console.log("txvideo-ad-clean: " + e);
      $done({});
    }
  }
  main();
})();
