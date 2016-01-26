export const CLICK_MENU = 'CLICK_MENU'

export function clickMenu(slideState) {
    return {
        type: CLICK_MENU,
        slideState
    }
}