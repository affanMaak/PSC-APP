import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import socketService from '../../../services/socket.service';

const VoucherContext = createContext();

export const VoucherProvider = ({ children }) => {
    const [activeVoucher, setActiveVoucher] = useState(null);

    // Clear voucher if it's expired or paid (real-time)
    useEffect(() => {
        if (!activeVoucher) return;

        // 1. Time-based expiry check
        const timer = setInterval(() => {
            if (activeVoucher.dueDate) {
                const distance = new Date(activeVoucher.dueDate).getTime() - new Date().getTime();
                if (distance < 0) {
                    console.log('⏰ Voucher expired, clearing global state');
                    setActiveVoucher(null);
                    clearInterval(timer);
                }
            }
        }, 5000);

        // 2. Real-time payment sync
        const voucherId = activeVoucher.voucher?.id || activeVoucher.bookingId || activeVoucher.id;
        let unsubscribe = () => { };

        if (voucherId) {
            unsubscribe = socketService.subscribeToPayment(voucherId, (data) => {
                if (data.status === 'PAID') {
                    console.log('💰 Payment received via Socket! Clearing voucher.');
                    Alert.alert(
                        'Payment Successful',
                        `Voucher ${data.voucherId || voucherId} has been paid! Your booking is now confirmed.`,
                        [{ text: 'Great!' }]
                    );
                    setActiveVoucher(null);
                }
            });
        }

        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    }, [activeVoucher]);

    const setVoucher = (voucherData, navigationParams) => {
        console.log('🔔 Global Voucher Set:', { voucherData, navigationParams });
        setActiveVoucher({
            ...voucherData,
            navigationParams,
            timestamp: new Date().getTime()
        });
    };

    const clearVoucher = () => {
        setActiveVoucher(null);
    };

    return (
        <VoucherContext.Provider value={{ activeVoucher, setVoucher, clearVoucher }}>
            {children}
        </VoucherContext.Provider>
    );
};

export const useVoucher = () => {
    const context = useContext(VoucherContext);
    if (!context) {
        throw new Error('useVoucher must be used within a VoucherProvider');
    }
    return context;
};
