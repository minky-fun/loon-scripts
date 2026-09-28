// Loon 998+: API 响应是 IV(16) + AES-256-CBC 二进制，不是 JSON 文本。
// 仅影响客户端看到的用户信息；不修改服务端账号和播放鉴权。
(function () {
  const PREFIX = '[dxweb VIP] ';
  const key = new TextEncoder().encode('mWnOc2VfZALtgvOD437RrV3S7sM1ZoBW');
  const endpoint = /\/api\/(user\/info\/get|vip\/get|discover\/mark|community\/browse\/tick)(?:\?|$)/.exec($request.url);
  if (!endpoint) { $done({}); return; }
  try {
    const original = $response.body;
    if (!(original instanceof Uint8Array) || original.length < 32 || (original.length - 16) % 16 !== 0) {
      throw Error('需要二进制响应：检查 binary-body-mode=true 和 MitM');
    }
    const iv = original.slice(0, 16);
    const plain = $crypto.aes.decrypt(original.slice(16), {
      mode: 'cbc', padding: 'pkcs7', key: key, iv: iv
    });
    const compressed = plain.length >= 2 && plain[0] === 0x1f && plain[1] === 0x8b;
    const decoded = compressed ? $utils.ungzip(plain) : plain;
    const packet = JSON.parse(new TextDecoder().decode(decoded));
    if (packet.c !== 0 || !packet.d || typeof packet.d !== 'object') {
      console.log(PREFIX + endpoint[1] + ' 返回非成功或无数据，保留原响应；状态=' + String(packet.c));
      $done({}); return;
    }
    const expiry = 2051193600; // 2035-01-01 00:00 +08:00，Unix 秒
    // vip/get 的 Levels 是站点实际等级表；只使用标题含“至尊”的编号，不猜测等级。
    let level = null;
    if (endpoint[1] === 'vip/get' && Array.isArray(packet.d.Levels)) {
      const supreme = packet.d.Levels.filter(item => item && /至尊/.test(String(item.Title || item.Name || '')) && Number.isFinite(Number(item.Level)));
      const selected = supreme.sort((a, b) => Number(b.Level) - Number(a.Level))[0];
      if (selected) {
        level = Number(selected.Level);
        $persistentStore.write(String(level), 'dxweb_vip_supreme_level');
        console.log(PREFIX + '从 Levels 识别至尊等级=' + level);
      }
    }
    if (level === null) {
      const saved = $persistentStore.read('dxweb_vip_supreme_level');
      if (saved !== null && saved !== undefined && saved !== '' && Number.isFinite(Number(saved))) level = Number(saved);
    }
    function applyMember(user) {
      user.IsVip = true;
      if (level !== null) user.VipLevel = level;
      user.VipLevelTitle = '至尊会员';
      user.VipExpireAt = expiry;
      // 短视频的广告横幅读取 Perms.hideAd；明确的 false 优先于 IsVip。
      user.Perms = Object.assign({}, user.Perms || {}, { hideAd: true });
    }
    let changed = false;
    if (endpoint[1] === 'community/browse/tick') {
      // 社区计时字段均为秒；Unlimited=true 时前端不再启用倒计时。
      packet.d.Unlimited = true;
      packet.d.Remaining = 86400;
      packet.d.Locked = false;
      packet.d.LimitSec = 86400;
      changed = true;
    } else if (endpoint[1] === 'discover/mark') {
      // 只关闭前端“今日观看限制”分支；不伪造计数或视频地址。
      packet.d.DailyWatchLimited = false;
      changed = true;
    } else if (endpoint[1] === 'user/info/get') {
      applyMember(packet.d);
      changed = true;
    } else if (packet.d.UserInfo && typeof packet.d.UserInfo === 'object') {
      applyMember(packet.d.UserInfo);
      changed = true;
    }
    if (!changed) {
      console.log(PREFIX + endpoint[1] + ' 无可修改的用户信息，保留原响应');
      $done({}); return;
    }
    const text = new TextEncoder().encode(JSON.stringify(packet));
    const payload = compressed ? $utils.gzip(text) : text;
    // 前端解密仅将前 16 字节当作 IV，不校验其签名；保留原 IV。
    const cipher = $crypto.aes.encrypt(payload, {
      mode: 'cbc', padding: 'pkcs7', key: key, iv: iv
    }).ciphertext;
    const result = new Uint8Array(16 + cipher.length);
    result.set(iv, 0);
    result.set(cipher, 16);
    const headers = Object.assign({}, $response.headers || {});
    for (const name of Object.keys(headers)) {
      if (name.toLowerCase() === 'content-length') delete headers[name];
    }
    console.log(PREFIX + endpoint[1] + ' 已解密并改写响应 (' + original.length + ' -> ' + result.length + ' bytes)');
    $done({ body: result, headers: headers });
  } catch (error) {
    console.log(PREFIX + endpoint[1] + ' 解密或改写失败，保留原响应: ' + String(error));
    $done({});
  }
})();
