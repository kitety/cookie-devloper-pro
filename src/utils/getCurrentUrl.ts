export const getCurrentUrl = () => {
  return new Promise<string>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs?.[0]?.url || ''
      resolve(url)
    })
  })
}
export const currentTabJumpUrl = (url: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].id) {
      chrome.tabs.update(tabs[0].id, { url })
    }
  })
}
