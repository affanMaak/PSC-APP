//ios test

// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   PermissionsAndroid
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { captureRef } from 'react-native-view-shot';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// const ReceiptScreen = ({ route }) => {
//   const { customerName, amount, date, paymentMethod, items, type, receiptId } = route.params;
//   const [userProfile, setUserProfile] = useState(null);
//   const [businessDetails, setBusinessDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const receiptRef = useRef(null);

//   const theme = {
//     background: 'black',
//     card: '#1E1E1E',
//     text: '#FFF0DC',
//     textSecondary: '#A0A0A0',
//     border: '#333333',
//     accent: '#543A14',
//     success: '#4CAF50',
//     accent2: '#FFF0DC',
//   };

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//           const [{ data: profileData }, { data: businessData }] = await Promise.all([
//             supabase.from('profiles').select('username').eq('id', user.id).single(),
//             supabase.from('business_users')
//               .select('business_name, phone_number, shop_number, area, city')
//               .eq('user_id', user.id).single()
//           ]);
//           setUserProfile(profileData);
//           setBusinessDetails(businessData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBusinessDetails();
//   }, []);

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getPaymentIcon = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'cash': return 'money';
//       case 'card': return 'credit-card';
//       case 'online': return 'public';
//       default: return 'payment';
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         if (Platform.Version >= 33) {
//           return true;
//         } else {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'Storage Permission',
//               message: 'This app needs storage permission to save receipt images to your gallery.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//       } catch (error) {
//         console.error('Permission request error:', error);
//         return false;
//       }
//     }
//     return true;
//   };

//   const captureReceipt = async () => {
//     try {
//       setIsCapturing(true);
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Required', 'Please grant storage permission to save receipt images.');
//         setIsCapturing(false);
//         return;
//       }

//       // Wait for UI to fully render before capture
//       setTimeout(async () => {
//         const uri = await captureRef(receiptRef, {
//           format: 'jpg',
//           quality: 0.9,
//         });

//         await CameraRoll.save(uri, { type: 'photo' });

//         Alert.alert('Success', 'Receipt saved to gallery successfully!');
//         setIsCapturing(false);
//       }, 500);
//     } catch (error) {
//       console.error('Error capturing receipt:', error);
//       Alert.alert('Error', 'Failed to save receipt. Please try again.');
//       setIsCapturing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
//         <ActivityIndicator size="large" color={theme.text} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <ScrollView style={{ flex: 1 }}>
//         <View
//           ref={receiptRef}
//           collapsable={false}
//           style={[styles.receiptContainer, { backgroundColor: theme.background }]}
//         >
//           {/* Business Header */}
//           <View style={styles.businessHeader}>
//             <Text style={[styles.businessName, { color: theme.text }]}>
//               {businessDetails?.business_name || userProfile?.username || 'Your Business'}
//             </Text>
//             <View style={styles.businessInfo}>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.area}{businessDetails?.city && `, ${businessDetails.city}`}
//               </Text>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.shop_number && ` Shop #${businessDetails.shop_number}`}
//               </Text>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.phone_number}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.paymentRow, { borderBottomColor: theme.border }]}></View>

//           <View style={styles.invoiceTitleContainer}>
//             <Text style={[styles.invoiceTitle, { color: theme.text }]}>
//               Invoice Number:{' '}
//               <Text style={[styles.invoiceId, { color: theme.textSecondary }]}>
//                 #{receiptId?.slice(0, 8).toUpperCase() || '--------'}
//               </Text>
//             </Text>
//           </View>

//           <View style={[styles.detailsSection, { backgroundColor: theme.card }]}>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {new Date(date).toLocaleDateString('en-IN', {
//                   day: 'numeric',
//                   month: 'short',
//                   year: 'numeric'
//                 })}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>{formatTime(date)}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Customer:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {customerName || 'Walk-in Customer'}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Type:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {type?.toUpperCase() || 'SALE'}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.itemsSection, { backgroundColor: theme.card }]}>
//             <Text style={[styles.sectionTitle, { color: theme.text }]}>ITEMS</Text>
//             <View style={[styles.itemsHeader, { borderBottomColor: theme.border }]}>
//               <Text style={[styles.itemHeaderText, { flex: 2, color: theme.textSecondary }]}>Description</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Qty</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Price</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Total</Text>
//             </View>
//             {items?.map((item, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.itemRow,
//                   {
//                     borderBottomColor: theme.border,
//                     backgroundColor: index % 2 === 0 ? theme.card : '#252525'
//                   }
//                 ]}
//               >
//                 <Text style={[styles.itemText, { flex: 2, color: theme.text }]}>{item.itemName}</Text>
//                 <Text style={[styles.itemText, { color: theme.text }]}>{item.quantity}</Text>
//                 <Text style={[styles.itemText, { color: theme.text }]}>Rs{item.unitPrice?.toFixed(0)}</Text>
//                 <Text style={[styles.itemText, { color: theme.success }]}>
//                   Rs{(item.quantity * item.unitPrice).toFixed(0)}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           <View style={[styles.paymentSection, { backgroundColor: theme.card }]}>
//             <View style={[styles.paymentRow, { borderBottomColor: theme.border }]}>
//               <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Subtotal:</Text>
//               <Text style={[styles.paymentValue, { color: theme.text }]}>
//                 Rs{parseFloat(amount).toFixed(0)}
//               </Text>
//             </View>
//             <View style={styles.paymentRow}>
//               <View style={styles.paymentMethod}>
//                 <Icon name={getPaymentIcon(paymentMethod)} size={20} color={theme.text} style={styles.paymentIcon} />
//                 <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Payment Method:</Text>
//               </View>
//               <Text style={[styles.paymentValue, { color: theme.text }]}>
//                 {paymentMethod?.toUpperCase() || 'CASH'}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.totalSection, { backgroundColor: theme.accent2 }]}>
//             <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
//             <Text style={styles.totalAmount}>Rs{parseFloat(amount).toFixed(2)}</Text>
//           </View>

//           <View style={styles.footer}>
//             <Text style={[styles.footerText, { color: theme.textSecondary }]}>
//               Thank you for your business!
//             </Text>
//             {businessDetails?.phone_number && (
//               <Text style={[styles.footerText, { color: theme.textSecondary }]}>
//                 For inquiries: {businessDetails.phone_number}
//               </Text>
//             )}
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.buttonContainer}>
//   <TouchableOpacity 
//     style={styles.saveButton} 
//     onPress={captureReceipt}
//     disabled={isCapturing}
//   >
//     {isCapturing ? (
//       <>
//         <ActivityIndicator color="white" />
//         <Text style={styles.buttonText}>Saving...</Text>
//       </>
//     ) : (
//       <>
//         <Icon name="save" size={24} color="#543A14" />
//         <Text style={styles.buttonText}>Save Receipt</Text>
//       </>
//     )}
//   </TouchableOpacity>
//         {/* <TouchableOpacity
//           style={[styles.screenshotButton, { backgroundColor: theme.accent2 }]}
//           onPress={captureReceipt}
//           disabled={isCapturing}
//         >
//           {isCapturing ? (
//             <ActivityIndicator size="small" color={theme.accent} />
//           ) : (
//             <Icon name="camera-alt" size={24} color={theme.accent} />
//           )}
//           <Text style={[styles.buttonText, { color: theme.accent }]}>
//             {isCapturing ? 'Saving...' : 'Save Receipt'}
//           </Text>
//         </TouchableOpacity> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   receiptContainer: { paddingBottom: 20 },
//   businessHeader: { marginBottom: 16, alignItems: 'center' },
//   businessName: { fontSize: 30, fontWeight: 'bold', marginBottom: 4 },
//   businessInfo: { alignItems: 'center' },
//   businessInfoText: { fontSize: 13, textAlign: 'center' },
//   invoiceTitleContainer: { alignItems: 'center', marginBottom: 16 },
//   invoiceTitle: { fontSize: 20, fontWeight: 'bold' },
//   invoiceId: { fontSize: 20, marginTop: 4 },
//   detailsSection: { padding: 12, marginBottom: 12, borderRadius: 8 },
//   detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
//   detailLabel: { fontSize: 14 },
//   detailValue: { fontSize: 14, fontWeight: '500' },
//   itemsSection: { padding: 12, marginBottom: 12, borderRadius: 8 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
//   itemsHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, marginBottom: 8 },
//   itemHeaderText: { fontSize: 14, fontWeight: '500', textAlign: 'center', flex: 1 },
//   itemRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1 },
//   itemText: { fontSize: 14, textAlign: 'center', flex: 1 },
//   paymentSection: { padding: 12, marginBottom: 12, borderRadius: 8 },
//   paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1 },
//   paymentMethod: { flexDirection: 'row', alignItems: 'center' },
//   paymentIcon: { marginRight: 6 },
//   paymentLabel: { fontSize: 14 },
//   paymentValue: { fontSize: 14, fontWeight: '500' },
//   totalSection: {
//     padding: 12,
//     marginTop: 20,
//     marginBottom: 16,
//     borderRadius: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     color: '#543A14'
//   },
//   totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#543A14' },
//   totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#543A14' },
//   footer: { alignItems: 'center' },
//   footerText: { fontSize: 13, marginBottom: 4 },
//   buttonContainer: { paddingTop: 10, paddingBottom: 10 },
//   screenshotButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 15,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   buttonText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
// saveButton: {
//   position: 'absolute',
//   bottom: 20,
//   right: 20,
//   backgroundColor: '#FFF0DC',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   paddingHorizontal: 20,
//   height: 50,
//   borderRadius: 25,
//   elevation: 5,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.3,
//   shadowRadius: 3,
// },
// buttonText: {
//   color: '#543A14',
//   marginLeft: 8,
//   fontSize: 16,
//   fontWeight: '500',
// },
// });

// export default ReceiptScreen;


// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   PermissionsAndroid
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { captureRef } from 'react-native-view-shot';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// const ReceiptScreen = ({ route }) => {
//   const { customerName, amount, date, paymentMethod, items, type, receiptId } = route.params;
//   const [userProfile, setUserProfile] = useState(null);
//   const [businessDetails, setBusinessDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const receiptRef = useRef(null);

//   const theme = {
//     background: 'black',
//     card: '#1E1E1E',
//     text: '#FFF0DC',
//     textSecondary: '#A0A0A0',
//     border: '#333333',
//     accent: '#543A14',
//     success: '#4CAF50',
//     accent2: '#FFF0DC',
//   };

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//           const [{ data: profileData }, { data: businessData }] = await Promise.all([
//             supabase.from('profiles').select('username').eq('id', user.id).single(),
//             supabase.from('business_users')
//               .select('business_name, phone_number, shop_number, area, city')
//               .eq('user_id', user.id).single()
//           ]);
//           setUserProfile(profileData);
//           setBusinessDetails(businessData);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBusinessDetails();
//   }, []);

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getPaymentIcon = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'cash': return 'money';
//       case 'credit card':
//       case 'card': return 'credit-card';
//       case 'bank transfer': return 'account-balance';
//       case 'upi': return 'smartphone';
//       case 'online': return 'public';
//       default: return 'payment';
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         if (Platform.Version >= 33) {
//           return true;
//         } else {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'Storage Permission',
//               message: 'This app needs storage permission to save receipt images to your gallery.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//       } catch (error) {
//         console.error('Permission request error:', error);
//         return false;
//       }
//     }
//     return true;
//   };

//   const captureReceipt = async () => {
//     try {
//       setIsCapturing(true);
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Required', 'Please grant storage permission to save receipt images.');
//         setIsCapturing(false);
//         return;
//       }

//       // Wait for UI to fully render before capture
//       setTimeout(async () => {
//         try {
//           const uri = await captureRef(receiptRef, {
//             format: 'jpg',
//             quality: 0.9,
//           });

//           await CameraRoll.save(uri, { type: 'photo' });

//           Alert.alert('Success', 'Receipt saved to gallery successfully!');
//         } catch (captureError) {
//           console.error('Error capturing receipt:', captureError);
//           Alert.alert('Error', 'Failed to save receipt. Please try again.');
//         } finally {
//           setIsCapturing(false);
//         }
//       }, 500);
//     } catch (error) {
//       console.error('Error in captureReceipt:', error);
//       Alert.alert('Error', 'Failed to save receipt. Please try again.');
//       setIsCapturing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
//         <ActivityIndicator size="large" color={theme.text} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <ScrollView style={{ flex: 1 }}>
//         <View
//           ref={receiptRef}
//           collapsable={false}
//           style={[styles.receiptContainer, { backgroundColor: theme.background }]}
//         >
//           {/* Business Header */}
//           <View style={styles.businessHeader}>
//             <Text style={[styles.businessName, { color: theme.text }]}>
//               {businessDetails?.business_name || userProfile?.username || 'Your Business'}
//             </Text>
//             <View style={styles.businessInfo}>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.area}{businessDetails?.city && `, ${businessDetails.city}`}
//               </Text>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.shop_number && ` Shop #${businessDetails.shop_number}`}
//               </Text>
//               <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
//                 {businessDetails?.phone_number}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.divider, { borderBottomColor: theme.border }]}></View>

//           <View style={styles.invoiceTitleContainer}>
//             <Text style={[styles.invoiceTitle, { color: theme.text }]}>
//               Invoice Number:{' '}
//               <Text style={[styles.invoiceId, { color: theme.textSecondary }]}>
//                 #{receiptId?.slice(0, 8).toUpperCase() || '--------'}
//               </Text>
//             </Text>
//           </View>

//           <View style={[styles.detailsSection, { backgroundColor: theme.card }]}>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {new Date(date).toLocaleDateString('en-IN', {
//                   day: 'numeric',
//                   month: 'short',
//                   year: 'numeric'
//                 })}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>{formatTime(date)}</Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Customer:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {customerName || 'Walk-in Customer'}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Type:</Text>
//               <Text style={[styles.detailValue, { color: theme.text }]}>
//                 {type?.toUpperCase() || 'SALE'}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.itemsSection, { backgroundColor: theme.card }]}>
//             <Text style={[styles.sectionTitle, { color: theme.text }]}>ITEMS</Text>
//             <View style={[styles.itemsHeader, { borderBottomColor: theme.border }]}>
//               <Text style={[styles.itemHeaderText, { flex: 2, color: theme.textSecondary }]}>Description</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Qty</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Price</Text>
//               <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Total</Text>
//             </View>
//             {items?.map((item, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.itemRow,
//                   {
//                     borderBottomColor: theme.border,
//                     backgroundColor: index % 2 === 0 ? theme.card : '#252525'
//                   }
//                 ]}
//               >
//                 <Text style={[styles.itemText, { flex: 2, color: theme.text }]}>{item.itemName}</Text>
//                 <Text style={[styles.itemText, { color: theme.text }]}>{item.quantity}</Text>
//                 <Text style={[styles.itemText, { color: theme.text }]}>Rs{item.unitPrice?.toFixed(0)}</Text>
//                 <Text style={[styles.itemText, { color: theme.success }]}>
//                   Rs{(item.quantity * item.unitPrice).toFixed(0)}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           <View style={[styles.paymentSection, { backgroundColor: theme.card }]}>
//             <View style={[styles.paymentRow, { borderBottomColor: theme.border }]}>
//               <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Subtotal:</Text>
//               <Text style={[styles.paymentValue, { color: theme.text }]}>
//                 Rs{parseFloat(amount).toFixed(0)}
//               </Text>
//             </View>
//             <View style={styles.paymentRow}>
//               <View style={styles.paymentMethod}>
//                 <Icon name={getPaymentIcon(paymentMethod)} size={20} color={theme.text} style={styles.paymentIcon} />
//                 <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Payment Method:</Text>
//               </View>
//               <Text style={[styles.paymentValue, { color: theme.text }]}>
//                 {paymentMethod?.toUpperCase() || 'CASH'}
//               </Text>
//             </View>
//           </View>

//           <View style={[styles.totalSection, { backgroundColor: theme.accent2 }]}>
//             <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
//             <Text style={styles.totalAmount}>Rs{parseFloat(amount).toFixed(2)}</Text>
//           </View>

//           <View style={styles.footer}>
//             <Text style={[styles.footerText, { color: theme.textSecondary }]}>
//               Thank you for your business!
//             </Text>
//             {businessDetails?.phone_number && (
//               <Text style={[styles.footerText, { color: theme.textSecondary }]}>
//                 For inquiries: {businessDetails.phone_number}
//               </Text>
//             )}
//           </View>
//         </View>
//       </ScrollView>

//       <TouchableOpacity 
//         style={styles.saveButton} 
//         onPress={captureReceipt}
//         disabled={isCapturing}
//       >
//         {isCapturing ? (
//           <>
//             <ActivityIndicator color="#543A14" size="small" />
//             <Text style={styles.saveButtonText}>Saving...</Text>
//           </>
//         ) : (
//           <>
//             <Icon name="save" size={24} color="#543A14" />
//             <Text style={styles.saveButtonText}>Save Receipt</Text>
//           </>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     padding: 16 
//   },
//   receiptContainer: { 
//     paddingBottom: 100 // Add padding to avoid overlap with floating button
//   },
//   businessHeader: { 
//     marginBottom: 16, 
//     alignItems: 'center' 
//   },
//   businessName: { 
//     fontSize: 30, 
//     fontWeight: 'bold', 
//     marginBottom: 4 
//   },
//   businessInfo: { 
//     alignItems: 'center' 
//   },
//   businessInfoText: { 
//     fontSize: 13, 
//     textAlign: 'center' 
//   },
//   divider: {
//     borderBottomWidth: 1,
//     marginBottom: 16
//   },
//   invoiceTitleContainer: { 
//     alignItems: 'center', 
//     marginBottom: 16 
//   },
//   invoiceTitle: { 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   invoiceId: { 
//     fontSize: 20, 
//     marginTop: 4 
//   },
//   detailsSection: { 
//     padding: 12, 
//     marginBottom: 12, 
//     borderRadius: 8 
//   },
//   detailRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginBottom: 6 
//   },
//   detailLabel: { 
//     fontSize: 14 
//   },
//   detailValue: { 
//     fontSize: 14, 
//     fontWeight: '500' 
//   },
//   itemsSection: { 
//     padding: 12, 
//     marginBottom: 12, 
//     borderRadius: 8 
//   },
//   sectionTitle: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     marginBottom: 8 
//   },
//   itemsHeader: { 
//     flexDirection: 'row', 
//     paddingBottom: 8, 
//     borderBottomWidth: 1, 
//     marginBottom: 8 
//   },
//   itemHeaderText: { 
//     fontSize: 14, 
//     fontWeight: '500', 
//     textAlign: 'center', 
//     flex: 1 
//   },
//   itemRow: { 
//     flexDirection: 'row', 
//     paddingVertical: 8, 
//     borderBottomWidth: 1 
//   },
//   itemText: { 
//     fontSize: 14, 
//     textAlign: 'center', 
//     flex: 1 
//   },
//   paymentSection: { 
//     padding: 12, 
//     marginBottom: 12, 
//     borderRadius: 8 
//   },
//   paymentRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     paddingVertical: 6, 
//     borderBottomWidth: 1 
//   },
//   paymentMethod: { 
//     flexDirection: 'row', 
//     alignItems: 'center' 
//   },
//   paymentIcon: { 
//     marginRight: 6 
//   },
//   paymentLabel: { 
//     fontSize: 14 
//   },
//   paymentValue: { 
//     fontSize: 14, 
//     fontWeight: '500' 
//   },
//   totalSection: {
//     padding: 12,
//     marginTop: 20,
//     marginBottom: 16,
//     borderRadius: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   totalLabel: { 
//     fontSize: 16, 
//     fontWeight: 'bold', 
//     color: '#543A14' 
//   },
//   totalAmount: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     color: '#543A14' 
//   },
//   footer: { 
//     alignItems: 'center', 
//     marginBottom: 20 
//   },
//   footerText: { 
//     fontSize: 13, 
//     marginBottom: 4 
//   },
//   saveButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#FFF0DC',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     height: 50,
//     borderRadius: 25,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
//   saveButtonText: {
//     color: '#543A14',
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: '500',
//   }
// });

// export default ReceiptScreen;


import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';
import { captureRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const ReceiptScreen = ({ route }) => {
  const { customerName, amount, date, paymentMethod, items, type, receiptId } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const receiptRef = useRef(null);

  // Fixed theme object - use backgroundColor instead of background
  const theme = {
    backgroundColor: 'black',
    card: '#1E1E1E',
    text: '#FFF0DC',
    textSecondary: '#A0A0A0',
    border: '#333333',
    accent: '#543A14',
    success: '#4CAF50',
    accent2: '#FFF0DC',
  };

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [{ data: profileData }, { data: businessData }] = await Promise.all([
            supabase.from('profiles').select('username').eq('id', user.id).single(),
            supabase.from('business_users')
              .select('business_name, phone_number, shop_number, area, city')
              .eq('user_id', user.id).single()
          ]);
          setUserProfile(profileData);
          setBusinessDetails(businessData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessDetails();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'cash': return 'money';
      case 'credit card':
      case 'card': return 'credit-card';
      case 'bank transfer': return 'account-balance';
      case 'upi': return 'smartphone';
      case 'online': return 'public';
      default: return 'payment';
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          return true;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs storage permission to save receipt images to your gallery.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    return true;
  };

  const captureReceipt = async () => {
    try {
      setIsCapturing(true);
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please grant storage permission to save receipt images.');
        setIsCapturing(false);
        return;
      }

      // Wait for UI to fully render before capture
      setTimeout(async () => {
        try {
          const uri = await captureRef(receiptRef, {
            format: 'jpg',
            quality: 0.9,
          });

          await CameraRoll.save(uri, { type: 'photo' });

          Alert.alert('Success', 'Receipt saved to gallery successfully!');
        } catch (captureError) {
          console.error('Error capturing receipt:', captureError);
          Alert.alert('Error', 'Failed to save receipt. Please try again.');
        } finally {
          setIsCapturing(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error in captureReceipt:', error);
      Alert.alert('Error', 'Failed to save receipt. Please try again.');
      setIsCapturing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView style={{ flex: 1 }}>
        <View
          ref={receiptRef}
          collapsable={false}
          style={[styles.receiptContainer, { backgroundColor: theme.backgroundColor }]}
        >
          {/* Business Header */}
          <View style={styles.businessHeader}>
            <Text style={[styles.businessName, { color: theme.text }]}>
              {businessDetails?.business_name || userProfile?.username || 'Your Business'}
            </Text>
            <View style={styles.businessInfo}>
              <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
                {businessDetails?.area}{businessDetails?.city && `, ${businessDetails.city}`}
              </Text>
              <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
                {businessDetails?.shop_number && ` Shop #${businessDetails.shop_number}`}
              </Text>
              <Text style={[styles.businessInfoText, { color: theme.textSecondary }]}>
                {businessDetails?.phone_number}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { borderBottomColor: theme.border }]}></View>

          <View style={styles.invoiceTitleContainer}>
            <Text style={[styles.invoiceTitle, { color: theme.text }]}>
              Invoice Number:{' '}
              <Text style={[styles.invoiceId, { color: theme.textSecondary }]}>
                #{receiptId?.slice(0, 8).toUpperCase() || '--------'}
              </Text>
            </Text>
          </View>

          <View style={[styles.detailsSection, { backgroundColor: theme.card }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {new Date(date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Time:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{formatTime(date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Customer:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {customerName || 'Walk-in Customer'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Type:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {type?.toUpperCase() || 'SALE'}
              </Text>
            </View>
          </View>

          <View style={[styles.itemsSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>ITEMS</Text>
            <View style={[styles.itemsHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.itemHeaderText, { flex: 2, color: theme.textSecondary }]}>Description</Text>
              <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Qty</Text>
              <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Price</Text>
              <Text style={[styles.itemHeaderText, { color: theme.textSecondary }]}>Total</Text>
            </View>
            {items?.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.itemRow,
                  {
                    borderBottomColor: theme.border,
                    backgroundColor: index % 2 === 0 ? theme.card : '#252525'
                  }
                ]}
              >
                <Text style={[styles.itemText, { flex: 2, color: theme.text }]}>{item.itemName}</Text>
                <Text style={[styles.itemText, { color: theme.text }]}>{item.quantity}</Text>
                <Text style={[styles.itemText, { color: theme.text }]}>Rs{item.unitPrice?.toFixed(0)}</Text>
                <Text style={[styles.itemText, { color: theme.success }]}>
                  Rs{(item.quantity * item.unitPrice).toFixed(0)}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.paymentSection, { backgroundColor: theme.card }]}>
            <View style={[styles.paymentRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Subtotal:</Text>
              <Text style={[styles.paymentValue, { color: theme.text }]}>
                Rs{parseFloat(amount).toFixed(0)}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <View style={styles.paymentMethod}>
                <Icon name={getPaymentIcon(paymentMethod)} size={20} color={theme.text} style={styles.paymentIcon} />
                <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Payment Method:</Text>
              </View>
              <Text style={[styles.paymentValue, { color: theme.text }]}>
                {paymentMethod?.toUpperCase() || 'CASH'}
              </Text>
            </View>
          </View>

          <View style={[styles.totalSection, { backgroundColor: theme.accent2 }]}>
            <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.totalAmount}>Rs{parseFloat(amount).toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Thank you for your business!
            </Text>
            {businessDetails?.phone_number && (
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                For inquiries: {businessDetails.phone_number}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={captureReceipt}
        disabled={isCapturing}
      >
        {isCapturing ? (
          <>
            <ActivityIndicator color="#543A14" size="small" />
            <Text style={styles.saveButtonText}>Saving...</Text>
          </>
        ) : (
          <>
            <Icon name="save" size={24} color="#543A14" />
            <Text style={styles.saveButtonText}>Save Receipt</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  receiptContainer: { 
    paddingBottom: 100 // Add padding to avoid overlap with floating button
  },
  businessHeader: { 
    marginBottom: 16, 
    alignItems: 'center' 
  },
  businessName: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  businessInfo: { 
    alignItems: 'center' 
  },
  businessInfoText: { 
    fontSize: 13, 
    textAlign: 'center' 
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 16
  },
  invoiceTitleContainer: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  invoiceTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  invoiceId: { 
    fontSize: 20, 
    marginTop: 4 
  },
  detailsSection: { 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8 
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 6 
  },
  detailLabel: { 
    fontSize: 14 
  },
  detailValue: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  itemsSection: { 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  itemsHeader: { 
    flexDirection: 'row', 
    paddingBottom: 8, 
    borderBottomWidth: 1, 
    marginBottom: 8 
  },
  itemHeaderText: { 
    fontSize: 14, 
    fontWeight: '500', 
    textAlign: 'center', 
    flex: 1 
  },
  itemRow: { 
    flexDirection: 'row', 
    paddingVertical: 8, 
    borderBottomWidth: 1 
  },
  itemText: { 
    fontSize: 14, 
    textAlign: 'center', 
    flex: 1 
  },
  paymentSection: { 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8 
  },
  paymentRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 6, 
    borderBottomWidth: 1 
  },
  paymentMethod: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  paymentIcon: { 
    marginRight: 6 
  },
  paymentLabel: { 
    fontSize: 14 
  },
  paymentValue: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  totalSection: {
    padding: 12,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#543A14' 
  },
  totalAmount: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#543A14' 
  },
  footer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  footerText: { 
    fontSize: 13, 
    marginBottom: 4 
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFF0DC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#543A14',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  }
});

export default ReceiptScreen;