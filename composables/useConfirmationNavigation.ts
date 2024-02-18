export default function useConfirmNavigation(message = 'Are you sure you want to leave this page?') {
    const confirmNavigation = (event) => {
        // Prevent the default browser dialog
        event.preventDefault(); 
        // Chrome requires returnValue to be set
        event.returnValue = ''; 
        if (!confirm(message)) {
            // User confirmed navigation, remove the listener to avoid triggering it again
            window.removeEventListener('popstate', confirmNavigation, false);
            // Go back if it was a back navigation
            history.back();
        } else {
            console.log("here")
            // User canceled navigation, manipulate history to stay on the page
            history.pushState(null, null, window.location.pathname);
        }
    };

    const setupConfirmNavigation = () => {
        window.addEventListener('popstate', confirmNavigation, false);
    };

    const removeConfirmNavigation = () => {
        window.removeEventListener('popstate', confirmNavigation, false);
    };

    return { setupConfirmNavigation, removeConfirmNavigation };
}