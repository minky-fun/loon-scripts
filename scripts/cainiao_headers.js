// 仅供学习交流，请勿用于商业或非法用途。
/**
 * 菜鸟请求头抓取脚本
 * 适用于 Loon
 * 功能：
 * 1. 抓取指定 POST 请求的所有请求头
 * 2. 保存完整 headers 到持久化存储
 * 3. 额外拆分保存常用关键字段，方便 BoxJS 查看
 * 4. 不修改原请求
 */

const STORAGE_KEYS = {
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

function getHeader(headers, name) {
  if (!headers || !name) return '';

  const target = name.toLowerCase();

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === target) {
      return headers[key];
    }
  }

  return '';
}

function writeStore(key, value) {
  try {
    const data = value == null ? '' : String(value);
    return $persistentStore.write(data, key);
  } catch (error) {
    console.log(`[菜鸟请求头抓取] 写入失败：${key}`);
    console.log(String(error));
    return false;
  }
}

function formatHeaders(headers) {
  return Object.keys(headers)
    .map((key) => `${key}: ${headers[key]}`)
    .join('\n');
}

function notify(title, subtitle, message) {
  try {
    if (typeof $notification !== 'undefined') {
      $notification.post(title, subtitle, message);
    }
  } catch (error) {
    console.log('[菜鸟请求头抓取] 通知失败');
    console.log(String(error));
  }
}

(function main() {
  try {
    const url = $request.url || '';
    const method = ($request.method || '').toUpperCase();
    const headers = $request.headers || {};

    const isTargetApi =
      method === 'POST' &&
      /^https:\/\/caps-mtop\.cainiao\.com\/gw\/mtop\.cainiao\.pcs\.packageservice\.querypackagedynlist\.cn\/1\.0/.test(
        url,
      );

    if (!isTargetApi) {
      console.log('[菜鸟请求头抓取] 非目标请求，跳过');
      $done({});
      return;
    }

    const now = new Date();
    const captureTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const headersJson = JSON.stringify(headers, null, 2);
    const headersText = formatHeaders(headers);

    writeStore(STORAGE_KEYS.headersJson, headersJson);
    writeStore(STORAGE_KEYS.headersText, headersText);

    writeStore(STORAGE_KEYS.cookie, getHeader(headers, 'Cookie'));
    writeStore(STORAGE_KEYS.xSign, getHeader(headers, 'x-sign'));
    writeStore(STORAGE_KEYS.xMiniWua, getHeader(headers, 'x-mini-wua'));
    writeStore(STORAGE_KEYS.xSgext, getHeader(headers, 'x-sgext'));
    writeStore(STORAGE_KEYS.xUmt, getHeader(headers, 'x-umt'));
    writeStore(STORAGE_KEYS.xSid, getHeader(headers, 'x-sid'));
    writeStore(STORAGE_KEYS.xUid, getHeader(headers, 'x-uid'));
    writeStore(STORAGE_KEYS.xAppkey, getHeader(headers, 'x-appkey'));
    writeStore(STORAGE_KEYS.xT, getHeader(headers, 'x-t'));
    writeStore(STORAGE_KEYS.xUtdid, getHeader(headers, 'x-utdid'));
    writeStore(STORAGE_KEYS.xDevid, getHeader(headers, 'x-devid'));
    writeStore(STORAGE_KEYS.lastCaptureTime, captureTime);

    console.log('[菜鸟请求头抓取] 抓取成功');
    console.log(`[菜鸟请求头抓取] 时间：${captureTime}`);
    console.log(`[菜鸟请求头抓取] URL：${url}`);
    console.log(`[菜鸟请求头抓取] Headers：\n${headersText}`);

    notify('菜鸟请求头抓取成功', captureTime, '已保存到 BoxJS / 持久化存储');

    /**
     * 不修改原请求，直接放行
     */
    $done({
      headers,
    });
  } catch (error) {
    console.log('[菜鸟请求头抓取] 脚本异常');
    console.log(String(error));

    notify('菜鸟请求头抓取失败', '脚本执行异常', String(error));

    $done({});
  }
})();
