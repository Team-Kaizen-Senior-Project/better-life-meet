export default function useConfirmNavigation(message = 'Are you sure you want to leave this page?') {
	let isLeavingConfirmed = false // Flag to track confirmation status
	const confirmNavigation = (event) => {
		if (event.type === 'beforeunload') {
			console.log('tab closed triggered')

			// Triggered on tab close
			if (!isLeavingConfirmed) {
				if (!confirm(message)) {
					event.preventDefault()
					event.returnValue = ''
				} else {
					isLeavingConfirmed = true
				}
			}
		} else if (event.type === 'popstate') {
			// Triggered on back button
			console.log('back buttib triggered')

			if (!isLeavingConfirmed) {
				if (confirm(message)) {
					history.back()
				} else {
					event.preventDefault()
				}
			}
		}
	}

	const setupConfirmNavigation = () => {
		console.log('setting up event listeners')
		window.addEventListener('beforeunload', confirmNavigation, false)
		window.addEventListener('popstate', confirmNavigation, false)
	}

	const removeConfirmNavigation = () => {
		window.removeEventListener('beforeunload', confirmNavigation, false)
		window.removeEventListener('popstate', false)
	}

	return { setupConfirmNavigation, removeConfirmNavigation }
}
