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
    Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useVoucher } from '../auth/contexts/VoucherContext';
import { useNavigation } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import { voucherAPI } from '../../config/apis';
import socketService from '../../services/socket.service';

const BookingSummaryBar = () => {
    const { activeVoucher, clearVoucher } = useVoucher();
    const navigation = useNavigation();
    const [vouchers, setVouchers] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [fadeAnim] = useState(new Animated.Value(0));
    const [expanded, setExpanded] = useState(false);
    const expandAnim = useRef(new Animated.Value(0)).current;
    const notificationSent = useRef(new Set()); // Track notifications per voucher
    const fetchInterval = useRef(null);
    const timerInterval = useRef(null);
    const [copiedId, setCopiedId] = useState(null);

    const fetchVouchers = async () => {
        try {
            const data = await voucherAPI.getTimerVouchers();
            console.log(data)
            if (data && Array.isArray(data)) {
                // Normalize data: Some responses wrap voucher details in voucherData.voucher
                const normalizedData = data.map(item => {
                    const v = item.voucherData?.voucher || item;
                    return {
                        ...item,
                        id: v.id || item.id,
                        booking_id: v.booking_id || item.booking_id || item.bookingId,
                        voucher_no: v.voucher_no || item.voucher_no || item.invoiceNumber,
                        issued_at: v.issued_at || v.issue_date || item.issued_at || item.issue_date,
                        expiresAt: v.expiresAt || v.expires_at || item.expiresAt || item.expires_at || item.dueDate || item.due_date,
                        consumer_number: v.consumer_number || item.consumer_number,
                        booking_type: v.booking_type || item.booking_type || item.bookingType || 'ROOM'
                    };
                });

                setVouchers(normalizedData);
                if (normalizedData.length > 0) {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                } else {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }
            }
        } catch (error) {
            console.error('Error fetching timer vouchers:', error);
        }
    };

    useEffect(() => {
        fetchVouchers();
        fetchInterval.current = setInterval(fetchVouchers, 30000); // Fetch every 30s

        timerInterval.current = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);

        return () => {
            if (fetchInterval.current) clearInterval(fetchInterval.current);
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, []);

    // Socket subscriptions for real-time payment updates
    useEffect(() => {
        const unsubscribes = [];

        vouchers.forEach(voucher => {
            const voucherId = voucher.id || voucher.booking_id;
            if (voucherId) {
                const unsub = socketService.subscribeToPayment(voucherId, (data) => {
                    if (data.status === 'PAID' || data.status === 'CANCELLED') {
                        // console.log(`📡 Status update for voucher ${voucherId}: ${data.status}`);

                        if (data.status === 'PAID') {
                            Alert.alert(
                                'Payment Successful',
                                `Voucher ${voucher.voucher_no || voucherId} has been paid! Your booking is now confirmed.`,
                                [{ text: 'Great!' }]
                            );
                        }

                        // Remove the voucher from our local list for both PAID and CANCELLED
                        setVouchers(prev => prev.filter(v => (v.id || v.booking_id) !== voucherId));

                        // Remove from notification tracking
                        notificationSent.current.delete(voucherId);

                        // If this was the active voucher in context, clear it too
                        if (activeVoucher && (activeVoucher.id === voucherId || activeVoucher.bookingId === voucherId)) {
                            clearVoucher();
                        }
                    }
                });
                unsubscribes.push(unsub);
            }
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [vouchers]);

    const getVoucherTimer = (voucher) => {
        const rawIssueDate = voucher?.issued_at;
        const rawExpire = voucher?.expiresAt || voucher?.expires_at || 15;

        const issueTime = rawIssueDate ? new Date(rawIssueDate).getTime() : null;
        let expiryTime = null;

        // Try to parse rawExpire as a number of minutes first
        const expireMinutes = Number(rawExpire);

        if (!isNaN(expireMinutes) && typeof rawExpire !== 'string') {
            // It's a number (or number-like string that is just a digit), treat as minutes
            if (issueTime && !isNaN(issueTime)) {
                expiryTime = issueTime + (expireMinutes * 60 * 1000);
            }
        } else {
            // Try to parse as absolute date string
            const absoluteExp = new Date(rawExpire).getTime();
            if (!isNaN(absoluteExp)) {
                expiryTime = absoluteExp;
            } else if (issueTime && !isNaN(issueTime) && !isNaN(expireMinutes)) {
                // Fallback to minutes if it's a numeric string
                expiryTime = issueTime + (expireMinutes * 60 * 1000);
            }
        }

        if (!expiryTime || isNaN(expiryTime)) {
            return 'EXPIRED';
        }

        const distance = expiryTime - currentTime;

        if (distance <= 0) return 'EXPIRED';

        const minutes = Math.floor(distance / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return {
            text: `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`,
            minutes,
            expired: false,
            distance
        };
    };


    // Filter valid vouchers and sort by urgency
    const activeVouchers = vouchers
        .map(v => ({ ...v, timer: getVoucherTimer(v) }))
        .filter(v => v.timer !== 'EXPIRED')
        .sort((a, b) => a.timer.distance - b.timer.distance);

    useEffect(() => {
        // Notification logic for the most urgent voucher
        if (activeVouchers.length > 0) {
            const mostUrgent = activeVouchers[0];
            const voucherId = mostUrgent.voucher_no || mostUrgent.id;

            if (mostUrgent.timer.minutes <= 15 && !notificationSent.current.has(voucherId)) {
                triggerUrgencyNotification(mostUrgent);
                notificationSent.current.add(voucherId);
            }
        }
    }, [activeVouchers]);

    const triggerUrgencyNotification = async (voucher) => {
        const message = `Your booking hold (${voucher.voucher_no || 'Pending'}) expires in 15 minutes. Complete your payment now!`;

        if (AppState.currentState === 'active') {
            Alert.alert(
                "Booking Expiry Reminder",
                message,
                [{ text: "Complete Payment", onPress: () => handlePress(voucher) }, { text: "Dismiss" }]
            );
        } else {
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
                        pressAction: { id: 'default' },
                    },
                });
            } catch (error) {
                console.error('Error triggering local notification:', error);
            }
        }
    };

    if (activeVouchers.length === 0) return null;

    const handlePress = (voucher) => {
        const bookingType = voucher.booking_type || voucher.bookingType || 'ROOM';
        let screen = 'Voucher';

        const params = {
            bookingId: voucher.booking_id || voucher.id || voucher.bookingId,
            numericBookingId: voucher.booking_id || voucher.id || voucher.bookingId,
            voucherData: voucher.voucherData || { voucher: voucher },
            bookingData: voucher.bookingData,
            roomType: voucher.roomType,
            memberDetails: voucher.memberDetails,
            isGuest: voucher.isGuest,
            dueDate: voucher.dueDate || voucher.expiresAt,
            bookingType: bookingType,
            navigationParams: { bookingType: bookingType }
        };

        if (bookingType === 'ROOM') {
            screen = 'voucher';
        } else if (bookingType === 'HALL') {
            screen = 'HallInvoiceScreen';
        } else if (bookingType === 'SHOOT') {
            screen = 'InvoiceScreen';
        }

        navigation.navigate(screen, params);
    };

    const copyToClipboard = (text, id) => {
        Clipboard.setString(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleExpand = () => {
        const toValue = expanded ? 0 : 1;
        setExpanded(!expanded);
        Animated.spring(expandAnim, {
            toValue,
            useNativeDriver: false,
        }).start();
    };

    const mostUrgent = activeVouchers[0];
    const totalVouchers = activeVouchers.length;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

            {!expanded && (
                <TouchableOpacity
                    style={styles.floatingCircle}
                    onPress={toggleExpand}
                    activeOpacity={0.9}
                >
                    <AntIcon name="clockcircleo" size={20} color="#fff" />
                    {totalVouchers > 1 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalVouchers}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            )}

            {expanded && (
                <Animated.View style={[
                    styles.content,
                    {
                        transform: [
                            { scale: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                            { translateY: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                        ],
                        opacity: expandAnim
                    }
                ]}>
                    <TouchableOpacity
                        style={styles.mainBar}
                        onPress={toggleExpand}
                        activeOpacity={0.7}
                    >
                        <Icon name="keyboard-arrow-down" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Animated.View style={[
                        styles.expandedContent,
                        {
                            height: expandAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, Math.min(activeVouchers.length * 80 + 20, 400)]
                            })
                        }
                    ]}>
                        <View style={styles.divider} />

                        {activeVouchers.map((v, index) => (
                            <View key={v.id || index} style={styles.voucherItem}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoBlock}>
                                        <View style={styles.voucherLabelRow}>
                                            <View style={styles.consumerContainer}>
                                                <Text style={styles.infoLabel}>
                                                    Consumer #{' '}
                                                </Text>
                                                <Text style={styles.consumerValue} numberOfLines={1}>
                                                    {v.consumer_number || 'N/A'}
                                                </Text>
                                                {v.consumer_number && (
                                                    <TouchableOpacity
                                                        onPress={() => copyToClipboard(v.consumer_number, v.id || index)}
                                                        style={styles.copyButton}
                                                    >
                                                        <Icon
                                                            name={copiedId === (v.id || index) ? "check" : "content-copy"}
                                                            size={12}
                                                            color="#fff"
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <Text style={styles.infoType}>
                                                {v.booking_type || 'ROOM'}
                                            </Text>
                                        </View>

                                        <Text style={styles.infoValue}>
                                            {v.timer.text}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => handlePress(v)}
                                    >
                                        <Text style={styles.viewButtonText}>Pay Now</Text>
                                    </TouchableOpacity>
                                </View>

                                {index < activeVouchers.length - 1 && (
                                    <View style={styles.itemDivider} />
                                )}
                            </View>
                        ))}
                    </Animated.View>
                </Animated.View>
            )}
        </Animated.View>
    );

};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        bottom: 80,
        right: 20,
        zIndex: 10000,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#dc3545',
        borderRadius: 16,
        width: '90%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    floatingCircle: {
        backgroundColor: '#dc3545',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
    },

    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 0,
        paddingVertical: 2,
    },

    badgeText: {
        color: '#dc3545',
        fontSize: 10,
        fontWeight: 'bold',
    },

    mainBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        marginRight: 10,
    },
    infoLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    consumerValue: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        flexShrink: 1,
    },
    infoValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
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
    },
    voucherItem: {
        paddingVertical: 8,
    },
    itemDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 4,
    },
    voucherLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
        paddingEnd: 3
    },
    infoType: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    viewButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 0,
        borderRadius: 10,
    },
    viewButtonText: {
        color: '#dc3545',
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 2,
    },
    consumerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyButton: {
        marginLeft: 8,
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
    }
});

export default BookingSummaryBar;
