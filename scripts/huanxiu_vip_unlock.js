// 仅供学习交流，请勿用于商业或非法用途。
const obj = JSON.parse($response.body);
const date = new Date();

date.setFullYear(date.getFullYear() + 1);

const expireTime = date.toISOString().slice(0, 10);

obj.data.sipActive = true;
obj.data.vipActive = true;
obj.data.trialVip = true;
obj.data.sipExpireTime = expireTime;
obj.data.familySipExpireTime = expireTime;
obj.data.vipExpireTime = expireTime;
obj.data.familyVipExpireTime = expireTime;

$done({
  body: JSON.stringify(obj)
});
