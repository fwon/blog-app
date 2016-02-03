import {combineReducers} from 'redux'
import {routeReducer, UPDATE_LOCATION} from 'redux-simple-router'
import {
    CLICK_MENU,
    RECEIVE_ARTICLE,
    REQUEST_ARTICLE
} from '../actions'

function slideState(state=false, action) {
    switch(action.type) {
        case CLICK_MENU:
            return action.slideState
        default:
            return state
    }
}

function article(state={
    isFetching: true
}, action) {
    switch(action.type) {
        case REQUEST_ARTICLE:
            return Object.assign({}, state, {
                isFetching: true,
                content: ''
            })
        case RECEIVE_ARTICLE:
            return Object.assign({}, state, {
                isFetching: false,
                content: action.articleContent
            })
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

// export default function todoApp(state, action) {
//   return {
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//     todos: todos(state.todos, action)
//   };
// }

const rootReducer = combineReducers({
    slideState,
    update,
    article,
    routing: routeReducer
})

export default rootReducer