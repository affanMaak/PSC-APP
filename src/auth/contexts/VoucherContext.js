import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketService from '../../../services/socket.service';

const VoucherContext = createContext();
const VOUCHER_STORAGE_KEY = '@active_voucher';

export const VoucherProvider = ({ children }) => {
    const [activeVoucher, setActiveVoucher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load persisted voucher on mount
    useEffect(() => {
        const loadPersistedVoucher = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(VOUCHER_STORAGE_KEY);
                if (jsonValue != null) {
                    const persistedVoucher = JSON.parse(jsonValue);
                    // Check if persisted voucher is still valid
                    if (persistedVoucher.dueDate) {
                        const distance = new Date(persistedVoucher.dueDate).getTime() - new Date().getTime();
                        if (distance > 0) {
                            console.log('📦 Loaded persisted voucher:', persistedVoucher.voucher?.voucher_no || persistedVoucher.bookingId);
                            setActiveVoucher(persistedVoucher);
                        } else {
                            console.log('⏰ Persisted voucher expired, clearing storage');
                            await AsyncStorage.removeItem(VOUCHER_STORAGE_KEY);
                        }
                    }
                }
            } catch (e) {
                console.error('Error loading persisted voucher:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadPersistedVoucher();
    }, []);

    // Clear voucher if it's expired or paid (real-time)
    useEffect(() => {
        if (!activeVoucher) return;

        // 1. Time-based expiry check
        const timer = setInterval(async () => {
            if (activeVoucher.dueDate) {
                const distance = new Date(activeVoucher.dueDate).getTime() - new Date().getTime();
                if (distance < 0) {
                    console.log('⏰ Voucher expired, clearing global state and storage');
                    setActiveVoucher(null);
                    await AsyncStorage.removeItem(VOUCHER_STORAGE_KEY);
                    clearInterval(timer);
                }
            }
        }, 5000);

        // 2. Real-time payment sync
        const voucherId = activeVoucher.voucher?.id || activeVoucher.bookingId || activeVoucher.id;
        let unsubscribe = () => { };

        if (voucherId) {
            unsubscribe = socketService.subscribeToPayment(voucherId, async (data) => {
                if (data.status === 'PAID') {
                    console.log('💰 Payment received via Socket! Clearing voucher and storage.');
                    Alert.alert(
                        'Payment Successful',
                        `Voucher ${data.voucherId || voucherId} has been paid! Your booking is now confirmed.`,
                        [{ text: 'Great!' }]
                    );
                    setActiveVoucher(null);
                    await AsyncStorage.removeItem(VOUCHER_STORAGE_KEY);
                }
            });
        }

        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    }, [activeVoucher]);

    const setVoucher = async (voucherData, navigationParams) => {
        console.log('🔔 Global Voucher Set:', { voucherData, navigationParams });
        const newVoucher = {
            ...voucherData,
            navigationParams,
            timestamp: new Date().getTime()
        };
        setActiveVoucher(newVoucher);
        try {
            await AsyncStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(newVoucher));
        } catch (e) {
            console.error('Error saving voucher to storage:', e);
        }
    };

    const clearVoucher = async () => {
        setActiveVoucher(null);
        try {
            await AsyncStorage.removeItem(VOUCHER_STORAGE_KEY);
        } catch (e) {
            console.error('Error clearing voucher from storage:', e);
        }
    };

    return (
        <VoucherContext.Provider value={{ activeVoucher, setVoucher, clearVoucher, isLoading }}>
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
