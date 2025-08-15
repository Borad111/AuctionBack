import app from './app';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

//setup socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    },
    path:'/realtime'
});

//socket.io authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    if(!token) {
        return next(new Error('Authentication error'));
    }

    try {
         const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    (socket as any).user = payload;
    next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
});

//socket.io connection event
io.of('/realtime').on('connection', (socket) => {
  console.log('New client connected:', (socket as any).user);

  // Join auction room
  socket.on('joinAuction', ({ auctionId }) => {
    socket.join(auctionId);
    console.log(`User ${(socket as any).user.id} joined auction ${auctionId}`);
  });

  // Place bid
  socket.on('placeBid', ({ auctionId, amount }) => {
    console.log(`Bid received: ${amount} on auction ${auctionId}`);

    // TODO: Validate bid (currentPrice + incrementStep, endAt)
    // TODO: Save bid in DB
    // TODO: Emit events to room
    io.of('/realtime').to(auctionId).emit('bidPlaced', {
      auctionId,
      bid: amount,
      bidderId: (socket as any).user.id,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', (socket as any).user.id);
  });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

