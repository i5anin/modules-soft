// region Работа с токеном
const TOKEN_KEY = 'token'

const getToken = () => localStorage.getItem(TOKEN_KEY) || null

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
// endregion

export { getToken, setToken, removeToken }
