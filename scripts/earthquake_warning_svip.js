// 将苹果会员查询接口的响应替换为 SVIP，并把到期时间设为当前日期的 10 年后。
const body = JSON.parse($response.body);
const endTime = new Date();

endTime.setFullYear(endTime.getFullYear() + 10);

body.data.productName = 'svip_year';
body.data.endTime = endTime.getTime();
body.data.vipType = 'svip';
body.data.productId = 'com.huania.earthquakewarning.svip.year';
body.data.upgradePrice = 0;

$done({ body: JSON.stringify(body) });
