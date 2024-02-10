import { Client } from 'fauna'

export default function useFauna() {
	const { FAUNA_KEY } = useRuntimeConfig()

	if (FAUNA_KEY == undefined) {
		return {
			client: null,
			error: new Error('FAUNA_KEY is missing in the environment.'),
		}
	}

	return {
		client: new Client({ secret: FAUNA_KEY as string }),
		error: null,
	}
}
