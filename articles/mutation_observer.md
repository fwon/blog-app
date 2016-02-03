最近看了fex团队的一篇关于前端xss攻击的文章，感觉非常精彩。
里面对于MutationEvent的运用让人眼前一亮。所以顺便学习并记录了一下该事件的相关用法。
Mutation events 包括DOMNodeInserted事件，其用法如下：
```javascript
document.addEventListener('DOMNodeInserted', function(e) {
    console.log('DOMNodeInserted:', e);
}, true);

var el = document.createElement('script');
el.src = 'http://www.xxx.com/xss/out.js?dynamic';
document.body.appendChild(el);
```
当程序动态往document添加script节点时，MutationEvent捕抓到了该DOMNodeInserted事件，并触发了回调，输出‘DOMNodeInserted:xxx’。

类似的事件还有：

 - DOMAttrModified
 - DOMAttributeNameChanged
 - DOMCharacterDataModified
 - DOMElementNameChanged
 - DOMNodeInserted
 - DOMNodeInsertedIntoDocument
 - DOMNodeRemoved
 - DOMNodeRemovedFromDocument
 - DOMSubtreeModified

但是使用MotationEvent有两个缺点：
**一是会影响DOM操作的执行效率**，可能会有高达1.5-7倍的延迟！而且移除监听器的操作，也会带来性能上的影响。
**二是会存在跨浏览器兼容的问题。**
对于第二点我们都知道是因为各浏览器厂商对API支持的不一致导致的，那为什么会存在第一个问题呢？个人认为有以下原因。
第一，对DOM节点的监听会消耗节点遍历的时间，而被监听DOM的分支越深，则所用时间越多。
第二，某些事件如DOMAttributeNameChanged and DOMElementNameChanged.等会储存节点信息，而当这些信息为SVG attribute或一些大的样式，其开销也会相当大。mutation将这些信息封装为一个信息量很大的objects并返回给回调函数，这些操作需要一定的计算消耗和内存损耗。

因为mutation event存在比较大的性能问题，它已经逐渐被淘汰了，而且官方建议最好不再使用。取而代之的是MutationObserver类，其构造函数的格式为：
```javascript
MutationObserver(
     function callback
);
```
callback函数有两个参数，第一个参数为MutationRecord类型的对象，第二个为该MutationObserver的实例。每一个MutationObserver包含三个方法。

方法一, **observe(Node target, MutationObserverInit options)**;
observe即为监听函数，传入两个参数：
```javascript
void observe(
     Node target,     //设置监听的节点
     MutationObserverInit options     //设置监听的选项
);
```
一个最简单的监听是这样写的：
```javascript
var observer = new MutationObserver(function(mutations) {
    console.log('MutationObserver:', mutations);
});
observer.observe(document, {
    subtree: true, //表示对target的后代也添加该监听
    childList: true //必选项，表示子节点（包括文字节点）的添加删除操作会被监听
});
```
当html中外部引入js时
```javascript
<script src="http://www.xxx.com/xss/out.js"></script>
```
MutationObserver监听到了document中的静态元素变化。发现有新元素添加就会触发回调。当页面中载入<script src="http://www.xxx.com/xss/out.js"></script>时，会输出mutations对象。
方法二，**disconnect()**
取消节点的监听事件。
方法三，**takeRecords()**
清除MutationObserver事例的记录队列并返回该队列。
返回的类型为MutationRecords,也就是MutationObserver构造函数回调的第一个参数。
该object包括addedNodes,removedNodes等节点信息。
虽然运用这些方法虽然比较爽地解决一些问题，但是基于节点的遍历在性能上还是存在一定瓶颈，这在于这种观察者模式的内部实现，虽然MutationObserser已经做了优化，但是个人建议非必要时还是不要滥用。

参考：
1.https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events
2.https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver