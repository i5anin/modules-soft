//region Генерация временного токена
const getToken = () => {
  let token = localStorage.getItem('token') || '18|gfTXsUcC7w9x7aRqpsqgVnNqhlJyz1Cq5Kp0HIql23bab626'

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
