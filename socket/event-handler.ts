import { Server as SocketServer } from 'socket.io'

const socketEventHandler = async (wss: SocketServer) => {
	console.log('✔ Socket.io server is listening')

	wss.on('connection', (ws) => {
		console.log(`Socket [${ws.id}] has connected.`)

		ws.on('disconnect', () => {
			console.log(`Socket [${ws.id}] has disconnected.`)
		})
	})
}

export default socketEventHandler
