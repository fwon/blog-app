import fetch from 'isomorphic-fetch'
import marked from 'marked'
import highlight from 'highlight.js'
export const CLICK_MENU = 'CLICK_MENU'
export const RECEIVE_ARTICLE = 'RECEIVE_ARTICLE'
export const REQUEST_ARTICEL = 'REQUEST_ARTICEL'

marked.setOptions({
    highlight: code => highlight.highlightAuto(code).value
})

export function clickMenu(slideState) {
    return {
        type: CLICK_MENU,
        slideState
    }
}

export function requestArticle(articleName) {
    return {
        type: REQUEST_ARTICEL,
        articleName
    }
}

export function receiveArticle(articleContent) {
    return {
        type: RECEIVE_ARTICLE,
        articleContent: marked(articleContent)
    }
}

export function fetchArticle(articleName) {
    return dispatch => {
        dispatch(requestArticle(articleName))
        return fetch(`https://raw.githubusercontent.com/fwon/fwon.github.io/master/app/articles/${articleName}.md`)
            .then(response => response.text())
            .then(content => dispatch(receiveArticle(content)))
    }
}