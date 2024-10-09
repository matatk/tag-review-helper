function internalComments() {
	if (document.getElementById('tag-review-helper')) {
		// NOTE: GitHub in particular seems to double up history state pushes.
		console.warn("Ignoring duplicate request to run helper")
		return
	}

	const internalIssueAnchor = document.querySelector('a[href^="/w3ctag/design-reviews-private-brainstorming/issues/"]')
	if (!internalIssueAnchor) {
		console.warn("Couldn't find link to mirror repo")
		return
	}

	const internalIssueURL = internalIssueAnchor.href
	if (!internalIssueURL) {
		console.warn("Couldn't get URL to mirror issue")
		return
	}

	const targ = document.getElementsByClassName('js-quote-selection-container')[0]
	if (!targ) {
		console.warn("Couldn't find intended part of the page to surface internal comments")
		return
	}

	const container = document.createElement('div')
	container.id = 'tag-review-helper'
	container.hidden = true

	const containerHeading = document.createElement('h3')
	containerHeading.append('Internal comments')

	const controls = document.createElement('div')
	controls.classList.add('controls')

	const link = document.createElement('a')
	link.setAttribute('href', internalIssueURL)
	link.append('Internal comments thread')

	const toggle = document.createElement('button')
	toggle.append('Expand all')
	toggle.ariaPressed = 'false'
	toggle.addEventListener('click', event => {
		for (const comment of container.getElementsByTagName('details')) {
			comment.toggleAttribute('open')
		}
		event.target.ariaPressed = toggle.ariaPressed === 'true' ? 'false' : 'true'
	})

	controls.append(link)
	container.append(containerHeading, controls)

	targ.insertAdjacentElement('afterbegin', container)

	fetch(internalIssueURL)
		.then(response => {
			return response.text()
		})
		.then(html => {
			const parser = new DOMParser()
			const doc = parser.parseFromString(html, "text/html")
			const comments = Array.from(doc.querySelectorAll('main .timeline-comment'))
			const numInternalComments = comments.length - 1

			containerHeading.innerText += ` (${numInternalComments})`
			comments.shift()

			for (const comment of comments) {
				const details = document.createElement('details')
				const summary = document.createElement('summary')
				const commentHeading = document.createElement('h4')
				commentHeading.append(comment.querySelector('h3').textContent.replace('Loading', ''))
				summary.append(commentHeading)
				details.append(summary, comment.querySelector('td'))
				container.append(details)
			}

			if (numInternalComments > 0) {
				controls.append(toggle)
			}

			container.hidden = false
		})
		.catch(error => {
			console.warn('Failed to fetch internal issue page: ', error)
			container.remove()
			return
		})
}

console.log('Starting TAG review helper on', window.location.href)
chrome.runtime.onMessage.addListener(message => {
	if (message.name === 'issue-comments') {
		// NOTE: Sometimes we get history requests for different URLs in quick succession.
		if (message.for === window.location.href) {
			internalComments()
		}
	}
})
