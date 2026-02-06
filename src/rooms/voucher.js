
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   StatusBar,
//   Share,
//   RefreshControl,
//   ImageBackground
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { bookingService } from '../../services/bookingService';
// import { useAuth } from '../auth/contexts/AuthContext';
// import { useVoucher } from '../auth/contexts/VoucherContext';
// import socketService from '../../services/socket.service';

// export default function voucher({ navigation, route }) {
//   const { clearVoucher } = useVoucher();
//   const { user } = useAuth();
//   const {
//     bookingId,
//     numericBookingId,
//     bookingData,
//     roomType,
//     selectedRoom,
//     bookingResponse,
//     voucherData, // Added for new payload
//     dueDate: initialDueDate, // Allow initial due date from params
//     isGuest,
//     memberDetails
//   } = route.params || {};

//   const [invoiceData, setInvoiceData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [timeLeft, setTimeLeft] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const [shareLoading, setShareLoading] = useState(false);

//   useEffect(() => {
//     if (voucherData) {
//       console.log('🔄 Using passed voucherData for Room Booking');
//       const details = {
//         invoiceNo: voucherData.voucher?.voucher_no || bookingId,
//         invoiceNumber: voucherData.voucher?.voucher_no,
//         bookingId: voucherData.voucher?.booking_id || bookingId,
//         status: voucherData.voucher?.status || 'PENDING',
//         issued_at: voucherData.issue_date || voucherData.voucher?.issued_at || new Date().toISOString(),
//         issued_by: voucherData.voucher?.issued_by || 'System',
//         dueDate: voucherData.due_date || voucherData.voucher?.expiresAt || initialDueDate,
//         amount: voucherData.voucher?.amount || bookingData?.totalPrice,
//         totalPrice: voucherData.voucher?.amount || bookingData?.totalPrice,
//         paymentMode: voucherData.voucher?.payment_mode || 'PENDING',
//         remarks: voucherData.voucher?.remarks,
//         consumerNumber: voucherData.voucher?.consumer_number,
//         membershipNo: voucherData.membership?.no,
//         memberName: voucherData.membership?.name,
//         // Room information
//         roomType: roomType?.name,
//         roomNumber: selectedRoom?.roomNumber,
//         // Booking dates
//         checkIn: bookingData?.checkIn,
//         checkOut: bookingData?.checkOut,
//         numberOfAdults: bookingData?.numberOfAdults || 1,
//         numberOfChildren: bookingData?.numberOfChildren || 0,
//         numberOfRooms: bookingData?.numberOfRooms || 1,
//       };
//       setInvoiceData(details);
//       setLoading(false);
//     } else if (bookingId) {
//       fetchInvoice();
//     } else {
//       Alert.alert('Error', 'No booking ID provided');
//       navigation.goBack();
//     }

//     // Real-time payment sync for THIS specific screen
//     const voucherId = voucherData?.voucher?.id || bookingId;
//     let unsubscribe = () => { };

//     if (voucherId) {
//       unsubscribe = socketService.subscribeToPayment(voucherId, (data) => {
//         if (data.status === 'PAID') {
//           console.log('💰 [Room Voucher] Real-time payment detected!');
//           setInvoiceData(prev => prev ? { ...prev, status: 'PAID' } : null);
//         }
//       });
//     }

//     return () => unsubscribe();
//   }, [bookingId, voucherData]);

//   // Countdown Timer Logic
//   useEffect(() => {
//     if (!invoiceData?.dueDate || invoiceData?.status === 'PAID') return;

//     const targetDate = new Date(invoiceData.dueDate).getTime();

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance < 0) {
//         clearInterval(interval);
//         setTimeLeft('EXPIRED');
//         return;
//       }

//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       let timeStr = '';
//       if (hours > 0) timeStr += `${hours}h `;
//       timeStr += `${minutes}m ${seconds}s`;

//       setTimeLeft(timeStr);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [invoiceData?.dueDate, invoiceData?.status]);

//   const transformBookingResponseToInvoice = (bookingResponse) => {
//     // Extract from Data object (invoice response)
//     if (bookingResponse.Data) {
//       return {
//         invoice_no: bookingResponse.Data.InvoiceNumber,
//         invoiceNumber: bookingResponse.Data.InvoiceNumber,
//         bookingId: bookingResponse.BookingId || bookingId,
//         status: bookingResponse.Status || 'PENDING_PAYMENT',
//         amount: bookingResponse.Data.Amount,
//         totalPrice: bookingResponse.Data.Amount,
//         dueDate: bookingResponse.Data.DueDate,
//         instructions: bookingResponse.Data.Instructions,
//         bookingSummary: bookingResponse.Data.BookingSummary,
//         paymentChannels: bookingResponse.Data.PaymentChannels,
//         isInvoice: true
//       };
//     }

//     // Extract from direct invoice response
//     if (bookingResponse.invoiceNumber || bookingResponse.invoice_no) {
//       return bookingResponse;
//     }

//     // Extract from bookings array if available
//     if (bookingResponse.bookings && Array.isArray(bookingResponse.bookings) && bookingResponse.bookings.length > 0) {
//       const booking = bookingResponse.bookings[0];
//       return {
//         invoice_no: booking.invoiceNumber || `INV-${booking.id}`,
//         invoiceNumber: booking.invoiceNumber || `INV-${booking.id}`,
//         bookingId: booking.id,
//         status: booking.status || 'PENDING_PAYMENT',
//         amount: booking.totalPrice,
//         payment_mode: 'PENDING',
//         issued_at: new Date().toISOString(),
//         isInvoice: true
//       };
//     }

//     return null;
//   };

//   const transformInvoiceData = (invoiceResponse) => {
//     const invoice = Array.isArray(invoiceResponse) ? invoiceResponse[0] : invoiceResponse;

//     return {
//       // Invoice identification
//       invoiceNo: invoice.invoice_no || invoice.invoiceNumber || invoice.InvoiceNumber || `INV-${bookingId}`,
//       bookingId: invoice.bookingId || bookingId,

//       // Status and dates
//       status: invoice.status || 'PENDING_PAYMENT',
//       issued_at: invoice.issued_at || new Date().toISOString(),
//       issued_by: invoice.issued_by || 'System',

//       // Due date and instructions
//       dueDate: invoice.dueDate,
//       instructions: invoice.instructions,
//       paymentChannels: invoice.paymentChannels,
//       bookingSummary: invoice.bookingSummary,

//       // Room information
//       roomType: roomType?.name,
//       roomNumber: selectedRoom?.roomNumber,

//       // Booking dates
//       checkIn: bookingData?.checkIn,
//       checkOut: bookingData?.checkOut,
//       numberOfAdults: bookingData?.numberOfAdults || 1,
//       numberOfChildren: bookingData?.numberOfChildren || 0,
//       numberOfRooms: bookingData?.numberOfRooms || 1,

//       // Payment information
//       totalPrice: bookingData?.totalPrice || invoice.amount || invoice.totalPrice,
//       paymentMode: invoice.payment_mode || invoice.paymentMode || 'PENDING',
//       paymentStatus: invoice.payment_status || 'PENDING',

//       // Additional fields
//       transaction_id: invoice.transaction_id,
//       remarks: invoice.remarks,
//       note: invoice.note || 'Complete payment to confirm your booking'
//     };
//   };

//   const createTemporaryInvoice = () => {
//     console.log('🔄 Creating temporary invoice as fallback');
//     const tempInvoice = bookingService.createLocalInvoice(
//       bookingId,
//       bookingData,
//       roomType,
//       selectedRoom,
//       bookingResponse?.Data?.InvoiceNumber
//     );

//     setInvoiceData(tempInvoice);
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchInvoice();
//   };

//   const handleMakePayment = () => {
//     Alert.alert(
//       'Complete Payment',
//       'Redirect to payment gateway to complete your booking?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Proceed to Payment',
//           onPress: () => {
//             // Clear global voucher on payment initiation
//             clearVoucher();

//             // Here you would integrate with your payment gateway
//             Alert.alert(
//               'Payment Gateway',
//               'Payment integration would happen here. For now, please check your bookings list after payment completion.',
//               [{ text: 'OK' }]
//             );
//           }
//         }
//       ]
//     );
//   };

//   const handleShareInvoice = async () => {
//     try {
//       setShareLoading(true);

//       if (!invoiceData) {
//         Alert.alert('Error', 'No invoice data to share');
//         return;
//       }

//       const shareMessage = `
// 🏨 BOOKING INVOICE

// 📋 Invoice Number: ${invoiceData.invoiceNo}
// 🔢 Booking ID: ${invoiceData.bookingId}
// 🔄 Status: ${invoiceData.status}

// 🏠 Room Information:
//    • Room Type: ${invoiceData.roomType}
//    ${invoiceData.roomNumber ? `   • Room Number: ${invoiceData.roomNumber}` : ''}
//    • Check-in: ${formatDate(invoiceData.checkIn)}
//    • Check-out: ${formatDate(invoiceData.checkOut)}
//    • Guests: ${invoiceData.numberOfAdults} Adults, ${invoiceData.numberOfChildren} Children
//    ${invoiceData.numberOfRooms ? `   • Rooms: ${invoiceData.numberOfRooms}` : ''}

// 💳 Payment Details:
//    • Total Amount: $${parseFloat(invoiceData.totalPrice || 0).toFixed(2)}
//    • Payment Status: ${invoiceData.paymentStatus}
//    • Payment Required: YES

// ${invoiceData.dueDate ? `📅 Payment Due: ${formatDateTime(invoiceData.dueDate)}\n` : ''}
// ${invoiceData.instructions ? `💡 Instructions: ${invoiceData.instructions}\n` : ''}
// 📝 Important Information:
//    • Complete payment to confirm your booking
//    • Check-in: 2:00 PM
//    • Check-out: 12:00 PM
//    • Government ID required at check-in

// Thank you for your booking!
//       `.trim();

//       await Share.share({
//         message: shareMessage,
//         title: `Invoice - ${invoiceData.invoiceNo}`
//       });
//     } catch (error) {
//       console.error('Error sharing invoice:', error);
//       Alert.alert('Error', 'Failed to share invoice');
//     } finally {
//       setShareLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusUpper = (status || '').toUpperCase();
//     switch (statusUpper) {
//       case 'CONFIRMED':
//       case 'PAID':
//         return { text: 'CONFIRMED', style: styles.statusConfirmed, icon: 'check-circle' };
//       case 'PENDING_PAYMENT':
//         return { text: 'PAYMENT PENDING', style: styles.statusPending, icon: 'payment' };
//       case 'PROCESSING':
//         return { text: 'PROCESSING', style: styles.statusProcessing, icon: 'schedule' };
//       case 'CANCELLED':
//         return { text: 'CANCELLED', style: styles.statusCancelled, icon: 'cancel' };
//       default:
//         return { text: status || 'PENDING', style: styles.statusPending, icon: 'schedule' };
//     }
//   };

//   const statusInfo = getStatusBadge(invoiceData?.status);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <StatusBar backgroundColor="#fffaf2" barStyle="dark-content" />
//         <ImageBackground
//           source={require("../../assets/notch.jpg")}
//           style={styles.notch}
//           imageStyle={styles.notchImage}
//         >
//           <View style={styles.notchRow}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
//               <Icon name="arrow-back" size={28} color="#000" />
//             </TouchableOpacity>

//             <Text style={styles.notchTitle}>Booking Invoice</Text>

//             <View style={styles.iconWrapper} />
//           </View>
//         </ImageBackground>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#b48a64" />
//           <Text style={styles.loadingText}>Generating your invoice...</Text>
//           <Text style={styles.loadingSubtext}>
//             This will be ready immediately
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#fffaf2" barStyle="dark-content" />

//       {/* Replaced Header with Notch Image */}
//       <ImageBackground
//         source={require("../../assets/notch.jpg")}
//         style={styles.notch}
//         imageStyle={styles.notchImage}
//       >
//         <View style={styles.notchRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
//             <Icon name="arrow-back" size={28} color="#000" />
//           </TouchableOpacity>

//           <Text style={styles.notchTitle}>Booking Invoice</Text>

//           <TouchableOpacity onPress={handleRefresh} disabled={refreshing} style={styles.iconWrapper}>
//             <Icon name="refresh" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>

//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             colors={['#b48a64']}
//           />
//         }
//       >
//         {invoiceData ? (
//           <View style={styles.invoiceContainer}>
//             {/* Invoice Header */}
//             <View style={styles.invoiceHeader}>
//               <Icon
//                 name={statusInfo.icon}
//                 size={40}
//                 color="#b48a64"
//               />
//               <Text style={styles.invoiceTitle}>
//                 ROOM BOOKING VOUCHER
//               </Text>
//               <Text style={styles.invoiceSubtitle}>
//                 Complete payment to confirm your reservation
//               </Text>
//               {timeLeft && timeLeft !== 'EXPIRED' && invoiceData?.status !== 'PAID' && (
//                 <View style={styles.timerContainer}>
//                   <Icon name="schedule" size={16} color="#dc3545" />
//                   <Text style={styles.timerText}> Expires in: {timeLeft}</Text>
//                 </View>
//               )}
//               {timeLeft === 'EXPIRED' && (
//                 <Text style={styles.expiredText}>EXPIRED</Text>
//               )}
//             </View>

//             {/* Payment Required Alert */}
//             <View style={styles.paymentAlert}>
//               <Icon name="payment" size={20} color="#856404" />
//               <View style={styles.paymentAlertContent}>
//                 <Text style={styles.paymentAlertTitle}>Payment Required</Text>
//                 <Text style={styles.paymentAlertText}>
//                   Complete payment to confirm your booking and receive confirmation
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.paymentButton}
//                   onPress={handleMakePayment}
//                 >
//                   <Text style={styles.paymentButtonText}>Make Payment Now</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Invoice Details */}
//             <View style={styles.invoiceSection}>
//               <Text style={styles.sectionTitle}>Invoice Details</Text>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Invoice Number:</Text>
//                 <Text style={[styles.detailValue, styles.invoiceHighlight]}>
//                   {invoiceData.invoiceNo}
//                 </Text>
//               </View>

//               {invoiceData.consumerNumber && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Consumer Number:</Text>
//                   <Text style={[styles.detailValue, styles.invoiceHighlight]}>
//                     {invoiceData.consumerNumber}
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Booking ID:</Text>
//                 <Text style={styles.detailValue}>
//                   {invoiceData.bookingId}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Status:</Text>
//                 <View style={[styles.statusBadge, statusInfo.style]}>
//                   <Text style={styles.statusText}>{statusInfo.text}</Text>
//                 </View>
//               </View>

//               {invoiceData.dueDate && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Payment Due:</Text>
//                   <Text style={[styles.detailValue, styles.dueDate]}>
//                     {formatDateTime(invoiceData.dueDate)}
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Issued At:</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDateTime(invoiceData.issued_at)}
//                 </Text>
//               </View>

//               {invoiceData.issued_by && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Issued By:</Text>
//                   <Text style={styles.detailValue}>
//                     {invoiceData.issued_by}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {/* Room Information */}
//             <View style={styles.invoiceSection}>
//               <Text style={styles.sectionTitle}>Room Information</Text>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Room Type:</Text>
//                 <Text style={styles.detailValue}>
//                   {invoiceData.roomType || 'N/A'}
//                 </Text>
//               </View>

//               {invoiceData.roomNumber && (
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Room Number:</Text>
//                   <Text style={styles.detailValue}>
//                     {invoiceData.roomNumber}
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Check-in:</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDate(invoiceData.checkIn)}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Check-out:</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDate(invoiceData.checkOut)}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Guests:</Text>
//                 <Text style={styles.detailValue}>
//                   {invoiceData.numberOfAdults} Adults, {invoiceData.numberOfChildren} Children
//                   {invoiceData.numberOfRooms > 1 && `, ${invoiceData.numberOfRooms} Rooms`}
//                 </Text>
//               </View>
//             </View>

//             {/* Payment Information */}
//             <View style={styles.invoiceSection}>
//               <Text style={styles.sectionTitle}>Payment Details</Text>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Total Amount:</Text>
//                 <Text style={[styles.detailValue, styles.amount]}>
//                   Rs. {invoiceData.totalPrice ? parseFloat(invoiceData.totalPrice).toFixed(2) : '0.00'}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Payment Status:</Text>
//                 <View style={[styles.statusBadge, styles.pendingBadge]}>
//                   <Text style={styles.statusText}>PENDING</Text>
//                 </View>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Payment Mode:</Text>
//                 <Text style={styles.detailValue}>
//                   {invoiceData.paymentMode}
//                 </Text>
//               </View>
//             </View>

//             {/* Payment Instructions */}
//             {invoiceData.instructions && (
//               <View style={styles.instructionsSection}>
//                 <Text style={styles.instructionsTitle}>Payment Instructions</Text>
//                 <Text style={styles.instructionsText}>{invoiceData.instructions}</Text>
//               </View>
//             )}

//             {/* Payment Channels */}
//             {invoiceData.paymentChannels && (
//               <View style={styles.paymentChannelsSection}>
//                 <Text style={styles.paymentChannelsTitle}>Available Payment Methods</Text>
//                 <View style={styles.paymentChannelsList}>
//                   {invoiceData.paymentChannels.map((channel, index) => (
//                     <View key={index} style={styles.paymentChannelItem}>
//                       <Icon name="payment" size={16} color="#2e7d32" />
//                       <Text style={styles.paymentChannelText}>{channel}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}

//             {/* General Instructions */}
//             <View style={styles.instructions}>
//               <Text style={styles.instructionsTitle}>Important Information</Text>
//               <View style={styles.instructionItem}>
//                 <Icon name="access-time" size={16} color="#2e7d32" />
//                 <Text style={styles.instructionText}>Check-in: 2:00 PM | Check-out: 12:00 PM</Text>
//               </View>
//               <View style={styles.instructionItem}>
//                 <Icon name="credit-card" size={16} color="#2e7d32" />
//                 <Text style={styles.instructionText}>Government ID required at check-in</Text>
//               </View>
//               <View style={styles.instructionItem}>
//                 <Icon name="receipt" size={16} color="#2e7d32" />
//                 <Text style={styles.instructionText}>Present payment confirmation at reception</Text>
//               </View>
//             </View>

//             {/* Action Buttons */}
//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={handleRefresh}
//                 disabled={refreshing}
//               >
//                 <Icon name="refresh" size={20} color="#b48a64" />
//                 <Text style={styles.secondaryButtonText}>
//                   {refreshing ? 'Refreshing...' : 'Refresh Invoice'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.shareButton}
//                 onPress={handleShareInvoice}
//                 disabled={shareLoading}
//               >
//                 <Icon name="share" size={20} color="#fff" />
//                 <Text style={styles.shareButtonText}>
//                   {shareLoading ? 'Sharing...' : 'Share Invoice'}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Make Payment Button */}
//             <TouchableOpacity
//               style={styles.paymentActionButton}
//               onPress={handleMakePayment}
//             >
//               <Icon name="payment" size={20} color="#fff" />
//               <Text style={styles.paymentActionButtonText}>Complete Payment Now</Text>
//             </TouchableOpacity>

//             <View style={styles.actionButtons}>
//               <TouchableOpacity
//                 style={styles.primaryButton}
//                 onPress={() => navigation.navigate('Bookings')}
//               >
//                 <Icon name="list-alt" size={20} color="#fff" />
//                 <Text style={styles.primaryButtonText}>View All Bookings</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.noInvoiceContainer}>
//             <Icon name="receipt" size={60} color="#ccc" />
//             <Text style={styles.noInvoiceTitle}>Invoice Not Available</Text>
//             <Text style={styles.noInvoiceText}>
//               Unable to load invoice at this time.
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={handleRefresh}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9f3eb' },
//   // notch styles
//   notch: {
//     paddingTop: 50,
//     paddingBottom: 25,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     overflow: "hidden",
//     backgroundColor: "#D2B48C",
//   },
//   notchImage: {
//     resizeMode: "cover",
//   },
//   notchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingBottom: 10,
//   },
//   iconWrapper: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notchTitle: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#000",
//   },

//   content: { flex: 1 },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//     fontSize: 16,
//   },
//   loadingSubtext: {
//     marginTop: 5,
//     color: '#888',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   invoiceContainer: {
//     padding: 15,
//   },
//   invoiceHeader: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 15,
//     marginBottom: 20,
//   },
//   invoiceTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   invoiceSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
//   paymentAlert: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#fff3cd',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     borderLeftWidth: 4,
//     borderLeftColor: '#ffc107',
//   },
//   paymentAlertContent: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   paymentAlertTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#856404',
//     marginBottom: 5,
//   },
//   paymentAlertText: {
//     fontSize: 14,
//     color: '#856404',
//     lineHeight: 18,
//     marginBottom: 10,
//   },
//   paymentButton: {
//     backgroundColor: '#b48a64',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//   },
//   paymentButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   invoiceSection: {
//     backgroundColor: '#fff',
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//     flex: 1,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '600',
//     flex: 1,
//     textAlign: 'right',
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//   },
//   dueDate: {
//     color: '#dc3545',
//     fontWeight: 'bold',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusConfirmed: {
//     backgroundColor: '#e8f5e8',
//   },
//   statusPending: {
//     backgroundColor: '#fff3cd',
//   },
//   statusProcessing: {
//     backgroundColor: '#e2e3e5',
//   },
//   statusCancelled: {
//     backgroundColor: '#f8d7da',
//   },
//   invoiceHighlight: {
//     color: '#b48a64',
//     fontWeight: 'bold',
//   },
//   timerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#fff1f0',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#ffa39e',
//   },
//   timerText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#dc3545',
//   },
//   expiredText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#dc3545',
//     marginTop: 10,
//     textTransform: 'uppercase',
//   },
//   pendingBadge: {
//     backgroundColor: '#fff3cd',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//   },
//   instructionsSection: {
//     backgroundColor: '#e7f3ff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 15,
//     borderLeftWidth: 4,
//     borderLeftColor: '#0d6efd',
//   },
//   instructionsTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#0d6efd',
//     marginBottom: 8,
//   },
//   instructionsText: {
//     fontSize: 14,
//     color: '#0d6efd',
//     lineHeight: 20,
//   },
//   paymentChannelsSection: {
//     backgroundColor: '#f0f7ff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 15,
//   },
//   paymentChannelsTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1565c0',
//     marginBottom: 10,
//   },
//   paymentChannelsList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   paymentChannelItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginRight: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//   },
//   paymentChannelText: {
//     fontSize: 12,
//     color: '#1565c0',
//     marginLeft: 6,
//   },
//   instructions: {
//     backgroundColor: '#f0f7ff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 15,
//   },
//   instructionsTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1565c0',
//     marginBottom: 10,
//   },
//   instructionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   instructionText: {
//     fontSize: 12,
//     color: '#1565c0',
//     marginLeft: 8,
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 15,
//   },
//   secondaryButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#b48a64',
//     backgroundColor: 'transparent',
//     gap: 8,
//   },
//   secondaryButtonText: {
//     color: '#b48a64',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   shareButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#2196f3',
//     gap: 8,
//   },
//   shareButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   paymentActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#bdaea1ff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//     gap: 8,
//   },
//   paymentActionButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   primaryButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#b48a64',
//     gap: 8,
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   noInvoiceContainer: {
//     alignItems: 'center',
//     padding: 40,
//     marginTop: 50,
//   },
//   noInvoiceTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#666',
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   noInvoiceText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 5,
//   },
//   retryButton: {
//     backgroundColor: '#b48a64',
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Share,
  RefreshControl,
  ImageBackground,
  Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../auth/contexts/AuthContext';
import { useVoucher } from '../auth/contexts/VoucherContext';
import socketService from '../../services/socket.service';

export default function voucher({ navigation, route }) {
  const { clearVoucher } = useVoucher();
  const { user } = useAuth();
  const {
    bookingId,
    numericBookingId,
    bookingData,
    roomType,
    selectedRoom,
    bookingResponse,
    voucherData, // Added for new payload
    dueDate: initialDueDate, // Allow initial due date from params
    isGuest,
    memberDetails
  } = route.params || {};

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    if (voucherData) {
      console.log('🔄 Using passed voucherData for Room Booking');
      const details = {
        invoiceNo: voucherData.voucher?.voucher_no || bookingId,
        invoiceNumber: voucherData.voucher?.voucher_no,
        bookingId: voucherData.voucher?.booking_id || bookingId,
        status: voucherData.voucher?.status || 'PENDING',
        issued_at: voucherData.issue_date || voucherData.voucher?.issued_at || new Date().toISOString(),
        issued_by: voucherData.voucher?.issued_by || 'System',
        dueDate: voucherData.due_date || voucherData.voucher?.expiresAt || initialDueDate,
        amount: voucherData.voucher?.amount || bookingData?.totalPrice,
        totalPrice: voucherData.voucher?.amount || bookingData?.totalPrice,
        paymentMode: voucherData.voucher?.payment_mode || 'PENDING',
        remarks: voucherData.voucher?.remarks,
        consumerNumber: voucherData.voucher?.consumer_number,
        membershipNo: voucherData.membership?.no,
        memberName: voucherData.membership?.name,
        // Room information
        roomType: roomType?.name || voucherData.Room?.roomType,
        // Priority: Multi-rooms > Voucher Object > Nested Room Object > Regex Extraction > Navigation param
        roomNumber: (() => {
          // Check 1: Multi-rooms
          if (voucherData.rooms?.length > 0) {
            return voucherData.rooms.map(r => r.room?.roomNumber || r.roomNumber).join(', ');
          }

          // Check 2: Direct properties
          const direct = voucherData.voucher?.room_number || voucherData.Room?.roomNumber;
          if (direct) return direct;

          // Check 3: Regex Extraction from remarks
          const remarks = voucherData.voucher?.remarks || '';
          const extracted = remarks.match(/Room(?: booking)?:\s*(\w+)/i)?.[1];
          if (extracted) {
            console.log('📍 [DeepExtract] Found via Regex in voucherData remarks:', extracted);
            return extracted;
          }

          // Check 4: Fallback
          return selectedRoom?.roomNumber;
        })(),
        // Booking dates
        checkIn: bookingData?.checkIn,
        checkOut: bookingData?.checkOut,
        numberOfAdults: bookingData?.numberOfAdults || 1,
        numberOfChildren: bookingData?.numberOfChildren || 0,
        numberOfRooms: bookingData?.numberOfRooms || 1,
      };
      setInvoiceData(details);
      setLoading(false);
    } else if (bookingId) {
      fetchInvoice();
    } else {
      Alert.alert('Error', 'No booking ID provided');
      navigation.goBack();
    }

    // Real-time payment sync for THIS specific screen
    const voucherId = voucherData?.voucher?.id || bookingId;
    let unsubscribe = () => { };

    if (voucherId) {
      unsubscribe = socketService.subscribeToPayment(voucherId, (data) => {
        if (data.status === 'PAID') {
          console.log('💰 [Room Voucher] Real-time payment detected!');
          setInvoiceData(prev => prev ? { ...prev, status: 'PAID' } : null);
        }
      });
    }

    return () => unsubscribe();
  }, [bookingId, voucherData]);

  // Countdown Timer Logic
  // Countdown Timer Logic
  useEffect(() => {
    // Try to find a valid target date: paymentDue, dueDate, or maybe inferred from issued_at
    const targetDateStr = invoiceData?.paymentDue || invoiceData?.dueDate;

    if (!targetDateStr || invoiceData?.status === 'PAID') {
      if (timeLeft !== '') setTimeLeft(''); // Clear if not applicable
      return;
    }

    const targetDate = new Date(targetDateStr).getTime();

    // Critical Fix: Ensure date is valid to prevent "NaNm NaNs"
    if (isNaN(targetDate)) {
      console.log('⚠️ Invalid Timer Date:', targetDateStr);
      setTimeLeft('');
      return;
    }

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
  }, [invoiceData?.dueDate, invoiceData?.paymentDue, invoiceData?.status]);

  const transformBookingResponseToInvoice = (bookingResponse) => {
    // Extract from Data object (invoice response)
    if (bookingResponse.Data) {
      return {
        invoice_no: bookingResponse.Data.InvoiceNumber,
        invoiceNumber: bookingResponse.Data.InvoiceNumber,
        bookingId: bookingResponse.BookingId || bookingId,
        status: bookingResponse.Status || 'PENDING_PAYMENT',
        amount: bookingResponse.Data.Amount,
        totalPrice: bookingResponse.Data.Amount,
        dueDate: bookingResponse.Data.DueDate,
        instructions: bookingResponse.Data.Instructions,
        bookingSummary: bookingResponse.Data.BookingSummary,
        paymentChannels: bookingResponse.Data.PaymentChannels,
        // Map room number from response if available (Multi-room support)
        roomNumber: bookingResponse.Data.Rooms?.length > 0
          ? bookingResponse.Data.Rooms.map(r => r.room?.roomNumber || r.roomNumber).join(', ')
          : (bookingResponse.Data.Room?.roomNumber || bookingResponse.Data.room_number || bookingResponse.Data.roomNumber),
        isInvoice: true
      };
    }

    // Extract from direct invoice response
    if (bookingResponse.invoiceNumber || bookingResponse.invoice_no) {
      return bookingResponse;
    }

    // Extract from bookings array if available
    if (bookingResponse.bookings && Array.isArray(bookingResponse.bookings) && bookingResponse.bookings.length > 0) {
      const booking = bookingResponse.bookings[0];
      return {
        invoice_no: booking.invoiceNumber || `INV-${booking.id}`,
        invoiceNumber: booking.invoiceNumber || `INV-${booking.id}`,
        bookingId: booking.id,
        status: booking.status || 'PENDING_PAYMENT',
        amount: booking.totalPrice,
        payment_mode: 'PENDING',
        issued_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        roomNumber: booking.rooms?.length > 0
          ? booking.rooms.map(r => r.room?.roomNumber || r.roomNumber).join(', ')
          : (booking.Room?.roomNumber || booking.room_number || booking.roomNumber),
        isInvoice: true
      };
    }

    return null;
  };

  const transformInvoiceData = (invoiceResponse) => {
    const invoice = Array.isArray(invoiceResponse) ? invoiceResponse[0] : invoiceResponse;

    return {
      // Invoice identification
      invoiceNo: invoice.invoice_no || invoice.invoiceNumber || invoice.InvoiceNumber || `INV-${bookingId}`,
      bookingId: invoice.bookingId || bookingId,

      // Status and dates
      status: invoice.status || 'PENDING_PAYMENT',
      issued_at: invoice.issued_at || new Date().toISOString(),
      issued_by: invoice.issued_by || 'System',

      // Due date and instructions
      dueDate: invoice.dueDate,
      instructions: invoice.instructions,
      paymentChannels: invoice.paymentChannels,
      bookingSummary: invoice.bookingSummary,

      // Room information
      roomType: roomType?.name || invoice.Room?.roomType || invoice.roomType,
      // Room information
      roomType: roomType?.name || invoice.Room?.roomType || invoice.roomType,
      roomNumber: (() => {
        // Deep Extraction Logic

        // Check 1: Multi-room array
        if (invoice.rooms && Array.isArray(invoice.rooms) && invoice.rooms.length > 0) {
          const multi = invoice.rooms
            .map(r => r.room?.roomNumber || r.roomNumber)
            .filter(Boolean)
            .join(', ');
          console.log('📍 [DeepExtract] Found in invoice.rooms:', multi);
          return multi;
        }

        // Check 2: Direct or Nested properties
        const direct = invoice.roomNumber ||
          invoice.room_number ||
          invoice.Room?.roomNumber ||
          invoice.voucher?.room_number;

        if (direct) {
          console.log('📍 [DeepExtract] Found in direct/nested props:', direct);
          return direct;
        }

        // Check 3: Regex Extraction from Remarks
        // Pattern: "Room: 123" or "Room booking: 123" (case-insensitive)
        const extractedRoom = invoice.remarks?.match(/Room(?: booking)?:\s*(\w+)/i)?.[1];
        if (extractedRoom) {
          console.log('📍 [DeepExtract] Found via Regex in remarks:', extractedRoom);
          return extractedRoom;
        }

        // Check 4: Booking Summary (literal fallback)
        if (invoice.bookingSummary) {
          console.log('📍 [DeepExtract] Found in bookingSummary:', invoice.bookingSummary);
          return invoice.bookingSummary;
        }

        // Check 5: Context / Navigation Fallback
        if (selectedRoom?.roomNumber) {
          console.log('📍 [DeepExtract] Found in selectedRoom fallback:', selectedRoom.roomNumber);
          return selectedRoom.roomNumber;
        }

        console.log('⚠️ [DeepExtract] No room number found in any source');
        return '';
      })(),

      // Booking dates
      checkIn: bookingData?.checkIn,
      checkOut: bookingData?.checkOut,
      numberOfAdults: bookingData?.numberOfAdults || 1,
      numberOfChildren: bookingData?.numberOfChildren || 0,
      numberOfRooms: bookingData?.numberOfRooms || 1,

      // Payment information
      totalPrice: bookingData?.totalPrice || invoice.amount || invoice.totalPrice,
      paymentMode: invoice.payment_mode || invoice.paymentMode || 'PENDING',
      paymentStatus: invoice.payment_status || 'PENDING',

      // Additional fields
      transaction_id: invoice.transaction_id,
      remarks: invoice.remarks,
      note: invoice.note || 'Complete payment to confirm your booking'
    };
  };

  /* New fetchInvoice Implementation with Deep Extraction Logging */
  const fetchInvoice = async () => {
    try {
      console.log('🔄 START: Fetching Invoice for ID:', bookingId);
      // Don't set loading true if refreshing to avoid full screen spinner
      if (!refreshing) setLoading(true);

      if (!bookingId) {
        throw new Error('No booking ID available');
      }

      // Use the service which handles multiple endpoints
      const response = await bookingService.getInvoice(bookingId, numericBookingId);

      console.log('🧾 Invoice Raw Response:', JSON.stringify(response, null, 2));

      // Explicitly transform data
      const transformed = transformInvoiceData(response);
      console.log('✨ Transformed Invoice Data:', JSON.stringify(transformed, null, 2));

      setInvoiceData(transformed);
    } catch (error) {
      console.error('❌ Error fetching invoice:', error);
      // Fallback
      createTemporaryInvoice();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createTemporaryInvoice = () => {
    console.log('🔄 Creating temporary invoice as fallback');
    const tempInvoice = bookingService.createLocalInvoice(
      bookingId,
      bookingData,
      roomType,
      selectedRoom,
      bookingResponse?.Data?.InvoiceNumber
    );

    setInvoiceData(tempInvoice);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInvoice();
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
            // Clear global voucher on payment initiation
            clearVoucher();

            // Here you would integrate with your payment gateway
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

      if (!invoiceData) {
        Alert.alert('Error', 'No invoice data to share');
        return;
      }

      const shareMessage = `
🏨 BOOKING INVOICE

📋 Invoice Number: ${invoiceData.invoiceNo}
🔢 Booking ID: ${invoiceData.bookingId}
🔄 Status: ${invoiceData.status}

🏠 Room Information:
   • Room Type: ${invoiceData.roomType}
   ${invoiceData.roomNumber ? `   • Room Number: ${invoiceData.roomNumber}` : ''}
   • Check-in: ${formatDate(invoiceData.checkIn)}
   • Check-out: ${formatDate(invoiceData.checkOut)}
   • Guests: ${invoiceData.numberOfAdults} Adults, ${invoiceData.numberOfChildren} Children
   ${invoiceData.numberOfRooms ? `   • Rooms: ${invoiceData.numberOfRooms}` : ''}

💳 Payment Details:
   • Total Amount: $${parseFloat(invoiceData.totalPrice || 0).toFixed(2)}
   • Payment Status: ${invoiceData.paymentStatus}
   • Payment Required: YES

${invoiceData.dueDate ? `📅 Payment Due: ${formatDateTime(invoiceData.dueDate)}\n` : ''}
${invoiceData.instructions ? `💡 Instructions: ${invoiceData.instructions}\n` : ''}
📝 Important Information:
   • Complete payment to confirm your booking
   • Check-in: 2:00 PM
   • Check-out: 12:00 PM
   • Government ID required at check-in

Thank you for your booking!
      `.trim();

      await Share.share({
        message: shareMessage,
        title: `Invoice - ${invoiceData.invoiceNo}`
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice');
    } finally {
      setShareLoading(false);
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

  const getStatusBadge = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'CONFIRMED':
      case 'PAID':
        return { text: 'CONFIRMED', style: styles.statusConfirmed, icon: 'check-circle' };
      case 'PENDING_PAYMENT':
        return { text: 'PAYMENT PENDING', style: styles.statusPending, icon: 'payment' };
      case 'PROCESSING':
        return { text: 'PROCESSING', style: styles.statusProcessing, icon: 'schedule' };
      case 'CANCELLED':
        return { text: 'CANCELLED', style: styles.statusCancelled, icon: 'cancel' };
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
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.notchTitle}>Booking Invoice</Text>

            <View style={styles.iconWrapper} />
          </View>
        </ImageBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b48a64" />
          <Text style={styles.loadingText}>Generating your invoice...</Text>
          <Text style={styles.loadingSubtext}>
            This will be ready immediately
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fffaf2" barStyle="dark-content" />

      {/* Replaced Header with Notch Image */}
      <ImageBackground
        source={require("../../assets/notch.jpg")}
        style={styles.notch}
        imageStyle={styles.notchImage}
      >
        <View style={styles.notchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.notchTitle}>Booking Invoice</Text>

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
        {invoiceData ? (
          <View style={styles.invoiceContainer}>
            {/* Invoice Header */}
            <View style={styles.invoiceHeader}>
              <Icon
                name={statusInfo.icon}
                size={40}
                color="#b48a64"
              />
              <Text style={styles.invoiceTitle}>
                ROOM BOOKING VOUCHER
              </Text>
              <Text style={styles.invoiceSubtitle}>
                Complete payment to confirm your reservation
              </Text>
              {timeLeft && timeLeft !== 'EXPIRED' && invoiceData?.status !== 'PAID' && (
                <View style={styles.timerContainer}>
                  <Icon name="schedule" size={16} color="#dc3545" />
                  <Text style={styles.timerText}> Expires in: {timeLeft}</Text>
                </View>
              )}
              {timeLeft === 'EXPIRED' && (
                <Text style={styles.expiredText}>EXPIRED</Text>
              )}
            </View>

            {/* Payment Required Alert
            <View style={styles.paymentAlert}>
              <Icon name="payment" size={20} color="#856404" />
              <View style={styles.paymentAlertContent}>
                <Text style={styles.paymentAlertTitle}>Payment Required</Text>
                <Text style={styles.paymentAlertText}>
                  Complete payment to confirm your booking and receive confirmation
                </Text>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={handleMakePayment}
                >
                  <Text style={styles.paymentButtonText}>Make Payment Now</Text>
                </TouchableOpacity>
              </View>
            </View> */}

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
                    <Icon name="content-copy" size={16} color="#b48a64" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booking ID:</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.bookingId}
                </Text>
              </View>

              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, statusInfo.style]}>
                  <Text style={styles.statusText}>{statusInfo.text}</Text>
                </View>
              </View> */}

              {invoiceData.dueDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Due:</Text>
                  <Text style={[styles.detailValue, styles.dueDate]}>
                    {formatDateTime(invoiceData.dueDate)}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Issued At:</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(invoiceData.issued_at)}
                </Text>
              </View>

              {/* {invoiceData.issued_by && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issued By:</Text>
                  <Text style={styles.detailValue}>
                    {invoiceData.issued_by}
                  </Text>
                </View>
              )} */}
            </View>

            {/* Room Information */}
            <View style={styles.invoiceSection}>
              <Text style={styles.sectionTitle}>Room Information</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room Type:</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.roomType || 'N/A'}
                </Text>
              </View>

              <View style={[styles.detailRow, { marginBottom: 10, alignItems: 'flex-start' }]}>
                <Text style={[styles.detailLabel, { marginTop: 0 }]}>Room Number:</Text>
                {/* Updated Check: Render if roomNumber exists and is not empty */}
                {(invoiceData.roomNumber && invoiceData.roomNumber !== "") ? (
                  <Text style={[styles.detailValue, { flex: 1, textAlign: 'right', flexWrap: 'wrap' }]}>
                    {invoiceData.roomNumber}
                  </Text>
                ) : (
                  <Text style={[styles.detailValue, { color: '#888888' }]}>
                    Pending Assignment
                  </Text>
                )}
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-in:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoiceData.checkIn)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-out:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoiceData.checkOut)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Guests:</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.numberOfAdults} Adults, {invoiceData.numberOfChildren} Children
                  {invoiceData.numberOfRooms > 1 && `, ${invoiceData.numberOfRooms} Rooms`}
                </Text>
              </View>
            </View>

            {/* Payment Information */}
            <View style={styles.invoiceSection}>
              <Text style={styles.sectionTitle}>Payment Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Amount:</Text>
                <Text style={[styles.detailValue, styles.amount]}>
                  Rs. {invoiceData.totalPrice ? parseFloat(invoiceData.totalPrice).toFixed(2) : '0.00'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status:</Text>
                <View style={[styles.statusBadge, styles.pendingBadge]}>
                  <Text style={styles.statusText}>PENDING</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Mode:</Text>
                <Text style={styles.detailValue}>
                  {invoiceData.paymentMode}
                </Text>
              </View>
            </View>

            {/* Payment Instructions */}
            {invoiceData.instructions && (
              <View style={styles.instructionsSection}>
                <Text style={styles.instructionsTitle}>Payment Instructions</Text>
                <Text style={styles.instructionsText}>{invoiceData.instructions}</Text>
              </View>
            )}

            {/* Payment Channels */}
            {invoiceData.paymentChannels && (
              <View style={styles.paymentChannelsSection}>
                <Text style={styles.paymentChannelsTitle}>Available Payment Methods</Text>
                <View style={styles.paymentChannelsList}>
                  {invoiceData.paymentChannels.map((channel, index) => (
                    <View key={index} style={styles.paymentChannelItem}>
                      <Icon name="payment" size={16} color="#2e7d32" />
                      <Text style={styles.paymentChannelText}>{channel}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* General Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>Important Information</Text>
              <View style={styles.instructionItem}>
                <Icon name="access-time" size={16} color="#2e7d32" />
                <Text style={styles.instructionText}>Check-in: 2:00 PM | Check-out: 12:00 PM</Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="credit-card" size={16} color="#2e7d32" />
                <Text style={styles.instructionText}>Government ID required at check-in</Text>
              </View>
              <View style={styles.instructionItem}>
                <Icon name="receipt" size={16} color="#2e7d32" />
                <Text style={styles.instructionText}>Present payment confirmation at reception</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {/* <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleRefresh}
                disabled={refreshing}
              >
                <Icon name="refresh" size={20} color="#b48a64" />
                <Text style={styles.secondaryButtonText}>
                  {refreshing ? 'Refreshing...' : 'Refresh Invoice'}
                </Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareInvoice}
                disabled={shareLoading}
              >
                <Icon name="share" size={20} color="#fff" />
                <Text style={styles.shareButtonText}>
                  {shareLoading ? 'Sharing...' : 'Share Invoice'}
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* Make Payment Button */}
            {/* <TouchableOpacity
              style={styles.paymentActionButton}
              onPress={handleMakePayment}
            >
              <Icon name="payment" size={20} color="#fff" />
              <Text style={styles.paymentActionButtonText}>Complete Payment Now</Text>
            </TouchableOpacity> */}

            {/* <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Bookings')}
              >
                <Icon name="list-alt" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>View All Bookings</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        ) : (
          <View style={styles.noInvoiceContainer}>
            <Icon name="receipt" size={60} color="#ccc" />
            <Text style={styles.noInvoiceTitle}>Invoice Not Available</Text>
            <Text style={styles.noInvoiceText}>
              Unable to load invoice at this time.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3eb' },
  // notch styles
  notch: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    backgroundColor: "#D2B48C",
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
  loadingSubtext: {
    marginTop: 5,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
    marginBottom: 5,
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
  statusProcessing: {
    backgroundColor: '#e2e3e5',
  },
  statusCancelled: {
    backgroundColor: '#f8d7da',
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
    marginTop: 10,
    textTransform: 'uppercase',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  instructionsSection: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0d6efd',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d6efd',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#0d6efd',
    lineHeight: 20,
  },
  paymentChannelsSection: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  paymentChannelsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10,
  },
  paymentChannelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paymentChannelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentChannelText: {
    fontSize: 12,
    color: '#1565c0',
    marginLeft: 6,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#b48a64',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noInvoiceContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noInvoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 10,
  },
  noInvoiceText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: '#b48a64',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});