import {combineReducers} from 'redux'
import {routeReducer, UPDATE_LOCATION} from 'redux-simple-router'
import {
    CLICK_TITLEBTN,
    RECEIVE_ARTICLE,
    REQUEST_ARTICLE
} from '../actions'

function titleBtnStatus(state={
    slideState: false,
    isBack: false
}, action) {
    switch(action.type) {
        case CLICK_TITLEBTN:
            return Object.assign({}, state, {
                slideState: action.slideState,
                isBack: action.isBack
            })
        default:
            return state
    }
}

function article(state={
    isFetching: false
}, action) {
    switch(action.type) {
        case REQUEST_ARTICLE:
            return Object.assign({}, state, {
                isFetching: true,
                [action.articleName]: ''
            })
        case RECEIVE_ARTICLE:
            return Object.assign({}, state, {
                isFetching: false,
                [action.articleName]: action.articleContent
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
    titleBtnStatus,
    update,
    article,
    routing: routeReducer
})

export default rootReducer