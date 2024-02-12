/* Get authenticated users session data
 will return session stats like so:
{
  "data": {
    "user": {
      "email": "First.Last@example.com",
      "id": "379073277919756353",
      "firstName": "First",
      "lastName": "Last",
      "netWorth": 175000,
      "podRef": "382425683595362372"
    },
    "expires": "2024-03-06T22:37:02.988Z"
  },
  "pending": false,
  "error": null,
  "status": "success"
}
*/

export default eventHandler(async (event) => {
	// session retrieval.
	const authBasePath = useRuntimeConfig().public.auth.computed.pathname
	const session = await $fetch(authBasePath + '/session', {
		method: 'GET',
		headers: event.headers,
	})
	//if user is unathenticated, return unauthenticated status
	if (!session) {
		return { status: 'unauthenticated' }
	}
	// return session and authenticated users session data
	// i.e. user email, user id, etc.
	return session
})
