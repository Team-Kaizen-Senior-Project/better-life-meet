import { Vimeo } from 'vimeo'

export default defineEventHandler(async (event) => {
	// Get video ID
	const { id } = event.context.params as { id: string }

	const clientId = process.env.VIMEO_CLIENT_ID as string
	const clientSecret = process.env.VIMEO_CLIENT_SECRET as string
	const accessToken = process.env.VIMEO_ACCESS_TOKEN as string

	// Initialize the Vimeo client with your credentials
	const client = new Vimeo(clientId, clientSecret, accessToken)

	// Use the client to make a request to the Vimeo API
	return new Promise((resolve, reject) => {
		client.request(
			{
				method: 'GET',
				path: `/videos/${id}`,
			},
			(error, body, status_code, headers) => {
				if (error) {
					console.error('Error fetching video:', error)
					reject(error)
				} else {
					resolve(body)
				}
			},
		)
	})
})
