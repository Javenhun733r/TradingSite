import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    setupSocketConnection() {
        const endpoint = 'http://localhost:8081';
        this.socket = io(endpoint);

        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    // Custom method to handle any socket event
    onSocketEvent(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // Custom method to emit any socket event
    emitSocketEvent(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

export default new SocketService();
