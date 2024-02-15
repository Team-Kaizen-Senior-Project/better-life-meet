// Import necessary utilities from Vitest
import { describe, it, expect, vi } from 'vitest'
import { io } from 'socket.io-client'
import { useMediaStore } from '~/stores/MediaStore'

describe('media functionality setup tests', () => {
    it('gets the route', () => {
        const route = useRoute()
        expect(route).not.toBeNull()
    })
    it ('gets the meeting id', () => { 
        const route = useRoute()
        const meetingID = route.params.meetingID
        expect(meetingID).not.toBeNull()
    })
    it ('accesses the mediastore successfully', () => {
        const mediaStore = useMediaStore()
        expect(mediaStore).not.toBeNull()
    })
    it ('connects to the websocket server successfully', () => {
        const route = useRoute()
        const meetingID = route.params.meetingID
        const ws = io({ path: '/wss' })
        ws.emit('join', meetingID)
        ws.on('joined', (data) => {
            expect(data).toEqual('joined')
        })
    })
})
