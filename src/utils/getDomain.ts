const urlRegex = /^(?:https?:\/\/)?(?:[^@\\/\n]+@)?(?:www\.)?([^:\\/?\n]+)/gim
const getDomain = (str: string): string => {
  if (!str) return ''

  const isUrl = urlRegex.test(str)
  const isHaveProtocol = str.startsWith('http')
  if (isUrl && isHaveProtocol) {
    const url = new URL(str)
    str = url.hostname
  }
  if (str.startsWith('www.')) {
    str = str.replace('www', '')
  }
  return str
}
export default getDomain
