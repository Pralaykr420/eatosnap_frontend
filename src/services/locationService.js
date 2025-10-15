import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class LocationService {
  constructor() {
    this.socket = null;
    this.watchId = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  startTracking(orderId) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    this.connect();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.socket.emit('rider-location-update', {
          orderId,
          location,
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  subscribeToOrderUpdates(orderId, callback) {
    this.connect();
    this.socket.emit('join-order', orderId);
    this.socket.on('order-status-changed', callback);
  }

  subscribeToLocationUpdates(orderId, callback) {
    this.connect();
    this.socket.emit('join-order', orderId);
    this.socket.on('rider-location-changed', callback);
  }

  unsubscribe() {
    if (this.socket) {
      this.socket.off('order-status-changed');
      this.socket.off('rider-location-changed');
    }
  }
}

export default new LocationService();
