import React, {Component, PropTypes} from 'react'
import Header from '../components/Header'

class Home extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Header/>
                <div className="home">
                    <p style={{marginTop:'20px'}}>
                        power by redux
                    </p>
                    <p className="footer">copyright@fwon</p>
                </div>
            </div>
        )
    }
}

export default Home