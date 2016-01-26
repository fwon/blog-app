import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Slider from '../components/Slider'
import {clickMenu} from '../actions'
import { routeActions } from 'redux-simple-router'

class App extends Component {
    constructor(props) {
        super(props)
        this.slideToright = this.slideToright.bind(this)
    }
    slideToright(status) {
        const {dispatch} = this.props
        dispatch(clickMenu(status))
    }
    clickLink(url) {
        const {dispatch} = this.props
        dispatch(routeActions.push(url))
        dispatch(clickMenu(false)) // 关闭滑动
    }
    componentDidMount() {
        // Event.on('Section:toggle', this.slideToright)
    }
    render() {
        const {slideState, dispatch} = this.props //通过connect将state注入到props
        // console.log(SectionDOM());
        return (
            <div>
                <Slider status={slideState} onLink={(url)=>this.clickLink(url)}/>
                <section className={slideState ? 'slideOut' : ''}>
                    <i className="iconfont icon-menu" onClick={e => this.slideToright(!slideState)}></i>
                    <div className="content">
                       {this.props.children}
                    </div>
                </section>
                
            </div>
        )
    }
}

App.propTypes = {
    slideState: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    const {slideState} = state
    return {
        slideState
    }
}

export default connect(mapStateToProps)(App)