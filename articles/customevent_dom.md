### CustomEvent-传统DOM事件

如今大多数前端框架都添加了对事件系统的支持，通常的做法是定义一个事件存储器，当时间绑定时，将事件以及对于的回调存储起来，触发事件的时候，从存储器取出回调执行，其简单实现代码如下：
```javascript
var list = {}; //容器

function bind(event, fn) {
    list[event] = fn;
}
function trigger(event) {
    list[event]();
}

bind("event1", callback); //绑定
trigger("event1"); //触发
```
实现原理比较简单，但是一个健壮的事件系统往往就是一个框架的核心。DOM3中的事件系统除了我们熟知的UIEvent外，还定义了一个CustonEvent事件，用于自定义DOM的事件。

![event](https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/images/event-inheritance.svg)

下面代码演示了怎么实现一个简单的CustomEvent。
```javascript
// 添加事件监听
document.addEventListener("eventName", function(e) {
    console.log(e.detail);
});

// 创建事件
var event = new CustomEvent("eventName", {"detail":{"msg":true}});

//触发事件
document.dispatchEvent(event);
```
基于这样的设计，有利于把事件独立开来，不与DOM本身耦合在一起，有利于事件的分发，多个DOM可以共用同一个事件。

利用它我们也能够建造一个事件系统，不过其本质是基于DOM的监听，跟我们上面基于容器的事件系统相比，性能上是没有可比性的，在一个页面中添加过多的DOM事件是比较消耗性能的。
