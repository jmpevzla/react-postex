import Swal from "sweetalert2"

const TOKEN = 'postex-token'
const USERID = 'postex-user-id'
const THEME = 'theme'

export function setStUser(token: string, userId: number) {
  try {
    window.localStorage.setItem(TOKEN, token)
    window.localStorage.setItem(USERID, String(userId))
  } catch(err) {
    const error = err as Error
    console.error(error)
    Swal.fire('Error in localStorage', error.message, 'error')
  }
}

export function getStToken() {
  return window.localStorage.getItem(TOKEN)
}

export function getStUserId() {
  return window.localStorage.getItem(USERID)
}

export function stOkLogin() {
  return getStToken() !== null && getStUserId() !== null
}

export function clearStUser() {
  window.localStorage.removeItem(TOKEN)
  window.localStorage.removeItem(USERID)
}

export function setTheme(name: string) {
  try {
    window.localStorage.setItem(THEME, name)
  } catch(err) {
    const error = err as Error
    console.error(error)
    Swal.fire('Error in localStorage', error.message, 'error')
  }
}

export function isThemeEmpty() {
  return window.localStorage.getItem('theme') === null
}

export function isThemeLight() {
  return window.localStorage.getItem('theme') === 'light'
}

export function isThemeDark() {
  return window.localStorage.getItem('theme') === 'dark'
}
