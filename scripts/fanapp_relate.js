// FanApp getUserRelate：只处理 results 下的剧集列表，不改写其他结构。
try {
  const data = JSON.parse($response.body);
  const results = data && data.results;
  if (!data || data.code !== 0 || data.success !== true ||
      !results || typeof results !== 'object' || Array.isArray(results)) {
    $done({});
  } else {
    // 插件设置里的 #!input=openState 由 Loon 写入 persistentStore。
    const raw = $persistentStore.read('openState');
    const value = typeof raw === 'string' ? raw.trim() : String(raw == null ? '' : raw).trim();
    const configured = /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
    const openState = configured ? Number(value) : null;
    let changed = false;
    for (const key of Object.keys(results)) {
      const list = results[key];
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
        if (configured && Object.prototype.hasOwnProperty.call(item, 'openState')) {
          item.openState = openState;
          changed = true;
        }
        if (Object.prototype.hasOwnProperty.call(item, 'seriesNum') &&
            typeof item.seriesNumAll === 'number' && Number.isFinite(item.seriesNumAll)) {
          item.seriesNum = item.seriesNumAll;
          changed = true;
        }
      }
    }
    $done(changed ? { body: JSON.stringify(data) } : {});
  }
} catch (error) {
  console.log('[FanApp 剧集状态] 解析失败，保留原响应：' + error);
  $done({});
}
