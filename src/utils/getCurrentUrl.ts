export const getCurrentUrl = () => {
  return new Promise<string>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs?.[0]?.url || ''
      resolve(url)
    })
  })
}
