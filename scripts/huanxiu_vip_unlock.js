// 仅供学习交流，请勿用于商业或非法用途。
// 开关参数格式：sipActive=true&vipActive=true&trialVip=true
const argument = typeof $argument === 'string' ? $argument : '';
const params = new URLSearchParams(argument);
const sipActive = params.get('sipActive') !== 'false';
const vipActive = params.get('vipActive') !== 'false';
const trialVip = params.get('trialVip') !== 'false';
const obj = JSON.parse($response.body);
const date = new Date();

date.setFullYear(date.getFullYear() + 1);

const expireTime = date.toISOString().slice(0, 10);

obj.data.sipActive = sipActive;
obj.data.vipActive = vipActive;
obj.data.trialVip = trialVip;
obj.data.sipExpireTime = expireTime;
obj.data.familySipExpireTime = expireTime;
obj.data.vipExpireTime = expireTime;
obj.data.familyVipExpireTime = expireTime;

$done({
  body: JSON.stringify(obj)
});
