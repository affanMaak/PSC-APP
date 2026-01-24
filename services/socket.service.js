import { io } from 'socket.io-client';
import { getBaseUrl } from '../config/apis';

// Derive Socket URL from API Base URL
const apiBaseUrl = getBaseUrl();
const SOCKET_URL = apiBaseUrl.replace('/api', '/realtime');

console.log('🔌 Socket Service initializing with URL:', SOCKET_URL);

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to WebSocket');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from WebSocket:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('⚠️ WebSocket connection error:', error.message);
        });
    }

    subscribeToPayment(voucherId, callback) {
        if (!this.socket || !this.socket.connected) {
            this.connect();
        }

        console.log(`📡 Subscribing to payment updates for voucher: ${voucherId}`);
        this.socket.emit('subscribe_payment', voucherId);

        const handler = (data) => {
            console.log('📨 Received payment status update:', data);
            if (data.voucherId === voucherId || data.id === voucherId) {
                callback(data);
            }
        };

        this.socket.on('payment_status', handler);

        return () => {
            console.log(`📴 Unsubscribing from payment updates for voucher: ${voucherId}`);
            this.socket.off('payment_status', handler);
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
