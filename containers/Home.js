import React, {Component, PropTypes} from 'react'
import Avatar from '../components/Avatar'

class Home extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="home">
                <Avatar/>
                <div className="home">
                    <p style={{marginTop:'20px',textAlign:'center'}}>
                        power by redux
                    </p>
                    <p className="footer">copyright@fwon</p>
                </div>
            </div>
        )
    }
}

export default Home