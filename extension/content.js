// FIXME:
//   - If we go to the internal thread, then use the back button, the found comments disappear.
// TODO:
//   - GitHub has a lot of History updates; would be good to be able to filter these further.

const TRH_NAME = 'TAG Review Helper'
const CONTAINER = document.createElement('div')
const OUTPUT = document.createElement('div')
const WARNINGS = document.createElement('div')
const AGAIN = document.createElement('div')

let placedElements = false
let foundComments = false


//
// Support functions
//

function placeGlobalElements() {
	CONTAINER.id = 'tag-review-helper'  // for the CSS

	OUTPUT.hidden = true
	WARNINGS.hidden = true
	AGAIN.hidden = true

	const tryAgain = document.createElement('button')
	tryAgain.addEventListener('click', findAndGetComments)
	tryAgain.append('Try again')
	AGAIN.append(tryAgain)

	CONTAINER.append(WARNINGS, OUTPUT, AGAIN)

	const targ = document.querySelector('[data-testid="issue-viewer-issue-container"]')
	if (!targ) {
		document.body.prepend(CONTAINER)
		// This warning needs to be persistent
		const bodyWarning = document.createElement('p')
		bodyWarning.append("Couldn't find the intended part of the page to surface internal review comments; just putting them at the top. The extension will need to be updated for the latest GitHub web UI.")
		CONTAINER.prepend(bodyWarning)
	} else {
		targ.prepend(CONTAINER)
	}

	placedElements = true
}

function warn(...messages) {
	const warning = document.createElement('p')
	warning.append(TRH_NAME + ': ' + messages.join(' '))
	WARNINGS.append(warning)
}

// NOTE: This function must be passed a URL that doesn't have a fragment, or query.
function getCommentsFor(internalIssueURL) {
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
		for (const comment of OUTPUT.getElementsByTagName('details')) {
			comment.toggleAttribute('open')
		}
		event.target.ariaPressed = toggle.ariaPressed === 'true' ? 'false' : 'true'
	})

	controls.append(link)
	OUTPUT.append(containerHeading, controls)

	const issueNumber = internalIssueURL.split('/').at(-1)
	const queryUrl = `https://api.github.com/repos/w3ctag/design-reviews-private-brainstorming/issues/${issueNumber}/comments`
	console.debug('Fetching', queryUrl, '- current location:', window.location.href)

	chrome.storage.local.get('token', items => {
		fetch(queryUrl, {
			headers: {
				Accept: "application/vnd.github.html+json",
				Authorization: `Bearer ${items.token}`
			}
		})
			.then(response => {
				return response.json()
			})
			.then(comments => {
				if (!Array.isArray(comments)) {
					console.error('Something unexpected with the returned data, which is:', comments)
					warn('Something went wrong in fetching/processing the internal comments. The returned data has been logged to the console.')
					return
				}

				containerHeading.innerText += ` (${comments.length})`

				for (const comment of comments) {
					const createdDateTime = new Date(comment.created_at)
					const prettyDateTime = createdDateTime.toLocaleString()
					const heading = `${comment.user.login} on ${prettyDateTime}`
					const info = document.createElement('div')
					info.innerHTML = comment.body_html

					const details = document.createElement('details')
					const summary = document.createElement('summary')
					const commentHeading = document.createElement('h4')
					commentHeading.append(heading)
					summary.append(commentHeading)
					details.append(summary, info)
					OUTPUT.append(details)
				}

				if (comments.length > 0) {
					controls.append(toggle)
				}

				WARNINGS.remove()
				AGAIN.remove()
				OUTPUT.hidden = false
				foundComments = true  // FIXME: this becomes incorrect after a navigation via history state.
			})
			.catch(error => {
				console.error(error)
				warn('Failed to fetch internal issue page: ', error)
			})
	})
}

function findAndGetComments() {
	WARNINGS.replaceChildren()
	AGAIN.hidden = true

	setTimeout(() => {
		WARNINGS.hidden = false
		AGAIN.hidden = false
	}, 2000)

	const internalIssueAnchor = document.querySelector('a[href^="https://github.com/w3ctag/design-reviews-private-brainstorming/issues/"]')

	if (internalIssueAnchor && internalIssueAnchor.href) {
		console.debug('Creating UI and fetching comments. Current location:', window.location.href)

		// NOTE: If navigating to the internal thread, then using the Back button, the page is not fully reloaded, and the first anchor found is the timestamp in the internal thread, which has a fragment - so this must be removed.
		getCommentsFor(internalIssueAnchor.href.split('#')[0])
	} else {
		warn('Couldn\'t find the link to the internal repo. If the thread is long, it may be behind a "Load more" button. Also, enusre that you\'re signed in to GitHub. Failing this, the extension may need to be updated to reflect a change in the GitHub web UI.')
		WARNINGS.hidden = false
		AGAIN.hidden = false
	}
}


//
// Start-up actions
//

console.debug(`Starting ${TRH_NAME} on`, window.location.href)

chrome.runtime.onMessage.addListener(message => {
	if (message.name === 'issue-comments') {
		if (!placedElements) placeGlobalElements()

		// FIXME: We can return to the previous page via the Back button without a reload in some cases, but in rendering the previous page, GitHub removes the found comments.
		if (foundComments) {
			console.debug('Ignoring duplicate request to find comments.')
			return
		}

		// NOTE: Sometimes we get history requests for different URLs in quick succession.
		// TODO: Check the above is true.
		if (message.for === window.location.href.split('#')[0]) {
			console.debug('Received request to find comments. Current location:', window.location.href)
			findAndGetComments()
		}
	}
})
