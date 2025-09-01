import app from './app';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import sequelize from './config/database';
import env from './config/env';
dotenv.config();

const PORT =env.PORT || 5000;

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

const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    if (retries === 0) {
      console.error('Database connection failed after multiple retries:', error);
      process.exit(1);
    }
    
    console.log(`Retrying database connection... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    await connectWithRetry(retries - 1, delay);
  }
};
(async () => {
  await connectWithRetry();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

