const getDomain = (inputStr: string): string => {
  let str = inputStr.trim()
  if (!str) return ''

  const isHaveProtocol = str.startsWith('http')
  if (isHaveProtocol) {
    const url = new URL(str)
    str = url.hostname
  }
  if (str.startsWith('www.')) {
    str = str.replace('www', '')
  }
  return str
}

export default getDomain
