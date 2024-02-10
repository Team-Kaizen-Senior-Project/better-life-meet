import { getToken } from '#auth'
//Nuxt auth JWT token generation
export default eventHandler((event) => getToken({ event }))
