function getTopLevelDomain(domainStr: string) {
  let domain = domainStr
  const parts = domainStr.split('.')
  const numParts = parts.length
  if (numParts > 2) {
    // 如果有子域名，则返回最后两个部分
    domain = parts[numParts - 2] + '.' + parts[numParts - 1]
  }
  return domain
}
const getDomain = (inputStr: string): string => {
  let str = inputStr.trim()
  if (!str) return ''

  const isHaveProtocol = str.startsWith('http')
  if (isHaveProtocol) {
    const url = new URL(str)
    str = url.hostname
  }
  if (str.startsWith('www.')) {
    str = str.replace('www.', '')
  }
  return getTopLevelDomain(str)
}

export default getDomain
