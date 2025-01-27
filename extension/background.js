const urlPrefix = 'https://github.com/w3ctag/design-reviews/issues/'
const reIssue = /\/\d+$/

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		chrome.tabs.create({ url: 'set-up.html'  })
	}
})

chrome.webNavigation.onHistoryStateUpdated.addListener(handleHistory, { url: [{ urlPrefix }] })

function handleHistory(details) {
	if (details.frameId > 0) return
	const urlWithoutHash = details.url.split('#')[0]
	if (reIssue.test(urlWithoutHash)) {
		chrome.tabs.sendMessage(details.tabId, { name: 'issue-comments', for: urlWithoutHash })
			.catch(error => console.warn(error))
	}
}
