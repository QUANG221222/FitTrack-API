import { env } from '~/configs/environment'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { cookieOptions } from '~/configs/cookieOption'
import { threadModel } from '~/models/thread.model'

let io: SocketIOServer

const handleJoinThread = async (socket: any, roomId: string) => {
  try {
    const thread = await threadModel.findChatByRoomId(roomId)

    if (!thread) {
      socket.emit('error', { message: 'Thread not found' })
      return
    }

    socket.join(roomId)

    socket.emit('joinedThread', {
      roomId: thread.roomId,
      messages: thread.messages
    })
  } catch (error) {
    console.error('Error joining thread:', error)
    socket.emit('error', { message: 'Failed to join thread' })
  }
}

const handleSendMessage = async (
  socket: any,
  data: {
    roomId: string
    senderAvatarUrl?: string
    message: string
    senderId: string
    senderName: string
    senderRole: 'member' | 'admin'
  }
) => {
  try {
    const {
      roomId,
      senderAvatarUrl,
      message,
      senderId,
      senderName,
      senderRole
    } = data

    const thread = await threadModel.findChatByRoomId(roomId)

    if (!thread) {
      socket.emit('error', { message: 'Thread not found' })
      return
    }

    const newMessage = {
      senderId,
      senderName,
      senderRole,
      senderAvatarUrl,
      message,
      timestamp: Date.now(),
      isRead: false,
      isDeleted: false
    }
    await threadModel.addMessage(roomId, newMessage)

    socket.to(roomId).emit('messageReceived', {
      roomId,
      message: newMessage
    })
    socket.emit('newMessage', { roomId, message: newMessage })
  } catch (error) {
    console.error('Error sending message:', error)
    socket.emit('error', { message: 'Failed to send message' })
  }
}

const handleDelete = async (
  socket: any,
  data: { roomId: string; messageId: string }
) => {
  try {
    await threadModel.deleteMessage(data.roomId, data.messageId)
    io.to(data.roomId).emit('messageDeleted', {
      roomId: data.roomId,
      messageId: data.messageId
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    socket.emit('error', { message: 'Failed to delete message' })
  }
}

const setupSocketEvents = (socket: any) => {
  socket.on('joinThread', (roomId: any) => handleJoinThread(socket, roomId))
  socket.on('sendMessage', (data: any) => handleSendMessage(socket, data))
  socket.on('deleteMessage', (data: any) => handleDelete(socket, data))
  // socket.on('disconnect', () => console.log('❌ User disconnected:', socket.id))
  socket.on('disconnect', () => {})
}

const initializeSocket = (server: HttpServer): SocketIOServer => {
  // Initialize Socket.io server
  io = new SocketIOServer(server, {
    cors: {
      origin:
        env.BUILD_MODE === 'production'
          ? env.WEBSITE_DOMAIN_PRODUCTION
          : env.WEBSITE_DOMAIN_DEVELOPMENT,
      credentials: true
    },
    cookie: { ...cookieOptions, name: 'fittrack-socket-io' }
  })

  io.on('connection', (socket: any) => {
    // console.log('✅ User connected:', socket.id)
    setupSocketEvents(socket)
  })
  return io
}

const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

export { initializeSocket, getIO }
