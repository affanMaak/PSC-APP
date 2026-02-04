// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   ScrollView,
//   ImageBackground,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
//   Image,
//   Modal,
//   TextInput,
//   Alert,
//   Platform,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {
//   getAffiliatedClubs,
//   createAffiliatedClubRequest,
//   getUserData,
//   getUserAffiliatedClubRequests
// } from '../../config/apis';

// const aff_club = () => {
//   const navigation = useNavigation();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [instructionsModalVisible, setInstructionsModalVisible] = useState(true);
//   const [selectedClub, setSelectedClub] = useState(null);
//   const [clubs, setClubs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [clubsLoading, setClubsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Form state - only these 3 fields are needed as per web portal
//   const [visitDate, setVisitDate] = useState(new Date());
//   const [memberId, setMemberId] = useState('');
//   const [userProfile, setUserProfile] = useState(null);

//   // Requests state
//   const [requestsModalVisible, setRequestsModalVisible] = useState(false);
//   const [userRequests, setUserRequests] = useState([]);
//   const [requestsLoading, setRequestsLoading] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//     fetchAffiliatedClubs();
//     // Show instructions modal on first visit
//     setInstructionsModalVisible(true);
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const profile = await getUserData();
//       setUserProfile(profile);
//       // Try to get membership number from different possible fields
//       setMemberId(profile.membershipNumber || profile.membershipNo || profile.Membership_No || profile.memberId || '');
//     } catch (error) {
//       console.log('Error fetching user profile:', error);
//       Alert.alert('Error', 'Failed to load user information');
//     }
//   };

//   const fetchAffiliatedClubs = async () => {
//     try {
//       setClubsLoading(true);
//       const clubsData = await getAffiliatedClubs();
//       const activeClubs = clubsData.filter(club => club.isActive !== false);
//       setClubs(activeClubs);
//     } catch (error) {
//       console.log('Error fetching clubs:', error);
//       Alert.alert('Error', 'Failed to load clubs. Please try again.');
//     } finally {
//       setClubsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAffiliatedClubs();
//   };

//   const openVisitModal = (club) => {
//     setSelectedClub(club);
//     setVisitDate(new Date());
//     setShowDatePicker(false);
//     // Show instructions modal first, then the visit request modal
//     setInstructionsModalVisible(true);
//     setModalVisible(true);
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//   };

//   const fetchUserRequests = async () => {
//     if (!memberId) {
//       Alert.alert('Error', 'Membership information not found. Please log in again.');
//       return;
//     }

//     try {
//       setRequestsLoading(true);
//       setRequestsModalVisible(true);
//       const data = await getUserAffiliatedClubRequests(memberId);
//       setUserRequests(data);
//     } catch (error) {
//       console.log('Error fetching requests:', error);
//       Alert.alert('Error', 'Failed to load your requests. Please try again.');
//     } finally {
//       setRequestsLoading(false);
//     }
//   };

//   // Filter clubs based on search query
//   const filteredClubs = clubs.filter((club) => {
//     const query = searchQuery.toLowerCase();
//     const nameMatch = club.name?.toLowerCase().includes(query);
//     const locationMatch = club.location?.toLowerCase().includes(query);
//     const addressMatch = club.address?.toLowerCase().includes(query);
//     return nameMatch || locationMatch || addressMatch;
//   });

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(Platform.OS === 'ios');
//     if (selectedDate) {
//       setVisitDate(selectedDate);
//     }
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const handleSendVisitRequest = async () => {
//     if (!memberId || memberId.trim() === '') {
//       Alert.alert('Error', 'Member ID is required');
//       return;
//     }

//     if (!visitDate) {
//       Alert.alert('Error', 'Please select a visit date');
//       return;
//     }

//     // Check if date is not in the past
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const selected = new Date(visitDate);
//     selected.setHours(0, 0, 0, 0);

//     if (selected < today) {
//       Alert.alert('Error', 'Cannot select a past date');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Prepare payload exactly as web portal expects
//       const requestData = {
//         affiliatedClubId: selectedClub.id,
//         membershipNo: memberId,
//         requestedDate: visitDate.toISOString().split('T')[0], // YYYY-MM-DD format
//       };

//       console.log('Sending request:', requestData);

//       const response = await createAffiliatedClubRequest(requestData);

//       Alert.alert(
//         'Success',
//         'Visit request submitted successfully! You will receive a confirmation email.',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               setModalVisible(false);
//             }
//           }
//         ]
//       );

//     } catch (error) {
//       console.log('Error submitting request:', error);
//       let errorMessage = 'Failed to submit visit request. Please try again.';

//       if (error.response) {
//         // Handle specific HTTP errors
//         const status = error.response.status;
//         if (status === 404) {
//           errorMessage = 'Member or club not found. Please check your membership number.';
//         } else if (status === 400) {
//           errorMessage = 'Invalid request data. Please check your information.';
//         } else if (status === 500) {
//           errorMessage = 'Server error. Please try again later.';
//         } else {
//           errorMessage = error.response.data?.message || errorMessage;
//         }
//       }

//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderClubCards = () => {
//     if (clubsLoading) {
//       return (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#A3834C" />
//           <Text style={styles.loadingText}>Loading clubs...</Text>
//         </View>
//       );
//     }

//     if (clubs.length === 0) {
//       return (
//         <View style={styles.noDataContainer}>
//           <Text style={styles.noDataText}>No affiliated clubs available</Text>
//           <Text style={styles.noDataSubText}>
//             There are currently no clubs in the system
//           </Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={fetchAffiliatedClubs}
//           >
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     if (filteredClubs.length === 0) {
//       return (
//         <View style={styles.noResultsContainer}>
//           <Icon name="search-off" size={50} color="#ccc" />
//           <Text style={styles.noResultsText}>No clubs found</Text>
//           <Text style={styles.noResultsSubtext}>
//             Try searching with different keywords
//           </Text>
//         </View>
//       );
//     }

//     return filteredClubs.map((club, index) => {
//       const clubImage = club.image
//         ? { uri: club.image }
//         : require('../../assets/psc_home.jpeg');

//       return (
//         <TouchableOpacity
//           key={club.id || index}
//           style={styles.card}
//           onPress={() => openVisitModal(club)}
//           activeOpacity={0.9}
//         >
//           <ImageBackground
//             source={clubImage}
//             style={styles.cardBackground}
//             imageStyle={styles.cardImage}
//           >
//             <View style={styles.overlay} />
//             <View style={styles.cardContent}>
//               <View style={styles.textContainer}>
//                 <Text style={styles.cardTitle}>{club.name}</Text>

//                 {club.location && (
//                   <Text style={styles.cardDescription}>
//                     📍 {club.location}
//                   </Text>
//                 )}

//                 {/* {club.email && (
//                   <Text style={styles.detailText}>
//                     📧 {club.email}
//                   </Text>
//                 )}

//                 {club.contactNo && (
//                   <Text style={styles.detailText}>
//                     📞 {club.contactNo}
//                   </Text>
//                 )}

//                 {club.description && (
//                   <Text style={styles.cardDescription} numberOfLines={2}>
//                     {club.description}
//                   </Text>
//                 )} */}

//                 {/* <View style={styles.statusContainer}>
//                   <Text style={[
//                     styles.statusText,
//                     club.isActive ? styles.statusActive : styles.statusInactive
//                   ]}>
//                     {club.isActive ? '✅ Available for Visits' : '❌ Not Available'}
//                   </Text>
//                 </View> */}
//               </View>

//               <View style={styles.arrowContainer}>
//                 <Text style={styles.arrowIcon}>›</Text>
//               </View>
//             </View>
//           </ImageBackground>
//         </TouchableOpacity>
//       );
//     });
//   };

//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.container}>
//         <ImageBackground
//           source={require('../../assets/notch.jpg')}
//           style={styles.notch}
//           imageStyle={styles.notchImage}
//         >
//           <View style={styles.notchContent}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.navigate('Home')}
//             >
//               <Icon name="arrow-back" size={28} color="#000000" />
//             </TouchableOpacity>
//             <Text style={styles.headerText}>Affiliated Clubs</Text>
//             <View style={{ width: 40 }} />
//           </View>
//         </ImageBackground>

//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search clubs by name, location..."
//             placeholderTextColor="#888"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
//               <Icon name="close" size={18} color="#888" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Results Count */}
//         {searchQuery.length > 0 && (
//           <View style={styles.resultsContainer}>
//             <Text style={styles.resultsText}>
//               {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} found
//             </Text>
//           </View>
//         )}

//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={['#A3834C']}
//                 tintColor="#A3834C"
//               />
//             }
//           >
//             <View style={styles.infoContainer}>
//               {/* <Text style={styles.infoText}>
//                 🏢 Showing {clubs.length} affiliated clubs
//               </Text> */}
//               <Text style={styles.instructionText}>
//                 Tap on a club to request a visit
//               </Text>
//             </View>

//             {renderClubCards()}
//           </ScrollView>
//         </SafeAreaView>

//         {/* Visit Request Modal - Simplified to match web portal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <ScrollView contentContainerStyle={styles.modalScrollContent}>
//               <View style={styles.modalView}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalTitle}>
//                     Visit Request
//                   </Text>
//                   <TouchableOpacity
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Text style={styles.closeButtonText}>×</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Club Info */}
//                 {selectedClub && (
//                   <View style={styles.selectedClubInfo}>
//                     <Text style={styles.selectedClubName}>{selectedClub.name}</Text>
//                     {selectedClub.location && (
//                       <Text style={styles.selectedClubLocation}>📍 {selectedClub.location}</Text>
//                     )}
//                   </View>
//                 )}

//                 {/* Membership Number */}
//                 {/* <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Membership Number *</Text>
//                   <TextInput
//                     value={memberId}
//                     onChangeText={setMemberId}
//                     style={styles.input}
//                     placeholder="Enter your membership number"
//                     placeholderTextColor="#888"
//                     editable={false}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                   />
//                   {userProfile && (
//                     <Text style={styles.hintText}>
//                       Your profile: {userProfile.firstName || ''} {userProfile.lastName || ''}
//                     </Text>
//                   )}
//                 </View> */}

//                 {/* Visit Date Picker */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Visit Date *</Text>
//                   <TouchableOpacity
//                     style={styles.datePickerButton}
//                     onPress={() => setShowDatePicker(true)}
//                   >
//                     <Text style={styles.dateText}>
//                       {formatDate(visitDate)}
//                     </Text>
//                     <Text style={styles.calendarIcon}>📅</Text>
//                   </TouchableOpacity>
//                   <Text style={styles.hintText}>
//                     Select your preferred visit date
//                   </Text>
//                 </View>

//                 {/* Date Picker */}
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={visitDate}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleDateChange}
//                     minimumDate={new Date()}
//                     style={styles.datePicker}
//                   />
//                 )}

//                 {/* Action Buttons */}
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalBtn, styles.cancelBtn]}
//                     onPress={() => setModalVisible(false)}
//                     disabled={loading}
//                   >
//                     <Text style={styles.modalBtnText}>Cancel</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[styles.modalBtn, styles.sendBtn]}
//                     onPress={handleSendVisitRequest}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <>
//                         <Text style={styles.modalBtnText}>Submit Request</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>

//                 {/* Terms/Info */}
//                 <Text style={styles.termsText}>
//                   By submitting, you agree that an email will be sent to you and the club for confirmation.
//                 </Text>
//               </View>
//             </ScrollView>
//           </View>
//         </Modal>

//         {/* Instructions Modal */}
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={instructionsModalVisible}
//           onRequestClose={() => setInstructionsModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.instructionsModalView}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.instructionsTitle}>How to Request a Visit</Text>
//                 <TouchableOpacity
//                   style={styles.closeButton}
//                   onPress={() => setInstructionsModalVisible(false)}
//                 >
//                   <Text style={styles.closeButtonText}>×</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.instructionStep}>
//                 <Text style={styles.stepNumber}>1</Text>
//                 <Text style={styles.stepText}>Select a club from the list</Text>
//               </View>
//               <View style={styles.instructionStep}>
//                 <Text style={styles.stepNumber}>2</Text>
//                 <Text style={styles.stepText}>Select your desired visit date</Text>
//               </View>
//               <View style={styles.instructionStep}>
//                 <Text style={styles.stepNumber}>3</Text>
//                 <Text style={styles.stepText}>Submit your request</Text>
//               </View>
//               <Text style={styles.noteText}>
//                 Note: You will receive an email confirmation once your request is processed.
//               </Text>

//               <TouchableOpacity
//                 style={styles.gotItButton}
//                 onPress={() => setInstructionsModalVisible(false)}
//               >
//                 <Text style={styles.gotItButtonText}>Proceed</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* User Requests Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={requestsModalVisible}
//           onRequestClose={() => setRequestsModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.requestsModalView}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>My Visit Requests</Text>
//                 <TouchableOpacity
//                   style={styles.closeButton}
//                   onPress={() => setRequestsModalVisible(false)}
//                 >
//                   <Text style={styles.closeButtonText}>×</Text>
//                 </TouchableOpacity>
//               </View>

//               {requestsLoading ? (
//                 <View style={styles.modalLoadingContainer}>
//                   <ActivityIndicator size="large" color="#A3834C" />
//                   <Text style={styles.loadingText}>Loading requests...</Text>
//                 </View>
//               ) : userRequests.length === 0 ? (
//                 <View style={styles.noRequestsContainer}>
//                   <Icon name="event-busy" size={60} color="#ccc" />
//                   <Text style={styles.noRequestsText}>No requests found</Text>
//                   <Text style={styles.noRequestsSubtext}>
//                     You haven't submitted any visit requests yet.
//                   </Text>
//                 </View>
//               ) : (
//                 <ScrollView
//                   style={styles.requestsList}
//                   showsVerticalScrollIndicator={false}
//                 >
//                   {userRequests.map((req, index) => (
//                     <View key={req.id || index} style={styles.requestCard}>
//                       <View style={styles.requestCardHeader}>
//                         <Text style={styles.reqClubName}>{req.affiliatedClub?.name}</Text>
//                         <View style={[
//                           styles.statusBadge,
//                           req.status === 'APPROVED' ? styles.statusApproved :
//                             req.status === 'REJECTED' ? styles.statusRejected : styles.statusPending
//                         ]}>
//                           <Text style={styles.statusBadgeText}>{req.status || 'PENDING'}</Text>
//                         </View>
//                       </View>

//                       <View style={styles.requestDetailRow}>
//                         <Icon name="event" size={16} color="#666" />
//                         <Text style={styles.reqDateText}>
//                           Requested for: {new Date(req.requestedDate).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </Text>
//                       </View>

//                       <View style={styles.requestDetailRow}>
//                         <Icon name="access-time" size={16} color="#666" />
//                         <Text style={styles.reqDateText}>
//                           Submitted on: {new Date(req.createdAt).toLocaleDateString()}
//                         </Text>
//                       </View>
//                     </View>
//                   ))}
//                 </ScrollView>
//               )}

//               <TouchableOpacity
//                 style={styles.closeModalButton}
//                 onPress={() => setRequestsModalVisible(false)}
//               >
//                 <Text style={styles.closeModalButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   notch: {
//     paddingTop: 50,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     borderBottomEndRadius: 30,
//     borderBottomStartRadius: 30,
//     overflow: 'hidden',
//     minHeight: 120,
//   },
//   notchImage: {
//     resizeMode: 'cover',
//   },
//   notchContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   historyButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000000',
//     flex: 1,
//     textAlign: 'center',
//   },
//   // Search bar styles
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 15,
//     marginTop: 10,
//     marginBottom: 5,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#333',
//     paddingVertical: 8,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   resultsContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 5,
//   },
//   resultsText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     paddingBottom: 30,
//   },
//   infoContainer: {
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   instructionText: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 5,
//     marginLeft: 80
//   },
//   card: {
//     marginBottom: 15,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   cardBackground: {
//     height: 180,
//   },
//   cardImage: {
//     borderRadius: 15,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   cardContent: {
//     flex: 1,
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#fff',
//     marginBottom: 5,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#fff',
//     marginBottom: 5,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   statusContainer: {
//     marginTop: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   statusActive: {
//     color: '#4CAF50',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   statusInactive: {
//     color: '#F44336',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   arrowContainer: {
//     justifyContent: 'center',
//   },
//   arrowIcon: {
//     fontSize: 30,
//     color: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   noDataContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 50,
//   },
//   noDataText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#666',
//     marginBottom: 10,
//   },
//   noDataSubText: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 40,
//   },
//   retryButton: {
//     backgroundColor: '#A3834C',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   noResultsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   noResultsText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#999',
//     marginTop: 12,
//   },
//   noResultsSubtext: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 6,
//   },
//   instructionsCard: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     marginTop: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   instructionsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   instructionStep: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   stepNumber: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#A3834C',
//     color: '#fff',
//     textAlign: 'center',
//     lineHeight: 24,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   stepText: {
//     fontSize: 14,
//     color: '#555',
//     flex: 1,
//   },
//   noteText: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//   },
//   modalScrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalView: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#A3834C',
//     flex: 1,
//   },
//   closeButton: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 20,
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   selectedClubInfo: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#A3834C',
//   },
//   selectedClubName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   selectedClubLocation: {
//     fontSize: 14,
//     color: '#666',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#f9f9f9',
//     color: '#333',
//   },
//   hintText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5,
//   },
//   datePickerButton: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   calendarIcon: {
//     fontSize: 18,
//   },
//   datePicker: {
//     marginVertical: 10,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   modalBtn: {
//     flex: 1,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     paddingVertical: 15,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   cancelBtn: {
//     backgroundColor: '#6c757d',
//   },
//   sendBtn: {
//     backgroundColor: '#A3834C',
//   },
//   modalBtnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginRight: 5,
//   },
//   submitIcon: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   termsText: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   // Instructions Modal Styles
//   instructionsModalView: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 25,
//     margin: 20,
//     maxWidth: 400,
//     alignSelf: 'center',
//     elevation: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   instructionsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#A3834C',
//     flex: 1,
//   },
//   instructionStep: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   stepNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#A3834C',
//     color: '#fff',
//     textAlign: 'center',
//     lineHeight: 28,
//     fontWeight: 'bold',
//     marginRight: 12,
//     fontSize: 14,
//   },
//   stepText: {
//     fontSize: 15,
//     color: '#333',
//     flex: 1,
//     lineHeight: 20,
//   },
//   noteText: {
//     fontSize: 13,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 20,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     lineHeight: 18,
//   },
//   gotItButton: {
//     backgroundColor: '#A3834C',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   gotItButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   historyButton: {
//     position: 'absolute',
//     right: 0,
//     padding: 5,
//   },
//   requestsModalView: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     width: '90%',
//     maxHeight: '80%',
//     alignSelf: 'center',
//     elevation: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//   },
//   modalLoadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   noRequestsContainer: {
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   noRequestsText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#666',
//     marginTop: 15,
//   },
//   noRequestsSubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   requestsList: {
//     marginTop: 10,
//   },
//   requestCard: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   requestCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   reqClubName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginLeft: 10,
//   },
//   statusBadgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   statusApproved: {
//     backgroundColor: '#4CAF50',
//   },
//   statusRejected: {
//     backgroundColor: '#F44336',
//   },
//   statusPending: {
//     backgroundColor: '#FF9800',
//   },
//   requestDetailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   reqDateText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 6,
//   },
//   closeModalButton: {
//     backgroundColor: '#A3834C',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   closeModalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default aff_club;

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAffiliatedClubs,
  createAffiliatedClubRequest,
  getUserData,
  getUserAffiliatedClubRequests,
  getAffiliatedClubRequests,
  getCurrentAdmin
} from '../../config/apis';

const aff_club = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [instructionsModalVisible, setInstructionsModalVisible] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Stats State
  const [isAdmin, setIsAdmin] = useState(false);
  const [clubStats, setClubStats] = useState({});

  // Form state - only these 3 fields are needed as per web portal
  const [visitDate, setVisitDate] = useState(new Date());
  const [memberId, setMemberId] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Requests state
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUserProfile();
    fetchAffiliatedClubs();
    // Show instructions modal on first visit
    setInstructionsModalVisible(true);
  }, []);

  const checkAdminStatus = async () => {
    const admin = await getCurrentAdmin();
    if (admin) {
      setIsAdmin(true);
      fetchClubStats();
    }
  };

  const fetchClubStats = async () => {
    try {
      // Frontend Logic: Fetch all requests and count them per club
      // Passing no arguments to get ALL requests (might require backend support for no-filter)
      // If backend requires filters, this might need adjustment, but user prompt implies no specific clubId gets everything.
      const allRequests = await getAffiliatedClubRequests();

      const statsMap = {};
      if (Array.isArray(allRequests)) {
        allRequests.forEach(req => {
          const clubId = req.affiliatedClubId;
          if (clubId) {
            statsMap[clubId] = (statsMap[clubId] || 0) + 1;
          }
        });
      }
      setClubStats(statsMap);
      console.log('📊 Calculated Club Stats:', statsMap);
    } catch (error) {
      console.log('Error fetching/calculating stats:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserData();
      setUserProfile(profile);
      // Try to get membership number from different possible fields
      setMemberId(profile.membershipNumber || profile.membershipNo || profile.Membership_No || profile.memberId || '');
    } catch (error) {
      console.log('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user information');
    }
  };

  const fetchAffiliatedClubs = async () => {
    try {
      setClubsLoading(true);
      const clubsData = await getAffiliatedClubs();
      const activeClubs = clubsData.filter(club => club.isActive !== false);
      setClubs(activeClubs);
    } catch (error) {
      console.log('Error fetching clubs:', error);
      Alert.alert('Error', 'Failed to load clubs. Please try again.');
    } finally {
      setClubsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAffiliatedClubs();
  };

  const openVisitModal = (club) => {
    setSelectedClub(club);
    setVisitDate(new Date());
    setShowDatePicker(false);
    // Show instructions modal first, then the visit request modal
    setInstructionsModalVisible(true);
    setModalVisible(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const fetchUserRequests = async () => {
    if (!memberId) {
      Alert.alert('Error', 'Membership information not found. Please log in again.');
      return;
    }

    try {
      setRequestsLoading(true);
      setRequestsModalVisible(true);
      const data = await getUserAffiliatedClubRequests(memberId);
      setUserRequests(data);
    } catch (error) {
      console.log('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to load your requests. Please try again.');
    } finally {
      setRequestsLoading(false);
    }
  };

  // Filter clubs based on search query
  const filteredClubs = clubs.filter((club) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = club.name?.toLowerCase().includes(query);
    const locationMatch = club.location?.toLowerCase().includes(query);
    const addressMatch = club.address?.toLowerCase().includes(query);
    return nameMatch || locationMatch || addressMatch;
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setVisitDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSendVisitRequest = async () => {
    if (!memberId || memberId.trim() === '') {
      Alert.alert('Error', 'Member ID is required');
      return;
    }

    if (!visitDate) {
      Alert.alert('Error', 'Please select a visit date');
      return;
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(visitDate);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      Alert.alert('Error', 'Cannot select a past date');
      return;
    }

    setLoading(true);

    try {
      // Prepare payload exactly as web portal expects
      const requestData = {
        affiliatedClubId: selectedClub.id,
        membershipNo: memberId,
        requestedDate: visitDate.toISOString().split('T')[0], // YYYY-MM-DD format
      };

      console.log('Sending request:', requestData);

      const response = await createAffiliatedClubRequest(requestData);

      Alert.alert(
        'Success',
        'Visit request submitted successfully! You will receive a confirmation email.',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
            }
          }
        ]
      );

    } catch (error) {
      console.log('Error submitting request:', error);
      let errorMessage = 'Failed to submit visit request. Please try again.';

      if (error.response) {
        // Handle specific HTTP errors
        const status = error.response.status;
        if (status === 404) {
          errorMessage = 'Member or club not found. Please check your membership number.';
        } else if (status === 400) {
          errorMessage = 'Invalid request data. Please check your information.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderClubCards = () => {
    if (clubsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A3834C" />
          <Text style={styles.loadingText}>Loading clubs...</Text>
        </View>
      );
    }

    if (clubs.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No affiliated clubs available</Text>
          <Text style={styles.noDataSubText}>
            There are currently no clubs in the system
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchAffiliatedClubs}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredClubs.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={50} color="#ccc" />
          <Text style={styles.noResultsText}>No clubs found</Text>
          <Text style={styles.noResultsSubtext}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return filteredClubs.map((club, index) => {
      const clubImage = club.image
        ? { uri: club.image }
        : require('../../assets/psc_home.jpeg');

      return (
        <TouchableOpacity
          key={club.id || index}
          style={styles.card}
          onPress={() => openVisitModal(club)}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={clubImage}
            style={styles.cardBackground}
            imageStyle={styles.cardImage}
          >
            <View style={styles.overlay} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{club.name}</Text>

                {club.location && (
                  <Text style={styles.cardDescription}>
                    📍 {club.location}
                  </Text>
                )}

                {/* Admin Stats Badge */}
                {isAdmin && clubStats[club.id] !== undefined && (
                  <View style={styles.statBadge}>
                    <Icon name="people" size={14} color="#FFF" />
                    <Text style={styles.statText}>
                      {clubStats[club.id]} Visitors
                    </Text>
                  </View>
                )}

                {/* {club.email && (
                  <Text style={styles.detailText}>
                    📧 {club.email}
                  </Text>
                )}

                {club.contactNo && (
                  <Text style={styles.detailText}>
                    📞 {club.contactNo}
                  </Text>
                )}

                {club.description && (
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {club.description}
                  </Text>
                )} */}

                {/* <View style={styles.statusContainer}>
                  <Text style={[
                    styles.statusText,
                    club.isActive ? styles.statusActive : styles.statusInactive
                  ]}>
                    {club.isActive ? '✅ Available for Visits' : '❌ Not Available'}
                  </Text>
                </View> */}
              </View>

              <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/notch.jpg')}
          style={styles.notch}
          imageStyle={styles.notchImage}
        >
          <View style={styles.notchContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Icon name="arrow-back" size={28} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Affiliated Clubs</Text>
            <View style={{ width: 40 }} />
          </View>
        </ImageBackground>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs by name, location..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        {searchQuery.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'} found
            </Text>
          </View>
        )}

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#A3834C']}
                tintColor="#A3834C"
              />
            }
          >
            <View style={styles.infoContainer}>
              {/* <Text style={styles.infoText}>
                🏢 Showing {clubs.length} affiliated clubs
              </Text> */}
              <Text style={styles.instructionText}>
                Tap on a club to request a visit
              </Text>
            </View>

            {renderClubCards()}
          </ScrollView>
        </SafeAreaView>

        {/* Visit Request Modal - Simplified to match web portal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Visit Request
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* Club Info */}
                {selectedClub && (
                  <View style={styles.selectedClubInfo}>
                    <Text style={styles.selectedClubName}>{selectedClub.name}</Text>
                    {selectedClub.location && (
                      <Text style={styles.selectedClubLocation}>📍 {selectedClub.location}</Text>
                    )}
                  </View>
                )}

                {/* Membership Number */}
                {/* <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Membership Number *</Text>
                  <TextInput
                    value={memberId}
                    onChangeText={setMemberId}
                    style={styles.input}
                    placeholder="Enter your membership number"
                    placeholderTextColor="#888"
                    editable={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {userProfile && (
                    <Text style={styles.hintText}>
                      Your profile: {userProfile.firstName || ''} {userProfile.lastName || ''}
                    </Text>
                  )}
                </View> */}

                {/* Visit Date Picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Visit Date *</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {formatDate(visitDate)}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </TouchableOpacity>
                  <Text style={styles.hintText}>
                    Select your preferred visit date
                  </Text>
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                  <DateTimePicker
                    value={visitDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    style={styles.datePicker}
                  />
                )}

                {/* Action Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={() => setModalVisible(false)}
                    disabled={loading}
                  >
                    <Text style={styles.modalBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.sendBtn]}
                    onPress={handleSendVisitRequest}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.modalBtnText}>Submit Request</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Terms/Info */}
                <Text style={styles.termsText}>
                  By submitting, you agree that an email will be sent to you and the club for confirmation.
                </Text>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Instructions Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={instructionsModalVisible}
          onRequestClose={() => setInstructionsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.instructionsModalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.instructionsTitle}>How to Request a Visit</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setInstructionsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.instructionStep}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Select a club from the list</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Select your desired visit date</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>Submit your request</Text>
              </View>
              <Text style={styles.noteText}>
                Note: You will receive an email confirmation once your request is processed.
              </Text>

              <TouchableOpacity
                style={styles.gotItButton}
                onPress={() => setInstructionsModalVisible(false)}
              >
                <Text style={styles.gotItButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* User Requests Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={requestsModalVisible}
          onRequestClose={() => setRequestsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.requestsModalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>My Visit Requests</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setRequestsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {requestsLoading ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#A3834C" />
                  <Text style={styles.loadingText}>Loading requests...</Text>
                </View>
              ) : userRequests.length === 0 ? (
                <View style={styles.noRequestsContainer}>
                  <Icon name="event-busy" size={60} color="#ccc" />
                  <Text style={styles.noRequestsText}>No requests found</Text>
                  <Text style={styles.noRequestsSubtext}>
                    You haven't submitted any visit requests yet.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.requestsList}
                  showsVerticalScrollIndicator={false}
                >
                  {userRequests.map((req, index) => (
                    <View key={req.id || index} style={styles.requestCard}>
                      <View style={styles.requestCardHeader}>
                        <Text style={styles.reqClubName}>{req.affiliatedClub?.name}</Text>
                        <View style={[
                          styles.statusBadge,
                          req.status === 'APPROVED' ? styles.statusApproved :
                            req.status === 'REJECTED' ? styles.statusRejected : styles.statusPending
                        ]}>
                          <Text style={styles.statusBadgeText}>{req.status || 'PENDING'}</Text>
                        </View>
                      </View>

                      <View style={styles.requestDetailRow}>
                        <Icon name="event" size={16} color="#666" />
                        <Text style={styles.reqDateText}>
                          Requested for: {new Date(req.requestedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>

                      <View style={styles.requestDetailRow}>
                        <Icon name="access-time" size={16} color="#666" />
                        <Text style={styles.reqDateText}>
                          Submitted on: {new Date(req.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setRequestsModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  statText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#FEF9F3',
  },
  notch: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    overflow: 'hidden',
    minHeight: 120,
  },
  notchImage: {
    resizeMode: 'cover',
  },
  notchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  // Search bar styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  resultsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  infoContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    marginLeft: 80
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBackground: {
    height: 180,
  },
  cardImage: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusActive: {
    color: '#4CAF50',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusInactive: {
    color: '#F44336',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 30,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#A3834C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 6,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#b48a64',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b48a64',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  selectedClubInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#A3834C',
  },
  selectedClubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedClubLocation: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 18,
  },
  datePicker: {
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
  },
  sendBtn: {
    backgroundColor: '#b48a64',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
  },
  submitIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  // Instructions Modal Styles
  instructionsModalView: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    maxWidth: 400,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b48a64',
    flex: 1,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#b48a64',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 14,
  },
  stepText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    lineHeight: 18,
  },
  gotItButton: {
    backgroundColor: '#b48a64',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  gotItButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  requestsModalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignSelf: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalLoadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noRequestsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRequestsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
  },
  noRequestsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  requestsList: {
    marginTop: 10,
  },
  requestCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  requestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reqClubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusRejected: {
    backgroundColor: '#F44336',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
  requestDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reqDateText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  closeModalButton: {
    backgroundColor: '#b48a64',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default aff_club;