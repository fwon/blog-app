import React, {Component, PropTypes} from 'react'
// import {Link} from 'react-router'
import { routeActions } from 'redux-simple-router'

export default class Slider extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        const {status, onLink} = this.props
        const classes = status ? 'slider slideOut' : 'slider'
        return (
            <div className={classes}>
                <ul>
                    <li onClick={() => onLink('/')}>Home</li>
                    <li onClick={() => onLink('/archives')}>Archives</li>
                    <li onClick={() => onLink('/about')}>About</li>
                </ul>
            </div>
        )
    }
}