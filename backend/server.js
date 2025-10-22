// index.js
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

// ===== SOCKET.IO CONFIG =====
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', // Frontend URL from env
    methods: ['GET', 'POST'],
  },
});

const ROOM = 'group';

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // JOIN ROOM
  socket.on('joinRoom', async (userName) => {
    console.log(`${userName} is joining the group.`);
    await socket.join(ROOM);

    // Notify others
    socket.to(ROOM).emit('roomNotice', userName);
  });

  // CHAT MESSAGE
  socket.on('chatMessage', (msg) => {
    socket.to(ROOM).emit('chatMessage', msg);
  });

  // TYPING INDICATORS
  socket.on('typing', (userName) => {
    socket.to(ROOM).emit('typing', userName);
  });

  socket.on('stopTyping', (userName) => {
    socket.to(ROOM).emit('stopTyping', userName);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// SIMPLE HEALTH CHECK
app.get('/', (req, res) => {
  res.send('<h1>Realtime Group Chat Backend is Running ✅</h1>');
});

// DYNAMIC PORT
const PORT = process.env.PORT || 4600;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
