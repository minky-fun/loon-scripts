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
