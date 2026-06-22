// 仅供学习交流，请勿用于商业或非法用途。
/**
 * 菜鸟 refreshToken 抓取脚本
 * 文件名：cainiao_refresh_token.js
 * 适用于：Loon
 *
 * 功能：
 * 抓取：
 * https://cn-acs.m.cainiao.com/gw/mtop.cainiao.cnmember.customer.autologin/1.0
 *
 * 响应体里的：
 * data.data.refreshToken
 *
 * 并写入：
 * cainiao_refresh_token
 */

const STORAGE_KEYS = {
  refreshToken: 'cainiao_refresh_token',
  sessionId: 'cainiao_session_id',
  cnAccountId: 'cainiao_cn_account_id',
  refreshTokenExpired: 'cainiao_refresh_token_expired',
  sessionIdExpired: 'cainiao_session_id_expired',
  lastCaptureTime: 'cainiao_refresh_token_last_capture_time',
  rawBody: 'cainiao_autologin_raw_body',
};

function writeStore(key, value) {
  try {
    const data = value == null ? '' : String(value);
    return $persistentStore.write(data, key);
  } catch (error) {
    console.log(`[菜鸟refreshToken抓取] 写入失败：${key}`);
    console.log(String(error));
    return false;
  }
}

function getNowText() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0',
  )}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function notify(title, subtitle, message) {
  try {
    if (typeof $notification !== 'undefined') {
      $notification.post(title, subtitle, message);
    }
  } catch (error) {
    console.log('[菜鸟refreshToken抓取] 通知失败');
    console.log(String(error));
  }
}

(function main() {
  try {
    const url = $request && $request.url ? $request.url : '';
    const body = $response && $response.body ? $response.body : '';

    const isTargetApi =
      /^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.cnmember\.customer\.autologin\/1\.0/.test(
        url,
      );

    if (!isTargetApi) {
      console.log('[菜鸟refreshToken抓取] 非目标接口，跳过');
      $done({});
      return;
    }

    if (!body) {
      console.log('[菜鸟refreshToken抓取] 响应体为空，请确认 requires-body=true');
      $done({});
      return;
    }

    let json;

    try {
      json = JSON.parse(body);
    } catch (error) {
      console.log('[菜鸟refreshToken抓取] JSON 解析失败');
      console.log(String(error));
      console.log(body);
      $done({});
      return;
    }

    const data = json && json.data && json.data.data ? json.data.data : {};
    const ext = data && data.ext ? data.ext : {};

    const refreshToken = data.refreshToken || '';
    const sessionId = data.sessionId || '';
    const cnAccountId = data.cnAccountId || ext.accountId || '';
    const refreshTokenExpired = ext.refreshTokenExpired || '';
    const sessionIdExpired = ext.sessionIdExpired || '';

    if (!refreshToken) {
      console.log('[菜鸟refreshToken抓取] 未找到 refreshToken');
      console.log(body);
      $done({});
      return;
    }

    const captureTime = getNowText();

    writeStore(STORAGE_KEYS.refreshToken, refreshToken);
    writeStore(STORAGE_KEYS.sessionId, sessionId);
    writeStore(STORAGE_KEYS.cnAccountId, cnAccountId);
    writeStore(STORAGE_KEYS.refreshTokenExpired, refreshTokenExpired);
    writeStore(STORAGE_KEYS.sessionIdExpired, sessionIdExpired);
    writeStore(STORAGE_KEYS.lastCaptureTime, captureTime);
    writeStore(STORAGE_KEYS.rawBody, body);

    console.log('[菜鸟refreshToken抓取] 抓取成功');
    console.log(`[菜鸟refreshToken抓取] 时间：${captureTime}`);
    console.log(`[菜鸟refreshToken抓取] refreshToken：${refreshToken}`);
    console.log(`[菜鸟refreshToken抓取] sessionId：${sessionId}`);
    console.log(`[菜鸟refreshToken抓取] cnAccountId：${cnAccountId}`);

    notify('菜鸟 refreshToken 抓取成功', captureTime, '已保存到 cainiao_refresh_token');

    // 不修改响应，直接放行
    $done({});
  } catch (error) {
    console.log('[菜鸟refreshToken抓取] 脚本异常');
    console.log(String(error));

    notify('菜鸟 refreshToken 抓取失败', '脚本异常', String(error));

    $done({});
  }
})();
