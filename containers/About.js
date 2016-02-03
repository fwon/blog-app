import React, {Component, PropTypes} from 'react'
import TitleBar from '../components/TitleBar'

class About extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="aboutme">
                <TitleBar title="关于我"/>
                <div className="detail">
                    <p>我叫王丰，在互联网上使用过的 ID 包括 wonderfun，fwon 等。我白天主要是在公司写代码，晚上回家喜欢看剧看书。</p>
                    <p>1990 年出生，2013 年大学毕业。从毕业到现在一直在做 Web 前端开发，主要对JavaScript比较熟悉，工作包括页面重构也包括js架构。后端语言对php, python都有所接触，曾经也玩过Android开发。</p>
                    <p>你可以在这些地方找到我：<br/>
                    <a href="https://github.com/fwon">Github</a><br/>
                    <a href="http://stackoverflow.com/users/1856785/frankjs">Stackoverflow</a><br/>
                    <a href="http://segmentfault.com/u/fwon">Segmentfault</a><br/>
                    <a href="http://weibo.com/enjoyli">weibo</a><br/>
                    或者给我发邮件：<br/>
                    wangfengmmd@163.com</p>
                </div>
            </div>
        )
    }
}

export default About