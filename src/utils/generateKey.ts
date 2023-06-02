export const generateCookieKey = (cookie: chrome.cookies.Cookie) => {
  return `${cookie.domain}${cookie.path}${cookie.name}${cookie.value}`
}
