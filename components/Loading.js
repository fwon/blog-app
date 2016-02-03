import React, {Component, PropTypes} from 'react'

export default class loading extends Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {isFetching} = this.props
        const show = isFetching ? 'block' : 'none'
        return (
            <div className="c-loading" style={{display: show}}>
                <img src="../img/loading.gif"/>
            </div>
        )
    }
}