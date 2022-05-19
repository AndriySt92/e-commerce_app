export const getToken = () => {
    let token
    if (localStorage.getItem('user')) {
      token = JSON.parse(localStorage.getItem('user') as string).token
      return token
    } else {
      token = ''
      return token
    }
  }