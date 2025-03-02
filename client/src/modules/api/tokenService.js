//region Генерация временного токена
const getToken = () => {
  let token = localStorage.getItem('token') || btoa('user:secureRandomString123')

  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', token)
    console.log('Создан новый token:', token)
  } else {
    console.log('Текущий token:', token)
  }

  return token
}
//endregion

export { getToken }