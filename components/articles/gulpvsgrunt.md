# grunt vs gulp
虽然gulp已经出来很久了，但是一直没有去使用过。得益于最近项目需要，就尝试了一下，以下从几个要点讲一下grunt和gulp使用的区别，侧重讲一下在使用gulp过程中发现的问题。而两种工具孰优孰劣由读者自己判断。
## 1. 书写方式
**grunt** 运用配置的思想来写打包脚本，一切皆配置，所以会出现比较多的配置项，诸如option,src,dest等等。而且不同的插件可能会有自己扩展字段，导致认知成本的提高，运用的时候要搞懂各种插件的配置规则。
**gulp** 是用代码方式来写打包脚本，并且代码采用流式的写法，只抽象出了gulp.src, gulp.pipe, gulp.dest, gulp.watch 接口,运用相当简单。经尝试，使用gulp的代码量能比grunt少一半左右。
- - -
## 2. 任务划分
**grunt** 中每个任务对应一个最外层配置的key, 大任务可以包含小任务，以一种树形结构存在。举个栗子：
```javascript
uglify: {
    one: {
        src: 'src/a.js',
        dest: 'dest/a.min.js'
    },
    two: {
        src: 'tmp/b.js',
        dest: 'dist/b.min.js'
    }
}
```
将uglify划分子任务的好处是，我们在封装不同的task时可以分别对'uglify:one'或'uglify:two'进行调用，这对于某些需要在不同时间点调用到uglify的task相当有用。

**gulp** 中没有子任务的概念，对于上面的需求，只能通过注册两个task来完成
```javascript
gulp.task('uglify:one', function(){
    gulp.src('src/a.js')
        .pipe(uglify())
        .dest('dest/a.min.js')
});
gulp.task('uglify:two', function(){
    gulp.src('tmp/b.js')
        .pipe(uglify())
        .dest('dist/b.min.js')
});
```
当然这种需求往往可以通过调整打包策略来优化，并不需要分解子task，特殊情况下可以用这种方法解决。

## 3. 运行效率
**grunt** 采用串行的方式执行任务，比如我们注册了这样一个任务：
`grunt.register('default', ['concat', 'uglify', 'release'])`
grunt是按书写的顺序首先执行cancat，然后是uglify，最后才是release，一派和谐的气氛，谁也不招惹谁。而我们知道某些操作时可以同步执行的，比如cssmin和uglifyjs。这时grunt无法通过简单地更改配置来达到并行执行的效果，通常的做法是手动写异步task，举个栗子：
```javascript
grunt.registerTask('cssmin', 'async cssmin task', function() {
  var done = this.async();
  cssmin(done);
});
```
在cssmin操作完成后传入done方法告知程序，但这需要插件支持。

**gulp** 基于并行执行任务的思想，通过一个pipe方法，以数据流的方式处理打包任务，我们来看这段代码：
```javascript
gulp.task('jsmin', function () {
    gulp.src(['build/js/**/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(uglify()
        .pipe(gulp.dest('dist/js/'));
});
```
程序首先将`build/js`下的js文件压缩为`app.min.js`, 再进行uglify操作，最后放置于dist/js下。这一系列工作就在一个task中完成，中间没有产生任何临时文件。如果用grunt，我们需要怎样写这个任务？那必须是有两个task配置，一个concat，一个uglify，中间还必须产生一个临时文件。从这个角度来说，gulp快在中间文件的产生只生成于内存，不会产生多余的io操作。
再来看看前面的问题，如何并行执行uglify和cssmin？其实gulp本身就是并发执行的，我们并不需要多什么多余多工作，只需
```
gulp.task('default', ['uglify', 'cssmin']);
```
gulp该怎么快就怎么来，并不会等到uglify再执行cssmin。
是不是觉得gulp秒杀grunt几条街了呢？且慢，坑还在后面...
首先我们需要问一个问题，为什么要用并发？
为了快？那什么时候可以快，什么时候又不能快？
假设我们有这样一个任务：
```javascript
gulp.task('jsmin', ['clean', 'concat']);
```
需要先将文件夹清空，再进行合并压缩，根据gulp的并发执行的方式，两个任务会同时执行，虽然从指令上看是先执行了clean再执行concat，然而clean还没结束，concat就执行了，导致代码合并了一些未被清理的文件，这显然不是我们想要的结果。
**那这个问题有没有什么解决方案呢？**
gulp官方API给出了这样的方法：
- 给出一个提示，来告知 task 什么时候执行完毕
- 并且再给出一个提示，来告知一个 task 依赖另一个 task 的完成

官方举了这个例子：
让我们先假定你有两个 task，"one" 和 "two"，并且你希望它们按照这个顺序执行：
1. 在 "one" 中，你加入一个提示，来告知什么时候它会完成：可以再完成时候返回一个 callback，或者返回一个 promise 或 stream，这样系统会去等待它完成。
2. 在 "two" 中，你需要添加一个提示来告诉系统它需要依赖第一个 task 完成。

因此，这个例子的实际代码将会是这样：
```javascript
var gulp = require('gulp');

// 返回一个 callback，因此系统可以知道它什么时候完成
gulp.task('one', function(cb) {
    // 做一些事 -- 异步的或者其他的
    cb(err); // 如果 err 不是 null 或 undefined，则会停止执行，且注意，这样代表执行失败了
});

// 定义一个所依赖的 task 必须在这个 task 执行之前完成
gulp.task('two', ['one'], function() {
    // 'one' 完成后
});

gulp.task('default', ['one', 'two']);
```
task one执行完毕后需要调用cb方法来告知task two我已经执行完成了，你可以干你的事了。
那在我们实际运用中，通常是这样的：
```javascript
gulp.task('clean', function (cb) {
    gulp.src(['tmp'])
        .pipe(clean())；
});
```
这个时候clean结束的cb要写在哪呢？是这样吗？
```javascript
gulp.task('clean', function (cb) {
    gulp.src(['tmp'])
        .pipe(clean())；
    cb();
});
```
对于理解什么叫异步的人来说这种方法肯定是不行的，clean还没完成，cb已经执行了。好在！！！
好在我们可以利用gulp中的时间监听来做结束判断：
```javascript
gulp.task('clean', function (cb) {
    gulp.src(['tmp'])
        .pipe(clean()),
        .on('end', cb);
});
gulp.task('concat', [clean], function(){
    gulp.src('blabla')
        .pipe('blabla')
        .dest('blabla');
});
```
由于gulp是用node实现的，所以必然绑定了数据流的监听事件，我们通过监听[stream event end](https://nodejs.org/api/stream.html#stream_event_end)来达到这个目的。
而不得不吐槽的是通过在task后面写［］依赖的方式也并不优雅，通常可以通过其他插件来达到顺序执行的效果，写法如同grunt，但是每个task的end事件的监听也是少不了的。
如果你的任务不多的时候，直接在回调后面执行concat也是可以的：
```javascript
gulp.task('clean', function(){})
gulp.task('concat', function(){})
gulp.task('clean-concat', ['clean'], function(){
    gulp.start('concat');
})
```
## 4. 其他要交代的
1. gulp真的只有src, pipe, dest, watch, run这几个API吗？
不，由于gulp继承了[Orchestrator](https://github.com/orchestrator/orchestrator/blob/f3fcb93e3560afd0bc0c4acd5c5db7bd109414e7/index.js)（<4.0），所以具备了另外一些API，包括start等。当然这些API是官方不推荐使用的。会导致代码的复杂度提升，所以并没有出现在官方文档中。
2. 不建议将多个操作写在同个task中，这样程序并不知道任务及时结束，如：
```javascript
gulp.task('test', function(cb) {

  gulp.src('bootstrap/js/*.js')
    .pipe(gulp.dest('public/bootstrap'))
    .on('end', cb);

  gulp.src('jquery.cookie/jquery.cookie.js')
    .pipe(gulp.dest('public/jquery'))
    .on('end', cb);
});
```
3. 尽量减少task的数量，很多任务其实可以在一个task中用多个pipe来执行，只需要我们在打包等时候规划好文件夹及任务流。

**对了，gulp4.0会带给我们很多惊喜（wtf!），虽然它还是迟迟未发布... 暂时不想去踩坑。读者可自行Google。**

参考链接：
https://github.com/gulpjs/gulp/issues/755
https://github.com/gulpjs/gulp/issues/82
https://github.com/orchestrator/orchestrator/issues/10