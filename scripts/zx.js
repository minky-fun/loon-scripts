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
if (!$response.body) {
    console.log("❌ 无响应体");
    $done({});
}

const url = $request.url;
let obj = JSON.parse($response.body);

console.log("🎯 匹配到携程广告请求：" + url);

if (url.includes("/json/tripAds")) {
    let adCount = 0;
    if (obj && obj.seats) {
        obj.seats.forEach(seat => {
            if (seat.ads) adCount += seat.ads.length;
        });
    }
    
    console.log("📊 原始广告数量：" + adCount + "个");
    
    // 移除广告
    if (obj && obj.seats) {
        obj.seats = [];
    }
    
    obj.code = 200;
    obj.message = "SUCCESS";
    
    console.log("✅ 广告已成功移除");
    
    $done({body: JSON.stringify(obj)});
} else {
    console.log("⏭️  非广告请求，跳过处理");
    $done({});
}
