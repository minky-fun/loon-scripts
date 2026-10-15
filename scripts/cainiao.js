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

const PACKAGE_KEYS = {
  headersJson: 'cainiao_pcs_headers_json',
  headersText: 'cainiao_pcs_headers_text',
  cookie: 'cainiao_pcs_cookie',
  xSign: 'cainiao_pcs_x_sign',
  xMiniWua: 'cainiao_pcs_x_mini_wua',
  xSgext: 'cainiao_pcs_x_sgext',
  xUmt: 'cainiao_pcs_x_umt',
  xSid: 'cainiao_pcs_x_sid',
  xUid: 'cainiao_pcs_x_uid',
  xAppkey: 'cainiao_pcs_x_appkey',
  xT: 'cainiao_pcs_x_t',
  xUtdid: 'cainiao_pcs_x_utdid',
  xDevid: 'cainiao_pcs_x_devid',
  lastCaptureTime: 'cainiao_pcs_last_capture_time',
};

const AUTOLOGIN_KEYS = {
  headersJson: 'cainiao_autologin_headers_json',
  data: 'cainiao_autologin_data',
  refreshToken: 'cainiao_refresh_token',
  sessionId: 'cainiao_session_id',
  cnAccountId: 'cainiao_cn_account_id',
  refreshTokenExpired: 'cainiao_refresh_token_expired',
  sessionIdExpired: 'cainiao_session_id_expired',
  lastCaptureTime: 'cainiao_refresh_token_last_capture_time',
  rawBody: 'cainiao_autologin_raw_body',
};

const PACKAGE_API_RE =
  /^https:\/\/(?:nbpickup-mtop\.cainiao\.com\/gw\/mtop\.cainiao\.nbpickup\.site\.pickup\.page\.query\.cn|caps-mtop\.cainiao\.com\/gw\/mtop\.cainiao\.(?:lpc|pcs)\.packageservice\.querypackagedynlist\.cn)\/1\.0/;
// 只保存逆向中确认的完整包裹列表请求，不把动态增量请求当成全量列表。
const PACKAGE_LIST_API_RE =
  /^https:\/\/caps-mtop\.cainiao\.com\/gw\/mtop\.cainiao\.(?:lpc\.packageservice\.querypdspackagedatalist\.cn|pcs\.packageservice\.querypackagedatalist\.cn)\/1\.0\/?(?:\?[^#]*)?$/i;
const PACKAGE_REQUEST_KEY = 'cainiao_package_request_v1';

/** 只保存抓取阶段和 API 名称，供组件诊断；不记录 URL 参数或凭据。 */
function recordCaptureStatus(state, url) {
  const match = url.match(/\/gw\/(mtop\.[a-z0-9.]+)\//i);
  if (!match) return;
  writeStore('cainiao_capture_status_v1', JSON.stringify({
    version: 1, scriptVersion: '1.2.1', state, api: match[1], capturedAt: Date.now(),
  }));
}

/** 保存完整签名请求；仅接受第一页，签名相关字段与原始请求保持一致。 */
function capturePackageRequest(url, method, headers, body) {
  if (!PACKAGE_LIST_API_RE.test(url)) return false;
  if (getHeader(headers, 'x-cniao-skip-capture')) return true;
  if (method !== 'GET' && method !== 'POST') return true;
  if (method === 'POST' && (typeof body !== 'string' || !body)) {
    recordCaptureStatus('body_missing', url);
    console.log('[菜鸟] 未获得原始请求体，请确认 requires-body=true');
    return true;
  }
  const carrier = method === 'GET' ? url.split('?')[1] || '' : body;
  const match = carrier.match(/(?:^|&)data=([^&]+)/);
  if (!match) {
    recordCaptureStatus('data_missing', url);
    console.log('[菜鸟] 未获得原始 data 参数，不覆盖完整请求');
    return true;
  }
  try {
    const data = JSON.parse(decodeURIComponent(match[1].replace(/\+/g, ' ')));
    if (!data || data.currentPage !== 1) {
      recordCaptureStatus('page_not_first', url);
      console.log('[菜鸟] 不是第一页请求，未保存完整列表');
      return true;
    }
  } catch (error) {
    recordCaptureStatus('data_invalid', url);
    console.log('[菜鸟] data 参数无法解析，不覆盖完整请求');
    return true;
  }
  if (!getHeader(headers, 'x-sign') || !getHeader(headers, 'x-t')) {
    recordCaptureStatus('signature_missing', url);
    console.log('[菜鸟] 缺少签名字段，不覆盖完整请求');
    return true;
  }
  const snapshot = { version: 1, url, method, headers, capturedAt: Date.now() };
  if (method === 'POST') snapshot.body = body;
  const saved = writeStore(PACKAGE_REQUEST_KEY, JSON.stringify(snapshot));
  recordCaptureStatus(saved ? 'captured' : 'storage_failed', url);
  console.log(saved ? '[菜鸟] 已保存完整包裹列表请求' : '[菜鸟] 完整请求保存失败');
  return true;
}

const AUTOLOGIN_API_RE =
  /^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.cnmember\.customer\.autologin\/1\.0/;

/**
 * 从请求头对象中按不区分大小写的方式读取指定头。
 */
function getHeader(headers, name) {
  const target = name.toLowerCase();

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }

  return '';
}

/**
 * 将数据写入 Loon 持久化存储。
 */
function writeStore(key, value) {
  try {
    return $persistentStore.write(value == null ? '' : String(value), key);
  } catch (error) {
    console.log(`[菜鸟] 写入失败：${key}`);
    return false;
  }
}

/**
 * 生成当前时间文本，方便在日志和存储里查看抓取时间。
 */
function getNowText() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0',
  )}:${String(now.getSeconds()).padStart(2, '0')}`;
}

/**
 * 将请求头转成便于阅读的多行文本。
 */
function formatHeaders(headers) {
  return Object.keys(headers)
    .map((key) => `${key}: ${headers[key]}`)
    .join('\n');
}

/**
 * 抓取包裹接口请求头，并拆分保存常用签名字段。
 */
function capturePackageHeaders(url, method, headers) {
  if (method !== 'POST' || !PACKAGE_API_RE.test(url)) {
    return false;
  }

  recordCaptureStatus('legacy_request', url);
  const captureTime = getNowText();
  const headersText = formatHeaders(headers);

  writeStore(PACKAGE_KEYS.headersJson, JSON.stringify(headers, null, 2));
  writeStore(PACKAGE_KEYS.headersText, headersText);
  writeStore(PACKAGE_KEYS.cookie, getHeader(headers, 'Cookie'));
  writeStore(PACKAGE_KEYS.xSign, getHeader(headers, 'x-sign'));
  writeStore(PACKAGE_KEYS.xMiniWua, getHeader(headers, 'x-mini-wua'));
  writeStore(PACKAGE_KEYS.xSgext, getHeader(headers, 'x-sgext'));
  writeStore(PACKAGE_KEYS.xUmt, getHeader(headers, 'x-umt'));
  writeStore(PACKAGE_KEYS.xSid, getHeader(headers, 'x-sid'));
  writeStore(PACKAGE_KEYS.xUid, getHeader(headers, 'x-uid'));
  writeStore(PACKAGE_KEYS.xAppkey, getHeader(headers, 'x-appkey'));
  writeStore(PACKAGE_KEYS.xT, getHeader(headers, 'x-t'));
  writeStore(PACKAGE_KEYS.xUtdid, getHeader(headers, 'x-utdid'));
  writeStore(PACKAGE_KEYS.xDevid, getHeader(headers, 'x-devid'));
  writeStore(PACKAGE_KEYS.lastCaptureTime, captureTime);

  console.log('[菜鸟] 包裹请求头抓取成功');
  console.log('[菜鸟] 当前为动态或取件页接口，未保存完整包裹列表请求');
  console.log(`[菜鸟] 时间：${captureTime}`);

  return true;
}

/**
 * 抓取 autologin 请求头和 URL 里的 data 参数。
 */
function captureAutologinHeaders(url, headers) {
  if (!AUTOLOGIN_API_RE.test(url)) {
    return false;
  }

  if (headers['x-cniao-skip-capture']) {
    console.log('[菜鸟] 小组件请求，跳过 autologin 请求头抓取');
    return true;
  }

  const cleaned = {};
  const skipKeys = new Set(['content-length', 'connection', 'host']);

  for (const [key, value] of Object.entries(headers)) {
    if (!skipKeys.has(key.toLowerCase()) && value != null) {
      cleaned[key] = String(value);
    }
  }

  writeStore(AUTOLOGIN_KEYS.headersJson, JSON.stringify(cleaned));

  const dataMatch = url.match(/[?&]data=([^&]+)/);
  if (dataMatch) {
    writeStore(AUTOLOGIN_KEYS.data, decodeURIComponent(dataMatch[1]));
    console.log('[菜鸟] autologin data 参数已保存');
  }

  console.log('[菜鸟] autologin 请求头抓取成功');
  console.log(`[菜鸟] 头数量：${Object.keys(cleaned).length}`);

  return true;
}

/**
 * 抓取 autologin 响应里的 refreshToken 和账号字段。
 */
function captureRefreshToken(url, body) {
  if (!AUTOLOGIN_API_RE.test(url)) {
    return false;
  }

  if (!body) {
    console.log('[菜鸟] autologin 响应体为空，请确认 requires-body=true');
    return true;
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch (error) {
    console.log('[菜鸟] autologin 响应 JSON 解析失败');
    return true;
  }

  const data = json && json.data && json.data.data ? json.data.data : {};
  const ext = data && data.ext ? data.ext : {};
  const refreshToken = data.refreshToken || '';

  if (!refreshToken) {
    console.log('[菜鸟] 未找到 refreshToken');
    return true;
  }

  const captureTime = getNowText();

  writeStore(AUTOLOGIN_KEYS.refreshToken, refreshToken);
  writeStore(AUTOLOGIN_KEYS.sessionId, data.sessionId || '');
  writeStore(AUTOLOGIN_KEYS.cnAccountId, data.cnAccountId || '');
  writeStore(AUTOLOGIN_KEYS.refreshTokenExpired, ext.refreshTokenExpired || '');
  writeStore(AUTOLOGIN_KEYS.sessionIdExpired, ext.sessionIdExpired || '');
  writeStore(AUTOLOGIN_KEYS.lastCaptureTime, captureTime);
  writeStore(AUTOLOGIN_KEYS.rawBody, body);

  console.log('[菜鸟] refreshToken 抓取成功');
  console.log(`[菜鸟] 时间：${captureTime}`);

  return true;
}

/**
 * 根据当前 Loon 脚本上下文分发到请求抓取或响应抓取。
 */
function main() {
  try {
    const url = $request && $request.url ? $request.url : '';
    const method = ($request && $request.method ? $request.method : '').toUpperCase();
    const headers = $request && $request.headers ? $request.headers : {};

    if (typeof $response !== 'undefined') {
      captureRefreshToken(url, $response.body || '');
      $done({});
      return;
    }

    if (capturePackageRequest(url, method, headers, $request.body)) {
      $done({});
      return;
    }

    if (!capturePackageHeaders(url, method, headers)) {
      captureAutologinHeaders(url, headers);
    }

    $done({});
  } catch (error) {
    console.log('[菜鸟] 脚本异常');
    $done({});
  }
}

main();
