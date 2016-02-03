import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Slider from '../components/Slider'
import TitleBtn from '../components/TitleBtn'

class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {slideState, dispatch} = this.props //通过connect将state注入到props
        return (
            <div>
                <Slider status={slideState}/>
                <section className={slideState ? 'slideOut' : ''}>
                    <TitleBtn status={slideState}/>
                    {this.props.children}
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