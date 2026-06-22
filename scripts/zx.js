// 仅供学习交流，请勿用于商业或非法用途。
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
