/**
 * 抓取 cn-acs.m.cainiao.com autologin 请求头
 * Surge / Quantumult X / Loon 通用
 * 用法：挂到 cn-acs.m.cainiao.com 的请求脚本（onRequest）
 * 存储 key: cainiao_autologin_headers_json
 */

const STORAGE_KEY_HEADERS = "cainiao_autologin_headers_json"
const STORAGE_KEY_DATA = "cainiao_autologin_data"  // URL 里的 data 参数，回放时需要一字不差

function writeStore(key, value) {
  try {
    const data = value == null ? "" : String(value)
    return $persistentStore.write(data, key)
  } catch (error) {
    console.log(`[菜鸟autologin头抓取] 写入失败：${key}`)
    console.log(String(error))
    return false
  }
}

function getNowText() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
    2,
    "0",
  )}:${String(now.getSeconds()).padStart(2, "0")}`
}

function notify(title, subtitle, message) {
  try {
    if (typeof $notification !== "undefined") {
      $notification.post(title, subtitle, message)
    }
  } catch (error) {
    console.log("[菜鸟autologin头抓取] 通知失败")
    console.log(String(error))
  }
}

;(function main() {
  try {
    const url = $request && $request.url ? $request.url : ""
    const headers = $request && $request.headers ? $request.headers : {}

    const isTargetApi =
      /^https:\/\/cn-acs\.m\.cainiao\.com\/gw\/mtop\.cainiao\.cnmember\.customer\.autologin\/1\.0/.test(
        url,
      )

    if (!isTargetApi) {
      console.log("[菜鸟autologin头抓取] 非目标接口，跳过")
      $done({})
      return
    }

    // 小组件发出的请求，跳过不抓
    if (headers["x-cniao-skip-capture"]) {
      console.log("[菜鸟autologin头抓取] 小组件请求，跳过")
      $done({})
      return
    }

    if (!headers || Object.keys(headers).length === 0) {
      console.log("[菜鸟autologin头抓取] 请求头为空")
      $done({})
      return
    }

    // 过滤掉不需要的头，减少体积
    const skipKeys = new Set(["content-length", "connection", "host"])
    const cleaned = {}
    for (const [k, v] of Object.entries(headers)) {
      if (!skipKeys.has(k.toLowerCase()) && v != null) {
        cleaned[k] = String(v)
      }
    }

    const captureTime = getNowText()

    writeStore(STORAGE_KEY_HEADERS, JSON.stringify(cleaned))

    // 从 URL 提取 data 参数，回放时需要一字不差（签名的 MD5 依赖它）
    const dataMatch = url.match(/[?&]data=([^&]+)/)
    if (dataMatch) {
      writeStore(STORAGE_KEY_DATA, decodeURIComponent(dataMatch[1]))
      console.log("[菜鸟autologin头抓取] data 参数已保存")
    }

    console.log(`[菜鸟autologin头抓取] 抓取成功`)
    console.log(`[菜鸟autologin头抓取] 时间：${captureTime}`)
    console.log(`[菜鸟autologin头抓取] 头数量：${Object.keys(cleaned).length}`)

    notify("菜鸟 autologin 头抓取成功", captureTime, `已保存 ${Object.keys(cleaned).length} 个头 + data`)

    // 不修改请求，直接放行
    $done({})
  } catch (error) {
    console.log("[菜鸟autologin头抓取] 脚本异常")
    console.log(String(error))
    notify("菜鸟 autologin 头抓取失败", "脚本异常", String(error))
    $done({})
  }
})()
