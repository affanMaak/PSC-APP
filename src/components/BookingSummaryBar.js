import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
    AppState,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useVoucher } from '../auth/contexts/VoucherContext';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import notifee from '@notifee/react-native';

const BookingSummaryBar = () => {
    const { activeVoucher } = useVoucher();
    const navigation = useNavigation();
    const [timeLeft, setTimeLeft] = useState('');
    const [minutesLeft, setMinutesLeft] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [expanded, setExpanded] = useState(false);
    const expandAnim = useRef(new Animated.Value(0)).current;
    const appState = useRef(AppState.currentState);
    const notificationSent = useRef(false);

    useEffect(() => {
        if (activeVoucher) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            // Reset notification flag when a new voucher is set
            // The voucher object has a timestamp, so we can detect if it's new
            notificationSent.current = false;

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
                setMinutesLeft(minutes);

                // Urgency Notification logic (15 minutes or less)
                if (minutes <= 15 && !notificationSent.current) {
                    triggerUrgencyNotification();
                    notificationSent.current = true;
                }
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

    const triggerUrgencyNotification = async () => {
        const message = "Your room hold expires in 15 minutes. Complete your payment now to secure your stay!";

        if (AppState.currentState === 'active') {
            Alert.alert(
                "Booking Expiry Reminder",
                message,
                [{ text: "Complete Payment", onPress: handlePress }, { text: "Dismiss" }]
            );
        } else {
            // Background push notification
            try {
                const channelId = await notifee.createChannel({
                    id: 'urgency-reminder',
                    name: 'Urgency Reminders',
                });

                await notifee.displayNotification({
                    title: 'Hold Expiring Soon!',
                    body: message,
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            } catch (error) {
                console.error('Error triggering local notification:', error);
            }
        }
    };

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

    const toggleExpand = () => {
        const toValue = expanded ? 0 : 1;
        setExpanded(!expanded);
        Animated.spring(expandAnim, {
            toValue,
            useNativeDriver: false,
        }).start();
    };

    const voucherId = activeVoucher.voucher?.voucher_no || activeVoucher.voucherData?.voucher?.voucher_no || activeVoucher.invoiceNumber;
    const consumerNo = activeVoucher.voucher?.consumer_number || activeVoucher.voucherData?.voucher?.consumer_number;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.mainBar}
                    onPress={toggleExpand}
                    activeOpacity={0.9}
                >
                    <View style={styles.timerSection}>
                        <AntIcon name="clockcircleo" size={16} color="#fff" />
                        <Text style={styles.timerText}>{timeLeft}</Text>
                        {expanded ? (
                            <Icon name="keyboard-arrow-up" size={24} color="#fff" />
                        ) : (
                            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
                        )}
                    </View>

                    {!expanded && (
                        <TouchableOpacity style={styles.payNowButton} onPress={handlePress}>
                            <Text style={styles.payNowText}>Pay Now</Text>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                <Animated.View style={[
                    styles.expandedContent,
                    {
                        height: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 110]
                        }),
                        opacity: expandAnim
                    }
                ]}>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoLabel}>Voucher #</Text>
                            <Text style={styles.infoValue}>{voucherId || 'N/A'}</Text>
                        </View>
                        {consumerNo && (
                            <View style={styles.infoBlock}>
                                <Text style={styles.infoLabel}>Consumer #</Text>
                                <Text style={styles.infoValue}>{consumerNo}</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.fullPayButton} onPress={handlePress}>
                        <Text style={styles.fullPayButtonText}>View & Pay Invoice</Text>
                        <Icon name="arrow-forward" size={18} color="#dc3545" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 70, // Sticky below status bar/header
        left: 15,
        right: 15,
        zIndex: 10000, // Above everything
    },
    content: {
        backgroundColor: '#dc3545',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#ffa39e',
    },
    mainBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    timerSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        marginRight: 4,
        minWidth: 80,
    },
    payNowButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
    },
    payNowText: {
        color: '#dc3545',
        fontSize: 12,
        fontWeight: 'bold',
    },
    expandedContent: {
        paddingHorizontal: 15,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoBlock: {
        flex: 1,
    },
    infoLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        marginBottom: 2,
    },
    infoValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    fullPayButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 10,
    },
    fullPayButtonText: {
        color: '#dc3545',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    }
});

export default BookingSummaryBar;
