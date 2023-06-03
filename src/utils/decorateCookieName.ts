const regex = /CHROME_DEV【(.*)】CHROME_DEV/

export const decorateCookieName = (name: string) => {
  return `CHROME_DEV【${name}】CHROME_DEV`
}

export const isNameDecorated = (name: string) => {
  return regex.test(name)
}

export const getRealName = (name: string) => {
  if (isNameDecorated(name)) {
    return name.replace(regex, '$1')
  }
  return name
}
