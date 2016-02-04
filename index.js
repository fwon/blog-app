require("./style/style.less")

import 'babel-core/polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router,Route,IndexRoute} from 'react-router'
import {syncHistory,routeReducer} from 'redux-simple-router'
import configureStore, {history, reduxRouterMiddleware} from './store/configureStore'
import App from './containers/App'
import Home from './containers/Home'
//import About from './containers/About'
// import Archives from './containers/Archives'
// import ArchivesHome from './containers/ArchivesHome'
// import ArchivePage from './containers/ArchivePage'

const store = configureStore()
reduxRouterMiddleware.listenForReplays(store)

const loadPageAsync = pageName => (location, cb) => {
    let bundle = require('bundle?lazy!./containers/' + pageName)
    bundle(component => {
        cb(null, component)
    })
}

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="about" getComponent={loadPageAsync('About')}/>
                <Route path="archives" getComponent={loadPageAsync('Archives')}>
                    <IndexRoute getComponent={loadPageAsync('ArchivesHome')}/>
                    <Route path=":name" getComponent={loadPageAsync('ArchivePage')}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
