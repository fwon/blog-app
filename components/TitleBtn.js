import React, {Component, PropTypes} from 'react'
import {clickMenu} from '../actions'
import {connect} from 'react-redux'

class TitleBtn extends Component {
    constructor(props) {
        super(props)
        this.clickTitleBtn = this.clickTitleBtn.bind(this)
    }
    clickTitleBtn(status) {
        const {dispatch} = this.props
        dispatch(clickMenu(status))
    }
    render() {
        const {status} = this.props
        return (
            <i className="iconfont icon-menu" onClick={e => this.clickTitleBtn(!status)}></i>
        )
    }
}

export default connect()(TitleBtn)