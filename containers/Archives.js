import React, {Component, PropTypes} from 'react'

class Archives extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="archives">
                <h1>文章</h1>
                <ul>
                    <li><a href="https://github.com/fwon/blog/issues/17">gulp + webpack 构建多页面前端项目</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/16">Grunt vs Gulp</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/15">Javascript Scoping and Hoisting</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/14">javascript常见设计模式一览</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/10">怎么在模块化项目中使用Mocha</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/9">正则表达式用法总结</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/8">继承和原型链</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/7">CustomEvent-传统DOM事件</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/6">属性模块</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/5">MutationObserver用法浅析</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/2">一段代码理解Promise/Deferred模式</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/1">YAHOO网站加速最佳实践</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/12">Node.js之session实践</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/13">由秒杀活动想到的</a></li>
                    <li><a href="https://github.com/fwon/blog/issues/11">Cookie知多少</a></li>
                </ul>
            </div>
        )
    }
}

export default Archives