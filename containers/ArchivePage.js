require ('../style/markdown.css')
require ('../style/railscasts.css')
import {fetchArticleIfNeeded, clickTitleBtn} from '../actions'
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
        let articleName = this.pageName
        const {dispatch} = this.props
        dispatch(fetchArticleIfNeeded(articleName))
    }
    componentDidMount() {
        const {dispatch} = this.props
        dispatch(clickTitleBtn(false, true))
    }
    render() {
        const {article} = this.props
        return (
            <div>
                <Loading/>
                <div className="markdown-body" dangerouslySetInnerHTML={{__html: article[this.pageName]}}>
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