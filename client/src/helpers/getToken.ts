export const getToken = () => {
    let token
    if (localStorage.getItem('user')) {
      token = JSON.parse(localStorage.getItem('user') as string).token
      return `bearer ${token}`
    } else {
      token = ''
      return token
    }
  }