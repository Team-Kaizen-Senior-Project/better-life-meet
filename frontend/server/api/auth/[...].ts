// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'

interface Customer {
	email: string
	id: string
	firstName: string
	lastName: string
	netWorth: string
	podRef: string
}

async function getCustomer(email: string) {
	return await $fetch<Customer>('/api/auth/customer', {
		method: 'POST',
		body: {
			email: email,
		},
	})
}

export default NuxtAuthHandler({
	providers: [
		// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point\
		CredentialsProvider.default({
			name: 'Credentials',
			async authorize(credentials: any) {
				const customer = await getCustomer(credentials.email)
				let user: Customer
				if (credentials.email === customer.email && credentials.password === 'password') {
					user = {
						email: customer.email,
						id: customer.id,
						firstName: customer.firstName,
						lastName: customer.lastName,
						netWorth: customer.netWorth,
						podRef: customer.podRef
					}
					return user
				} else {
					console.log('Invalid username or password')
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		session: async ({ session, token }) => {
			try {
				if (token.email) {
					const customerData = await getCustomer(token.email)
					//@ts-expect-error
					session.user.id = customerData.id
					//@ts-expect-error
					session.user.firstName = customerData.firstName
					//@ts-expect-error
					session.user.lastName = customerData.lastName
					//@ts-expect-error
					session.user.netWorth = customerData.netWorth
					//@ts-expect-error
					session.user.podRef = customerData.podRef
				} else {
					console.log('Token Email Invalid: ', token.email)
				}
			} catch (error) {
				console.error('Error fetching user data:', error)
			}
			return Promise.resolve(session)
		},
	},
})
