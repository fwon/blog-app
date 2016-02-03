import React, {Component, PropTypes} from 'react'

export default class TitleBar extends Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {title} = this.props
        return (
            <h1 className="c-page-title">{title}</h1>
        )
    }
}