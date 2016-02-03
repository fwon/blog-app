引子
======
首先大家看一下下面的代码，猜猜会输出什么结果？
```javascript
var foo = 1;
function bar() {
    if (!foo) {
        var foo = 10;
    }
    alert(foo);
}
bar();
```
答案是10!
你是否会疑惑条件语句`if(!foo)`并不会执行，为什么`foo`会被赋值为10

再来看第二个例子
```javascript
var a = 1;
function b() {
    a = 10;
    return;
    function a() {}
}
b();
alert(a);
```
答案还是10吗？显然不是，`alert`输出了1

如果你仍然对上面两个输出结果摸不着头脑，那么请认真阅读这篇文章

Scoping in Javascript
======
Javascript的作用域已经是老生常谈的问题了，但是不一定每个人都能准确理解。
我们先来看一下C语言的一个例子：
```cpp
#include <stdio.h>
int main() {
    int x = 1;
    printf("%d, ", x); // 1
    if (1) {
        int x = 2;
        printf("%d, ", x); // 2
    }
    printf("%d\n", x); // 1
}
```
程序依次输出了1，2，1
为什么第三个输出了1而不是2呢？因为在C语言中，我们有块级作用域（block-level scope）。在一个代码块的中变量并不会覆盖掉代码块外面的变量。我们不妨试一下Javascript中的表现
```javascript
var x = 1;
console.log(x); // 1
if (true) {
    var x = 2;
    console.log(x); // 2
}
console.log(x); // 2
```
输出的结果为1，2，2 `if`代码块中的变量覆盖了全局变量。那是因为JavaScript是一种函数级作用域（function-level scope）所以if中并没有独立维护一个scope,变量`x`影响到了全局变量`x`

C,C++,C#和Java都是块级作用域语言，那么在Javascript中，我们怎么实现一种类似块级作用域的效果呢？答案是闭包
```javascript
function foo() {
    var x = 1;
    if (x) {
        (function () {
            var x = 2;
            // some other code
        }());
    }
    // x is still 1.
}
```
上面代码在if条件块中创建了一个闭包，它是一个立即执行函数，所以相当于我们又创建了一个函数作用域，所以内部的`x`并不会对外部产生影响。

Hoisting in Javascript
======
在Javascript中，变量进入一个作用域可以通过下面四种方式：
1. 语言自定义变量：所有的作用域中都存在this和arguments这两个默认变量
2. 函数形参：函数的形参存在函数作用域中
3. 函数声明：`function foo() {}`
4. 变量定义：`var foo`

其中，___在代码运行前，函数声明和变量定义通常会被解释器移动到其所在作用域的最顶部___，如何理解这句话呢？
```javascript
function foo() {
    bar();
    var x = 1;
}
```
上面这段在吗，被代码解释器编译完后，将变成下面的形式：
```javascript
function foo() {
    var x;
    bar();
    x = 1;
}
```
我们注意到，`x`变量的定义被移动到函数的最顶部。然后在`bar()`后，再对其进行赋值。
再来看一个例子，下面两段代码其实是等价的：
```javascript
function foo() {
    if (false) {
        var x = 1;
    }
    return;
    var y = 1;
}
```
```javascript
function foo() {
    var x, y;
    if (false) {
        x = 1;
    }
    return;
    y = 1;
}
```
所以变量的上升（Hoisting）只是其定义上升，而变量的赋值并不会上升。

我们都知道，创建一个函数的方法有两种，一种是通过函数声明`function foo(){}`
另一种是通过定义一个变量`var foo = function(){} `那这两种在代码执行上有什么区别呢？

来看下面的例子：
```javascript
function test() {
    foo(); // TypeError "foo is not a function"
    bar(); // "this will run!"
    var foo = function () { // function expression assigned to local variable 'foo'
        alert("this won't run!");
    }
    function bar() { // function declaration, given the name 'bar'
        alert("this will run!");
    }
}
test();
```
在这个例子中，`foo()`调用的时候报错了，而bar能够正常调用
我们前面说过变量会上升，所以`var foo`首先会上升到函数体顶部，然而此时的`foo`为`undefined`,所以执行报错。而对于函数`bar`, 函数本身也是一种变量，所以也存在变量上升的现象，但是它是上升了整个函数，所以`bar()`才能够顺利执行。

再回到一开始我们提出的两个例子，能理解其输出原理了吗？
```javascript
var foo = 1;
function bar() {
    if (!foo) {
        var foo = 10;
    }
    alert(foo);
}
bar();
```
其实就是：
```javascript
var foo = 1;
function bar() {
    var foo;
    if (!foo) {
        foo = 10;
    }
    alert(foo);
}
bar();
```

```javascript
var a = 1;
function b() {
    a = 10;
    return;
    function a() {}
}
b();
alert(a);
```
其实就是：
```javascript
var a = 1;
function b() {
    function a() {}
    a = 10;
    return;
}
b();
alert(a);
```

这就是为什么，我们写代码的时候，变量定义总要写在最前面。

ES6有何区别
======
在ES6中，存在`let`关键字，它声明的变量同样存在块级作用域。
而且函数本身的作用域，只存在其所在的块级作用域之内，例如：
```javascript
function f() { console.log('I am outside!'); }
if(true) {
   // 重复声明一次函数f
   function f() { console.log('I am inside!'); }
}
f();
```
上面这段代码在ES5中的输出结果为`I am inside!`因为f被条件语句中的f上升覆盖了。
在ES6中的输出是`I am outside!`块级中定义的函数不会影响外部。

如果对let的使用，或ES6的其他新特性感兴趣，请自行阅读ES6文档。