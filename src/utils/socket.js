import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const joinOrder = orderId => {
  socket.emit('join-order', orderId);
};

export const onOrderUpdate = callback => {
  socket.on('order-status-changed', callback);
};

export const offOrderUpdate = () => {
  socket.off('order-status-changed');
};
