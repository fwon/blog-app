**Singleton(单例)模式**
限制了类的实例化次数只能为一次

    getInstance = function () {
      if (this._instance == null) {
        this._instance = new Singletance();
      }
      return this._instance;
    }

 
**Mediator(中介者)模式**
Mediator模式促进松耦合的方式是确保组件的交互是通过这个中心点来处理的，
而不是通过显式地应用彼此，这种模式可以帮助我们解耦并提高组件的可重用性。
通常可理解为Observer的共享目标。或Event模块。
 
**Command(命令)模式**
封装一个execute方法统一执行命令。
 
**Factory(工厂)模式**
提供一个通用的接口来创建对象

    function MotoFactory (option) {
      if(option.type === 'car') {
        this.product = Car;
      } else {
        this.product = Truck;
      }
      return new this.product;
    }

抽象工厂：先抽象再细化
 
**Mixin(混入)模式**
用于函数复用
 
**Decorator(装饰者)模式**
多见于类扩展中，与Mixin类似，是另一个可行的对象子类化的替代方案。
jQuery.extend
 
**Composite(组合)模式**
Composite模式描述了一组对象，可以使用与处理对象的单个实例同样的方式来进行处理。
addClass()可以应用于单个item或组
 
$("#singleItem").addClass("active");
$(".item").addClass("active");
 
**Adapter(适配器)模式**
适配器模式讲对象或类的接口(Interface)转变为特定的系统兼容的接口。
jQuery.fn.css()方法，提供了标准化的接口，使我们能够使用简单的语法适配浏览器。
 
**Facade(外观)模式**
外观模式为更复杂的代码提供一个更简单的接口
jQuery.ajax 封装了get, post, getJSON, getScript等外观接口
 
**Observer(观察者)模式**
在系统中提供订阅和发布功能
jQuery.on, jQuery.off, jQuery.trigger
 
**Iterator(迭代器)模式**
迭代器顺序访问聚合对象的元素，无需公开其基本形式。
jQuery.each, 也被视为一种特殊的Facade
 
**Proxy(代理)模式**
控制对象访问权限和上下文。
jQuery.proxy()
如：

    $("button").on("click", function () {
      //proxy将外层的this传递进去
      setTimeout($.proxy(function () {
        //获取到正确的上下文，避免变成window
        $(this).addClass("active");
      }, this), 500);
    })
