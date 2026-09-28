// Loon http-response 脚本：仅改变本机网页收到的前端 JS 中的会员展示数据。
// 不修改网络 API 响应、账号权限或服务端会员记录。
const marker = 'return Y.d}async function z(';
const replacement = 'if(e==="/api/user/info/get"&&Y.d&&typeof Y.d==="object"){Y.d.IsVip=true;Y.d.VipLevel=1;Y.d.VipLevelTitle="VIP会员（本地展示）";Y.d.VipExpireAt=2051193600}if(e==="/api/vip/get"&&Y.d&&Y.d.UserInfo&&typeof Y.d.UserInfo==="object"){Y.d.UserInfo.VipExpireAt=2051193600}return Y.d}async function z(';
try {
  const body = $response.body;
  if (typeof body !== 'string' || body.split(marker).length !== 2) {
    console.log('[VIP display] 前端脚本版本变化或响应未匹配，保持原样');
    $done({});
  } else {
    $done({ body: body.replace(marker, replacement) });
  }
} catch (err) {
  console.log('[VIP display] ' + String(err));
  $done({});
}
