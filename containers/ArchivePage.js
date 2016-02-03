require ('../style/markdown.css')
require ('../style/railscasts.css')
import {fetchArticle} from '../actions'
import {connect} from 'react-redux'
import Loading from '../components/Loading'
import React, {Component, PropTypes} from 'react'


class ArchivePage extends Component {
    constructor(props) {
        super(props)
        this.pageName = this.props.params.name
        this.pageContent = ''
    }
    componentWillMount() {
        // To move to reducers as async loader
        let articleName = this.pageName
        // console.log(articleName);
        // this.pageContent = require(articleName)

        const {dispatch} = this.props
        dispatch(fetchArticle(articleName))
    }
    componentDidMount() {
        console.log('didaa ' + this.pageName);
    }
    render() {
        const {article} = this.props
        return (
            <div>
                <Loading status={article.isFetching}/>
                <div className="markdown-body" dangerouslySetInnerHTML={{__html: article.content}}>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {article} = state
    return {
        article
    }
}

export default connect(mapStateToProps)(ArchivePage)