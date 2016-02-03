一段代码理解Promise/Deferred模式
------------------------
Promise/Deferred模式包含两个部分，即Promise和Deferred,从语义上理解，Deferred为延迟对象，Deferred主要用于内部，用于维护异步模型的状态；Promise则作用于外部，通过then()方法暴露给外部以添加自定义逻辑。

Promises/A模型是这么定义的:

 - Promise操作只会处在这3种状态中的一种：未完成状态、完成状态和失败态。
 - Promise的状态只会出现从未完成态向完成态或失败态转化，不能逆反。完成态和失败态不能相互转化。
 - Promise的状态一旦转化，将不能被更改。

我们都曾饱受传统回调雪崩问题的困扰，下面以一段代码来诠释异步模型怎么解决这个问题的。
```javascript
var Deferred = function(){
    //声明promise为Deferred对象
    this.promise = new Promise();
};

//完成态
Deferred.prototype.resolve = function(obj) {
    var promise = this.promise;
    var handler;
    //遍历then链式中的回调
    while((handler = promise.queue.shift())) {
        //处理回调
        if(handler && handler.fulfilled(obj)) {
            var ret = handler.fulfilled(obj);
            //判断回调返回的结果是否为Promise对象，如果是，则跳出while循环,
            //等待该Promise的callback方法的执行，则会再次进入while循环
            if(ret && ret.isPromise) {
                ret.queue = promise.queue;
                //promise重新指向当前promise
                this.promise = ret;
                return;
            }
        }
    }
};

//失败态,原理如resolve
Deferred.prototype.reject = function(err) {
    var promise = this.promise;
    var handler;
    while((handler = promise.queue.shift())) {
        if(handler && handler.error) {
            var ret = handler.error(err);
            if(ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};

//生成回调函数
Deferred.prototype.callback = function() {
    var that = this;
    //then中的回调方法会自动执行，调用deferred的reject或resolve
    return function(err, file) {
        if(err) {
            return that.reject(err);
        }
        that.resolve(file);
    };
};

var Promise = function() {
    //队列用于存储待执行的回调函数
    this.queue = [];
    this.isPromise = true;
};

Promise.prototype.then = function(fulfilledHandler, errorHandler, progressHandler) {
    //handler对象存储成功回调和失败回调
    var handler = {};
    if(typeof fulfilledHandler === 'function') {
        handler.fulfilled = fulfilledHandler;
    }
    if(typeof errorHandler === 'function') {
        handler.error = errorHandler;
    }
    //放入队列
    this.queue.push(handler);
    return this;
};

var readFile1 = function(file, encoding) {
    var deferred = new Deferred();
    fs.readFile(file, encoding, deferred.callback());
    return deferred.promise;
};
var readFile2 = function(file, encoding) {
    var deferred = new Deferred();
    fs.readFile(file, encoding, deferred.callback());
    return deferred.promise;
};

//一开始queue中就完成了所有then回调的push操作，接着第一个readFile1执行
//fs.readFile(file, encoding,deferred.callback());
//完成时，deferred.callback()会被调用。加入操作成功，会调用到deferred的resolve方法，
//开始操作queue中的回调，var ret = handler.fulfilled(obj);
//则执行了return readFile2(file1.trim(),'utf8');该方法返回一个Promise对象，
//此时resolve方法跳出while循环，第二个then任为执行，
//等待readFile2完成操作，再次调用deferred.callback()，再次进入resolve的while循环，
//此时执行console.log(file2);返回非Promise对象，queue也同时结束遍历。*/

readFile1('file1.txt', 'utf8').then(function(file1) {
    return readFile2(file1.trim(), 'utf8');
}).then(function(file2){
    console.log(file2);
});
```