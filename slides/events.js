// // import React from 'react';
// // import {
// //   SafeAreaView,
// //   StyleSheet,
// //   Text,
// //   View,
// //   StatusBar,
// //   ScrollView,
// //   ImageBackground,
// //   TouchableOpacity,
// // } from 'react-native';
// // import AntIcon from "react-native-vector-icons/AntDesign";
// // import BellIcon from "react-native-vector-icons/Feather";

// // const events = ({ navigation }) => {

// //   const sportsData = [
// //     {
// //       id: 1,
// //       title: 'Vintage Car Rally',
// //       image: require('../assets/vin.jpg'),
// //       onPress: () => navigation.navigate('VCR'),
// //     },
// //     {
// //       id: 2,
// //       title: 'Grand Tambola Night',
// //       image: require('../assets/tamb.jpg'),
// //       onPress: () => navigation.navigate('GTN'),
// //     },
// //     {
// //       id: 3,
// //       title: 'Chand Raat',
// //       image: require('../assets/cd.jpg'),
// //       onPress: () => navigation.navigate('CR'),
// //     },
// //     {
// //       id: 4,
// //       title: 'New Year Night',
// //       image: require('../assets/ny0.jpg'),
// //       onPress: () => navigation.navigate('NY'),
// //     },
// //     {
// //       id: 5,
// //       title: 'Spring Festival',
// //       image: require('../assets/sp.jpg'),
// //       onPress: () => navigation.navigate('SF'),
// //     },
// //     {
// //       id: 6,
// //       title: 'Live Screaning of Matches',
// //       image: require('../assets/lv.jpg'),
// //       onPress: () => navigation.navigate('LCM'),
// //     },
// //     {
// //       id: 7,
// //       title: 'Saturday Night Buffet',
// //       image: require('../assets/s.jpg'),
// //       onPress: () => navigation.navigate('SNB'),
// //     },
// //     {
// //       id: 8,
// //       title: 'Hi Tea',
// //       image: require('../assets/sb1.jpg'),
// //       onPress: () => navigation.navigate('HiTea'),
// //     },
// //     {
// //       id: 9,
// //       title: 'Sunday Bruch',
// //       image: require('../assets/h.jpg'),
// //       onPress: () => navigation.navigate('SB'),
// //     },

// //   ];

// //   return (
// //     <>
// //       <StatusBar barStyle="light-content" />
// //       <View style={styles.container}>
// //         {/* 🔹 Notch Header */}
// //         <ImageBackground
// //           source={require("../assets/notch.jpg")}
// //           style={styles.notch}
// //           imageStyle={styles.notchImage}
// //         >
// //           <View style={styles.notchContent}>

// //             {/* Back Button (Real Icon) */}
// //             <TouchableOpacity
// //               style={styles.backButton}
// //               onPress={() => navigation.navigate("start")}
// //             >
// //               <AntIcon name="arrowleft" size={28} color="#000" />
// //             </TouchableOpacity>

// //             <Text style={styles.headerText}>Events</Text>




// //           </View>
// //         </ImageBackground>

// //         {/* 🔹 Main Scrollable Content */}
// //         <SafeAreaView style={styles.safeArea}>
// //           <ScrollView
// //             style={styles.scrollView}
// //             contentContainerStyle={styles.scrollContent}
// //             showsVerticalScrollIndicator={false}
// //           >
// //             {/* 🔹 Sports Cards */}
// //             {sportsData.map((sport) => (
// //               <TouchableOpacity
// //                 key={sport.id}
// //                 style={styles.sportCard}
// //                 onPress={sport.onPress} // ✅ Navigation fixed
// //               >
// //                 <ImageBackground
// //                   source={sport.image}
// //                   style={styles.sportCardBackground}
// //                   imageStyle={styles.sportCardImage}
// //                 >
// //                   <View style={styles.overlay} />
// //                   <View style={styles.sportCardContent}>
// //                     <Text style={styles.sportTitle}>{sport.title}</Text>
// //                     <View style={styles.arrowContainer}>
// //                       <Text style={styles.arrowIcon}>›</Text>
// //                     </View>
// //                   </View>
// //                 </ImageBackground>
// //               </TouchableOpacity>
// //             ))}
// //           </ScrollView>
// //         </SafeAreaView>
// //       </View>
// //     </>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F5F5F5',
// //   },
// //   notch: {
// //     paddingTop: 50,
// //     paddingBottom: 20,
// //     paddingHorizontal: 20,
// //     borderBottomEndRadius: 30,
// //     borderBottomStartRadius: 30,
// //     overflow: 'hidden',
// //     minHeight: 120,
// //   },
// //   notchImage: {
// //     resizeMode: 'cover',
// //   },
// //   notchContent: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   backIcon: {
// //     fontSize: 28,
// //     color: '#000',
// //     fontWeight: 'bold',
// //   },
// //   headerText: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     color: '#000',
// //     textAlign: 'center',
// //     flex: 1,
// //     marginRight: 55,
// //     marginBottom: 6
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   safeArea: {
// //     flex: 1,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     paddingVertical: 15,
// //     paddingHorizontal: 20,
// //     paddingBottom: 30,
// //   },
// //   sportCard: {
// //     height: 120,
// //     width: '100%',
// //     marginBottom: 12,
// //     borderRadius: 15,
// //     overflow: 'hidden',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     elevation: 6,
// //   },
// //   sportCardBackground: {
// //     width: '100%',
// //     height: '100%',
// //     justifyContent: 'center',
// //   },
// //   sportCardImage: {
// //     borderRadius: 15,
// //     resizeMode: 'cover',
// //   },
// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0, 0, 0, 0.4)',
// //   },
// //   sportCardContent: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     zIndex: 1,
// //   },
// //   sportTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFF',
// //     textShadowColor: 'rgba(0, 0, 0, 0.75)',
// //     textShadowOffset: { width: -1, height: 1 },
// //     textShadowRadius: 6,
// //   },
// //   arrowContainer: {
// //     width: 2,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.3)',
// //     position: 'absolute',
// //     right: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   arrowIcon: {
// //     fontSize: 32,
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //     position: 'absolute',
// //     right: -15,
// //   },
// // });

// // export default events;

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
//   Alert,
//   RefreshControl,
//   Image,
//   useWindowDimensions
// } from 'react-native';
// import RenderHtml from 'react-native-render-html';
// import { getEvents } from '../config/apis';
// import Icon from 'react-native-vector-icons/Ionicons';

// const events = ({ navigation }) => {
//   const { width } = useWindowDimensions();
//   const [eventsData, setEventsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedFilter, setSelectedFilter] = useState('Upcoming');

//   const decodeHtml = (html) => {
//     if (!html) return '';
//     return html
//       .replace(/&amp;/g, '&')
//       .replace(/&lt;/g, '<')
//       .replace(/&gt;/g, '>')
//       .replace(/&quot;/g, '"')
//       .replace(/&#039;/g, "'")
//       .replace(/&nbsp;/g, ' ');
//   };

//   // Function to fetch events from backend
//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('🔄 Fetching events...');

//       const data = await getEvents();
//       console.log('📊 Raw API data:', data);

//       // Check if data is an array
//       if (!Array.isArray(data)) {
//         console.warn('⚠️ API did not return an array:', data);
//         setEventsData(getFallbackEvents());
//         return;
//       }

//       // Transform the data
//       const transformedEvents = data
//         // .filter(event => event.isActive !== false) // Remove filter temporarily for debugging
//         .map((event, index) => {
//           console.log(`Processing event ${index + 1}:`, event);

//           // Handle images - check if images is a string or array
//           let imageSource;
//           if (event.images) {
//             try {
//               // Check if images is a string that needs parsing
//               const imagesArray = typeof event.images === 'string'
//                 ? JSON.parse(event.images)
//                 : event.images;

//               if (Array.isArray(imagesArray) && imagesArray.length > 0) {
//                 imageSource = { uri: imagesArray[0] };
//               } else {
//                 imageSource = require('../assets/psc_home.jpeg');
//               }
//             } catch (err) {
//               console.warn('Failed to parse images:', err);
//               imageSource = require('../assets/psc_home.jpeg');
//             }
//           } else {
//             imageSource = require('../assets/psc_home.jpeg');
//           }

//           return {
//             id: event.id || `event-${index}`,
//             title: event.title || 'Untitled Event',
//             description: event.description || 'No description available',
//             image: imageSource,
//             date: event.date || event.createdAt || '',
//             startDate: event.startDate || event.date || event.createdAt || '',
//             endDate: event.endDate || event.date || event.createdAt || '',
//             time: event.time || '',
//             location: event.location || '',
//             isActive: event.isActive !== false,
//             rawData: event, // Keep original data for debugging
//             onPress: () => handleEventPress(event),
//           };
//         });

//       console.log('✅ Transformed events:', transformedEvents);
//       setEventsData(transformedEvents);

//     } catch (error) {
//       console.error('❌ Error fetching events:', error);
//       setError(error.message || 'Failed to load events');
//       Alert.alert('Error', 'Failed to load events. Using sample data instead.');

//       // Fallback to dummy data
//       setEventsData(getFallbackEvents());
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Fallback dummy data
//   const getFallbackEvents = () => {
//     console.log('🔄 Using fallback events');
//     return [
//       {
//         id: 1,
//         title: 'Vintage Car Rally',
//         image: require('../assets/psc_home.jpeg'),
//         description: 'Join us for our annual vintage car exhibition and rally.',
//         date: '2024-03-15',
//         onPress: () => navigation.navigate('EventDetails', {
//           event: {
//             id: 1,
//             title: 'Vintage Car Rally',
//             image: require('../assets/psc_home.jpeg'),
//             description: 'Join us for our annual vintage car exhibition and rally.',
//             date: '2024-03-15',
//             time: '10:00 AM - 4:00 PM',
//             location: 'Main Club Lawn'
//           }
//         }),
//       },
//       {
//         id: 2,
//         title: 'Grand Tambola Night',
//         image: require('../assets/psc_home.jpeg'),
//         description: 'Exciting tambola night with amazing prizes.',
//         date: '2024-03-20',
//         onPress: () => navigation.navigate('EventDetails', {
//           event: {
//             id: 2,
//             title: 'Grand Tambola Night',
//             image: require('../assets/psc_home.jpeg'),
//             description: 'Exciting tambola night with amazing prizes.',
//             date: '2024-03-20',
//             time: '7:00 PM - 11:00 PM',
//             location: 'Banquet Hall'
//           }
//         }),
//       },
//       {
//         id: 3,
//         title: 'New Year Gala',
//         image: require('../assets/psc_home.jpeg'),
//         description: 'Celebrate the new year with music, dance, and fine dining.',
//         date: '2024-12-31',
//         onPress: () => navigation.navigate('EventDetails', {
//           event: {
//             id: 3,
//             title: 'New Year Gala',
//             image: require('../assets/psc_home.jpeg'),
//             description: 'Celebrate the new year with music, dance, and fine dining.',
//             date: '2024-12-31',
//             time: '8:00 PM - 1:00 AM',
//             location: 'Main Club House'
//           }
//         }),
//       },
//     ];
//   };

//   // Handle event press
//   const handleEventPress = (event) => {
//     console.log('Event pressed:', event.title);
//     navigation.navigate('EventDetails', { event });
//   };

//   // Pull to refresh
//   const onRefresh = () => {
//     console.log('🔄 Manual refresh triggered');
//     setRefreshing(true);
//     fetchEvents();
//   };

//   // Load events on component mount
//   useEffect(() => {
//     console.log('📱 Events screen mounted');
//     fetchEvents();
//   }, []);

//   // Filtering logic
//   const getFilteredEvents = () => {
//     const now = new Date();
//     // Reset time for date comparison
//     now.setHours(0, 0, 0, 0);

//     return eventsData.filter(event => {
//       const start = new Date(event.startDate);
//       const end = new Date(event.endDate);

//       // Reset times for date comparison
//       start.setHours(0, 0, 0, 0);
//       end.setHours(0, 0, 0, 0);

//       if (selectedFilter === 'Upcoming') {
//         // Merge Ongoing into Upcoming: show if hasn't ended yet
//         return end >= now;
//       } else if (selectedFilter === 'Past') {
//         return end < now;
//       }
//       return true;
//     });
//   };

//   const filteredEvents = getFilteredEvents();

//   // Loading state
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <StatusBar barStyle="light-content" backgroundColor="black" />
//         <ActivityIndicator size="large" color="#A3834C" />
//         <Text style={styles.loadingText}>Loading events...</Text>
//         {/* <Text style={styles.debugText}>Fetching from: {'/content/events'}</Text> */}
//       </View>
//     );
//   }

//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="black" />
//       <View style={styles.container}>
//         {/* 🔹 Notch Header */}
//         <ImageBackground
//           source={require('../assets/notch.jpg')}
//           style={styles.notch}
//           imageStyle={styles.notchImage}
//         >
//           <View style={styles.notchContent}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.navigate('start')}
//             >
//               <Icon name="arrow-back" size={28} color="#000" />
//             </TouchableOpacity>
//             <Text style={styles.headerText}>Events</Text>
//           </View>
//         </ImageBackground>

//         {/* 🔹 Filter Section */}
//         <View style={styles.filterContainer}>
//           {['Upcoming', 'Past'].map((filter) => (
//             <TouchableOpacity
//               key={filter}
//               style={[
//                 styles.filterTab,
//                 selectedFilter === filter && styles.activeFilterTab
//               ]}
//               onPress={() => setSelectedFilter(filter)}
//             >
//               <Text style={[
//                 styles.filterTabText,
//                 selectedFilter === filter && styles.activeFilterTabText
//               ]}>
//                 {filter}
//               </Text>
//               {selectedFilter === filter && <View style={styles.activeIndicator} />}
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* 🔹 Main Scrollable Content */}
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
//             {/* Events Count */}
//             {/* <View style={styles.eventsCountContainer}>
//               <Text style={styles.eventsCountText}>
//                 {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} in {selectedFilter}
//               </Text>
//             </View> */}

//             {/* 🔹 Events Cards */}
//             {filteredEvents.length > 0 ? (
//               filteredEvents.map((event) => (
//                 <TouchableOpacity
//                   key={event.id}
//                   style={styles.eventCard}
//                   onPress={event.onPress}
//                 >
//                   <ImageBackground
//                     source={event.image}
//                     style={styles.eventCardBackground}
//                     imageStyle={styles.eventCardImage}
//                   >
//                     <View style={styles.overlay} />
//                     <View style={styles.eventCardContent}>
//                       <View style={styles.eventInfo}>
//                         <Text style={styles.eventTitle}>{event.title}</Text>
//                         {/* {event.description && (
//                           <View style={{ height: 40, overflow: 'hidden', marginBottom: 6 }}>
//                             <RenderHtml
//                               contentWidth={width - 80} // Adjust for padding
//                               source={{ html: decodeHtml(event.description || '') }}
//                               baseStyle={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 18 }}
//                               tagsStyles={{
//                                 p: { margin: 0, padding: 0 },
//                                 ul: { margin: 0, paddingLeft: 10 },
//                                 li: { margin: 0 },
//                                 img: { display: 'none' } // Hide images in preview
//                               }}
//                             />
//                           </View>
//                         )} */}
//                         {event.startDate && (
//                           <Text style={styles.eventDate}>
//                             📅 {(() => {
//                               const start = new Date(event.startDate);
//                               const end = new Date(event.endDate);

//                               if (!event.endDate || start.toDateString() === end.toDateString()) {
//                                 return start.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
//                               }

//                               const startDay = start.getDate();
//                               const endDay = end.getDate();
//                               const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
//                               const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
//                               const startYear = start.getFullYear();
//                               const endYear = end.getFullYear();

//                               if (startMonth === endMonth && startYear === endYear) {
//                                 return `${startDay}-${endDay} ${startMonth} ${startYear}`;
//                               }
//                               return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
//                             })()}
//                           </Text>
//                         )}
//                         {event.time && (
//                           <Text style={styles.eventTime}>⏰ {event.time}</Text>
//                         )}
//                       </View>
//                       <View style={styles.arrowContainer}>
//                         <Icon name="chevron-forward" size={24} color="#FFF" />
//                       </View>
//                     </View>
//                   </ImageBackground>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               // No events state
//               <View style={styles.noEventsContainer}>
//                 <Text style={styles.noEventsText}>No {selectedFilter.toLowerCase()} events available</Text>
//                 <Text style={styles.noEventsSubText}>
//                   Feel free to check other categories or check back later
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.retryButton}
//                   onPress={fetchEvents}
//                 >
//                   <Text style={styles.retryButtonText}>Refresh Events</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   debugText: {
//     fontSize: 12,
//     color: '#888',
//     marginTop: 5,
//     textAlign: 'center',
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
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backIcon: {
//     fontSize: 28,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//     flex: 1,
//     marginRight: 50
//   },
//   debugButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   debugButtonText: {
//     fontSize: 20,
//     color: '#000',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     justifyContent: 'space-around',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEE',
//   },
//   filterTab: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   activeFilterTab: {
//     backgroundColor: '#F9F4EB',
//   },
//   filterTabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#888',
//   },
//   activeFilterTabText: {
//     color: '#A3834C',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     bottom: -4,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#A3834C',
//   },
//   debugContainer: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   eventsCountContainer: {
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   eventsCountText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   errorContainer: {
//     backgroundColor: '#fff3cd',
//     borderColor: '#ffeaa7',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 20,
//   },
//   errorText: {
//     color: '#856404',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   errorSubText: {
//     color: '#856404',
//     fontSize: 12,
//   },
//   eventCard: {
//     height: 140,
//     width: '100%',
//     marginBottom: 12,
//     borderRadius: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   eventCardBackground: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   eventCardImage: {
//     borderRadius: 15,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   eventCardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     zIndex: 1,
//   },
//   eventInfo: {
//     flex: 1,
//   },
//   eventTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 6,
//     marginBottom: 4,
//   },
//   eventDescription: {
//     fontSize: 13,
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   eventDate: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 4,
//     marginBottom: 2,
//   },
//   eventTime: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 4,
//   },
//   arrowContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingLeft: 10,
//   },
//   arrowIcon: {
//     // No longer used for text, keeping it here won't hurt or can be removed
//   },
//   noEventsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//     paddingHorizontal: 20,
//   },
//   noEventsText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   noEventsSubText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   retryButton: {
//     backgroundColor: '#A3834C',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     width: '80%',
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   sampleButton: {
//     backgroundColor: '#8B4513',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: '80%',
//   },
//   sampleButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });

// export default events;

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   ScrollView,
//   ImageBackground,
//   TouchableOpacity,
// } from 'react-native';
// import AntIcon from "react-native-vector-icons/AntDesign";
// import BellIcon from "react-native-vector-icons/Feather";

// const events = ({ navigation }) => {

//   const sportsData = [
//     {
//       id: 1,
//       title: 'Vintage Car Rally',
//       image: require('../assets/vin.jpg'),
//       onPress: () => navigation.navigate('VCR'),
//     },
//     {
//       id: 2,
//       title: 'Grand Tambola Night',
//       image: require('../assets/tamb.jpg'),
//       onPress: () => navigation.navigate('GTN'),
//     },
//     {
//       id: 3,
//       title: 'Chand Raat',
//       image: require('../assets/cd.jpg'),
//       onPress: () => navigation.navigate('CR'),
//     },
//     {
//       id: 4,
//       title: 'New Year Night',
//       image: require('../assets/ny0.jpg'),
//       onPress: () => navigation.navigate('NY'),
//     },
//     {
//       id: 5,
//       title: 'Spring Festival',
//       image: require('../assets/sp.jpg'),
//       onPress: () => navigation.navigate('SF'),
//     },
//     {
//       id: 6,
//       title: 'Live Screaning of Matches',
//       image: require('../assets/lv.jpg'),
//       onPress: () => navigation.navigate('LCM'),
//     },
//     {
//       id: 7,
//       title: 'Saturday Night Buffet',
//       image: require('../assets/s.jpg'),
//       onPress: () => navigation.navigate('SNB'),
//     },
//     {
//       id: 8,
//       title: 'Hi Tea',
//       image: require('../assets/sb1.jpg'),
//       onPress: () => navigation.navigate('HiTea'),
//     },
//     {
//       id: 9,
//       title: 'Sunday Bruch',
//       image: require('../assets/h.jpg'),
//       onPress: () => navigation.navigate('SB'),
//     },

//   ];

//   return (
//     <>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.container}>
//         {/* 🔹 Notch Header */}
//         <ImageBackground
//           source={require("../assets/notch.jpg")}
//           style={styles.notch}
//           imageStyle={styles.notchImage}
//         >
//           <View style={styles.notchContent}>

//             {/* Back Button (Real Icon) */}
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.navigate("start")}
//             >
//               <AntIcon name="arrowleft" size={28} color="#000" />
//             </TouchableOpacity>

//             <Text style={styles.headerText}>Events</Text>




//           </View>
//         </ImageBackground>

//         {/* 🔹 Main Scrollable Content */}
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* 🔹 Sports Cards */}
//             {sportsData.map((sport) => (
//               <TouchableOpacity
//                 key={sport.id}
//                 style={styles.sportCard}
//                 onPress={sport.onPress} // ✅ Navigation fixed
//               >
//                 <ImageBackground
//                   source={sport.image}
//                   style={styles.sportCardBackground}
//                   imageStyle={styles.sportCardImage}
//                 >
//                   <View style={styles.overlay} />
//                   <View style={styles.sportCardContent}>
//                     <Text style={styles.sportTitle}>{sport.title}</Text>
//                     <View style={styles.arrowContainer}>
//                       <Text style={styles.arrowIcon}>›</Text>
//                     </View>
//                   </View>
//                 </ImageBackground>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </SafeAreaView>
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
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backIcon: {
//     fontSize: 28,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//     textAlign: 'center',
//     flex: 1,
//     marginRight: 55,
//     marginBottom: 6
//   },
//   placeholder: {
//     width: 40,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   sportCard: {
//     height: 120,
//     width: '100%',
//     marginBottom: 12,
//     borderRadius: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   sportCardBackground: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//   },
//   sportCardImage: {
//     borderRadius: 15,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   sportCardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     zIndex: 1,
//   },
//   sportTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 6,
//   },
//   arrowContainer: {
//     width: 2,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     position: 'absolute',
//     right: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrowIcon: {
//     fontSize: 32,
//     color: '#FFF',
//     fontWeight: 'bold',
//     position: 'absolute',
//     right: -15,
//   },
// });

// export default events;

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
  Alert,
  RefreshControl,
  Image,
  useWindowDimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { getEvents } from '../config/apis';
import Icon from 'react-native-vector-icons/Ionicons';

const events = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Upcoming');

  const decodeHtml = (html) => {
    if (!html) return '';
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  };

  // Function to fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching events...');

      const data = await getEvents();
      console.log('📊 Raw API data:', data);

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.warn('⚠️ API did not return an array:', data);
        setEventsData(getFallbackEvents());
        return;
      }

      // Transform the data
      const transformedEvents = data
        // .filter(event => event.isActive !== false) // Remove filter temporarily for debugging
        .map((event, index) => {
          console.log(`Processing event ${index + 1}:`, event);

          // Handle images - check if images is a string or array
          let imageSource;
          if (event.images) {
            try {
              // Check if images is a string that needs parsing
              const imagesArray = typeof event.images === 'string'
                ? JSON.parse(event.images)
                : event.images;

              if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                imageSource = { uri: imagesArray[0] };
              } else {
                imageSource = require('../assets/psc_home.jpeg');
              }
            } catch (err) {
              console.warn('Failed to parse images:', err);
              imageSource = require('../assets/psc_home.jpeg');
            }
          } else {
            imageSource = require('../assets/psc_home.jpeg');
          }

          return {
            id: event.id || `event-${index}`,
            title: event.title || 'Untitled Event',
            description: event.description || 'No description available',
            image: imageSource,
            date: event.date || event.createdAt || '',
            startDate: event.startDate || event.date || event.createdAt || '',
            endDate: event.endDate || event.date || event.createdAt || '',
            time: event.time || '',
            location: event.location || '',
            isActive: event.isActive !== false,
            rawData: event, // Keep original data for debugging
            onPress: () => handleEventPress(event),
          };
        });

      console.log('✅ Transformed events:', transformedEvents);
      setEventsData(transformedEvents);

    } catch (error) {
      console.error('❌ Error fetching events:', error);
      setError(error.message || 'Failed to load events');
      Alert.alert('Error', 'Failed to load events. Using sample data instead.');

      // Fallback to dummy data
      setEventsData(getFallbackEvents());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback dummy data
  const getFallbackEvents = () => {
    console.log('🔄 Using fallback events');
    return [
      {
        id: 1,
        title: 'Vintage Car Rally',
        image: require('../assets/psc_home.jpeg'),
        description: 'Join us for our annual vintage car exhibition and rally.',
        date: '2024-03-15',
        onPress: () => navigation.navigate('EventDetails', {
          event: {
            id: 1,
            title: 'Vintage Car Rally',
            image: require('../assets/psc_home.jpeg'),
            description: 'Join us for our annual vintage car exhibition and rally.',
            date: '2024-03-15',
            time: '10:00 AM - 4:00 PM',
            location: 'Main Club Lawn'
          }
        }),
      },
      {
        id: 2,
        title: 'Grand Tambola Night',
        image: require('../assets/psc_home.jpeg'),
        description: 'Exciting tambola night with amazing prizes.',
        date: '2024-03-20',
        onPress: () => navigation.navigate('EventDetails', {
          event: {
            id: 2,
            title: 'Grand Tambola Night',
            image: require('../assets/psc_home.jpeg'),
            description: 'Exciting tambola night with amazing prizes.',
            date: '2024-03-20',
            time: '7:00 PM - 11:00 PM',
            location: 'Banquet Hall'
          }
        }),
      },
      {
        id: 3,
        title: 'New Year Gala',
        image: require('../assets/psc_home.jpeg'),
        description: 'Celebrate the new year with music, dance, and fine dining.',
        date: '2024-12-31',
        onPress: () => navigation.navigate('EventDetails', {
          event: {
            id: 3,
            title: 'New Year Gala',
            image: require('../assets/psc_home.jpeg'),
            description: 'Celebrate the new year with music, dance, and fine dining.',
            date: '2024-12-31',
            time: '8:00 PM - 1:00 AM',
            location: 'Main Club House'
          }
        }),
      },
    ];
  };

  // Handle event press
  const handleEventPress = (event) => {
    console.log('Event pressed:', event.title);
    navigation.navigate('EventDetails', { event });
  };

  // Pull to refresh
  const onRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    fetchEvents();
  };

  // Load events on component mount
  useEffect(() => {
    console.log('📱 Events screen mounted');
    fetchEvents();
  }, []);

  // Filtering logic
  const getFilteredEvents = () => {
    const now = new Date();
    // Reset time for date comparison
    now.setHours(0, 0, 0, 0);

    return eventsData.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      // Reset times for date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (selectedFilter === 'Upcoming') {
        // Merge Ongoing into Upcoming: show if hasn't ended yet
        return end >= now;
      } else if (selectedFilter === 'Past') {
        return end < now;
      }
      return true;
    });
  };

  const filteredEvents = getFilteredEvents();

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <ActivityIndicator size="large" color="#b48a64" />
        <Text style={styles.loadingText}>Loading events...</Text>
        {/* <Text style={styles.debugText}>Fetching from: {'/content/events'}</Text> */}
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        {/* 🔹 Notch Header */}
        <ImageBackground
          source={require('../assets/notch.jpg')}
          style={styles.notch}
          imageStyle={styles.notchImage}
        >
          <View style={styles.notchContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('start')}
            >
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Events</Text>
            <View style={{ width: 40 }} />
          </View>
        </ImageBackground>

        {/* 🔹 Filter Section */}
        <View style={styles.filterContainer}>
          {['Upcoming', 'Past'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter && styles.activeFilterTabText
              ]}>
                {filter}
              </Text>
              {selectedFilter === filter && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Main Scrollable Content */}
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#b48a64']}
                tintColor="#b48a64"
              />
            }
          >
            {/* Events Count */}
            {/* <View style={styles.eventsCountContainer}>
              <Text style={styles.eventsCountText}>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} in {selectedFilter}
              </Text>
            </View> */}

            {/* 🔹 Events Cards */}
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={event.onPress}
                >
                  <ImageBackground
                    source={event.image}
                    style={styles.eventCardBackground}
                    imageStyle={styles.eventCardImage}
                  >
                    <View style={styles.overlay} />
                    <View style={styles.eventCardContent}>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        {/* {event.description && (
                          <View style={{ height: 40, overflow: 'hidden', marginBottom: 6 }}>
                            <RenderHtml
                              contentWidth={width - 80} // Adjust for padding
                              source={{ html: decodeHtml(event.description || '') }}
                              baseStyle={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 18 }}
                              tagsStyles={{
                                p: { margin: 0, padding: 0 },
                                ul: { margin: 0, paddingLeft: 10 },
                                li: { margin: 0 },
                                img: { display: 'none' } // Hide images in preview
                              }}
                            />
                          </View>
                        )} */}
                        {event.startDate && (
                          <Text style={styles.eventDate}>
                            📅 {(() => {
                              const start = new Date(event.startDate);
                              const end = new Date(event.endDate);

                              if (!event.endDate || start.toDateString() === end.toDateString()) {
                                return start.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                              }

                              const startDay = start.getDate();
                              const endDay = end.getDate();
                              const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
                              const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
                              const startYear = start.getFullYear();
                              const endYear = end.getFullYear();

                              if (startMonth === endMonth && startYear === endYear) {
                                return `${startDay}-${endDay} ${startMonth} ${startYear}`;
                              }
                              return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
                            })()}
                          </Text>
                        )}
                        {event.time && (
                          <Text style={styles.eventTime}>⏰ {event.time}</Text>
                        )}
                      </View>
                      <View style={styles.arrowContainer}>
                        <Icon name="chevron-forward" size={24} color="#FFF" />
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
            ) : (
              // No events state
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No {selectedFilter.toLowerCase()} events available</Text>
                <Text style={styles.noEventsSubText}>
                  Feel free to check other categories or check back later
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchEvents}
                >
                  <Text style={styles.retryButtonText}>Refresh Events</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  debugText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  debugButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugButtonText: {
    fontSize: 20,
    color: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  activeFilterTab: {
    backgroundColor: '#F9F4EB',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeFilterTabText: {
    color: '#b48a64',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#b48a64',
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  eventsCountContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  eventsCountText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  errorSubText: {
    color: '#856404',
    fontSize: 12,
  },
  eventCard: {
    height: 140,
    width: '100%',
    marginBottom: 12,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  eventCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  eventCardImage: {
    borderRadius: 15,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  eventCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 6,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    lineHeight: 18,
  },
  eventDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  arrowIcon: {
    // No longer used for text, keeping it here won't hurt or can be removed
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noEventsSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#b48a64',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sampleButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
  },
  sampleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default events;