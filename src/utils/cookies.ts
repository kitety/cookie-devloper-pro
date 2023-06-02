const filterDomain = (domain: string) => {
  // if domain start with ., remove it
  if (domain.startsWith('.')) {
    domain = domain.slice(1)
  }
  return domain
}

export const getAllCookies = () => {
  return chrome.cookies.getAll({})
}
export const deleteCookie = (cookie: chrome.cookies.Cookie) => {
  return chrome.cookies.remove({
    url: `http${cookie.secure ? 's' : ''}://${filterDomain(cookie.domain)}${
      cookie.path
    }`,
    name: cookie.name,
  })
}
export const saveCookie = (cookie: chrome.cookies.Cookie) => {
  const {
    domain,
    name,
    storeId,
    value,
    expirationDate,
    path,
    httpOnly,
    secure,
    sameSite,
  } = cookie
  const dataPayload = {
    domain,
    name,
    storeId,
    value,
    expirationDate: expirationDate ? Number(expirationDate) : undefined,
    path,
    httpOnly,
    secure,
    sameSite,
    url: `http${cookie.secure ? 's' : ''}://${filterDomain(domain)}${
      cookie.path
    }`,
  }
  console.log('dataPayload', dataPayload)
  return chrome.cookies.set(dataPayload)
}
