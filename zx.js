
if (!$response.body) $done({});

const url = $request.url; //请求地址
let obj = JSON.parse($response.body); //请求结果

if (url.includes("/json/tripAds")) {
    // 彻底移除所有广告相关数据
    if (obj && obj.seats) {
        obj.seats = []; // 直接清空整个seats数组
    }

    // 保持响应结构完整但无广告
    obj.code = 200;
    obj.message = "SUCCESS";

    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
