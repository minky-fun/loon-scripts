if (!$response || !$response.body) { $done({}); }

const url = $request.url;
let text = $response.body;

// 尝试 JSON & gzip 已由 Loon 处理，body 是解码后的；如果不是 JSON 也无所谓，我们做纯文本匹配
const needles = [
  "预约狂欢礼",
  "\\u9884\\u7ea6\\u72c2\\u6b22\\u793c", // Unicode 形式
  "预约", "狂欢"
];

const hit = needles.some(k => text.indexOf(k) !== -1);
if (hit) {
  console.log("🧩 命中“预约狂欢礼” → " + url);
  // 也可以把命中片段裁一段出来
  try {
    const i = text.indexOf("预约") >= 0 ? text.indexOf("预约") : text.indexOf("\\u9884\\u7ea6");
    if (i >= 0) {
      const snippet = text.slice(Math.max(0, i - 80), i + 200);
      console.log("片段：", snippet.slice(0, 400));
    }
  } catch(e){}
}

$done({});
