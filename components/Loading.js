import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class Loading extends Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {article} = this.props
        return (
            <div className="c-loading" style={{display: article.isFetching ? 'block' : 'none'}}>
                <img src="./img/loading.gif"/>
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

export default connect(mapStateToProps)(Loading)