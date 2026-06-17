/*
联通 Cookie 获取
*/

if ($request && $request.headers) {
  let cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie) {
    $persistentStore.write(cookie, "10010.cookie");
    $notification.post("联通Cookie获取成功", "已写入 BoxJs", "");
    console.log("联通Cookie写入成功");
  } else {
    console.log("未获取到Cookie");
  }
}