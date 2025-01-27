chrome.storage.local.get('token', items => {
	if (items.token) {
		document.getElementById('token').value = items.token
	}
})

document.getElementById('save').addEventListener('click', () => {
	chrome.storage.local.set({ token: document.getElementById('token').value })
	document.getElementById('result').innerText = 'Token saved'
})
