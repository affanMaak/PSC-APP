
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Share,
  ActivityIndicator,
  Linking,
  RefreshControl,
  ImageBackground,
  Clipboard,
  PermissionsAndroid,
  Platform
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useVoucher } from '../auth/contexts/VoucherContext';
import socketService from '../../services/socket.service';
import { lawnAPI, voucherAPI } from '../../config/apis';
import { bookingService } from '../../services/bookingService';
import { permissionService } from '../services/PermissionService';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const Voucher = ({ route, navigation }) => {
  const { clearVoucher } = useVoucher();
  const invoiceRef = React.useRef(); // Ref for ViewShot
  const [saveLoading, setSaveLoading] = useState(false);
  const {
    invoiceData: rawInvoiceData,
    bookingDetails,
    venue,
    isGuest,
    memberDetails,
    guestDetails
  } = route.params || {};

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  const handleCancelBooking = async () => {
    const bookingId = rawInvoiceData.voucher?.consumer_number;
    if (!bookingId) {
      Alert.alert('Error', 'Booking ID not found');
      return;
    }

    Alert.alert(
      'Cancel Lawn Booking',
      'Are you sure you want to cancel this booking request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // Use the EXACT same service method as Halls
              await bookingService.deleteBooking(bookingId);
              await clearVoucher();
              Alert.alert('Success', 'Lawn booking cancelled successfully');
              navigation.reset({
                index: 1,
                routes: [{ name: 'home' }],
              });
            } catch (error) {
              console.error('Error cancelling lawn booking:', error);
              Alert.alert('Error', error.message || 'Failed to cancel booking.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const loadInvoiceData = async () => {
      if (rawInvoiceData) {
        console.log('🔄 Mapping Lawn Invoice Data');

        let resolvedDetails = bookingDetails;

        // If bookingDetails is missing (navigated from BookingSummaryBar),
        // fetch full booking details from the API.
        if (!resolvedDetails?.bookingDate && !resolvedDetails?.lawnName) {
          const bookingId = rawInvoiceData.voucher?.booking_id || rawInvoiceData.voucher?.id;
          if (bookingId) {
            try {
              const res = await voucherAPI.getVoucherByType('LAWN', bookingId);
              const fetched = res?.data?.Data || res?.data || {};
              resolvedDetails = {
                lawnName: fetched.lawn?.name || fetched.lawnName || fetched.booking?.lawnName,
                bookingDate: fetched.booking?.bookingDate || fetched.bookingDate || fetched.eventDate,
                eventTime: fetched.booking?.timeSlot || fetched.timeSlot || fetched.booking?.eventTime || fetched.eventTime,
                numberOfGuests: fetched.booking?.numberOfGuests || fetched.numberOfGuests,
                selectedDates: fetched.booking?.selectedDates || fetched.selectedDates || [],
                dateConfigurations: fetched.booking?.dateConfigurations || fetched.dateConfigurations || {},
                guestName: fetched.booking?.guestName || fetched.guestName,
                guestContact: fetched.booking?.guestContact || fetched.guestContact,
              };
            } catch (err) {
              console.warn('⚠️ Could not fetch lawn booking details:', err);
            }
          }
        }

        const mappedDetails = {
          invoiceNo: rawInvoiceData.voucher?.id || 'N/A',
          invoiceNumber: rawInvoiceData.voucher?.id,
          consumerNumber: rawInvoiceData.voucher?.consumer_number,
          amount: rawInvoiceData.voucher?.amount,
          totalPrice: rawInvoiceData.voucher?.amount,
          dueDate: rawInvoiceData.due_date,
          status: rawInvoiceData.voucher?.status || 'PENDING',
          membershipNo: rawInvoiceData.membership?.no,
          memberName: rawInvoiceData.membership?.name,
          // Lawn specific
          lawnName: venue?.description || resolvedDetails?.lawnName,
          bookingDate: resolvedDetails?.bookingDate,
          eventTime: resolvedDetails?.eventTime,
          numberOfGuests: resolvedDetails?.numberOfGuests,
          isGuest: isGuest,
          selectedDates: resolvedDetails?.selectedDates || [],
          dateConfigurations: resolvedDetails?.dateConfigurations || {},
          guestName: guestDetails?.guestName || resolvedDetails?.guestName,
          guestContact: guestDetails?.guestContact || resolvedDetails?.guestContact,
        };
        setInvoiceData(mappedDetails);
        setLoading(false);
      } else {
        Alert.alert('Error', 'Invoice data not found');
        navigation.goBack();
      }
    };

    loadInvoiceData();
  }, [rawInvoiceData]);

  // Real-time payment sync - Separate useEffect with proper cleanup
  useEffect(() => {
    const voucherId = rawInvoiceData?.voucher?.id;
    if (!voucherId) return;

    const unsubscribe = socketService.subscribeToPayment(voucherId, (data) => {
      if (data.status === 'PAID') {
        console.log('💰 [Lawn Invoice] Real-time payment detected!');
        setInvoiceData(prev => prev ? { ...prev, status: 'PAID' } : null);
      }
    });

    return () => {
      console.log('🧹 [Lawn Invoice] Cleaning up socket subscription');
      unsubscribe();
    };
  }, [rawInvoiceData?.voucher?.id]);

  // Countdown Timer Logic
  useEffect(() => {
    if (!invoiceData?.dueDate || invoiceData?.status === 'PAID') {
      setTimeLeft('');
      return;
    }

    const targetDate = new Date(invoiceData.dueDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('EXPIRED');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeStr = '';
      if (hours > 0) timeStr += `${hours}h `;
      timeStr += `${minutes}m ${seconds}s`;

      setTimeLeft(timeStr);
    }, 1000);

    return () => clearInterval(interval);
  }, [invoiceData?.dueDate, invoiceData?.status]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleMakePayment = () => {
    Alert.alert(
      'Complete Payment',
      'Redirect to payment gateway to complete your booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Payment',
          onPress: () => {
            clearVoucher();
            Alert.alert(
              'Payment Gateway',
              'Payment integration would happen here. For now, please check your bookings list after payment completion.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleShareInvoice = async () => {
    try {
      setShareLoading(true);
      if (!invoiceData) return;

      const bookingDetailsText = (invoiceData.selectedDates && invoiceData.selectedDates.length > 0)
        ? invoiceData.selectedDates.map(date =>
          `• ${formatDate(date)}: ${formatTimeSlot(invoiceData.dateConfigurations[date]?.timeSlot || invoiceData.eventTime).split(' ')[0]} (${invoiceData.dateConfigurations[date]?.eventType || 'Event'})`
        ).join('\n')
        : `• Date: ${formatDate(invoiceData.bookingDate)}
• Time Slot: ${formatTimeSlot(invoiceData.eventTime)}`;

      const message = `
🏞️ LAWN BOOKING INVOICE

Invoice Number: ${invoiceData.invoiceNo}
Consumer Number: ${invoiceData.consumerNumber || 'N/A'}
Amount: Rs. ${invoiceData.amount}
Status: ${invoiceData.status}

📋 Booking Details:
• Lawn: ${invoiceData.lawnName}
${bookingDetailsText}
• Guests: ${invoiceData.numberOfGuests}

👤 ${invoiceData.isGuest ? 'Guest' : 'Member'} Information:
• Name: ${invoiceData.isGuest ? invoiceData.guestName : invoiceData.memberName}
• ${invoiceData.isGuest ? 'Contact No' : 'Membership No'}: ${invoiceData.isGuest ? invoiceData.guestContact : invoiceData.membershipNo}

${invoiceData.dueDate ? `📅 Payment Due: ${formatDateTime(invoiceData.dueDate)}\n` : ''}

Thank you for choosing our lawn services!
`.trim();

      await Share.share({
        message,
        title: `Lawn Invoice - ${invoiceData.invoiceNo}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share invoice');
    } finally {
      setShareLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    try {
      setSaveLoading(true);

      const hasPermission = await permissionService.requestPhotoLibraryPermission();
      if (!hasPermission) {
        permissionService.handlePermissionDenied();
        return;
      }

      if (invoiceRef.current) {
        const uri = await captureRef(invoiceRef, {
          format: 'png',
          quality: 1.0,
        });

        await CameraRoll.save(uri, { type: 'photo' });
        Alert.alert('Success', 'Invoice saved to gallery successfully!');
      } else {
        Alert.alert('Error', 'Capture reference not found');
      }

    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert('Error', 'Failed to save invoice. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return 'N/A';
    const slotMap = {
      'DAY': 'Day (8:00 AM - 4:00 PM)',
      'NIGHT': 'Night (4:00 PM - 12:00 AM)',
      'MORNING': 'Morning (8:00 AM - 2:00 PM)',
      'EVENING': 'Evening (2:00 PM - 8:00 PM)',
      'NIGHT_OLD': 'Night (8:00 PM - 12:00 AM)' // Kept for legacy if needed, but the user wants DAY/NIGHT
    };
    return slotMap[timeSlot] || timeSlot;
  };

  const getStatusBadge = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'CONFIRMED':
      case 'PAID':
        return { text: 'CONFIRMED', style: styles.statusConfirmed, icon: 'check-circle' };
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return { text: 'PAYMENT PENDING', style: styles.statusPending, icon: 'payment' };
      default:
        return { text: status || 'PENDING', style: styles.statusPending, icon: 'schedule' };
    }
  };

  const statusInfo = getStatusBadge(invoiceData?.status);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fffaf2" barStyle="dark-content" />
        <ImageBackground
          source={require("../../assets/notch.jpg")}
          style={styles.notch}
          imageStyle={styles.notchImage}
        >
          <View style={styles.notchRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
              <MaterialIcons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.notchTitle}>Lawn Invoice</Text>
            <View style={styles.iconWrapper} />
          </View>
        </ImageBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b48a64" />
          <Text style={styles.loadingText}>Generating your invoice...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fffaf2" barStyle="dark-content" />

      <ImageBackground
        source={require("../../assets/notch.jpg")}
        style={styles.notch}
        imageStyle={styles.notchImage}
      >
        <View style={styles.notchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <MaterialIcons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.notchTitle}>Lawn Invoice</Text>

          <View style={styles.iconWrapper} />
        </View>
      </ImageBackground>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#b48a64']}
          />
        }
      >
        <ViewShot ref={invoiceRef} options={{ format: 'png', quality: 1.0 }} style={{ backgroundColor: '#f9f3eb' }}>
          <View style={styles.invoiceContainer}>
            {/* Invoice Header */}
            <View style={styles.invoiceHeader}>
              <MaterialIcons
                name={statusInfo.icon}
                size={40}
                color="#b48a64"
              />
              <Text style={styles.invoiceTitle}>
                LAWN BOOKING VOUCHER
              </Text>
              <Text style={styles.invoiceSubtitle}>
                Complete payment to confirm your booking
              </Text>
              {timeLeft && timeLeft !== 'EXPIRED' && invoiceData?.status !== 'PAID' && (
                <View style={styles.timerContainer}>
                  <MaterialIcons name="schedule" size={16} color="#dc3545" />
                  <Text style={styles.timerText}> Expires in: {timeLeft}</Text>
                </View>
              )}
              {timeLeft === 'EXPIRED' && (
                <View style={styles.timerContainer}>
                  <MaterialIcons name="warning" size={16} color="#dc3545" />
                  <Text style={styles.expiredText}>EXPIRED</Text>
                </View>
              )}
            </View>

            {/* Payment Required Alert */}
            {/* {invoiceData?.status !== 'PAID' && (
            <View style={styles.paymentAlert}>
              <MaterialIcons name="payment" size={20} color="#856404" />
              <View style={styles.paymentAlertContent}>
                <Text style={styles.paymentAlertTitle}>Payment Required</Text>
                <Text style={styles.paymentAlertText}>
                  Complete payment within 1 hour to secure your booking.
                </Text>
                <TouchableOpacity
                  style={[styles.paymentButton, timeLeft === 'EXPIRED' && { backgroundColor: '#ccc' }]}
                  onPress={handleMakePayment}
                  disabled={timeLeft === 'EXPIRED'}
                >
                  <Text style={styles.paymentButtonText}>Make Payment Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )} */}

            {/* Invoice Details */}
            <View style={styles.invoiceSection}>
              <Text style={styles.sectionTitle}>Invoice Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice Number:</Text>
                <Text style={[styles.detailValue, styles.invoiceHighlight]}>
                  {invoiceData.invoiceNo}
                </Text>
              </View>

              {invoiceData.consumerNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Consumer Number:</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(invoiceData.consumerNumber);
                      Alert.alert('Copied', 'Consumer number copied to clipboard');
                    }}
                    style={styles.copyContainer}
                  >
                    <Text style={[styles.detailValue, styles.invoiceHighlight]}>
                      {invoiceData.consumerNumber}
                    </Text>
                    <MaterialIcons name="content-copy" size={16} color="#b48a64" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, statusInfo.style]}>
                  <Text style={styles.statusText}>{statusInfo.text}</Text>
                </View>
              </View>

              {invoiceData.dueDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Due:</Text>
                  <Text style={[styles.detailValue, styles.dueDate]}>
                    {formatDateTime(invoiceData.dueDate)}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{invoiceData.isGuest ? 'Guest Name:' : 'Member Name:'}</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.isGuest ? invoiceData.guestName : invoiceData.memberName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{invoiceData.isGuest ? 'Contact No:' : 'Membership No:'}</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.isGuest ? invoiceData.guestContact : invoiceData.membershipNo}
                </Text>
              </View>
            </View>

            {/* Lawn Booking Summary */}
            <View style={styles.invoiceSection}>
              <Text style={styles.sectionTitle}>Lawn Booking Summary</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lawn Name:</Text>
                <Text style={styles.detailValue}>{invoiceData.lawnName}</Text>
              </View>

              {invoiceData.selectedDates && invoiceData.selectedDates.length > 0 ? (
                <View style={styles.multiDateContainer}>
                  <Text style={styles.multiDateHeader}>Dates & Configurations:</Text>
                  {invoiceData.selectedDates.map((date, index) => (
                    <View key={index} style={styles.dateConfigItem}>
                      <View style={styles.itemRow}>
                        <View style={styles.dateCol}>
                          <MaterialIcons name="event" size={16} color="#b48a64" />
                          <Text style={styles.dateText}>{formatDate(date)}</Text>
                        </View>
                        <View style={styles.configCol}>
                          <View style={styles.configChip}>
                            <Text style={styles.configText}>
                              {formatTimeSlot(invoiceData.dateConfigurations[date]?.timeSlot || invoiceData.eventTime).split(' ')[0]}
                            </Text>
                          </View>
                          <View style={styles.configChip}>
                            <Text style={styles.configText}>
                              {invoiceData.dateConfigurations[date]?.eventType || 'Event'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Booking Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(invoiceData.bookingDate)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time Slot:</Text>
                    <Text style={styles.detailValue}>{formatTimeSlot(invoiceData.eventTime)}</Text>
                  </View>
                </>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Guests:</Text>
                <Text style={styles.detailValue}>{invoiceData.numberOfGuests} people</Text>
              </View>

              {invoiceData?.status !== 'PAID' && (
                <TouchableOpacity
                  style={styles.cardFooterAction}
                  onPress={handleCancelBooking}
                >
                  <Text style={styles.cardFooterActionText}>Cancel This Booking</Text>
                  <MaterialIcons name="chevron-right" size={18} color="#dc3545" />
                </TouchableOpacity>
              )}
            </View>

            {/* Payment Details */}
            <View style={styles.invoiceSection}>
              <Text style={styles.sectionTitle}>Payment Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Amount:</Text>
                <Text style={[styles.detailValue, styles.amount]}>
                  Rs. {invoiceData.amount ? parseFloat(invoiceData.amount).toLocaleString() : '0.00'}/-
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status:</Text>
                <View style={[styles.statusBadge, invoiceData.status === 'PAID' ? styles.statusConfirmed : styles.pendingBadge]}>
                  <Text style={styles.statusText}>{invoiceData.status}</Text>
                </View>
              </View>
            </View>

            {/* Important Information */}
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>Important Information</Text>
              <View style={styles.instructionItem}>
                <MaterialIcons name="check-circle" size={16} color="#b48a64" />
                <Text style={styles.instructionText}>Complete payment within 1 hour to secure your booking</Text>
              </View>
              <View style={styles.instructionItem}>
                <MaterialIcons name="check-circle" size={16} color="#b48a64" />
                <Text style={styles.instructionText}>Present this voucher at the club office for verification</Text>
              </View>
            </View>

          </View>
        </ViewShot>

        <View style={{ paddingHorizontal: 15, paddingBottom: 20 }}>
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <MaterialIcons name="refresh" size={20} color="#b48a64" />
              <Text style={styles.secondaryButtonText}>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareInvoice}
              disabled={shareLoading}
            >
              <MaterialIcons name="share" size={20} color="#fff" />
              <Text style={styles.shareButtonText}>
                {shareLoading ? 'Sharing...' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Download Invoice Button */}
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleSaveToGallery}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="file-download" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}>Download Invoice</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Complete Payment Button */}
          {/* {invoiceData?.status !== 'PAID' && (
            <TouchableOpacity
              style={[styles.paymentActionButton, timeLeft === 'EXPIRED' && { backgroundColor: '#ccc' }]}
              onPress={handleMakePayment}
              disabled={timeLeft === 'EXPIRED'}
            >
              <MaterialIcons name="payment" size={20} color="#fff" />
              <Text style={styles.paymentActionButtonText}>Complete Payment Now</Text>
            </TouchableOpacity>
          )} */}

          {/* <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialIcons name="home" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3eb' },
  notch: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    overflow: "hidden",
    minHeight: 120,
  },
  notchImage: {
    resizeMode: "cover",
  },
  notchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notchTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  content: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  invoiceContainer: {
    padding: 15,
  },
  invoiceHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  invoiceSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  paymentAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  paymentAlertContent: {
    flex: 1,
    marginLeft: 10,
  },
  paymentAlertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  paymentAlertText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 18,
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: '#b48a64',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  paymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  invoiceSection: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  dueDate: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#e8f5e8',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  invoiceHighlight: {
    color: '#b48a64',
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff1f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffa39e',
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  instructions: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardFooterActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
    marginRight: 4,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#1565c0',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b48a64',
    backgroundColor: 'transparent',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#b48a64',
    fontWeight: '600',
    fontSize: 14,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bdaea1ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
  },
  paymentActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#b48a64',
    gap: 8,
    marginBottom: 30,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  multiDateContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  multiDateHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dateConfigItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
  },
  configCol: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 6,
  },
  configChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  configText: {
    fontSize: 11,
    color: '#4A5568',
    textTransform: 'capitalize',
  },
});

export default Voucher;