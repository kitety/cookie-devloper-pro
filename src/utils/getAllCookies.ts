const getAllCookies = () => {
  return new Promise<chrome.cookies.Cookie[]>((resolve) => {
    chrome.cookies.getAll({}, (cookies) => {
      resolve(cookies)
    })
  })
}
export default getAllCookies
