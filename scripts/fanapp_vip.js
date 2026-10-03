// FanApp getUserInfo：仅替换两个展示字段，不触碰账号身份、余额或服务端数据。
try {
  const data = JSON.parse($response.body);
  if (data && data.code === 0 && data.success === true &&
      data.results && typeof data.results === 'object' && !Array.isArray(data.results)) {
    data.results.isVip = 1;
    data.results.deadTime = '2099-12-31 23:59:59';
    $done({ body: JSON.stringify(data) });
  } else {
    $done({});
  }
} catch (error) {
  console.log('[FanApp 会员信息] 响应解析失败，保持原样：' + error);
  $done({});
}
