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
import About from './containers/About'
import Archives from './containers/Archives'

const store = configureStore()
reduxRouterMiddleware.listenForReplays(store)

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="about" component={About}/>
                <Route path="archives" component={Archives}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)