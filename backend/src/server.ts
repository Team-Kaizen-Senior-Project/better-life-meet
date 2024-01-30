import http from 'http'
import io from 'socket.io'
import express, { Express } from 'express'
import cors from 'cors'
import SelectiveForwardingUnit from './SelectiveForwardingUnit'

const initializeExpressServer = (): Express => {
	const app: Express = express()
	app.use(cors())

	// * Specify Express endpoints here
	app.get('/mediasoup', (req, res) => {
		res.send('Hello, world!')
	})

	return app
}

const initializeWebSocketServer = (httpServer: http.Server): io.Server => {
	const wss: io.Server = new io.Server(httpServer, {
		path: '/wss',
		cors: {
			origin: '*',
		},
	})

	// * Specify WebSocket events here
	wss.on('connection', async (socket: io.Socket) => {
		socket.on('greet', (data) => {
			console.log(data)
		})
	})

	return wss
}

const main = async () => {

	const sfu: SelectiveForwardingUnit = await SelectiveForwardingUnit.getInstance()

	const app: Express = initializeExpressServer()

	const httpServer: http.Server = new http.Server(app)

	const wss: io.Server = initializeWebSocketServer(httpServer)

	httpServer.listen(3333, () => {
		console.log('Listening on port 3333')
	})
}

if (require.main === module) {
	main()
}
