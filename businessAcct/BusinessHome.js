// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ActivityIndicator, 
//   Alert,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   RefreshControl
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BusinessAccount from '../components/BusinessAccount';
// import Logbook from '../screens/Logbook';

// const BusinessHome = ({ navigation }) => {
//   const [businessData, setBusinessData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const [summary, setSummary] = useState({
//     totalIncome: 0,
//     totalExpenses: 0,
//     netBalance: 0,
//     recentTransactions: []
//   });

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setRefreshing(true);
//     try {
//       await fetchBusinessData();
//       await fetchDashboardData();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   const fetchBusinessData = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError || !user) throw userError || new Error("No user found");
      
//       setUser(user);
      
//       const { data, error } = await supabase
//         .from('business_users')
//         .select(`
//           business_name, 
//           phone_number, 
//           shop_number, 
//           area, 
//           city,
//           business_types (name)
//         `)
//         .eq('user_id', user.id);

//       if (error) throw error;

//       if (data && data.length > 0) {
//         setBusinessData(data[0]);
//       } else {
//         const userRegistrationKey = `businessRegistered_${user.id}`;
//         await AsyncStorage.removeItem(userRegistrationKey);
//         Alert.alert("Business Not Found", "Please register your business", [
//           { text: "OK", onPress: () => navigation.replace('BusinessAccount') }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching business data:', error);
//       Alert.alert('Error', 'Failed to load business data');
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from('business_logs')
//         .select('id, amount, type, category, description, log_date')
//         .eq('user_id', user.id)
//         .order('log_date', { ascending: false });

//       if (error) throw error;

//       let totalIncome = 0, totalExpenses = 0;
//       data.forEach(({ amount, type }) => {
//         if (type === 'income') totalIncome += amount;
//         else if (type === 'expense') totalExpenses += amount;
//       });

//       setSummary({
//         totalIncome,
//         totalExpenses,
//         netBalance: totalIncome - totalExpenses,
//         recentTransactions: data.slice(0, 5)
//       });
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       Alert.alert("Error", "Failed to load transaction data");
//     }
//   };

//   const handleRefresh = () => {
//     fetchAllData();
//   };

//   const businessSections = [
//     {
//       title: 'Logbook',
//       items: [
//         { 
//           name: 'Daily Logs', 
//           icon: 'event-note',
//           screen: 'Logbook'
//         },
//         { 
//           name: 'Add Entry', 
//           icon: 'add-circle-outline',
//           screen: 'AddLogEntry'
//         },
//         { 
//           name: 'Reports', 
//           icon: 'assessment',
//           screen: 'Reports'
//         },
//         { 
//           name: 'Dashboard', 
//           icon: 'dashboard',
//           screen: 'Dashboard'
//         },
//         { 
//           name: 'Customers', 
//           icon: 'people',
//           screen: 'CustomersScreen'
//         },
//       ]
//     }
//   ];

//   useEffect(() => {
//     const fetchBusinessData = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         setUser(user);
        
//         const { data, error } = await supabase
//           .from('business_users')
//           .select(`
//             business_name, 
//             phone_number, 
//             shop_number, 
//             area, 
//             city,
//             business_types (name)
//           `)
//           .eq('user_id', user.id);

//         if (error) {
//           throw error;
//         }

//         if (data && data.length > 0) {
//           setBusinessData(data[0]);
//         } else {
//           // Remove user-specific registration flag
//           const userRegistrationKey = `businessRegistered_${user.id}`;
//           await AsyncStorage.removeItem(userRegistrationKey);
          
//           Alert.alert("Business Not Found", "Please register your business", [
//             { text: "OK", onPress: () => navigation.replace('BusinessAccount') }
//           ]);
//         }
//       } catch (error) {
//         console.error('Error fetching business data:', error);
//         Alert.alert('Error', 'Failed to load business data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessData();
//   }, []);

//   const handleMenuItemPress = (screen) => {
//     navigation.navigate(screen);
//   };

//   const handleLogout = async () => {
//     if (user) {
//       // Remove user-specific registration flag
//       const userRegistrationKey = `businessRegistered_${user.id}`;
//       await AsyncStorage.removeItem(userRegistrationKey);
//     }
    
//     await supabase.auth.signOut();
//     navigation.navigate('Login');
//   };

//   const renderMenuItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.menuItem} 
//       onPress={() => handleMenuItemPress(item.screen)}
//     >
//       <View style={styles.iconContainer}>
//         <Icon name={item.icon} size={32} color="#FFF0DC" />
//       </View>
//       <Text style={styles.menuItemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#543A14" />
//       </View>
//     );
//   }

//   if (!businessData) {
//     return (
//       <View style={[styles.container, styles.centerContainer]}>
//         <Text style={styles.title}>No business data found</Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.replace('BusinessAccount')}
//         >
//           <Text style={styles.buttonText}>Register Business</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const deleteTransaction = async (id) => {
//     Alert.alert(
//       "Delete Transaction",
//       "Are you sure you want to delete this transaction?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive", 
//           onPress: async () => {
//             try {
//               const { error } = await supabase
//                 .from('business_logs')
//                 .delete()
//                 .eq('id', id);

//               if (error) throw error;

//               // Immediately update UI by filtering out deleted item
//               setSummary(prev => ({
//                 ...prev,
//                 recentTransactions: prev.recentTransactions.filter(t => t.id !== id)
//               }));
              
//               // Then refresh all data to update totals
//               await fetchDashboardData();
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

  
// return (
//     <ScrollView 
//       contentContainerStyle={styles.scrollContainer}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           colors={['#4CAF50']}
//           tintColor={'#4CAF50'}
//         />
//       }
//     >
//       {/* Header with business info */}
//       <View style={styles.header}>
//         <View style={styles.businessInfo}>
//           <TouchableOpacity 
//         onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}
//       >
//           <Icon name="store" size={30} color="#543A14" style={styles.businessIcon} />
//          </TouchableOpacity> 

//           <View>
//                <TouchableOpacity 
//         onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}
//       >
//             <Text style={styles.businessName}>{businessData?.business_name}</Text>
//             <Text style={styles.businessType}>{businessData?.business_types?.name}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Icon name="logout" size={24} color="#FFF0DC" />
//         </TouchableOpacity>
//       </View>
      
//       {/* Summary Cards */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.row}>
//           <View style={[styles.summaryCard, styles.halfCard]}>
//             <Text style={styles.summaryLabel}>Total Income</Text>
//             <Text style={[styles.summaryValue, styles.income]}>
//               Rs{summary.totalIncome.toFixed(1)}
//             </Text>
//           </View>
          
//           <View style={[styles.summaryCard, styles.halfCard]}>
//             <Text style={styles.summaryLabel}>Total Expenses</Text>
//             <Text style={[styles.summaryValue, styles.expense]}>
//               Rs{summary.totalExpenses.toFixed(1)}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.fullWidthCard}>
//           <Text style={styles.summaryLabel}>Net Balance</Text>
//           <Text style={[
//             styles.summaryValue,
//             summary.netBalance >= 0 ? styles.income : styles.expense
//           ]}>
//             Rs{summary.netBalance.toFixed(1)}
//           </Text>
//         </View>
//       </View>

//       {/* Quick Actions Menu */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//         <FlatList
//           data={businessSections[0].items}
//           renderItem={renderMenuItem}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={2}
//           scrollEnabled={false}
//           contentContainerStyle={styles.menuContainer}
//         />
//       </View>

//       {/* Recent Transactions */}
//         <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Recent Transactions</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Logbook')}>
//           <Text style={styles.viewAll}>View All</Text>
//         </TouchableOpacity>
//       </View>
      
//       <SwipeListView
//         data={summary.recentTransactions}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//   <View style={styles.rowFront}>
//     <View style={styles.transactionCard}>
//       {/* Amount & Date on the left */}
//       <View style={styles.transactionLeft}>
//         <Text style={[
//           styles.transactionAmount, 
//           item.type === 'income' ? styles.income : styles.expense
//         ]}>
//           Rs{item.amount.toFixed(2)}
//         </Text>
//         <Text style={styles.transactionDate}>
//           {new Date(item.log_date).toLocaleDateString()}
//         </Text>
//       </View>

//       {/* Category & Description on the right */}
//       <View style={styles.transactionRight}>
//         <Text style={styles.transactionCategory}>{item.category}</Text>
//         <Text style={styles.transactionDescription}>{item.description}</Text>
//       </View>
//     </View>
//   </View>
// )}
//         renderHiddenItem={({ item }) => (
//           <View style={styles.rowBack}>
//             <TouchableOpacity 
//               style={styles.deleteButton} 
//               onPress={() => deleteTransaction(item.id)}
//             >
//               <Text style={styles.deleteText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         leftOpenValue={0}
//         rightOpenValue={-80}
//       />
//     </ScrollView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: 'black',
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//      backgroundColor: '#1E1E1E',
//     // backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   businessInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   businessIcon: {
//     marginRight: 15,
//     backgroundColor: '#FFF0DC',
//     padding: 12,
//     borderRadius: 12,
//   },
//   businessName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//   },
//   businessType: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   logoutButton: {
//     backgroundColor: '',
//     padding: 10,
//     borderRadius: 10,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 25,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 15,
//     marginHorizontal: 5,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 5,
//     color: '#FFF0DC',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#888',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//      //color: '#543A14',
//      color: '#FFF0DC',
//     paddingLeft: 10,
//     textAlign : 'center'
//   },
//   menuContainer: {
//     justifyContent: 'space-between',
//   },
//   menuItem: {
//     width: '48%',
//     backgroundColor:  '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     margin: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
    
//   },
//   iconContainer: {
//     //backgroundColor: '#f0e6d8',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   menuItemText: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     color: '#FFF0DC',
//   },
//   activityCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   activityText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#555',
//   },
//   button: {
//     backgroundColor: '#543A14',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#543A14',
//   },
//     summaryContainer: {
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryCard: {
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 10,
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   halfCard: {
//     width: '48%', 
//   },
//   fullWidthCard: {
//     width: '100%',
//     backgroundColor: '#1E1E1E',
//     padding: 25,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth : 1,
//     borderColor : '#FFF0DC'
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#FFF0DC',
//     fontWeight: '500',
//     marginBottom: 5,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   income: { color: '#4CAF50' },
//   expense: { color: '#F44336' },

//   transactionCard: {
//     backgroundColor: '#1E1E1E',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   transactionLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   transactionRight: {
//     alignItems: 'flex-end',
//   },
//   transactionCategory: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EAEAEA',
//   },
//   transactionDescription: {
//     fontSize: 14,
//     color: '#A0A0A0',
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   transactionDate: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   rowBack: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     backgroundColor: '#F44336',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   deleteButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: '100%',
//   },
//   deleteText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//     sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   viewAll: {
//     color: '#543A14',
//     fontSize: 14,
//     fontWeight : "900"
//   },


// });

// export default BusinessHome;

// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   StyleSheet, 
// //   ActivityIndicator, 
// //   Alert,
// //   ScrollView,
// //   TouchableOpacity,
// //   FlatList,
// //   RefreshControl,
// //   Dimensions
// // } from 'react-native';
// // import { SwipeListView } from 'react-native-swipe-list-view';
// // import { supabase } from '../lib/supabase';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const BusinessHome = ({ navigation }) => {
// //   const [businessData, setBusinessData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState(null);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [summary, setSummary] = useState({
// //     totalIncome: 0,
// //     totalExpenses: 0,
// //     netBalance: 0,
// //     recentTransactions: []
// //   });

// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   const fetchAllData = async () => {
// //     setRefreshing(true);
// //     try {
// //       await fetchBusinessData();
// //       await fetchDashboardData();
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     } finally {
// //       setRefreshing(false);
// //       setLoading(false);
// //     }
// //   };

// //   const fetchBusinessData = async () => {
// //     try {
// //       const { data: { user }, error: userError } = await supabase.auth.getUser();
// //       if (userError || !user) throw userError || new Error("No user found");
      
// //       setUser(user);
      
// //       const { data, error } = await supabase
// //         .from('business_users')
// //         .select(`
// //           business_name, 
// //           phone_number, 
// //           shop_number, 
// //           area, 
// //           city,
// //           business_types (name)
// //         `)
// //         .eq('user_id', user.id);

// //       if (error) throw error;

// //       if (data && data.length > 0) {
// //         setBusinessData(data[0]);
// //       } else {
// //         const userRegistrationKey = `businessRegistered_${user.id}`;
// //         await AsyncStorage.removeItem(userRegistrationKey);
// //         Alert.alert("Business Not Found", "Please register your business", [
// //           { text: "OK", onPress: () => navigation.replace('BusinessAccount') }
// //         ]);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching business data:', error);
// //       Alert.alert('Error', 'Failed to load business data');
// //     }
// //   };

// //   const fetchDashboardData = async () => {
// //     try {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       if (!user) return;

// //       const { data, error } = await supabase
// //         .from('business_logs')
// //         .select('id, amount, type, category, description, log_date')
// //         .eq('user_id', user.id)
// //         .order('log_date', { ascending: false });

// //       if (error) throw error;

// //       let totalIncome = 0, totalExpenses = 0;
// //       data.forEach(({ amount, type }) => {
// //         if (type === 'income') totalIncome += amount;
// //         else if (type === 'expense') totalExpenses += amount;
// //       });

// //       setSummary({
// //         totalIncome,
// //         totalExpenses,
// //         netBalance: totalIncome - totalExpenses,
// //         recentTransactions: data.slice(0, 5)
// //       });
// //     } catch (error) {
// //       console.error("Error fetching transactions:", error);
// //       Alert.alert("Error", "Failed to load transaction data");
// //     }
// //   };

// //   const handleRefresh = () => {
// //     fetchAllData();
// //   };

// //   const businessSections = [
// //     {
// //       title: 'Logbook',
// //       items: [
// //         { 
// //           name: 'Daily Logs', 
// //           emoji: '📅',
// //           screen: 'Logbook'
// //         },
// //         { 
// //           name: 'Add Entry', 
// //           emoji: '➕',
// //           screen: 'AddLogEntry'
// //         },
// //         { 
// //           name: 'Reports', 
// //           emoji: '📊',
// //           screen: 'Reports'
// //         },
// //         { 
// //           name: 'Dashboard', 
// //           emoji: '📈',
// //           screen: 'Dashboard'
// //         },
// //         { 
// //           name: 'Customers', 
// //           emoji: '👥',
// //           screen: 'CustomersScreen'
// //         },
// //       ]
// //     }
// //   ];

// //   const handleMenuItemPress = (screen) => {
// //     navigation.navigate(screen);
// //   };

// //   const handleLogout = async () => {
// //     if (user) {
// //       const userRegistrationKey = `businessRegistered_${user.id}`;
// //       await AsyncStorage.removeItem(userRegistrationKey);
// //     }
    
// //     await supabase.auth.signOut();
// //     navigation.navigate('Login');
// //   };

// //   const renderMenuItem = ({ item }) => (
// //     <TouchableOpacity 
// //       style={styles.menuItem} 
// //       onPress={() => handleMenuItemPress(item.screen)}
// //     >
// //       <View style={styles.iconContainer}>
// //         <Text style={styles.emojiIcon}>{item.emoji}</Text>
// //       </View>
// //       <Text style={styles.menuItemText}>{item.name}</Text>
// //     </TouchableOpacity>
// //   );

// //   const deleteTransaction = async (id) => {
// //     Alert.alert(
// //       "Delete Transaction",
// //       "Are you sure you want to delete this transaction?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Delete", 
// //           style: "destructive", 
// //           onPress: async () => {
// //             try {
// //               const { error } = await supabase
// //                 .from('business_logs')
// //                 .delete()
// //                 .eq('id', id);

// //               if (error) throw error;

// //               // Immediately update UI by filtering out deleted item
// //               setSummary(prev => ({
// //                 ...prev,
// //                 recentTransactions: prev.recentTransactions.filter(t => t.id !== id)
// //               }));
              
// //               // Then refresh all data to update totals
// //               await fetchDashboardData();
// //             } catch (error) {
// //               Alert.alert("Error", error.message);
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <View style={[styles.container, styles.loadingContainer]}>
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       </View>
// //     );
// //   }

// //   if (!businessData) {
// //     return (
// //       <View style={[styles.container, styles.centerContainer]}>
// //         <Text style={styles.title}>No business data found</Text>
// //         <TouchableOpacity
// //           style={styles.button}
// //           onPress={() => navigation.replace('BusinessAccount')}
// //         >
// //           <Text style={styles.buttonText}>Register Business</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   return (
// //     <ScrollView 
// //       style={styles.container}
// //       refreshControl={
// //         <RefreshControl
// //           refreshing={refreshing}
// //           onRefresh={handleRefresh}
// //           colors={['#D2B48C']}
// //           tintColor={'#D2B48C'}
// //         />
// //       }
// //     >
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity 
// //           style={styles.businessInfo}
// //           onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}
// //         >
// //           <View style={styles.businessIcon}>
// //             <Text style={styles.emoji}>🏪</Text>
// //           </View>
// //           <View>
// //             <Text style={styles.businessName}>{businessData?.business_name}</Text>
// //             <Text style={styles.businessType}>
// //               {businessData?.business_types?.name} • {businessData?.city}
// //             </Text>
// //           </View>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// //           <Text style={styles.logoutText}>Logout</Text>
// //         </TouchableOpacity>
// //       </View>
      
// //       {/* Financial Summary */}
// //       <View style={styles.summaryContainer}>
// //         <View style={styles.row}>
// //           <View style={[styles.summaryCard, styles.halfCard]}>
// //             <Text style={styles.emojiSummary}>💰</Text>
// //             <Text style={styles.summaryLabel}>Total Income</Text>
// //             <Text style={[styles.summaryValue, styles.income]}>
// //               Rs{summary.totalIncome.toFixed(1)}
// //             </Text>
// //           </View>
          
// //           <View style={[styles.summaryCard, styles.halfCard]}>
// //             <Text style={styles.emojiSummary}>💸</Text>
// //             <Text style={styles.summaryLabel}>Total Expenses</Text>
// //             <Text style={[styles.summaryValue, styles.expense]}>
// //               Rs{summary.totalExpenses.toFixed(1)}
// //             </Text>
// //           </View>
// //         </View>

// //         <View style={[styles.summaryCard, styles.fullWidthCard]}>
// //           <Text style={styles.emojiSummary}>⚖️</Text>
// //           <Text style={styles.summaryLabel}>Net Balance</Text>
// //           <Text style={[
// //             styles.summaryValue,
// //             summary.netBalance >= 0 ? styles.income : styles.expense
// //           ]}>
// //             Rs{summary.netBalance.toFixed(1)}
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Quick Actions */}
// //       <Text style={styles.sectionTitle}>Quick Actions</Text>
// //       <FlatList
// //         data={businessSections[0].items}
// //         renderItem={renderMenuItem}
// //         keyExtractor={(item, index) => index.toString()}
// //         numColumns={2}
// //         scrollEnabled={false}
// //         contentContainerStyle={styles.menuContainer}
// //       />

// //       {/* Recent Transactions with Swipe to Delete */}
// //       <View style={styles.sectionHeader}>
// //         <Text style={styles.sectionTitle}>Recent Transactions</Text>
// //         <TouchableOpacity onPress={() => navigation.navigate('Logbook')}>
// //           <Text style={styles.viewAll}>View All →</Text>
// //         </TouchableOpacity>
// //       </View>
      
// //       {summary.recentTransactions.length === 0 ? (
// //         <View style={styles.emptyState}>
// //           <Text style={styles.emoji}>📝</Text>
// //           <Text style={styles.emptyText}>No transactions yet</Text>
// //           <TouchableOpacity 
// //             style={styles.addButton}
// //             onPress={() => navigation.navigate('AddLogEntry')}
// //           >
// //             <Text style={styles.addButtonText}>Add Your First Entry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <SwipeListView
// //           data={summary.recentTransactions}
// //           keyExtractor={(item) => item.id.toString()}
// //           renderItem={({ item }) => (
// //             <TouchableOpacity 
// //               style={styles.transactionCard}
// //               // onPress={() => navigation.navigate('EditLogEntry', { entryId: item.id })}
// //             >
// //               <View style={styles.transactionIcon}>
// //                 <Text style={styles.emoji}>
// //                   {item.type === 'income' ? '⬇️' : '⬆️'}
// //                 </Text>
// //               </View>
              
// //               <View style={styles.transactionDetails}>
// //                 <Text style={styles.transactionCategory}>{item.category}</Text>
// //                 <Text style={styles.transactionDescription}>
// //                   {item.description || 'No description'}
// //                 </Text>
// //               </View>
              
// //               <View style={styles.transactionAmountContainer}>
// //                 <Text style={[
// //                   styles.transactionAmount,
// //                   item.type === 'income' ? styles.income : styles.expense
// //                 ]}>
// //                   Rs{item.amount.toFixed(2)}
// //                 </Text>
// //                 <Text style={styles.transactionDate}>
// //                   {new Date(item.log_date).toLocaleDateString()}
// //                 </Text>
// //               </View>
// //             </TouchableOpacity>
// //           )}
// //           renderHiddenItem={({ item }) => (
// //             <View style={styles.rowBack}>
// //               <TouchableOpacity 
// //                 style={styles.deleteButton} 
// //                 onPress={() => deleteTransaction(item.id)}
// //               >
// //                 <Text style={styles.deleteText}>Delete</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //           leftOpenValue={0}
// //           rightOpenValue={-80}
// //         />
// //       )}
      
// //       <View style={styles.footer}>
// //         <Text style={styles.footerText}>Manage your business finances effortlessly</Text>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: 'black',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 30,
// //     marginBottom: 20,
// //   },
// //   businessInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   businessIcon: {
// //     backgroundColor: 'rgba(84, 58, 20, 0.3)',
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 15,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   emoji: {
// //     fontSize: 28,
// //   },
// //   businessName: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 4,
// //   },
// //   businessType: {
// //     fontSize: 14,
// //     color: '#D2B48C',
// //     opacity: 0.8,
// //   },
// //   logoutButton: {
// //     backgroundColor: 'rgba(210, 180, 140, 0.2)',
// //     paddingVertical: 8,
// //     paddingHorizontal: 15,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   logoutText: {
// //     color: '#D2B48C',
// //     fontWeight: '600',
// //   },
// //   summaryContainer: {
// //     marginBottom: 25,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 15,
// //   },
// //   summaryCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 20,
// //     padding: 20,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     shadowColor: '#D2B48C',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 5,
// //     alignItems: 'center',
// //   },
// //   halfCard: {
// //     width: '48%',
// //   },
// //   fullWidthCard: {
// //     width: '100%',
// //   },
// //   emojiSummary: {
// //     fontSize: 30,
// //     marginBottom: 10,
// //   },
// //   summaryLabel: {
// //     fontSize: 14,
// //     color: '#BBB',
// //     marginBottom: 5,
// //   },
// //   summaryValue: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   income: {
// //     color: '#4CAF50',
// //   },
// //   expense: {
// //     color: '#F44336',
// //   },
// //   sectionTitle: {
// //     fontSize: 22,
// //     fontWeight: '600',
// //     color: '#FFF0DC',
// //     marginBottom: 15,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 15,
// //     marginTop: 10,
// //   },
// //   viewAll: {
// //     color: '#FFD700',
// //     fontSize: 14,
// //   },
// //   menuContainer: {
// //     justifyContent: 'space-between',
// //   },
// //   menuItem: {
// //     width: '48%',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 20,
// //     padding: 20,
// //     marginBottom: 15,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginHorizontal: 5,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     shadowColor: '#D2B48C',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   iconContainer: {
// //     marginBottom: 12,
// //   },
// //   emojiIcon: {
// //     fontSize: 32,
// //   },
// //   menuItemText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     textAlign: 'center',
// //     color: '#FFF0DC',
// //   },
// //   transactionCard: {
// //     flexDirection: 'row',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 20,
// //     padding: 16,
// //     marginBottom: 12,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     shadowColor: '#D2B48C',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //   },
// //   transactionIcon: {
// //     backgroundColor: 'rgba(84, 58, 20, 0.3)',
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 15,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   transactionDetails: {
// //     flex: 1,
// //   },
// //   transactionCategory: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#FFF0DC',
// //     marginBottom: 4,
// //   },
// //   transactionDescription: {
// //     fontSize: 14,
// //     color: '#BBB',
// //   },
// //   transactionAmountContainer: {
// //     alignItems: 'flex-end',
// //   },
// //   transactionAmount: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   transactionDate: {
// //     fontSize: 12,
// //     color: '#888',
// //     marginTop: 4,
// //   },
// //   rowBack: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     borderRadius: 20,
// //     marginBottom: 12,
// //   },
// //   deleteButton: {
// //     backgroundColor: '#F44336',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: 80,
// //     height: '100%',
// //     borderTopRightRadius: 20,
// //     borderBottomRightRadius: 20,
// //   },
// //   deleteText: {
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //   },
// //   emptyState: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 20,
// //     padding: 30,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     marginVertical: 20,
// //   },
// //   emptyText: {
// //     color: '#BBB',
// //     fontSize: 16,
// //     marginVertical: 15,
// //     textAlign: 'center',
// //   },
// //   addButton: {
// //     backgroundColor: 'rgba(84, 58, 20, 0.5)',
// //     paddingVertical: 12,
// //     paddingHorizontal: 25,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   addButtonText: {
// //     color: '#FFD700',
// //     fontWeight: '600',
// //   },
// //   footer: {
// //     paddingVertical: 25,
// //     borderTopWidth: 1,
// //     borderTopColor: '#333',
// //     marginTop: 15,
// //     marginBottom: 20,
// //   },
// //   footerText: {
// //     color: '#D2B48C',
// //     fontSize: 14,
// //     textAlign: 'center',
// //     fontStyle: 'italic',
// //     opacity: 0.8,
// //   },
// //   loadingContainer: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   centerContainer: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     color: '#FFF0DC',
// //   },
// //   button: {
// //     backgroundColor: '#543A14',
// //     padding: 15,
// //     borderRadius: 10,
// //     marginTop: 20,
// //     alignItems: 'center',
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// // });

// // export default BusinessHome;

//BusinessHome.js

//ios test 
// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ActivityIndicator, 
//   Alert,
//   TouchableOpacity,
//   FlatList,
//   RefreshControl
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BusinessHome = ({ navigation }) => {
//   const [businessData, setBusinessData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const [summary, setSummary] = useState({
//     totalIncome: 0,
//     totalExpenses: 0,
//     netBalance: 0,
//     recentTransactions: []
//   });

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setRefreshing(true);
//     try {
//       await fetchBusinessData();
//       await fetchDashboardData();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setRefreshing(false);
//       setLoading(false);
//     }
//   };

//   const fetchBusinessData = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError || !user) throw userError || new Error("No user found");
      
//       setUser(user);
      
//       const { data, error } = await supabase
//         .from('business_users')
//         .select(`
//           business_name, 
//           phone_number, 
//           shop_number, 
//           area, 
//           city,
//           business_types (name)
//         `)
//         .eq('user_id', user.id);

//       if (error) throw error;

//       if (data && data.length > 0) {
//         setBusinessData(data[0]);
//       } else {
//         const userRegistrationKey = `businessRegistered_${user.id}`;
//         await AsyncStorage.removeItem(userRegistrationKey);
//         Alert.alert("Business Not Found", "Please register your business", [
//           { text: "OK", onPress: () => navigation.replace('BusinessAccount') }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching business data:', error);
//       Alert.alert('Error', 'Failed to load business data');
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from('business_logs')
//         .select('id, amount, type, category, description, log_date')
//         .eq('user_id', user.id)
//         .order('log_date', { ascending: false });

//       if (error) throw error;

//       let totalIncome = 0, totalExpenses = 0;
//       data.forEach(({ amount, type }) => {
//         if (type === 'income') totalIncome += amount;
//         else if (type === 'expense') totalExpenses += amount;
//       });

//       setSummary({
//         totalIncome,
//         totalExpenses,
//         netBalance: totalIncome - totalExpenses,
//         recentTransactions: data.slice(0, 5)
//       });
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       Alert.alert("Error", "Failed to load transaction data");
//     }
//   };

//   const handleRefresh = () => {
//     fetchAllData();
//   };

//   const businessSections = [
//     {
//       title: 'Logbook',
//       items: [
//         { 
//           name: 'Add Entry', 
//           icon: 'add-circle-outline',
//           screen: 'AddLogEntry'
//         },
//         { 
//           name: 'Reports', 
//           icon: 'assessment',
//           screen: 'Reports'
//         },
//         { 
//           name: 'Daily Logs', 
//           icon: 'event-note',
//           screen: 'Logbook'
//         },
       
       
//         // { 
//         //   name: 'Dashboard', 
//         //   icon: 'dashboard',
//         //   screen: 'Dashboard'
//         // },
//         // { 
//         //   name: 'Customers', 
//         //   icon: 'people',
//         //   screen: 'CustomersScreen'
//         // },
//       ]
//     }
//   ];

//   const handleMenuItemPress = (screen) => {
//     navigation.navigate(screen);
//   };

//   const handleLogout = async () => {
//     if (user) {
//       // Remove user-specific registration flag
//       const userRegistrationKey = `businessRegistered_${user.id}`;
//       await AsyncStorage.removeItem(userRegistrationKey);
//     }
    
//     await supabase.auth.signOut();
//     navigation.navigate('Auth');
//   };

//   const renderMenuItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.menuItem} 
//       onPress={() => handleMenuItemPress(item.screen)}
//     >
//       <View style={styles.iconContainer}>
//         <Icon name={item.icon} size={32} color="#FFF0DC" />
//       </View>
//       <Text style={styles.menuItemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const deleteTransaction = async (id) => {
//     Alert.alert(
//       "Delete Transaction",
//       "Are you sure you want to delete this transaction?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           style: "destructive", 
//           onPress: async () => {
//             try {
//               const { error } = await supabase
//                 .from('business_logs')
//                 .delete()
//                 .eq('id', id);

//               if (error) throw error;

//               // Immediately update UI by filtering out deleted item
//               setSummary(prev => ({
//                 ...prev,
//                 recentTransactions: prev.recentTransactions.filter(t => t.id !== id)
//               }));
              
//               // Then refresh all data to update totals
//               await fetchDashboardData();
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const renderListHeader = () => (
//     <View style={styles.headerContainer}>
//       {/* Header with business info */}
//       <View style={styles.header}>
//         <View style={styles.businessInfo}>
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}
//           >
//             <Icon name="store" size={30} color="#543A14" style={styles.businessIcon} />
//           </TouchableOpacity> 

//           <View>
//             <TouchableOpacity 
//               onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}
//             >
//               <Text style={styles.businessName}>{businessData?.business_name}</Text>
//               <Text style={styles.businessType}>{businessData?.business_types?.name}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Icon name="logout" size={24} color="#FFF0DC" />
//         </TouchableOpacity>
//       </View>
      
//       {/* Summary Cards */}
//       <View style={styles.summaryContainer}>
//         <View style={styles.row}>
//           <View style={[styles.summaryCard, styles.halfCard]}>
//             <Text style={styles.summaryLabel}>Total Income</Text>
//             <Text style={[styles.summaryValue, styles.income]}>
//               Rs{summary.totalIncome.toFixed(1)}
//             </Text>
//           </View>
          
//           <View style={[styles.summaryCard, styles.halfCard]}>
//             <Text style={styles.summaryLabel}>Total Expenses</Text>
//             <Text style={[styles.summaryValue, styles.expense]}>
//               Rs{summary.totalExpenses.toFixed(1)}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.fullWidthCard}>
//           <Text style={styles.summaryLabel}>Net Balance</Text>
//           <Text style={[
//             styles.summaryValue,
//             summary.netBalance >= 0 ? styles.income : styles.expense
//           ]}>
//             Rs{summary.netBalance.toFixed(1)}
//           </Text>
//         </View>
//       </View>

//       {/* Quick Actions Menu */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//         <FlatList
//           data={businessSections[0].items}
//           renderItem={renderMenuItem}
//           keyExtractor={(item, index) => index.toString()}
//           numColumns={2}
//           scrollEnabled={false}
//           contentContainerStyle={styles.menuContainer}
//         />
//       </View>

//       {/* Recent Transactions Header */}
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Recent Transactions</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Logbook')}>
//           <Text style={styles.viewAll}>View All</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#543A14" />
//       </View>
//     );
//   }

//   if (!businessData) {
//     return (
//       <View style={[styles.container, styles.centerContainer]}>
//         <Text style={styles.title}>No business data found</Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.replace('BusinessAccount')}
//         >
//           <Text style={styles.buttonText}>Register Business</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <SwipeListView
//         data={summary.recentTransactions}
//         keyExtractor={(item) => item.id.toString()}
//         ListHeaderComponent={renderListHeader}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             colors={['#4CAF50']}
//             tintColor={'#4CAF50'}
//           />
//         }
//         renderItem={({ item }) => (
//           <View style={styles.rowFront}>
//             <View style={styles.transactionCard}>
//               {/* Amount & Date on the left */}
//               <View style={styles.transactionLeft}>
//                 <Text style={[
//                   styles.transactionAmount, 
//                   item.type === 'income' ? styles.income : styles.expense
//                 ]}>
//                   Rs{item.amount.toFixed(2)}
//                 </Text>
//                 <Text style={styles.transactionDate}>
//                   {new Date(item.log_date).toLocaleDateString()}
//                 </Text>
//               </View>

//               {/* Category & Description on the right */}
//               <View style={styles.transactionRight}>
//                 <Text style={styles.transactionCategory}>{item.category}</Text>
//                 <Text style={styles.transactionDescription}>{item.description}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//         renderHiddenItem={({ item }) => (
//           <View style={styles.rowBack}>
//             <TouchableOpacity 
//               style={styles.deleteButton} 
//               onPress={() => deleteTransaction(item.id)}
//             >
//               <Text style={styles.deleteText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         leftOpenValue={0}
//         rightOpenValue={-80}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   headerContainer: {
//     padding: 20,
//     paddingBottom: 10,
//   },
//   listContainer: {
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   businessInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   businessIcon: {
//     marginRight: 15,
//     backgroundColor: '#FFF0DC',
//     padding: 12,
//     borderRadius: 12,
//   },
//   businessName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//   },
//   businessType: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   logoutButton: {
//     backgroundColor: '',
//     padding: 10,
//     borderRadius: 10,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 25,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 15,
//     marginHorizontal: 5,
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 5,
//     color: '#FFF0DC',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#888',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#FFF0DC',
//     paddingLeft: 10,
//     textAlign: 'center'
//   },
//   menuContainer: {
//     justifyContent: 'space-between',
//   },
//   menuItem: {
//     width: '48%',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     margin: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   iconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   menuItemText: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     color: '#FFF0DC',
//   },
//   activityCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   activityText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#555',
//   },
//   button: {
//     backgroundColor: '#543A14',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#543A14',
//   },
//   summaryContainer: {
//     paddingVertical: 10,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   summaryCard: {
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#FFF0DC'
//   },
//   halfCard: {
//     width: '48%', 
//   },
//   fullWidthCard: {
//     width: '100%',
//     backgroundColor: '#1E1E1E',
//     padding: 25,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#FFF0DC'
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#FFF0DC',
//     fontWeight: '500',
//     marginBottom: 5,
//   },
//   summaryValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   income: { color: '#4CAF50' },
//   expense: { color: '#F44336' },
//   transactionCard: {
//     backgroundColor: '#1E1E1E',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     marginHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   transactionLeft: {
//     flex: 1,
//     marginRight: 10,
//   },
//   transactionRight: {
//     alignItems: 'flex-end',
//   },
//   transactionCategory: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#EAEAEA',
//   },
//   transactionDescription: {
//     fontSize: 14,
//     color: '#A0A0A0',
//   },
//   transactionAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   transactionDate: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 4,
//   },
//   rowBack: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     backgroundColor: '#F44336',
//     borderRadius: 8,
//     marginBottom: 12,
//     marginHorizontal: 20,
//   },
//   deleteButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 80,
//     height: '100%',
//   },
//   deleteText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   viewAll: {
//     color: '#543A14',
//     fontSize: 14,
//     fontWeight: "900"
//   },
//   rowFront: {
//     backgroundColor: 'transparent',
//   },
// });

// export default BusinessHome;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
// import Icon from '../components/IconWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusinessHome = ({ navigation }) => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    recentTransactions: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      await fetchBusinessData();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchBusinessData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error('No user found');

      setUser(user);

      const { data, error } = await supabase
        .from('business_users')
        .select(
          `
          business_name, 
          phone_number, 
          shop_number, 
          area, 
          city,
          business_types (name)
        `
        )
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setBusinessData(data[0]);
      } else {
        const userRegistrationKey = `businessRegistered_${user.id}`;
        await AsyncStorage.removeItem(userRegistrationKey);
        Alert.alert('Business Not Found', 'Please register your business', [
          { text: 'OK', onPress: () => navigation.replace('BusinessAccount') },
        ]);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      Alert.alert('Error', 'Failed to load business data');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('business_logs')
        .select('id, amount, type, category, description, log_date')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false });

      if (error) throw error;

      let totalIncome = 0,
        totalExpenses = 0;
      data.forEach(({ amount, type }) => {
        if (type === 'income') totalIncome += amount;
        else if (type === 'expense') totalExpenses += amount;
      });

      setSummary({
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        recentTransactions: data.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleMenuItemPress = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    if (user) {
      const userRegistrationKey = `businessRegistered_${user.id}`;
      await AsyncStorage.removeItem(userRegistrationKey);
    }

    await supabase.auth.signOut();
    navigation.navigate('Auth');
  };

  const deleteTransaction = async (id) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('business_logs').delete().eq('id', id);
            if (error) throw error;

            setSummary((prev) => ({
              ...prev,
              recentTransactions: prev.recentTransactions.filter((t) => t.id !== id),
            }));

            await fetchDashboardData();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const businessSections = [
    {
      title: 'Logbook',
      items: [
        { name: 'Add Entry', icon: 'add-circle-outline', screen: 'AddLogEntry' },
        { name: 'Reports', icon: 'assessment', screen: 'Reports' },
        { name: 'Daily Logs', icon: 'event-note', screen: 'Logbook' },
      ],
    },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress(item.screen)}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#FFF0DC" />
      </View>
      <Text style={styles.menuItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.businessInfo}>
          <TouchableOpacity onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}>
            <Icon name="store" size={30} color="#543A14" style={styles.businessIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('BusinessAccount', { isEditing: true })}>
            <Text style={styles.businessName}>{businessData?.business_name}</Text>
            <Text style={styles.businessType}>{businessData?.business_types?.name}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#FFF0DC" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.row}>
          <View style={[styles.summaryCard, styles.halfCard]}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryValue, styles.income]}>
              Rs{summary.totalIncome.toFixed(1)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.halfCard]}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, styles.expense]}>
              Rs{summary.totalExpenses.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.fullWidthCard}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[styles.summaryValue, summary.netBalance >= 0 ? styles.income : styles.expense]}>
            Rs{summary.netBalance.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <FlatList
          data={businessSections[0].items}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.menuContainer}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Logbook')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#543A14" />
      </View>
    );
  }

  if (!businessData) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.title}>No business data found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('BusinessAccount')}
        >
          <Text style={styles.buttonText}>Register Business</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeListView
        data={summary.recentTransactions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          // <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4CAF50']} tintColor={'#4CAF50'} />
          <RefreshControl 
  refreshing={refreshing} 
  onRefresh={handleRefresh} 
  tintColor={'#4CAF50'} 
/>
        }
        renderItem={({ item }) => (
          <View style={styles.rowFront}>
            <View style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <Text
                  style={[
                    styles.transactionAmount,
                    item.type === 'income' ? styles.income : styles.expense,
                  ]}
                >
                  Rs{item.amount.toFixed(2)}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(item.log_date).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.transactionRight}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDescription}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTransaction(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={0}
        rightOpenValue={-80}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // existing styles...
  logoutButton: {
    padding: 10,
    borderRadius: 10,
  },
  // rest of the styles remain unchanged
    container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  listContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessIcon: {
    marginRight: 15,
    backgroundColor: '#FFF0DC',
    padding: 12,
    borderRadius: 12,
  },
  businessName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF0DC',
  },
  businessType: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '',
    padding: 10,
    borderRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#FFF0DC',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFF0DC',
    paddingLeft: 10,
    textAlign: 'center'
  },
  menuContainer: {
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFF0DC',
  },
  activityCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#543A14',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#543A14',
  },
  summaryContainer: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFF0DC'
  },
  halfCard: {
    width: '48%', 
  },
  fullWidthCard: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFF0DC'
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFF0DC',
    fontWeight: '500',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  income: { color: '#4CAF50' },
  expense: { color: '#F44336' },
  transactionCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flex: 1,
    marginRight: 10,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EAEAEA',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  rowBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#F44336',
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    color: '#543A14',
    fontSize: 14,
    fontWeight: "900"
  },
  rowFront: {
    backgroundColor: 'transparent',
  },
});

export default BusinessHome;
