import { Server as SocketServer } from 'socket.io'
import type { Customer } from '~/types'
import dayjs from 'dayjs'

const socketEventHandler = async (wss: SocketServer) => {
	console.log('✔ Socket.io server is listening')

	wss.on('connection', (ws) => {
		console.log(`Socket [${ws.id}] has connected.`)

		// Join chat room
		ws.on('joinChat', ({ roomId, customer }) => {
			ws.join(roomId)

			ws.to(roomId).emit('message', `${customer} joined chat: ${roomId}`)
			console.log(`${customer} joined Chat: ${roomId}`)
		})
		// Handle messages
		ws.on('chatMessage', ({roomId, chat, isCurrentUser}) =>{
			ws.to(roomId).emit('message', chat, isCurrentUser)
			console.log(chat)
		})
		ws.on('disconnect', () => {
			console.log(`Socket [${ws.id}] has disconnected.`)
		})
	})
}

export default socketEventHandler
