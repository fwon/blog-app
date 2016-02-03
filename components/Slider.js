import React, {Component, PropTypes} from 'react'
import {clickMenu} from '../actions'
import { routeActions } from 'redux-simple-router'
import {connect} from 'react-redux'

class Slider extends Component {
    constructor(props) {
        super(props)
        this.clickLink = this.clickLink.bind(this)
    }
    clickLink(url) {
        const {dispatch} = this.props
        dispatch(routeActions.push(url))
        dispatch(clickMenu(false)) // 关闭滑动
    }
    render() {
        const {status} = this.props
        const classes = status ? 'slider slideOut' : 'slider'
        return (
            <div className={classes}>
                <ul>
                    <li onClick={() => this.clickLink('/')}>Home</li>
                    <li onClick={() => this.clickLink('/archives')}>Archives</li>
                    <li onClick={() => this.clickLink('/about')}>About</li>
                </ul>
            </div>
        )
    }
}

export default connect()(Slider)