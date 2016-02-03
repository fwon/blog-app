# 继承和原型链

------

javascript中的每个对象都有一个内部私有的链接指向另一个对象 ,这个对象就是原对象的原型. 这个原型对象也有自己的原型, 直到对象的原型为null为止（也就是没有原型）最上一层为Object. 这种一级一级的链结构就称为原型链.

我们最常见的实现原型继承的方式如下：
```javascript
function Animal() {
    this.name = 'Animal';
}

Animal.prototype.sleep = function() {
    console.log('i can sleep');
}

function Dog(name) {
    this.name = name;
}

Dog.prototype = new Animal(); //原型链指向Animal.prototype
Dog.prototype.constructor = Dog; //将constructor指向自己
var dog = new Dog('wangwang');
dog.name; //wangwang
dog.sleep(); //i can sleep

```
有些人不理解这句话的意义：

    Dog.prototype.constructor = Dog;
Dog将构造函数指向了自己，这是因为在执行了上面一句之后，会有：

    Dog.prototype.constructor == Animal; //true
    Dog.prototype.constructor == Dog; //false
这显然是不符合逻辑的，那么是否意味这这是一种hack的继承方式，有木有更好更自然的继承方法呢？别着急，慢慢来。
我开始好奇new Animal()的时候js内部做了什么操作，既然Dog.prototype继承了Animal.prototype中的方法，那么我们来做个尝试，修改代码：
```javascript
function Animal() {
    this.name = 'Animal';
}

Animal.prototype.sleep = function() {
    console.log('i can sleep');
}

function Dog(name) {
    this.name = name;
}

Dog.prototype = Animal.prototype; //将原型Animal.prototype直接赋值给Dog
Dog.prototype.constructor = Dog; //将constructor指向自己
var dog = new Dog('wangwang');
dog.name; //wangwang
dog.sleep(); //i can sleep

```
输出正常，好，我们再给狗多加一个技能：
```javascript
Dog.prototype.eatShit() {
    console.log('i can eat shit');
}
dog.eatShit(); //i can eat shit
Animal.prototype.eatShit(); //i can eat shit 
```
但是我们发现Animal的原型中也多了eatShit这个技能，其他动物如果也继承了Animal,那么他也会eatShit了,这明显不太科学。

这个问题是怎么导致的呢？
由于我们将原型直接赋值，所以Animal和Dog共用了同一个原型，你可以理解为指向同一个内存地址，那么只要其中一个更改了,就会影响到另外一个的值。

那神秘的new Animal()到底悄悄地做了什么呢？
```javascript
var animal = new Animal();
animal.__proto__ === Animal.prototype; //true
```
1.创建一个通用对象 var o = new Object();
2.将o作为关键字this的值传递给Animal的构造函数，var returnObject = Animal.constructor(o, arguments); this = o; 这个过程中构造函数显式地设置了name的值为“Animal”(执行Animal(),返回给o),隐式地将其内部的\__proto__属性设置为Animal.prototype的值。即o.\__proto__ = Animal.protorype;
3.返回新创建的对象returnObject并将animal的值指向该对象。

这个过程中，\__proto__提供了一个钩子，当请求prototype上的属性someProp时，JavaScript首先检查对象自身中是否存在属性的值，如果有，则返回该值。如果不存在，则检查Object.getPrototypeOf(o).someProp是否存在，如果仍然不存在，就继续检查Object.getPrototypeOf(Object.getPrototypeOf(0)).someProp,依次类推。

所以存在这样的关系：animal.\__proto__ = Animal.prototype;
有没有发现，我们实现继承的最简单方法就可以简化为：
```javascript
Dog.prototype.__proto__ = Animal.prototype;
```
ok,能理解么？既然new是将父类的prototype赋值给子类的\__proto__,那么我们只要对\__proto__赋值就能够继承原型链了。
but,遗憾的是这种方法并不能够继承到父类的私有属性。
```javascript
var animal = {};
animal.__proto__ = Animal.prototype;
animal.name; //undefined
```
并且这只适用于可扩展对象，一个不可扩展对象的\__proto\__属性是不可变的。
```javascript
var obj = {};
Object.preventExtensions(obj);
obj.__proto__ = {}; //抛出异常TypeError
```
ECMAScript5中引入一个新方法：Object.create.可以调用这个方法来创建新对象，新对象的原型就是调用create方法时传入的第一个参数：

    Object.create(proto [, propertiesObject ])
proto： 一个对象，作为新创建对象的原型。
propertiesObject: 一个对象值，可以包含若干个属性。
对于第一个参数的实现原理如下：
```javascript
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}
```
其本质也是在内部定义了一个中间量F,并进行原型的赋值和new操作,实现原型的继承。
下面这个例子采用Object.create()完整实现继承：
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype = {
    name: null,
    doSomething: function() {
        //...
    }
}

function Dog(name, age) {
    Animal.call(this, name); //私有属性继承
    this.age = age;
}

Dog.prototype = Object.create(Animal.prototype, {
    age: {
        value: null,
        enumerable: true,
        configurable: true,
        writable: true
    },
    doSomething: {
        value: function() {
            Animal.prototype.doSomething.apply(this, arguments); //call super
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});

var dog = new Dog();
dog.doSomething();
```

性能

在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。另外，试图访问不存在的属性时会遍历整个原型链。

遍历对象的属性时，原型链上的每个属性都是可枚举的。

检测对象的属性是定义在自身上还是在原型链上，有必要使用hasOwnProperty方法，该方法由所有对象继承自Object.proptotype。

hasOwnProperty是JavaScript中**唯一一个只涉及对象自身属性而不会遍历原型链的方法。**