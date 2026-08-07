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

const AD_MTOP_APIS = new Set([
  'mtop.cainiao.guoguo.nbnetflow.ads.show.cn',
  'mtop.cainiao.guoguo.ads.expose.mreply.cn',
  'mtop.cainiao.nbcommerce.recommend.feedback.forbid.query.cn',
]);

const AD_API_PATTERNS = [
  /guoguo\/nbnetflow\/ads/i,
  /guoguo\/ads\/expose/i,
  /hubble\/ads/i,
  /splashscreen\/getSplashInfo/i,
  /amdp\//i,
  /recommend\/ad/i,
  /acds\//i,
];

let removedCount = 0;

/**
 * 判断字段名是否属于菜鸟广告字段。
 */
function isAdKey(key) {
  const compactKey = String(key).replace(/[_-]/g, '').toLowerCase();

  return AD_KEYS.has(compactKey);
}

/**
 * 判断当前请求是否命中广告 API。
 */
function isAdApi(url) {
  if (AD_API_PATTERNS.some((pattern) => pattern.test(url))) {
    return true;
  }

  const dataMatch = url.match(/[?&]data=([^&]+)/);
  if (!dataMatch) {
    return false;
  }

  try {
    const data = JSON.parse(decodeURIComponent(dataMatch[1]));
    const api = data.api || data.apiName || '';

    return AD_MTOP_APIS.has(api);
  } catch (error) {
    return false;
  }
}

/**
 * 返回空 MTOP 成功响应，让广告请求不再继续。
 */
function doneEmptyResponse() {
  $done({
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ret: ['SUCCESS::调用成功'], data: {} }),
    },
  });
}

/**
 * 递归清理对象或数组里的广告字段，并过滤信息流广告项。
 */
function cleanAds(value) {
  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const item = value[index];

      if (item && typeof item === 'object' && (item.adType || item.isAd || item.advertisement)) {
        value.splice(index, 1);
        removedCount += 1;
        continue;
      }

      cleanAds(item);
    }

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
 * 处理 Loon 请求脚本入口。
 */
function handleRequest() {
  const url = $request && $request.url ? $request.url : '';

  if (isAdApi(url)) {
    console.log(`[菜鸟去广告] 拦截广告请求：${url}`);
    doneEmptyResponse();
    return;
  }

  $done({});
}

/**
 * 处理 Loon 响应脚本入口。
 */
function handleResponse() {
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
}

/**
 * 根据 Loon 当前上下文执行请求拦截或响应清理。
 */
function main() {
  try {
    if (typeof $response === 'undefined') {
      handleRequest();
      return;
    }

    handleResponse();
  } catch (error) {
    console.log('[菜鸟去广告] 脚本异常');
    console.log(String(error));
    $done({});
  }
}

main();
