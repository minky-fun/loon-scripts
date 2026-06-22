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
