import { http } from 'msw'

export const handlers = [
	http.get('http://localhost:3000/api/auth/session', (req, res, ctx) => {
		console.log('mocked http://localhost:3000/api/auth/session')

		return res(
			ctx.status(200),
			ctx.json({
				isAuthenticated: true,
				user: {
					name: 'John Doe',
					email: 'mock@example.com',
				},
			}),
		)
	}),
]
