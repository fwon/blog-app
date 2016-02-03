问题由来
--
Web服务器可能会同时与数千个不同的客户端进行对话，这些服务器通常要记录下它们与谁交流，而不会认为所有的请求都来自匿名的客户端，那有哪些技巧可以让服务器识别到不同的客户端呢。

我们知道HTTP是一个无连接，无状态的请求/响应协议。
【无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。HTTP协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。】
Web服务器几乎没有什么信息可以用来判定是哪个用户发送的请求，也无法记录来访用户的请求序列。

解决方案
----

 - 承载用户身份的HTTP首部。
 - 客户端IP地址跟踪，通过用户的IP地址对其进行识别。
 - 用户登录，用认证方式来识别用户。
 - 胖URL，一种在URL中嵌入识别信息的技术。
 - cookie,一种功能强大且高效的持久身份识别技术。

下面主要就cookie的实现方式展开，如果对上述方法也有兴趣的可以参考[《HTTP权威指南》](http://book.douban.com/subject/10746113/)。

cookie
------

 **1. cookie的分类类**
cookie分为**会话cookie**和**持久cookie**。会话cookie是一种临时的cookie,它记录了用户访问站点时的设置和偏好。用户退出浏览器时，会话cookie就被删除了，持久cookie的生存时间更长一些；它们存储在硬盘上。通常会用持久cookie来维护某个用户周期性访问站点的登录信息。

会话cookie和持久cookie之间唯一的区别就是他们的过期时间。如果设置了Discard参数，或者没有设置Expires或Max-Age参数来说明扩展的过期时间，这个cookie就是一个会话cookie。

 **2. cookie工作原理**
用户首次访问Web站点是，Web服务器对用户一无所知。服务器返回信息给用户时，就包含了一个cookie,用户下次访问站点时，就会携带此cookie，这时候Web服务器就能识别此客户端了。
cookie中包含了一个由name=value信息构成的任意列表，并通过Set-Cookie或Set-Cookie2 HTTP响应首部将其贴到用户身上去。
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/cookie-01.jpg)
cookie中可以包含任意信息，它们通常都只包含一个服务器为了进行跟踪而产生的独特识别码，比如id="34294"。服务器可以用这个数字来查找服务器为其访问者积累的数据库信息（用户购物地址，地址信息等）。

浏览器会记住从服务器返回的Set-Cookie或Set-Cookie2首部中的cookie内容，并将cookie集存储在浏览器的cookie数据库中。并在下次访问时在一个cookie请求首部中将其传出去。

 **3. 几个重要的cookie属性**
cookie的域属性---domain
产生cookie的服务器可以像Set-Cookie响应首部添加一个Domain属性来控制哪些站点可以看到那个cookie。

cookie的路径属性---path
通过Path属性可以讲cookie与部分Web站点关联起来。例如，某个Web服务器可能由两个组织共享的，每个组织都有独立的cookie。比如站点www.airtravel.com可能会将部分Web站点用于汽车租赁--比如，www.airtravel.com/autos/用一个独立的cookie来记录用户喜欢的汽车尺寸，可能会生成一个如下所示的特殊汽车租赁cookie:

    Set-cookie:pref=compact;domain="airtravel.com";path=/autos/

如果用户访问www.airtravel.com/specials.html,就只会获得这个cookie:

    Cookie:user="mary17"

但如果访问www.airtravel.com/autos/cheapo/index.html,就会获得这两个cookie：

    Cookie: user="mary17"
    Cookie: pref="compact"

 **4. Cookie的版本**
cookie规范有两个不同的版本，cookie版本0(有时候被称为Netscape cookies)和cookies版本1(RFC 2965)。cookie版本1是对cookies版本0的扩展，应用不如后者广泛。
cookie版本0（Netscape）
最初的cookie规范是由网景公司定义的。这些"版本0"的cookie定义了Set-Cookie响应首部，cookie请求首部以及用于控制cookie的字段。版本0的cookie看起来如下所示：
Set-Cookie：name=value[;expires=date][;path=path][;domain=domain][;secure]
Cookie:name1=value1[;name2=value2]...

cookie版本1(RFC 2965)
RFC 2965定义了一个cookie的扩展版本。这个版本1标准引入了Set-Cookie2首部和Cookie2首部，但它也能与版本0系统进行互操作。

RFC2965Cookie的主要改动包括下列内容：

 - 为每个Cookie关联上解释性文本，对其目的进行解释。
 - 允许在浏览器退出时，不考虑过期时间，将Cookie强制销毁。
 - 用相对秒数，而不是绝对日期来表示Cookie的Max-Age。
 - 通过URL端口号，而不仅仅是域和路径来控制Cookie的能力。
 - 通过Cookie首部回送域，端口和路径过滤器。
 - 为实现互操作性使用的版本号。
 - 在Cookie首部从名字中区分出附加关键字的$前缀。

如果客户端从同一个响应中既获得了Set-Cookie首部，又获得了Set-Cookie2首部，就会忽略老的Set-Cookie首部。如果客户端既支持版本0又支持版本1的cookie,但从服务器获得的是版本0的Set-Cookie首部，就会带着版本0的Set-Cookie首部发送cookie。但客户端还应该发送Cookie2:$Version="1"来告知服务器它是可以升级的。

**Cookie的安全性**
cookie被用来做的最多的一件事就是保持身份认证的服务端状态。这种保持可能是基于会话的(Session),也有可能是持久性的。所以cookie中包含的服务端信息一旦泄露，那么就有可能造成用户信息被盗的危险。为了安全考虑，通常我们会禁止js直接对Cookie进行操作。通过给Cookie加上HttpOnly标签。浏览器的document就看不到Cookie了。能有效防止简单的页面XSS攻击。

对已Cookie的安全防范包括与Session的配合使用将会在后面再做总结。

