import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const config = useRuntimeConfig()

// Function to generate a management token
export function generateManagementToken() {
	const payload = {
		access_key: config.HMS_ACCESS_KEY,
		type: 'management',
		version: 2,
		iat: Math.floor(Date.now() / 1000),
		nbf: Math.floor(Date.now() / 1000),
	}

	return new Promise((resolve, reject) => {
		jwt.sign(payload, config.HMS_SECRET!, { algorithm: 'HS256', expiresIn: '24h', jwtid: uuidv4() }, (err, token) =>
			err ? reject(err) : resolve(token),
		)
	})
}
