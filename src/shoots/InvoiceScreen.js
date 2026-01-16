import React, { useState } from 'react';
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
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { paymentAPI } from '../config/apis';

const InvoiceScreen = ({ route, navigation }) => {
  const { invoiceData, bookingData, photoshoot, memberInfo } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      let timePart = timeString;
      if (timeString instanceof Date) {
        const hour = timeString.getHours();
        const minutes = timeString.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }

      if (typeof timeString === 'string') {
        timePart = timeString.includes('T')
          ? timeString.split('T')[1].slice(0, 5)
          : timeString.slice(0, 5);

        const [hours, minutes] = timePart.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const handleShareInvoice = async () => {
    try {
      const slotsText = bookingData?.selectedDates
        ? bookingData.selectedDates.map(date =>
          `• ${formatDate(date)} at ${formatTime(bookingData.dateConfigurations?.[date]?.time)}`
        ).join('\n')
        : `• Date: ${formatDate(bookingData?.bookingDate)}\n• Time: ${formatTime(bookingData?.timeSlot)}`;

      const message = `
📸 Photoshoot Booking Invoice

Invoice Number: ${invoiceData.InvoiceNumber}
Amount: Rs. ${invoiceData.Amount}
Due Date: ${formatDate(invoiceData.DueDate)}

📋 Booking Details:
• Package: ${photoshoot?.description || 'Photoshoot Package'}
${slotsText}
• Type: ${bookingData?.pricingType === 'member' ? 'Member' : 'Guest'}
• Total: Rs. ${invoiceData.Amount}

💳 Payment Channels:
${invoiceData.PaymentChannels?.map(channel => `• ${channel}`).join('\n') || '• Not specified'}

📝 Instructions:
${invoiceData.Instructions || 'Please complete your payment to confirm the booking.'}

Thank you for choosing our service!
      `.trim();

      await Share.share({
        message,
        title: `Invoice - ${invoiceData.InvoiceNumber}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share invoice');
    }
  };

  const handleMakePayment = () => {
    Alert.alert(
      'Payment Instructions',
      `Complete your payment using any of these methods:\n\n${invoiceData.PaymentChannels?.join('\n') || 'Contact club office for payment details'}\n\nAfter payment, save your transaction ID and click "I Have Paid".\n\nAmount: Rs. ${invoiceData.Amount}\nInvoice: ${invoiceData.InvoiceNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Have Paid',
          onPress: () => promptForTransactionId(),
        },
      ]
    );
  };

  const promptForTransactionId = () => {
    Alert.prompt(
      'Transaction ID',
      'Please enter your payment transaction ID:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: (transactionId) => verifyPayment(transactionId),
        },
      ],
      'plain-text'
    );
  };

  const verifyPayment = async (transactionId) => {
    if (!transactionId || transactionId.trim() === '') {
      Alert.alert('Error', 'Please enter a valid transaction ID');
      return;
    }

    setLoading(true);
    try {
      const result = await paymentAPI.verifyPayment(
        invoiceData.InvoiceNumber,
        transactionId
      );

      setLoading(false);

      if (result.success || result.verified) {
        setPaymentStatus('paid');
        Alert.alert(
          'Payment Verified!',
          'Your payment has been successfully verified. Your booking is now confirmed.',
          [
            {
              text: 'View Booking',
              onPress: () => navigation.navigate('BookingConfirmation', {
                invoiceData: invoiceData,
                bookingData: bookingData,
                photoshoot: photoshoot,
                memberInfo: memberInfo,
                paymentStatus: 'PAID',
                transactionId: transactionId,
              }),
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Verification',
          result.message || 'We are verifying your payment. Please check your bookings list in a few minutes.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Payment verification error:', error);
      Alert.alert(
        'Payment Verification',
        'We are verifying your payment. Please check your bookings list in a few minutes.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }
  };

  if (!invoiceData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="exclamationcircleo" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>Invoice data not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Notch Header */}
      <ImageBackground
        source={require('../../assets/notch.jpg')}
        style={styles.notch}
        imageStyle={styles.notchImage}
      >
        <View style={styles.notchRow}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrowleft" size={30} color="#000" />
          </TouchableOpacity>

          <Text style={styles.notchTitle}>Booking Invoice</Text>

          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={handleShareInvoice}
            disabled={loading}
          >
            <Icon name="sharealt" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>PHOTOSHOOT BOOKING INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{invoiceData.InvoiceNumber}</Text>
          <Text style={styles.invoiceStatus}>
            Status: <Text style={paymentStatus === 'paid' ? styles.statusPaid : styles.statusPending}>
              {paymentStatus === 'paid' ? 'PAID' : 'PENDING PAYMENT'}
            </Text>
          </Text>
        </View>

        {/* Payment Required Alert */}
        {paymentStatus !== 'paid' && (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Icon name="clockcircle" size={20} color="#856404" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Payment Required</Text>
              <Text style={styles.alertText}>
                Complete payment within 3 minutes to confirm your booking
              </Text>
              <Text style={styles.dueDate}>
                Due by: {formatDate(invoiceData.DueDate)}
              </Text>
            </View>
          </View>
        )}

        {/* Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount Due</Text>
          <Text style={styles.amountValue}>Rs. {invoiceData.Amount}</Text>
        </View>

        {/* Member Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Member Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Membership No:</Text>
            <Text style={styles.detailValue}>{memberInfo?.membership_no || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{memberInfo?.member_name || memberInfo?.Name || 'N/A'}</Text>
          </View>
        </View>

        {/* Booking Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Package:</Text>
            <Text style={styles.detailValue}>
              {invoiceData.BookingSummary?.ServiceName || photoshoot?.description || 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking Type:</Text>
            <Text style={styles.detailValue}>
              {bookingData?.pricingType === 'member' ? 'Member Booking' : 'Guest Booking'}
            </Text>
          </View>

          <View style={styles.divider} />
          <Text style={[styles.detailLabel, { marginBottom: 10, fontWeight: 'bold' }]}>Selected Slots:</Text>

          {bookingData?.selectedDates ? (
            bookingData.selectedDates.map(date => (
              <View key={date} style={styles.slotRow}>
                <View style={styles.slotDateBox}>
                  <Text style={styles.detailLabelSmall}>{formatDate(date)}</Text>
                </View>
                <View style={styles.slotTimeBox}>
                  <Text style={styles.detailValueSmall}>{formatTime(bookingData.dateConfigurations?.[date]?.time)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.slotRow}>
              <Text style={styles.detailLabelSmall}>{formatDate(bookingData?.bookingDate)}</Text>
              <Text style={styles.detailValueSmall}>{formatTime(bookingData?.timeSlot)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Price:</Text>
            <Text style={styles.detailValue}>Rs. {invoiceData.BookingSummary?.BasePrice || invoiceData.Amount}</Text>
          </View>

          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>Rs. {invoiceData.Amount}</Text>
          </View>
        </View>

        {/* Payment Channels */}
        {invoiceData.PaymentChannels && invoiceData.PaymentChannels.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Available Payment Methods</Text>
            <View style={styles.channelsGrid}>
              {invoiceData.PaymentChannels.map((channel, index) => (
                <View key={index} style={styles.channelItem}>
                  <Icon name="creditcard" size={16} color="#A3834C" />
                  <Text style={styles.channelText}>{channel}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Important Instructions</Text>
          <Text style={styles.instructionsText}>
            {invoiceData.Instructions || 'Please complete your payment to confirm the booking.'}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need Assistance?</Text>
          <View style={styles.contactItem}>
            <Icon name="phone" size={14} color="#666" />
            <Text style={styles.contactText}>Club Office: 091-1234567</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {paymentStatus !== 'paid' && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleMakePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="creditcard" size={20} color="#fff" />
                <Text style={styles.paymentButtonText}>Make Payment</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Back to Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9EFE6',
  },
  notch: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    backgroundColor: "#A3834C",
  },
  notchImage: {
    resizeMode: "cover",
  },
  notchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  invoiceHeader: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  invoiceStatus: {
    fontSize: 12,
    color: '#666',
  },
  statusPending: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  statusPaid: {
    color: '#2E8B57',
    fontWeight: 'bold',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertIcon: {
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  alertText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  dueDate: {
    fontSize: 12,
    color: '#856404',
    marginTop: 5,
    fontStyle: 'italic',
  },
  amountCard: {
    backgroundColor: '#A3834C',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  slotDateBox: {
    flex: 1.5,
  },
  slotTimeBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  detailLabelSmall: {
    fontSize: 13,
    color: '#777',
  },
  detailValueSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A3834C',
  },
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F3EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBC9A5',
    marginBottom: 4,
  },
  channelText: {
    fontSize: 12,
    color: '#A3834C',
    marginLeft: 5,
    fontWeight: '500',
  },
  instructionsCard: {
    backgroundColor: '#E7F3FF',
    borderWidth: 1,
    borderColor: '#B3D7FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D6EFD',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 13,
    color: '#0D6EFD',
    lineHeight: 18,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
  },
  paymentButton: {
    backgroundColor: '#A3834C',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginVertical: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#A3834C',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoiceScreen;