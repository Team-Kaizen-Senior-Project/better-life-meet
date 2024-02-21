const attendee = useAttendeeStore()

export default function useConfirmNavigation(message = 'Are you sure you want to leave this page?') {
	let isLeavingConfirmed = false // Flag to track confirmation status
	const confirmNavigation = (event) => {
		if (event.type === 'beforeunload') {
			// Triggered on tab close
			if (!isLeavingConfirmed) {
				if (!confirm(message)) {
					event.preventDefault()
					event.returnValue = ''
				} else {
					isLeavingConfirmed = true
					attendee.logLeaveTime()
				}
			}
		} else if (event.type === 'popstate') {
			// Triggered on back button
			if (!isLeavingConfirmed) {
				if (confirm(message)) {
					attendee.logLeaveTime()
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
