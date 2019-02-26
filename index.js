/* eslint-disable no-param-reassign */

const socketio = require('socket.io');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

const port = process.env.PORT || 8081;

const server = socketio(port);

server.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });

  socket.on('joinRoom', (shareCode) => {
    logger.info('Client joined room', { socketId: socket.id, roomId: shareCode });
    socket.join(shareCode);
  });

  socket.on('updatePosition', (position) => {
    const shareCode = Object.keys(socket.rooms)[1];

    socket.position = position;

    socket.to(shareCode).emit('peerPositionUpdated', { id: socket.id, position });

    logger.info('Client updated position', { socketId: socket.id, position: socket.position });
  });

  socket.on('disconnect', (reason) => {
    logger.info('Client disconnected', { socketId: socket.id, reason });
  });
});

logger.info('Locashare server listening', { port });
