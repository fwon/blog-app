import {combineReducers} from 'redux'
import {routeReducer, UPDATE_LOCATION} from 'redux-simple-router'
import {
    CLICK_MENU
} from '../actions'

function slideState(state=false, action) {
    switch(action.type) {
        case CLICK_MENU:
            return action.slideState
        default:
            return state
    }
}

function update(state="update", action) {
    switch(action.type) {
        case UPDATE_LOCATION:
            return 'update'
        default:
            return state
    }
}

const rootReducer = combineReducers({
    slideState,
    update,
    routing: routeReducer
})

export default rootReducer