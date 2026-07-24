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

const AD_KEYS = new Set([
  'ad',
  'ads',
  'adarray',
  'addata',
  'adinfo',
  'adinfos',
  'adlist',
  'advert',
  'advertise',
  'advertisement',
  'alimama',
  'banner',
  'bannerlist',
  'csjsplash',
  'guidead',
  'guideads',
  'guideadsview',
  'launchsplash',
  'mama',
  'popad',
  'popup',
  'popupad',
  'recommendads',
  'sdkadarray',
  'searchads',
  'splash',
  'splashad',
  'splashads',
  'splashinfo',
]);

let removedCount = 0;

/**
 * 判断字段名是否属于动态库 Hook 点对应的广告字段。
 */
function isAdKey(key) {
  const compactKey = String(key).replace(/[_-]/g, '').toLowerCase();

  return AD_KEYS.has(compactKey);
}

/**
 * 递归清理对象或数组里的广告字段。
 */
function cleanAds(value) {
  if (Array.isArray(value)) {
    value.forEach(cleanAds);
    return value;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  Object.keys(value).forEach((key) => {
    if (isAdKey(key)) {
      delete value[key];
      removedCount += 1;
      return;
    }

    cleanAds(value[key]);
  });

  return value;
}

/**
 * Loon 响应脚本入口。
 */
function main() {
  try {
    const body = $response && $response.body ? $response.body : '';

    if (!body) {
      $done({});
      return;
    }

    const json = JSON.parse(body);
    cleanAds(json);

    if (removedCount > 0) {
      console.log(`[菜鸟去广告] 已清理字段：${removedCount}`);
      $done({ body: JSON.stringify(json) });
      return;
    }

    $done({});
  } catch (error) {
    console.log('[菜鸟去广告] 脚本异常');
    console.log(String(error));
    $done({});
  }
}

main();
