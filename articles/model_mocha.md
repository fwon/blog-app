前段时间为部门的项目引入了前端单元测试，主要是基于seajs引入mocha，现在把这篇文章修改了一下发布出来。
为什么引入单元测试？
----------
在采用mvc框架做开发的过程中，我们不断积累出自己的一些核心组件和通用组件。
我们面临了越来越明显的代码维护问题，如果不提早针对这些组件开发单元测试，将来会面临更严重的代码管理和维护问题，
前人开发的组件没做单元测试，后人用了错误的组件却无法定位问题，不能形成一个完善的前端系统。所以我们有必要开始考虑这方法的问题。

为什么选择 mocha + chai ?
--------------------
mocha的作者是大名鼎鼎的TJ Holowaychuk。该人同时是express，jade, stylus的作者。所以mocha框架也自然很受欢迎...
mocha的优点主要有如下几个：

 1. 异步方法的测试更容易
 2. 支持before,after（即beforeAll/afterAll)
 3. 与nodejs结合更自然

我们的项目总是会朝着前后端分离的方向走，所以不管是nodejs的引入，ApiServer的抽离，都会让mocha发挥它强大的作用。
至于chai,它是一个很好用的断言库，支持多种断言风格，能给你无缝链接的赶脚。该方案的详细使用方法可参考[这里](http://blog.codeship.io/2014/01/22/testing-frontend-javascript-code-using-mocha-chai-and-sinon.html)。

前端单元测试实践
--------
那么选定好框架后，怎样引入到项目中，并且我们要用它做哪些工作呢？

 **1. 目录结构**
 我们的所有前端代码在webapp中，测试代码放在tests,和statics位于同一级。

    ├── Gruntfile.js
    ├── package.json
    └── webapp
        ├── statics
        └── tests

tests中的文件结构如下：

    ├── test.html
    ├── unit
    │   ├── base
    │   │   ├── api.base.js
    │   │   ├── app.js
    │   │   ├── cache.js
    │   │   ├── global.js
    │   │   ├── message.js
    │   │   ├── model.base.js
    │   │   ├── region.js
    │   │   ├── view.base.js
    │   │   └── view.js
    │   ├── component
    │   └── utils
    │       ├── algorithm.js
    │       ├── date.js
    │       ├── message.js
    │       ├── random.js
    │       ├── sync.js
    │       └── uievent.js
    ├── vendor
        ├── chai.js
        ├── mocha.css
        └── mocha.js


test.html 为入口文件，掌管所有测试用例，
vendor 提供一些框架支持，目前为mocha和chai。
unit 为单元测试的文件夹，
base 存放的是基类的测试用例，
utils 存放的是工具类的测试用例，
component 存放的是组件的测试用例。
其实这里的utils也可以理解为组件的一种，为了和我们的项目结构统一，区分出了utils。
 **2. 怎么加载测试用例**
由于框架的基类基本是很少改动的，所以其测试用例也相对比较少改动。更多的是我们在编写公用组件或工具类的时候，要自己编写相对应的测试用例，
让其他同学能放心使用你的组件。在编写测试用例的过程中，你才能发现它的不足之处，才能考虑它可能出现的异常情况，所以不要认为自己编写的
测试用例肯定是能跑通自己的代码，错了，编写测试用例的过程就是让你的代码更健壮的过程！废话不多说了，我们来看一下代码怎么写。
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Mocha FE tests</title>
<link rel="stylesheet" media="all" href="vendor/mocha.css">
</head>
<body>
<div id="mocha"><p><a href=".">Mocha FE Unit Test</a></p></div>
<div id="messages"></div>
<div id="fixtures"></div>
<div id='testElement'>
    <h1></h1>
</div>
<script src="vendor/mocha.js"></script>
<script src="vendor/chai.js"></script>
<script>
    mocha.setup('bdd');
</script>
</body>
</html>
<script src="../statics/js/seajs/sea.js"></script>
<script>
    var path = '../';
    seajs.use([
        path + '/tests/unit/base/view.base'
    ], function() {
        mocha.run();
    });
</script>
```
因为我们的模块化开发是基于seajs的，所以为了方便，这里也采用seajs分别对不同模块进行测试。
首先要引入mocha.js和chai.js，接着调用mocha.setup方法设置改测试为bdd模式。然后我们才可以开始加载测试用例。为了能在测试用例中方便引入被测试模块，我们故意引用了与其同目录下的seajs。
所以要在入口重新配置测试用例的路劲，添加path前缀。
加载完测试用例后，不要忘记回调 mocha.run() 这样才能让它跑起来。
 **3. 怎么编写测试用例**
```javascript
define(function(require){
    'use strict';
    var View = require('view.base'),
        $ = require('core/selector'),
        expect = chai.expect,
        assert = chai.assert;
    describe('View.base', function() {                          //View.base为模块名
        describe('constructor', function() {                    //contructor为方法名
            it('constructor without arguments', function() {    //对方法名进行覆盖测试
                var view = new View();                          //实例化
                expect(view.name).to.equal('base');             //输出断言
                expect(view.tagName).to.equal('div');           //输出断言
            });
        });
    });
});
```
mocha采用describe关键字进行用例描述，it编写用例代码。相当简洁和符合bdd风格。
看一下浏览器运行的结果：
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/mocha-01.jpg)

 **4. 无界面跑测试用例**
显然每次运行测试用例都要打开浏览器是不现实的，那怎么在项目构建的时候自动跑测试用例呢？由于目前项目是基于grunt打包。
所以可以利用grunt的mocha插件。在Gruntfile.js中加入下面代码：
```javascript
mocha: {
    test: {
        options: {
            timeout: 10000,
            run: false
        },
        src: ['webapp/tests/test.html']
    }
}
grunt.loadNpmTasks('grunt-mocha');
grunt.registerTask('unit', ['mocha']); 
```
在命令行执行 ``grunt unit``
看看输出什么内容：
![roadmap.path](https://raw.githubusercontent.com/fwon/blog/master/assets/mocha-02.jpg)
显示102个通过，1个等待中，8个失败。并且下面会列出执行失败测试用例的位置和原因，绿色表示期望值，红色表示实际值。
 **5. 后话**
到这里整个单元测试的基本流程就完成了，在开发测试用例的过程中，也发现了基类几个潜在的bug。
目前项目中主要完成了基类和工具类的测试用例，而组件类的需要在后续开发中补上。该工作将在组件整理后进行。
测试用例看起来都很简单，也就是一大堆断言。实际上它要求你本身对代码有比较深刻的理解，才能写出更细致更有价值的测试用例。
所以测试用例的编写往往也是很费时间的，对于代码开发者，编写测试用例则能够考虑到更多潜在的情况。
养成编写测试用例的好习惯，能让你的代码更健壮，能让更多人接受它并传播它。