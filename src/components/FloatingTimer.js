import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useVoucher } from '../auth/contexts/VoucherContext';
import { useNavigation } from '@react-navigation/native';

const FloatingTimer = () => {
    const { activeVoucher } = useVoucher();
    const navigation = useNavigation();
    const [timeLeft, setTimeLeft] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (activeVoucher) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            const interval = setInterval(() => {
                const distance = new Date(activeVoucher.dueDate).getTime() - new Date().getTime();

                if (distance < 0) {
                    setTimeLeft('EXPIRED');
                    clearInterval(interval);
                    return;
                }

                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [activeVoucher]);

    if (!activeVoucher || timeLeft === 'EXPIRED') return null;

    const handlePress = () => {
        const { navigationParams } = activeVoucher;
        let screen = 'Voucher'; // Default for Lawn

        if (navigationParams?.bookingType === 'ROOM') {
            screen = 'voucher';
        } else if (navigationParams?.module === 'HALL') {
            screen = 'HallInvoiceScreen';
        } else if (navigationParams?.module === 'SHOOT') {
            screen = 'InvoiceScreen';
        }

        navigation.navigate(screen, navigationParams);
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={styles.button}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <View style={styles.timerContent}>
                    <Icon name="clockcircleo" size={16} color="#fff" />
                    <Text style={styles.timerText}>{timeLeft}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Pay</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 9999,
    },
    button: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#ffa39e',
    },
    timerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    timerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        minWidth: 60,
    },
    badge: {
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        color: '#dc3545',
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export default FloatingTimer;
