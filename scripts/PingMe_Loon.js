// PingMe_Loon.js
// Loon 外链脚本版：抓参 + 自动签到 + 视频奖励

const scriptName = 'PingMe';
const ckKey = 'pingme_capture_v3';

const SECRET = '0fOiukQq7jXZV2GRi9LGlO';
const MAX_VIDEO = 5;
const VIDEO_DELAY = 8000;

function MD5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);

    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      return (lResult & 0x40000000)
        ? lResult ^ 0xc0000000 ^ lX8 ^ lY8
        : lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(str) {
    const lMessageLength = str.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1).fill(0);

    let lBytePosition = 0;
    let lByteCount = 0;

    while (lByteCount < lMessageLength) {
      const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] |= str.charCodeAt(lByteCount) << lBytePosition;
      lByteCount++;
    }

    const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] |= 0x80 << lBytePosition;
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;

    return lWordArray;
  }

  function WordToHex(lValue) {
    let wordToHexValue = '';
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      const wordToHexValueTemp = '0' + lByte.toString(16);
      wordToHexValue += wordToHexValueTemp.substr(
        wordToHexValueTemp.length - 2,
        2
      );
    }
    return wordToHexValue;
  }

  const x = ConvertToWordArray(string);

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  const S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  const S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  const S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a;
    const BB = b;
    const CC = c;
    const DD = d;

    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
}

function getUTCSignDate() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
    now.getUTCDate()
  )} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(
    now.getUTCSeconds()
  )}`;
}

function normalizeHeaderNameMap(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(k => {
    out[k] = headers[k];
  });
  return out;
}

function parseRawQuery(url) {
  const query = (url.split('?')[1] || '').split('#')[0];
  const rawMap = {};
  query.split('&').forEach(pair => {
    if (!pair) return;
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    const k = pair.slice(0, idx);
    const v = pair.slice(idx + 1);
    rawMap[k] = v;
  });
  return rawMap;
}

function buildSignedParamsRaw(capture) {
  const params = {};
  Object.keys(capture.paramsRaw || {}).forEach(k => {
    if (k !== 'sign' && k !== 'signDate') params[k] = capture.paramsRaw[k];
  });

  params.signDate = getUTCSignDate();
  const signBase = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');

  params.sign = MD5(signBase + SECRET);
  return params;
}

function buildUrl(path, capture) {
  const params = buildSignedParamsRaw(capture);
  const qs = Object.keys(params)
    .map(k => `${k}=${encodeURIComponent(params[k])}`)
    .join('&');

  return `https://api.pingmeapp.net/app/${path}?${qs}`;
}

function cloneHeaders(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(k => {
    out[k] = headers[k];
  });
  return out;
}

function buildHeaders(capture) {
  const headers = cloneHeaders(capture.headers || {});

  delete headers['Content-Length'];
  delete headers['content-length'];
  delete headers[':authority'];
  delete headers[':method'];
  delete headers[':path'];
  delete headers[':scheme'];

  headers['Host'] = 'api.pingmeapp.net';
  headers['Accept'] = headers['Accept'] || 'application/json';

  return headers;
}

function notify(title, body) {
  if (typeof $notification !== 'undefined') {
    $notification.post(scriptName, title, body);
  } else if (typeof $notify !== 'undefined') {
    $notify(scriptName, title, body);
  }
}

function write(key, value) {
  if (typeof $persistentStore !== 'undefined') {
    return $persistentStore.write(value, key);
  }
  if (typeof $prefs !== 'undefined') {
    return $prefs.setValueForKey(value, key);
  }
  return false;
}

function read(key) {
  if (typeof $persistentStore !== 'undefined') {
    return $persistentStore.read(key);
  }
  if (typeof $prefs !== 'undefined') {
    return $prefs.valueForKey(key);
  }
  return null;
}

function done(value = {}) {
  $done(value);
}

function httpGet(options) {
  return new Promise((resolve, reject) => {
    if (typeof $httpClient !== 'undefined') {
      $httpClient.get(options, (error, response, data) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            statusCode: response ? response.status : undefined,
            headers: response ? response.headers : {},
            body: data
          });
        }
      });
      return;
    }

    if (typeof $task !== 'undefined') {
      $task
        .fetch({
          url: options.url,
          method: 'GET',
          headers: options.headers
        })
        .then(resolve)
        .catch(reject);
      return;
    }

    reject(new Error('No HTTP API available'));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (typeof $request !== 'undefined' && $request) {
  const capture = {
    url: $request.url,
    paramsRaw: parseRawQuery($request.url),
    headers: normalizeHeaderNameMap($request.headers || {})
  };

  write(ckKey, JSON.stringify(capture));
  notify('✅ 参数抓取成功', '已保存请求头和参数');
  console.log(`【${scriptName}】capture:\n${JSON.stringify(capture, null, 2)}`);
  done({});
} else {
  const raw = read(ckKey);

  if (!raw) {
    notify('⚠️ 未抓到参数', '先打开 PingMe 触发一次 queryBalanceAndBonus');
    done();
  } else {
    let capture;
    try {
      capture = JSON.parse(raw);
    } catch (e) {
      notify('⚠️ 参数损坏', '请重新打开 PingMe 抓参');
      done();
      return;
    }

    const headers = buildHeaders(capture);
    const msgs = [];

    function fetchApi(path) {
      return httpGet({
        url: buildUrl(path, capture),
        headers
      });
    }

    async function doVideoLoop(count) {
      for (let i = 1; i <= count; i++) {
        await sleep(i === 1 ? 1500 : VIDEO_DELAY);
        try {
          const res = await fetchApi('videoBonus');
          const d = JSON.parse(res.body || '{}');
          if (d.retcode === 0) {
            msgs.push(`视频${i}：+${d.result?.bonus || '?'} Coins`);
          } else {
            msgs.push(`⏸ 视频${i}：${d.retmsg || '失败'}`);
            break;
          }
        } catch (e) {
          msgs.push(`❌ 视频${i}：${e.message || e}`);
          break;
        }
      }
    }

    fetchApi('queryBalanceAndBonus')
      .then(res => {
        try {
          const d = JSON.parse(res.body || '{}');
          if (d.retcode === 0) {
            msgs.push(`余额：${d.result.balance} Coins`);
          } else {
            msgs.push(`⚠️ 查询：${d.retmsg || '失败'}`);
          }
        } catch (e) {
          msgs.push('❌ 查询：解析失败');
        }
        return fetchApi('checkIn');
      })
      .then(res => {
        try {
          const d = JSON.parse(res.body || '{}');
          if (d.retcode === 0) {
            msgs.push(
              `✅ 签到：${(d.result?.bonusHint || d.retmsg || '').replace(/\n/g, ' ')}`
            );
          } else {
            msgs.push(`⚠️ 签到：${d.retmsg || '失败'}`);
          }
        } catch (e) {
          msgs.push('❌ 签到：解析失败');
        }
        return doVideoLoop(MAX_VIDEO);
      })
      .then(() => {
        return fetchApi('queryBalanceAndBonus');
      })
      .then(res => {
        try {
          const d = JSON.parse(res.body || '{}');
          if (d.retcode === 0) {
            msgs.push(`最新余额：${d.result.balance} Coins`);
          }
        } catch (e) {}
        notify('✅ 任务完成', msgs.join('\n'));
        done();
      })
      .catch(err => {
        notify('❌ 任务失败', msgs.join('\n') + '\n' + (err.message || String(err)));
        done();
      });
  }
}
