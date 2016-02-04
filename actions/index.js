import fetch from 'isomorphic-fetch'
import marked from 'marked'
import highlight from 'highlight.js'
export const CLICK_TITLEBTN = 'CLICK_TITLEBTN'
export const RECEIVE_ARTICLE = 'RECEIVE_ARTICLE'
export const REQUEST_ARTICLE = 'REQUEST_ARTICLE'

marked.setOptions({
    highlight: code => highlight.highlightAuto(code).value
})

export function clickTitleBtn(slideState, isBack) {
    return {
        type: CLICK_TITLEBTN,
        slideState,
        isBack
    }
}

export function requestArticle(articleName) {
    return {
        type: REQUEST_ARTICLE,
        articleName
    }
}

export function receiveArticle(articleName, articleContent) {
    return {
        type: RECEIVE_ARTICLE,
        articleName,
        articleContent: marked(articleContent)
    }
}

function fetchArticle(articleName) {
    return dispatch => {
        dispatch(requestArticle(articleName))
        return fetch(`https://raw.githubusercontent.com/fwon/fwon.github.io/master/app/articles/${articleName}.md`)
            .then(response => response.text())
            .then(content => dispatch(receiveArticle(articleName, content)))
    }
}

function shouldFetchArticle(state, articleName) {
    const article = state.article
    if (!article || !article[articleName]) {
        console.log(true);
        return true
    }
    return false
}

export function fetchArticleIfNeeded(articleName) {
    return (dispatch, getState) => {
        if (shouldFetchArticle(getState(), articleName)) {
            return dispatch(fetchArticle(articleName))
        }
    }
}