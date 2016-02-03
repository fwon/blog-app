import React, {Component, PropTypes} from 'react'
import {clickTitleBtn} from '../actions'
import {connect} from 'react-redux'

class TitleBtn extends Component {
    constructor(props) {
        super(props)
        this.onSlider = this.onSlider.bind(this)
        this.onBack = this.onBack.bind(this)
        this.pageRecord = 0 //跳转页面记录
    }
    onSlider() {
        const {dispatch, slideState} = this.props
        dispatch(clickTitleBtn(!slideState))
    }
    onBack() {
        const {dispatch, slideState} = this.props
        history.back()
        if (0 === this.pageRecord--) {
            dispatch(clickTitleBtn(slideState, false))
        }
    }
    onClickController() {
        const {isBack} = this.props
        if (isBack) {
            this.onBack()
        } else {
            this.onSlider()    
        }
    }
    render() {
        const {isBack} = this.props
        const iconClassName = isBack ? 'icon-back' : 'icon-menu'
        const className = "c-title-btn iconfont " +  iconClassName
        if (isBack) this.pageRecord++
        return (
            <i className={className} onClick={e => this.onClickController()}></i>
        )
    }
}

function mapStateToProps(state) {
    const {titleBtnStatus} = state
    return {
        slideState: titleBtnStatus.slideState,
        isBack: titleBtnStatus.isBack
    }
}

export default connect(mapStateToProps)(TitleBtn)