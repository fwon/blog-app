# gulp + webpack 构建多页面前端项目

- - -

之前在使用gulp和webpack对项目进行构建的时候遇到了一些问题，最终算是搭建了一套比较完整的解决方案，接下来这篇文章以一个实际项目为例子，讲解多页面项目中如何利用gulp和webpack进行工程化构建。本文是自己的实践经验，所以有些解决方案并不是最优的，仍在探索优化中。所以有什么错误疏漏请随时指出。

使用gulp过程中的一些问题，我已经在另外一篇文章讲到了 [grunt or gulp](https://github.com/fwon/blog/issues/16)

## 前言

现在为什么又整了一个webpack进来呢？

我们知道webpack近来都比较火，那他火的原因是什么，有什么特别屌的功能吗？带着这些疑问，继续看下去。

在使用gulp进行项目构建的时候，我们一开始的策略是将所有js打包为一个文件，所有css打包为一个文件。然后每个页面都将只加载一个js和一个css,也就是我们通常所说的 ==all in one== 打包模式。这样做的目的就是减少http请求。这个方案对于简单的前端项目来说的是一个万金油。因为通常页面依赖的js,css并不会太大，通过压缩和gzip等方法更加减小了文件的体积。在项目最开始的一段时间内（几个月甚至更长），一个前端团队都能通过这种办法达到以不变应万变的效果。

然而，作为一个有追求（爱折腾）的前端，难道就满足于此吗？

妈妈说我不仅要请求合并，还要按需加载，我要模块化开发，还要自动监听文件更新，支持图片自动合并....

等等！你真的需要这些功能吗？是项目真的遇到了性能问题？不然你整这些干嘛？

对于pc端应用来说，性能往往不是最突出的问题，因为pc端的网速，浏览器性能都有比较好，所以很长一段时间我们要考虑的是开发效率的问题而不是性能问题，得在前端框架的选型上下功夫。至于加载文件的大小或文件个数，都难以形成性能瓶颈。
 
对于wap端来说，限制于手机的慢网速（仍然有很多用不上4g，wifi的人），对网站的性能要求就比较苛刻了，这时候就不仅仅要考虑开发效率的问题了。（移动网络的性能问题可参考《web性能权威指南》）

> 在《高性能网站建设进阶指南》中也讲到：不要过早地考虑网站的性能问题。

这点我有不一样的看法。如果我们在项目搭建的时候就能考虑得多一点，把基本能做的先做了。所花的成本绝对比以后去重构代码的成本要低很多，而且我们能够同时保证开发效率和网站性能，何乐而不为呢。

## 问题
竟然要做，那要做到什么程度呢，往往“度”是最难把握的东西。

以前在做wap网站的时候，遇到的最大的问题按需加载和请求合并的权衡。
通过纯前端的方法不能同时满足请求合并和按需加载，这里面的原理和难点已经有大牛讲得很清楚了 [前端工程与模块化框架](https://github.com/fouber/blog/issues/4)

实现的方法归纳起来主要有以下步骤：
1. 通过工具分析出前端静态文件依赖表
2. 页面通过模块化工具加载入口文件，并将所依赖的所有文件合并为combo请求。
3. 后端返回combo文件，浏览器将模块缓存起来，跳页面的时候执行步骤2，只请求没有缓存过的文件。

如此通过依赖分析和后端combo实现了按需加载和请求合并。

这种实现方式的缺陷就是需要后端的支持，如果前端团队本身不是自己实现的后端路由层，需要后端同学加以配合，就需要更多沟通成本。

在没有后端支持的情况下，怎么比较好地实现按需加载和请求合并，我们用webpack做了尝试。


## webpack的使用
> webpack可以说是一个大而全的前端构建工具。它实现了模块化开发和静态文件处理两大问题。

以往我们要在项目中支持模块化开发，需要引入requirejs，seajs等模块加载框架。而webpack天生支持AMD，CommonJS, ES6 module等模块规范。不用思考加载器的选型，可以直接像写nodejs一样写模块。
而webpack这种万物皆模块的思想好像就是为React而生的，在React组件中可以直接引入css或图片，而做到这一切只需要一个require语句和loader的配置。

webpack的功能之多和繁杂的配置项会让初学者感到眼花缭乱，网上的很多资料也是只介绍功能不教人实用技巧。这里有一篇文章就讲解了[webpack开发的workflow](http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html), 虽然该教程是基于React的，但是比较完整地讲了webpack的开发流程。下面我也用一个实例讲解使用中遇到的问题和解决方案。

我们的项目是一个多页面项目，即每个页面为一个html，访问不同的页面需要跳转链接。
项目目录结构大概是这样的，app放html文件，css为样式文件，images存放图片，js下有不同的文件夹，里面的子文件夹为一些核心文件和一些库文件，ui组件。js的根目录为页面入口文件。
```
├── app
│   ├── header.inc
│   ├── help-charge.inc
│   ├── index.html
│   ├── news-detail.html
│   └── news-list.html
├── css
│   ├── icon.less
│   └── slider.css
├── images
└── js
    ├── core
    ├── lib
    ├── ui
    ├── news-detail.js
    ├── news-list.js
    └── main.js
```
该项目中我们只用webpack处理js文件的合并压缩。其他任务交给gulp。关于多页面项目和单页面项目中js处理的差异请看[这里](https://github.com/webpack/docs/wiki/optimization)。

##### 配置文件如下：
```javascript
module.exports = {
    devtool: "source-map",  //生成sourcemap,便于开发调试
    entry: getEntry(),      //获取项目入口js文件
    output: {
        path: path.join(__dirname, "dist/js/"), //文件输出目录
        publicPath: "dist/js/",     //用于配置文件发布路径，如CDN或本地服务器
        filename: "[name].js",      //根据入口文件输出的对应多个文件名
    },
    module: {
        //各种加载器，即让各种文件格式可用require引用
        loaders: [
            // { test: /\.css$/, loader: "style-loader!css-loader"},
            // { test: /\.less$/, loader: "style-loader!csss-loader!less-loader"}
        ]
    },
    resolve: {
        //配置别名，在项目中可缩减引用路径
        alias: {
            jquery: srcDir + "/js/lib/jquery.min.js",
            core: srcDir + "/js/core",
            ui: srcDir + "/js/ui"
        }
    },
    plugins: [
        //提供全局的变量，在模块中使用无需用require引入
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            // nie: "nie"
        }),
        //将公共代码抽离出来合并为一个文件
        new CommonsChunkPlugin('common.js'),
        //js文件的压缩
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
```
[配置项参考文档](https://github.com/webpack/docs/wiki/configuration#configuration-object-content)
##### 打包思路：
该配置方案的思路是每个页面一个入口文件，文件中可以通过require引入其他模块，而这些模块webpack会自动跟入口文件合并为一个文件。通过getEntry获取入口文件：
```javascript
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    return files;
}
```
该方法将生成文件名到文件绝对路径的map， 比如
```
entry：{
    news-detail: /../Document/project/.../news-detail.js
}
```
然后output就会在output.path路径下生成[name].js，即news-detail.js,文件名保持相同。

**module** 的作用是添加loaders, 那loaders有什么作用呢？
如果我们想要在js文件中通过require引入模块，比如css或image，那么就需要在这里配置加载器，这一点对于React来说相当方便，因为可以在组件中使用模块化CSS。而一般的项目中可以不用到这个加载器。

**resolve** 中的alias可以用于定义别名，用过seajs等模块工具的都知道alias的作用，比如我们在这里定义了ui这个别名，那么我们在模块中想引用ui目录下的文件，就可以直接这样写
```javascript
require('ui/dialog.js');
```
不用加上前面的更长的文件路径。

**plugin** 用于引入一些插件，常见的有 [这些](https://github.com/webpack/docs/wiki/list-of-plugins)
我们这里使用了CommonsChunkPlugin用于生成公用代码，不只可以生成一个，还能根据不同页面的文件关系，自由生成多个，例如：
```javascript
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        p1: "./page1",
        p2: "./page2",
        p3: "./page3",
        ap1: "./admin/page1",
        ap2: "./admin/page2"
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
        new CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
    ]
};
// 在不同页面用<script>标签引入如下js:
// page1.html: commons.js, p1.js
// page2.html: commons.js, p2.js
// page3.html: p3.js
// admin-page1.html: commons.js, admin-commons.js, ap1.js
// admin-page2.html: commons.js, admin-commons.js, ap2.js
```
这种用法有点像gulp或grunt中手动将多个js合并为common, 但是在webpack里，这个过程是全自动生成的，不用我们自己分析代码的依赖关系。
另外一个插件是uglifyJsPlugin，用于压缩js代码。

我们还用到一个字段是 **devtool**, 用于配置开发工具。‘source-map’就是在生成的代码中加入sourceMap的支持。能够直接定位到出错代码的具体位置，对sourcemap的使用和原理还不了解的可以看下[这篇文章](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)。
另外，devtool的配置参数使用在[这里](http://webpack.github.io/docs/configuration.html#devtool)。

##### 如何加载第三方库？
在pc开发中我们通常会用到jQuery库。如何很好地处理这类文件呢？这里有两种办法。

**方法一** 是在html中用script标签引入js文件，如
```javascript
<script src="https://code.jquery.com/jquery-git2.min.js"></script>
```
然后再配置文件中添加externals
```javascript
externals: { jquery: "jQuery" }
```
该字段的作用是将加jQuery全局变量变为模块可引入。然后在各个模块中，就可以如下使用：
```javascript
var $ = require("jquery");
```
然而我个人觉得既然已经将加jQuery通过script引入了，那么就直接使用$标签就行了。不必再将其转化为模块。

**方法二** 是将jQuery代码保存到本地，在配置文件中添加：
```javascript
resolve: { alias: { jquery: "/path/to/jquery-git2.min.js" } }
```
即为jquery添加了别名，然后在模块中也是这样使用：
```javascript
var $ = require("jquery");
```
还可以配合使用ProvidePlugin，其作用是提供全局变量给每个模块，这样就不需要在模块中通过require引入，例如：
使用前:
```javascript
var _ = require("underscore");
_.size(...);
```
使用后：
```javascript
plugins: [
  new webpack.ProvidePlugin({
    "_": "underscore"
  })
]

// If you use "_", underscore is automatically required
_.size(...)
```
**总的来说**，如果文件来自CDN，那么使用方法一，如果文件在本地，则用方法二。
##### 如何启动服务器？

首先肯定要安装webpack-dev-server，安装方法自行脑补。

接着在webpack.config.js中添加配置
```javascript
entry: [
    'webpack-dev-server/client?http://0.0.0.0:9090',//资源服务器地址
    'webpack/hot/only-dev-server',
    './static/js/entry.js'
]
```
output的发布路径改为本地服务器
```javascript
output: {
    publicPath: "http://127.0.0.1:9090/static/dist/",
    path: './static/dist/',
    filename: "bundle.js"
}
```
在plugin中添加
```javascript
new webpack.HotModuleReplacementPlugin()
```
html中通过资源服务器的绝对路径引入js
```javascript
<script src="http://127.0.0.1:9090/static/dist/bundle.js"></script>
```
最后通过命令行启动
```
$ webpack-dev-server --hot --inline
```
配置参数的解释在[这里](http://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli)。

由于webpack服务器配置比较繁琐，所以我们的项目还是采用gulp来启动本地服务器...

## gulp足够优秀
目前来说，我们只利用webpack进行了js方面的打包，其他功能用gulp就足够了。gulp主要做了下面几个工作：
- css转化合并压缩
- 图片的雪碧图合并和base64
- 文件md5计算与替换
- 热启动，浏览器自动刷新

下列是依赖的npm模块：
```
  "devDependencies": {
    "gulp": "^3.8.10",
    "gulp-clean": "0.3.1",
    "gulp-concat": "2.6.0",
    "gulp-connect": "2.2.0",
    "gulp-css-base64": "^1.3.2",
    "gulp-css-spriter": "^0.3.3",
    "gulp-cssmin": "0.1.7",
    "gulp-file-include": "0.13.7",
    "gulp-less": "3.0.3",
    "gulp-md5-plus": "0.1.8",
    "gulp-open": "1.0.0",
    "gulp-uglify": "1.4.2",
    "gulp-util": "~2.2.9",
    "gulp-watch": "4.1.0",
    "webpack": "~1.0.0-beta6"
  },
```
**支持雪碧图合并和base64**
我对gulp-css-spriter和gulp-css-base64的源码做了一点修改，使其支持下面的语法：
```css
.icon_corner_new{
    background-image: url(../images/new-ico.png?__sprite);
}
```
如果在url的后面加上__sprite后缀,则插件将会把该图片合并到雪碧图里。可以支持一个css文件合并为一个雪碧图，也可以整站合并。
```css
.icon_corner_new{
    background-image: url(../images/new-ico.png?__inline);
}
```
如果加上后缀__inline,则会将图片转化为base64,直接添加到css文件中，对于几k的小文件可以直接使用inline操作。具体配置代码如下：
```javascript
gulp.task('sprite', function (done) {
    var timestamp = +new Date();
    gulp.src('dist/css/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        // .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});
```
src为需要处理的css文件，spriteSheet为雪碧图生成的目标文件夹，pathToSpriteSheetFromCSS为css文件中url的替换字符串，spritesmithOptions是生成雪碧图的间隙。

**文件加md5, 实现发布更新**
发版本的时候为了避免浏览器读取了旧的缓存文件，需要为其添加md5戳。
这里采用了gulp-md5-plus
```javascript
gulp.task('md5:js', function (done) {
    gulp.src('dist/js/*.js')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});
```
该代码会将dist/js下面所有的js计算md5戳，并将dist/app/下的html中script中的src引用文件名替换为加了md5的文件名，再将md5文件替换到目标目录dist/js。css的md5操作跟js无异。

关于服务器启动和代码转换的功能点，这里就不展开讲了。

## 总结
该方案总结下来做了下面几件事：
1. 将css直接合并为一个文件，在head中通过link标签引入，提高网页渲染速度。
2. 将js打包为不同的入口文件，并自动合并依赖关系。将跨页面的公用代码抽离为独立文件，益于浏览器缓存。
3. 增加图片雪碧图，base64的支持，开发者可以手动配置\__sprite和\__inline，灵活性较高。
4. 静态文件md5打包，并自动更改html引用路径，方便发布。
5. 提供开发调试所需要的环境，包括热启动，浏览器自动刷新，sourceMap。

该方案之所以针对多页面应用，区别在于对js和css的处理方式。在单页面应用中，通过哈希跳转来实现静态文件的异步加载，打包策略又有所不同。但webpack中已经提供了处理异步加载的接口require.ensure，可以发挥无穷的力量。