80-90% 的终端用户响应时间花在下载页面组件，包括images, stylesheets, scripts, Flash, 等等. 
**1. 减少HTTP请求。**
①文件合并压缩。
将js和css压缩为一个文件，在雀彩中根据业务逻辑模块划分压缩。避免加载所有逻辑代码。
解决方案：FIS，LESS
②CSS Sprites。
将背景图片做成雪碧图，减少http请求。用background-image 和 background-position 实现。
③Image maps。
④Inline images。
将图片用base64编码实现 data: URL scheme，缺点是会增加html代码的体积，可以将其放在stylesheet里解决此问题。

**2. CDN内容分发网络。效果显著。**

**3.添加Expire头和Cache-Control头**
①对静态文件添加“永不过期”
②对动态文件添加一定时间的Expire
**4.Gzip**

**5.将css放在head,将js放在底部**

**6.避免css表达式**

**7.外部引用css和js文件**

**8.减少DNS查找**

**9.避免重定向**
①写全链接，避免出现重定向。

**10.避免重复加载代码**

**11.ajax缓存请求**

**12.耗时组件后加载**

**13.预加载**
①如分页应用

**14.优化DOM结构，减少个数**
①document.getElementsByTagName('*').length （YAHOO 700）
