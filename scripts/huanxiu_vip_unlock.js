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
// 开关参数来自 Loon 注入的 $argument 字符串。
const argument = $argument;
const params = new URLSearchParams(argument);
const sipActive = params.get('sipActive') === 'true';
const vipActive = params.get('vipActive') === 'true';
const trialVip = params.get('trialVip') === 'true';
const obj = JSON.parse($response.body);
const date = new Date();

console.log('[幻休 VIP 解锁] 开始执行');
console.log(`[幻休 VIP 解锁] 原始参数: ${argument}`);
console.log(`[幻休 VIP 解锁] 开关解析: sipActive=${sipActive}, vipActive=${vipActive}, trialVip=${trialVip}`);
console.log(`[幻休 VIP 解锁] 原始字段: sipActive=${obj.data.sipActive}, vipActive=${obj.data.vipActive}, trialVip=${obj.data.trialVip}, sipExpireTime=${obj.data.sipExpireTime}, familySipExpireTime=${obj.data.familySipExpireTime}, vipExpireTime=${obj.data.vipExpireTime}, familyVipExpireTime=${obj.data.familyVipExpireTime}`);

date.setFullYear(date.getFullYear() + 1);

const expireTime = date.toISOString().slice(0, 10);

console.log(`[幻休 VIP 解锁] 计算到期时间: ${expireTime}`);

obj.data.sipActive = sipActive;
obj.data.vipActive = vipActive;
obj.data.trialVip = trialVip;

if (sipActive) {
  obj.data.sipExpireTime = expireTime;
  obj.data.familySipExpireTime = expireTime;
  console.log('[幻休 VIP 解锁] SIP 开关开启，已替换 sipExpireTime 与 familySipExpireTime');
} else {
  console.log('[幻休 VIP 解锁] SIP 开关关闭，跳过 sipExpireTime 与 familySipExpireTime');
}

if (vipActive) {
  obj.data.vipExpireTime = expireTime;
  obj.data.familyVipExpireTime = expireTime;
  console.log('[幻休 VIP 解锁] VIP 开关开启，已替换 vipExpireTime 与 familyVipExpireTime');
} else {
  console.log('[幻休 VIP 解锁] VIP 开关关闭，跳过 vipExpireTime 与 familyVipExpireTime');
}

console.log(`[幻休 VIP 解锁] 最终字段: sipActive=${obj.data.sipActive}, vipActive=${obj.data.vipActive}, trialVip=${obj.data.trialVip}, sipExpireTime=${obj.data.sipExpireTime}, familySipExpireTime=${obj.data.familySipExpireTime}, vipExpireTime=${obj.data.vipExpireTime}, familyVipExpireTime=${obj.data.familyVipExpireTime}`);
console.log('[幻休 VIP 解锁] 执行完成');

$done({
  body: JSON.stringify(obj)
});
