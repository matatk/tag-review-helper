const urlPrefix = 'https://github.com/w3ctag/design-reviews/issues/'
const reIssue = /\/\d+$/

chrome.webNavigation.onHistoryStateUpdated.addListener(handleHistory, { url: [{ urlPrefix }] })

function handleHistory(details) {
	if (details.frameId > 0) return
	if (reIssue.test(details.url)) {
		chrome.tabs.sendMessage(details.tabId, { name: 'issue-comments', for: details.url })
			.catch(error => console.warn(error))
	}
}
