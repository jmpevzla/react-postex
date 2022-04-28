import Swal from "sweetalert2"

const TOKEN = 'postex-token'
const USERID = 'postex-user-id'

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