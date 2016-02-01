require ('../style/markdown.css')
require ('../style/railscasts.css')
import React, {Component, PropTypes} from 'react'


export default class ArchivePage extends Component {
    constructor(props) {
        super(props)
        this.pageName = this.props.params.name
        this.pageContent = ''
    }
    componentWillMount() {
        let articleName = './articles/' + this.pageName + '.md'
        console.log(articleName);
        this.pageContent = require(articleName)
    }
    componentDidMount() {
        console.log('did ' + this.pageName);
    }
    render() {
        return (
            <div className="markdown-body" dangerouslySetInnerHTML={{__html: this.pageContent}}/>
        )
    }
}
