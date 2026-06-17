# Loon Scripts

个人自用 Loon 插件与脚本仓库，主要用于 GitHub Pages 和 raw 文件分发。

> 仓库内容仅供个人维护记录。使用前请自行检查规则、脚本来源和 MITM 域名。

## 快速使用

1. 复制下方插件文件的 raw 链接。
2. 在 Loon 中进入插件管理并添加插件。
3. 按插件内的 `[Mitm]` 配置开启对应域名。
4. 需要抓参的插件先打开对应 App 触发请求，再执行定时任务。

## Loon 插件

| 名称 | 文件 | 说明 |
|---|---|---|
| YouTube 去广告隐藏 Shorts 版 | [`youtube_ad_block.lpx`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/youtube_ad_block.lpx) | 去广告、隐藏 Shorts、处理播放页推荐卡 |
| 黑料网净化 | [`hlwxx_remove_ads.lpx`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/hlwxx_remove_ads.lpx) | 去开屏和页面广告内容 |
| 智行火车票去广告 | [`zhixing.lpx`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/zhixing.lpx) | 智行火车票广告净化 |

## 旧版插件

| 名称 | 文件 | 说明 |
|---|---|---|
| 菜鸟请求头抓取 | [`CainiaoHeaders.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/CainiaoHeaders.plugin) | 抓取菜鸟请求头和 refreshToken |
| 芒果 TV 解锁会员 | [`MangoTV_Vip.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/MangoTV_Vip.plugin) | 芒果 TV 会员相关请求处理 |
| PingMe | [`PingMe_Loon.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/PingMe_Loon.plugin) | 抓参、签到、视频奖励 |
| 瓜子影视净化 | [`TilingSales.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/TilingSales.plugin) | 去广告和页面净化 |
| 联通 Cookie 获取 | [`chinaunicom.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/chinaunicom.plugin) | 中国联通 App Cookie 抓取 |
| iios 签到 | [`iios_checkin_loon.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/iios_checkin_loon.plugin) | iios.fun 自动签到 |
| 一点万象签到 | [`mixc_signin_loon.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/mixc_signin_loon.plugin) | 一点万象参数捕获和每日签到 |
| 雨辰 ios 签到 | [`yuchenios.plugin`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/yuchenios.plugin) | 雨辰 ios 自动签到 |

## 脚本资源

| 文件 | 用途 |
|---|---|
| [`PingMe_Loon.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/PingMe_Loon.js) | PingMe 插件脚本 |
| [`TilingSales_getNav.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/TilingSales_getNav.js) | 瓜子影视净化脚本 |
| [`cainiao_headers.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/cainiao_headers.js) | 菜鸟请求头抓取脚本 |
| [`cainiao_refresh_token.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/cainiao_refresh_token.js) | 菜鸟 refreshToken 抓取脚本 |
| [`chinaunicom_cookie.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/chinaunicom_cookie.js) | 中国联通 Cookie 抓取脚本 |
| [`iios_checkin_loon.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/iios_checkin_loon.js) | iios 签到脚本 |
| [`sniff_yuyue.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/sniff_yuyue.js) | 预约相关脚本 |
| [`yuchenios.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/yuchenios.js) | 雨辰 ios 签到脚本 |
| [`zx.js`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/zx.js) | 智行火车票净化脚本 |

## 其他文件

| 文件 | 说明 |
|---|---|
| [`apple_intelligence.lsr`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/apple_intelligence.lsr) | Loon 规则集 |
| [`n_cn.ics`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/n_cn.ics) | 日历文件 |
| [`zhixing.png`](https://raw.githubusercontent.com/yangmingqi123/loon-scripts/main/zhixing.png) | 智行插件图标 |

## 维护约定

- 新增 Loon 插件优先使用 `.lpx` 格式。
- 插件文件保持在仓库根目录，避免破坏已有 raw 和 GitHub Pages 链接。
- 不提交 Cookie、Token、Authorization、账号 ID、手机号等私人数据。
- README 只记录公开文件和用途，不写入个人参数。
