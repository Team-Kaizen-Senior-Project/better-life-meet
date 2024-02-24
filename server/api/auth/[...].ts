import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { useApi } from '~/composables/useApi'
import type { Customer } from '~/types'

export default NuxtAuthHandler({
	secret: useRuntimeConfig().AUTH_SECRET,
	providers: [
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
		CredentialsProvider.default({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			// credentials: {
			// 	username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
			// 	password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' },
			// },
			async authorize(credentials: any) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

				try {
					const { getCustomerByEmail } = useApi()
					const customer: Customer = await getCustomerByEmail(credentials?.email)

					if (credentials?.email === customer.email && credentials?.password === 'password') {
						// Any object returned will be saved in `user` property of the JWT
						return customer
					} else {
						// If you return null then an error will be displayed advising the user to check their details.
						return null
					}
				} catch (err) {
					return null
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		session: async ({ session, token }) => {
			const { getCustomerByEmail } = useApi()
			const customer: Customer = await getCustomerByEmail(session.user?.email!)
			session.user = customer

			return session
		},
	},
})
