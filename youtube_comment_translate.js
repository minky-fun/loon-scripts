/**
 * @name YouTube 评论翻译器（GPT）
 * @desc 拦截并翻译 YouTube 评论为中文，使用 GPT 接口
 * @author Minky
 * @homepage https://github.com/yangmingqi123
 * @date 2025-06-03
 * @icon https://www.youtube.com/s/desktop/8cfc17a7/img/favicon.ico
 * @input GPT_API_KEY
 * @input GPT_PROXY_URL
 * @mitm youtubei.googleapis.com
 * @rewrite ^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/next url script-response-body
 */

console.log("🎉 YouTube 评论翻译器插件加载成功！");

async function translate(text) {
  const GPT_API_KEY = $persistentStore.read("GPT_API_KEY") || "";
  const GPT_API_URL = $persistentStore.read("GPT_PROXY_URL") || "https://api.openai.com/v1/chat/completions";

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "你是一个英译中助手，只翻译评论，不添加解释。" },
      { role: "user", content: text }
    ],
    temperature: 0.3
  };

  const res = await fetch(GPT_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GPT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "翻译失败";
}

(async () => {
  let obj = JSON.parse($response.body);
  let threads = obj.contents?.twoColumnWatchNextResults?.results?.results?.contents || [];

  for (let item of threads) {
    let comment = item?.itemSectionRenderer?.contents?.[0]?.commentThreadRenderer?.comment?.commentRenderer;
    if (comment?.contentText?.runs?.[0]?.text) {
      let original = comment.contentText.runs[0].text;
      if (/^[\x00-\x7F\s.,'?!\-"]{10,}$/.test(original)) {
        try {
          const translated = await translate(original);
          comment.contentText.runs[0].text += `\n🔁 ${translated}`;
        } catch (e) {
          console.log("翻译失败", e);
        }
      }
    }
  }

  $done({ body: JSON.stringify(obj) });
})();
