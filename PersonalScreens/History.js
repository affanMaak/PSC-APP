
// // // // // //Abdullah latest working
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import {
// // // // //   View, Text, StyleSheet, ActivityIndicator,
// // // // //   TouchableOpacity, Alert, RefreshControl, TextInput
// // // // // } from 'react-native';
// // // // // import { SwipeListView } from 'react-native-swipe-list-view';
// // // // // import { supabase } from '../lib/supabase';
// // // // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // // // export default function History({ navigation }) {
// // // // //   const [expenses, setExpenses] = useState([]);
// // // // //   const [filteredExpenses, setFilteredExpenses] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [user, setUser] = useState(null);
// // // // //   const [searchQuery, setSearchQuery] = useState('');
// // // // //   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'

// // // // //   useEffect(() => {
// // // // //     async function fetchUser() {
// // // // //       const { data: { user } } = await supabase.auth.getUser();
// // // // //       setUser(user);
// // // // //     }
// // // // //     fetchUser();
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (user) getExpenses();
// // // // //   }, [user]);

// // // // //   useEffect(() => {
// // // // //     filterExpenses();
// // // // //   }, [expenses, searchQuery, timeFilter]);

// // // // //   function filterExpenses() {
// // // // //     let result = [...expenses];
    
// // // // //     // Apply time filter
// // // // //     const now = new Date();
// // // // //     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// // // // //     const yesterdayStart = new Date(todayStart);
// // // // //     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
// // // // //     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
// // // // //     if (timeFilter === 'today') {
// // // // //       result = result.filter(expense => 
// // // // //         new Date(expense.created_at) >= todayStart
// // // // //       );
// // // // //     } else if (timeFilter === 'yesterday') {
// // // // //       result = result.filter(expense => 
// // // // //         new Date(expense.created_at) >= yesterdayStart && 
// // // // //         new Date(expense.created_at) < todayStart
// // // // //       );
// // // // //     } else if (timeFilter === 'month') {
// // // // //       result = result.filter(expense => 
// // // // //         new Date(expense.created_at) >= monthStart
// // // // //       );
// // // // //     }
    
// // // // //     // Apply search filter
// // // // //     if (searchQuery) {
// // // // //       const query = searchQuery.toLowerCase();
// // // // //       result = result.filter(expense => 
// // // // //         expense.friendUsername?.toLowerCase().includes(query) ||
// // // // //         expense.description?.toLowerCase().includes(query)
// // // // //       );
// // // // //     }
    
// // // // //     setFilteredExpenses(result);
// // // // //   }

// // // // //   async function getExpenses(isRefresh = false) {
// // // // //     if (isRefresh) setRefreshing(true);
// // // // //     else setLoading(true);

// // // // //     try {
// // // // //       const { data, error } = await supabase
// // // // //         .from('expenses')
// // // // //         .select(`
// // // // //           id,
// // // // //           group_id,
// // // // //           amount,
// // // // //           description,
// // // // //           created_at,
// // // // //           user_id,
// // // // //           friend_id,
// // // // //           split_type,
// // // // //           total_amount,
// // // // //           total_people,
// // // // //           payer:profiles!expenses_user_id_fkey(username),
// // // // //           receiver:profiles!expenses_friend_id_fkey(username)
// // // // //         `)
// // // // //         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
// // // // //         .order('created_at', { ascending: false });

// // // // //       if (error) throw error;

// // // // //       // Group expenses by group_id (or by id for old records)
// // // // //       const groupedExpenses = data.reduce((acc, expense) => {
// // // // //         const groupId = expense.group_id || expense.id; // Fallback to id
// // // // //         if (!acc[groupId]) {
// // // // //           acc[groupId] = {
// // // // //             id: groupId,
// // // // //             expenses: [],
// // // // //             total_amount: expense.total_amount,
// // // // //             description: expense.description,
// // // // //             created_at: expense.created_at,
// // // // //             total_people: expense.total_people,
// // // // //             split_type: expense.split_type
// // // // //           };
// // // // //         }
// // // // //         acc[groupId].expenses.push(expense);
// // // // //         return acc;
// // // // //       }, {});

// // // // //       // Convert to array and transform
// // // // //       const transformed = Object.values(groupedExpenses).map(group => {
// // // // //         const userExpense = group.expenses.find(e => 
// // // // //           e.user_id === user.id || e.friend_id === user.id
// // // // //         );
        
// // // // //         const isPaidByUser = userExpense?.user_id === user.id;
// // // // //         const friend = isPaidByUser 
// // // // //           ? userExpense.receiver 
// // // // //           : userExpense?.payer;

// // // // //         // Calculate user's net amount for this group
// // // // //         let amount = 0;
// // // // //         if (isPaidByUser) {
// // // // //           // User is payer: owed money from others
// // // // //           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
// // // // //         } else {
// // // // //           // User is participant: owes money
// // // // //           const userRecord = group.expenses.find(e => e.friend_id === user.id);
// // // // //           if (userRecord) amount = -userRecord.amount;
// // // // //         }

// // // // //         return {
// // // // //           ...group,
// // // // //           isPaidByUser,
// // // // //           friendUsername: friend?.username || 'Unknown',
// // // // //           amount: parseFloat(amount.toFixed(2))
// // // // //         };
// // // // //       });

// // // // //       setExpenses(transformed);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching expenses:', error);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //       setRefreshing(false);
// // // // //     }
// // // // //   }

// // // // //   const confirmSettle = (groupId) => {
// // // // //     Alert.alert(
// // // // //       'Confirm Settlement',
// // // // //       'Are you sure you want to mark this as settled?',
// // // // //       [
// // // // //         { 
// // // // //           text: 'Cancel', 
// // // // //           style: 'cancel',
// // // // //         },
// // // // //         { 
// // // // //           text: 'Confirm', 
// // // // //           onPress: () => handleSettle(groupId),
// // // // //           style: 'destructive'
// // // // //         }
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const handleSettle = async (groupId) => {
// // // // //     try {
// // // // //       // Delete all expenses in this group
// // // // //       const { error } = await supabase
// // // // //         .from('expenses')
// // // // //         .delete()
// // // // //         .eq('group_id', groupId);

// // // // //       if (error) throw error;

// // // // //       setExpenses(prev => prev.filter(expense => expense.id !== groupId));
// // // // //     } catch (error) {
// // // // //       Alert.alert('Error', 'Failed to settle expense group');
// // // // //     }
// // // // //   };

// // // // //   const getStatusText = (expense) => {
// // // // //     if (expense.isPaidByUser) {
// // // // //       return expense.split_type === 'equal'
// // // // //         ? `You paid • Split with ${expense.total_people - 1} people`
// // // // //         : `You lent to ${expense.friendUsername}`;
// // // // //     }
// // // // //     return expense.split_type === 'equal'
// // // // //       ? `${expense.friendUsername} paid • Split with you`
// // // // //       : `You borrowed from ${expense.friendUsername}`;
// // // // //   };

// // // // //   const viewGroupDetails = (groupId) => {
// // // // //     navigation.navigate('GroupExpenseDetail', { groupId });
// // // // //   };

// // // // //   const renderItem = ({ item }) => (
// // // // //     <View style={styles.expenseCard}>
// // // // //       <View style={styles.cardContent}>
// // // // //         <View style={styles.expenseInfo}>
// // // // //           <Text style={styles.description} numberOfLines={1}>
// // // // //             {item.description || 'Expense'}
// // // // //           </Text>
// // // // //           <View style={styles.statusContainer}>
// // // // //             <Text style={styles.statusText}>{getStatusText(item)}</Text>
// // // // //           </View>
// // // // //           <Text style={styles.date}>
// // // // //             {new Date(item.created_at).toLocaleDateString('en-IN', {
// // // // //               day: 'numeric', month: 'short', year: 'numeric'
// // // // //             })}
// // // // //           </Text>
// // // // //         </View>
        
// // // // //         <View style={styles.amountSection}>
// // // // //           <Text style={[
// // // // //             styles.amount,
// // // // //             item.isPaidByUser ? styles.owedToYou : styles.youOwe
// // // // //           ]}>
// // // // //             {item.isPaidByUser ? '' : ''}Rs{Math.abs(item.amount).toFixed(2)}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>
      
// // // // //       <View style={styles.actionRow}>
// // // // //         {item.split_type === 'equal' && item.total_people > 2 && (
// // // // //           <TouchableOpacity
// // // // //             style={styles.viewDetailsButton}
// // // // //             onPress={() => viewGroupDetails(item.id)}
// // // // //             activeOpacity={0.7}
// // // // //           >
// // // // //             <Text style={styles.viewDetailsButtonText}>View Details</Text>
// // // // //           </TouchableOpacity>
// // // // //         )}
        
// // // // //         <TouchableOpacity
// // // // //           style={styles.settleButton}
// // // // //           onPress={() => confirmSettle(item.id)}
// // // // //           activeOpacity={0.7}
// // // // //         >
// // // // //           <Text style={styles.settleButtonText}>Settle</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const renderHiddenItem = (data) => (
// // // // //     <View style={styles.rowBack}>
// // // // //       <TouchableOpacity
// // // // //         style={styles.deleteButton}
// // // // //         onPress={() => confirmSettle(data.item.id)}
// // // // //         activeOpacity={0.8}
// // // // //       >
// // // // //         <Text style={styles.deleteText}>Delete</Text>
// // // // //       </TouchableOpacity>
// // // // //     </View>
// // // // //   );

// // // // //   const TimeFilterButton = ({ label, value }) => (
// // // // //     <TouchableOpacity
// // // // //       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
// // // // //       onPress={() => setTimeFilter(value)}
// // // // //     >
// // // // //       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
// // // // //         {label}
// // // // //       </Text>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {/* Search Bar */}
// // // // //       <View style={styles.searchContainer}>
// // // // //         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// // // // //         <TextInput
// // // // //           style={styles.searchInput}
// // // // //           placeholder="Search by name or description"
// // // // //           placeholderTextColor="#888"
// // // // //           value={searchQuery}
// // // // //           onChangeText={setSearchQuery}
// // // // //           clearButtonMode="while-editing"
// // // // //         />
// // // // //       </View>
      
// // // // //       {/* Time Filters */}
// // // // //       <View style={styles.timeFilterContainer}>
// // // // //         <TimeFilterButton label="All" value="all" />
// // // // //         <TimeFilterButton label="Today" value="today" />
// // // // //         <TimeFilterButton label="Yesterday" value="yesterday" />
// // // // //         <TimeFilterButton label="Month" value="month" />
// // // // //       </View>

// // // // //       {loading ? (
// // // // //         <View style={styles.loadingContainer}>
// // // // //           <ActivityIndicator size="large" color="#D2B48C" />
// // // // //         </View>
// // // // //       ) : (
// // // // //         <SwipeListView
// // // // //           data={filteredExpenses}
// // // // //           keyExtractor={(item) => item.id}
// // // // //           renderItem={renderItem}
// // // // //           renderHiddenItem={renderHiddenItem}
// // // // //           rightOpenValue={-100}
// // // // //           disableRightSwipe
// // // // //           refreshControl={
// // // // //             <RefreshControl 
// // // // //               refreshing={refreshing} 
// // // // //               onRefresh={() => getExpenses(true)}
// // // // //               tintColor="#D2B48C"
// // // // //               colors={['#D2B48C']}
// // // // //             />
// // // // //           }
// // // // //           ListEmptyComponent={
// // // // //             <View style={styles.emptyContainer}>
// // // // //               <Text style={styles.emptyTitle}>No Transactions Found</Text>
// // // // //               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
// // // // //             </View>
// // // // //           }
// // // // //           contentContainerStyle={styles.listContent}
// // // // //           ItemSeparatorComponent={() => <View style={styles.separator} />}
// // // // //         />
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'black',
// // // // //     paddingHorizontal: 16,
// // // // //   },
// // // // //   searchContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#1E1E1E',
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 16,
// // // // //     marginVertical: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#333',
// // // // //   },
// // // // //   searchIcon: {
// // // // //     marginRight: 10,
// // // // //   },
// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     color: '#FFF0DC',
// // // // //     paddingVertical: 12,
// // // // //     fontSize: 16,
// // // // //   },
// // // // //   timeFilterContainer: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   timeFilterButton: {
// // // // //     paddingVertical: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: '#1E1E1E',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#333',
// // // // //   },
// // // // //   activeTimeFilter: {
// // // // //     backgroundColor: '#543A14',
// // // // //     borderColor: '#D2B48C',
// // // // //   },
// // // // //   timeFilterText: {
// // // // //     color: '#D2B48C',
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   activeTimeFilterText: {
// // // // //     color: '#FFF0DC',
// // // // //     fontWeight: 'bold',
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   expenseCard: {
// // // // //     backgroundColor: '#1E1E1E',
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#333',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   cardContent: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     padding: 16,
// // // // //   },
// // // // //   expenseInfo: {
// // // // //     flex: 1,
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   description: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#FFF0DC',
// // // // //     marginBottom: 6,
// // // // //   },
// // // // //   statusContainer: {
// // // // //     marginBottom: 6,
// // // // //   },
// // // // //   statusText: {
// // // // //     fontSize: 13,
// // // // //     color: '#BBB',
// // // // //   },
// // // // //   date: {
// // // // //     fontSize: 12,
// // // // //     color: '#888',
// // // // //   },
// // // // //   amountSection: {
// // // // //     alignItems: 'flex-end',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   amount: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   owedToYou: {
// // // // //     color: '#4CAF50',
// // // // //   },
// // // // //   youOwe: {
// // // // //     color: '#F44336',
// // // // //   },
// // // // //   actionRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'flex-end',
// // // // //     padding: 16,
// // // // //     paddingTop: 0,
// // // // //   },
// // // // //   viewDetailsButton: {
// // // // //     backgroundColor: '#1E2E1A',
// // // // //     paddingVertical: 6,
// // // // //     paddingHorizontal: 12,
// // // // //     borderRadius: 8,
// // // // //     marginRight: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#4CAF50',
// // // // //   },
// // // // //   viewDetailsButtonText: {
// // // // //     color: '#4CAF50',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   settleButton: {
// // // // //     backgroundColor: '#543A14',
// // // // //     paddingVertical: 6,
// // // // //     paddingHorizontal: 12,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#D2B48C',
// // // // //   },
// // // // //   settleButtonText: {
// // // // //     color: '#FFF0DC',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   emptyContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 100,
// // // // //   },
// // // // //   emptyTitle: {
// // // // //     fontSize: 18,
// // // // //     color: '#FFF0DC',
// // // // //     marginBottom: 8,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   emptySubtitle: {
// // // // //     fontSize: 14,
// // // // //     color: '#888',
// // // // //     textAlign: 'center',
// // // // //     maxWidth: 250,
// // // // //   },
// // // // //   rowBack: {
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#F44336',
// // // // //     borderRadius: 12,
// // // // //     flex: 1,
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'flex-end',
// // // // //     marginVertical: 4,
// // // // //   },
// // // // //   deleteButton: {
// // // // //     width: 100,
// // // // //     height: '100%',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   deleteText: {
// // // // //     color: '#FFF',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   listContent: {
// // // // //     paddingBottom: 24,
// // // // //     flexGrow: 1,
// // // // //   },
// // // // //   separator: {
// // // // //     height: 8,
// // // // //   },
// // // // // });

// // // // import React, { useEffect, useState } from 'react';
// // // // import {
// // // //   View, Text, StyleSheet, ActivityIndicator,
// // // //   TouchableOpacity, Alert, RefreshControl, TextInput
// // // // } from 'react-native';
// // // // import { SwipeListView } from 'react-native-swipe-list-view';
// // // // import { supabase } from '../lib/supabase';
// // // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // // export default function History({ navigation }) {
// // // //   const [expenses, setExpenses] = useState([]);
// // // //   const [filteredExpenses, setFilteredExpenses] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [user, setUser] = useState(null);
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'

// // // //   useEffect(() => {
// // // //     async function fetchUser() {
// // // //       const { data: { user } } = await supabase.auth.getUser();
// // // //       setUser(user);
// // // //     }
// // // //     fetchUser();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (user) getExpenses();
// // // //   }, [user]);

// // // //   useEffect(() => {
// // // //     filterExpenses();
// // // //   }, [expenses, searchQuery, timeFilter]);

// // // //   function filterExpenses() {
// // // //     let result = [...expenses];
    
// // // //     // Apply time filter
// // // //     const now = new Date();
// // // //     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// // // //     const yesterdayStart = new Date(todayStart);
// // // //     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
// // // //     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
// // // //     if (timeFilter === 'today') {
// // // //       result = result.filter(expense => 
// // // //         new Date(expense.created_at) >= todayStart
// // // //       );
// // // //     } else if (timeFilter === 'yesterday') {
// // // //       result = result.filter(expense => 
// // // //         new Date(expense.created_at) >= yesterdayStart && 
// // // //         new Date(expense.created_at) < todayStart
// // // //       );
// // // //     } else if (timeFilter === 'month') {
// // // //       result = result.filter(expense => 
// // // //         new Date(expense.created_at) >= monthStart
// // // //       );
// // // //     }
    
// // // //     // Apply search filter
// // // //     if (searchQuery) {
// // // //       const query = searchQuery.toLowerCase();
// // // //       result = result.filter(expense => 
// // // //         expense.friendUsername?.toLowerCase().includes(query) ||
// // // //         expense.description?.toLowerCase().includes(query)
// // // //       );
// // // //     }
    
// // // //     setFilteredExpenses(result);
// // // //   }

// // // //   async function getExpenses(isRefresh = false) {
// // // //     if (isRefresh) setRefreshing(true);
// // // //     else setLoading(true);

// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from('expenses')
// // // //         .select(`
// // // //           id,
// // // //           group_id,
// // // //           amount,
// // // //           description,
// // // //           created_at,
// // // //           user_id,
// // // //           friend_id,
// // // //           split_type,
// // // //           total_amount,
// // // //           total_people,
// // // //           payer:profiles!expenses_user_id_fkey(username),
// // // //           receiver:profiles!expenses_friend_id_fkey(username)
// // // //         `)
// // // //         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
// // // //         .order('created_at', { ascending: false });

// // // //       if (error) throw error;

// // // //       // Group expenses by group_id (or by id for old records)
// // // //       const groupedExpenses = data.reduce((acc, expense) => {
// // // //         const groupId = expense.group_id || expense.id; // Fallback to id
// // // //         if (!acc[groupId]) {
// // // //           acc[groupId] = {
// // // //             id: groupId,
// // // //             expenses: [],
// // // //             total_amount: expense.total_amount,
// // // //             description: expense.description,
// // // //             created_at: expense.created_at,
// // // //             total_people: expense.total_people,
// // // //             split_type: expense.split_type
// // // //           };
// // // //         }
// // // //         acc[groupId].expenses.push(expense);
// // // //         return acc;
// // // //       }, {});

// // // //       // Convert to array and transform
// // // //       const transformed = Object.values(groupedExpenses).map(group => {
// // // //         const userExpense = group.expenses.find(e => 
// // // //           e.user_id === user.id || e.friend_id === user.id
// // // //         );
        
// // // //         const isPaidByUser = userExpense?.user_id === user.id;
// // // //         const friend = isPaidByUser 
// // // //           ? userExpense.receiver 
// // // //           : userExpense?.payer;

// // // //         // Calculate user's net amount for this group
// // // //         let amount = 0;
// // // //         if (isPaidByUser) {
// // // //           // User is payer: owed money from others
// // // //           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
// // // //         } else {
// // // //           // User is participant: owes money
// // // //           const userRecord = group.expenses.find(e => e.friend_id === user.id);
// // // //           if (userRecord) amount = -userRecord.amount;
// // // //         }

// // // //         return {
// // // //           ...group,
// // // //           isPaidByUser,
// // // //           friendUsername: friend?.username || 'Unknown',
// // // //           amount: parseFloat(amount.toFixed(2))
// // // //         };
// // // //       });

// // // //       setExpenses(transformed);
// // // //     } catch (error) {
// // // //       console.error('Error fetching expenses:', error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //       setRefreshing(false);
// // // //     }
// // // //   }

// // // //   const confirmSettle = (groupId) => {
// // // //     Alert.alert(
// // // //       'Confirm Settlement',
// // // //       'Are you sure you want to mark this as settled?',
// // // //       [
// // // //         { 
// // // //           text: 'Cancel', 
// // // //           style: 'cancel',
// // // //         },
// // // //         { 
// // // //           text: 'Confirm', 
// // // //           onPress: () => handleSettle(groupId),
// // // //           style: 'destructive'
// // // //         }
// // // //       ]
// // // //     );
// // // //   };

// // // //   const handleSettle = async (groupId) => {
// // // //     try {
// // // //       // Delete all expenses in this group
// // // //       const { error } = await supabase
// // // //         .from('expenses')
// // // //         .delete()
// // // //         .eq('group_id', groupId);

// // // //       if (error) throw error;

// // // //       setExpenses(prev => prev.filter(expense => expense.id !== groupId));
// // // //     } catch (error) {
// // // //       Alert.alert('Error', 'Failed to settle expense group');
// // // //     }
// // // //   };

// // // //   const getStatusText = (expense) => {
// // // //     if (expense.isPaidByUser) {
// // // //       return expense.split_type === 'equal'
// // // //         ? `You paid • Split with ${expense.total_people - 1} people`
// // // //         : `You lent to ${expense.friendUsername}`;
// // // //     }
// // // //     return expense.split_type === 'equal'
// // // //       ? `${expense.friendUsername} paid • Split with you`
// // // //       : `You borrowed from ${expense.friendUsername}`;
// // // //   };

// // // //   const viewGroupDetails = (groupId) => {
// // // //     navigation.navigate('GroupExpenseDetail', { groupId });
// // // //   };

// // // //   const renderItem = ({ item }) => (
// // // //     <View style={styles.expenseCard}>
// // // //       <View style={styles.cardContent}>
// // // //         <View style={styles.expenseInfo}>
// // // //           <Text style={styles.description} numberOfLines={1}>
// // // //             {item.description || 'Expense'}
// // // //           </Text>
// // // //           <View style={styles.statusContainer}>
// // // //             <Text style={styles.statusText}>{getStatusText(item)}</Text>
// // // //           </View>
// // // //           <Text style={styles.date}>
// // // //             {new Date(item.created_at).toLocaleDateString('en-IN', {
// // // //               day: 'numeric', month: 'short', year: 'numeric'
// // // //             })}
// // // //           </Text>
// // // //         </View>
        
// // // //         <View style={styles.amountSection}>
// // // //           <Text style={[
// // // //             styles.amount,
// // // //             item.isPaidByUser ? styles.owedToYou : styles.youOwe
// // // //           ]}>
// // // //             {item.isPaidByUser ? '' : ''}Rs{Math.abs(item.amount).toFixed(2)}
// // // //           </Text>
// // // //         </View>
// // // //       </View>
      
// // // //       <View style={styles.actionRow}>
// // // //         {/* Always show View Details button for group expenses */}
// // // //         <TouchableOpacity
// // // //           style={styles.viewDetailsButton}
// // // //           onPress={() => viewGroupDetails(item.id)}
// // // //           activeOpacity={0.7}
// // // //         >
// // // //           <Text style={styles.viewDetailsButtonText}>View Details</Text>
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity
// // // //           style={styles.settleButton}
// // // //           onPress={() => confirmSettle(item.id)}
// // // //           activeOpacity={0.7}
// // // //         >
// // // //           <Text style={styles.settleButtonText}>Settle</Text>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const renderHiddenItem = (data) => (
// // // //     <View style={styles.rowBack}>
// // // //       <TouchableOpacity
// // // //         style={styles.deleteButton}
// // // //         onPress={() => confirmSettle(data.item.id)}
// // // //         activeOpacity={0.8}
// // // //       >
// // // //         <Text style={styles.deleteText}>Delete</Text>
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );

// // // //   const TimeFilterButton = ({ label, value }) => (
// // // //     <TouchableOpacity
// // // //       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
// // // //       onPress={() => setTimeFilter(value)}
// // // //     >
// // // //       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
// // // //         {label}
// // // //       </Text>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       {/* Search Bar */}
// // // //       <View style={styles.searchContainer}>
// // // //         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// // // //         <TextInput
// // // //           style={styles.searchInput}
// // // //           placeholder="Search by name or description"
// // // //           placeholderTextColor="#888"
// // // //           value={searchQuery}
// // // //           onChangeText={setSearchQuery}
// // // //           clearButtonMode="while-editing"
// // // //         />
// // // //       </View>
      
// // // //       {/* Time Filters */}
// // // //       <View style={styles.timeFilterContainer}>
// // // //         <TimeFilterButton label="All" value="all" />
// // // //         <TimeFilterButton label="Today" value="today" />
// // // //         <TimeFilterButton label="Yesterday" value="yesterday" />
// // // //         <TimeFilterButton label="Month" value="month" />
// // // //       </View>

// // // //       {loading ? (
// // // //         <View style={styles.loadingContainer}>
// // // //           <ActivityIndicator size="large" color="#D2B48C" />
// // // //         </View>
// // // //       ) : (
// // // //         <SwipeListView
// // // //           data={filteredExpenses}
// // // //           keyExtractor={(item) => item.id}
// // // //           renderItem={renderItem}
// // // //           renderHiddenItem={renderHiddenItem}
// // // //           rightOpenValue={-100}
// // // //           disableRightSwipe
// // // //           refreshControl={
// // // //             <RefreshControl 
// // // //               refreshing={refreshing} 
// // // //               onRefresh={() => getExpenses(true)}
// // // //               tintColor="#D2B48C"
// // // //               colors={['#D2B48C']}
// // // //             />
// // // //           }
// // // //           ListEmptyComponent={
// // // //             <View style={styles.emptyContainer}>
// // // //               <Text style={styles.emptyTitle}>No Transactions Found</Text>
// // // //               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
// // // //             </View>
// // // //           }
// // // //           contentContainerStyle={styles.listContent}
// // // //           ItemSeparatorComponent={() => <View style={styles.separator} />}
// // // //         />
// // // //       )}
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: 'black',
// // // //     paddingHorizontal: 16,
// // // //   },
// // // //   searchContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#1E1E1E',
// // // //     borderRadius: 12,
// // // //     paddingHorizontal: 16,
// // // //     marginVertical: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#333',
// // // //   },
// // // //   searchIcon: {
// // // //     marginRight: 10,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     color: '#FFF0DC',
// // // //     paddingVertical: 12,
// // // //     fontSize: 16,
// // // //   },
// // // //   timeFilterContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     marginBottom: 12,
// // // //   },
// // // //   timeFilterButton: {
// // // //     paddingVertical: 8,
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#1E1E1E',
// // // //     borderWidth: 1,
// // // //     borderColor: '#333',
// // // //   },
// // // //   activeTimeFilter: {
// // // //     backgroundColor: '#543A14',
// // // //     borderColor: '#D2B48C',
// // // //   },
// // // //   timeFilterText: {
// // // //     color: '#D2B48C',
// // // //     fontSize: 14,
// // // //   },
// // // //   activeTimeFilterText: {
// // // //     color: '#FFF0DC',
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   expenseCard: {
// // // //     backgroundColor: '#1E1E1E',
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#333',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   cardContent: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     padding: 16,
// // // //   },
// // // //   expenseInfo: {
// // // //     flex: 1,
// // // //     marginRight: 12,
// // // //   },
// // // //   description: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#FFF0DC',
// // // //     marginBottom: 6,
// // // //   },
// // // //   statusContainer: {
// // // //     marginBottom: 6,
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 13,
// // // //     color: '#BBB',
// // // //   },
// // // //   date: {
// // // //     fontSize: 12,
// // // //     color: '#888',
// // // //   },
// // // //   amountSection: {
// // // //     alignItems: 'flex-end',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   amount: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     marginBottom: 8,
// // // //   },
// // // //   owedToYou: {
// // // //     color: '#4CAF50',
// // // //   },
// // // //   youOwe: {
// // // //     color: '#F44336',
// // // //   },
// // // //   actionRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'flex-end',
// // // //     padding: 16,
// // // //     paddingTop: 0,
// // // //   },
// // // //   viewDetailsButton: {
// // // //     backgroundColor: '#1E2E1A',
// // // //     paddingVertical: 6,
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 8,
// // // //     marginRight: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: '#4CAF50',
// // // //   },
// // // //   viewDetailsButtonText: {
// // // //     color: '#4CAF50',
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //   },
// // // //   settleButton: {
// // // //     backgroundColor: '#543A14',
// // // //     paddingVertical: 6,
// // // //     paddingHorizontal: 12,
// // // //     borderRadius: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: '#D2B48C',
// // // //   },
// // // //   settleButtonText: {
// // // //     color: '#FFF0DC',
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //   },
// // // //   emptyContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 100,
// // // //   },
// // // //   emptyTitle: {
// // // //     fontSize: 18,
// // // //     color: '#FFF0DC',
// // // //     marginBottom: 8,
// // // //     fontWeight: '600',
// // // //   },
// // // //   emptySubtitle: {
// // // //     fontSize: 14,
// // // //     color: '#888',
// // // //     textAlign: 'center',
// // // //     maxWidth: 250,
// // // //   },
// // // //   rowBack: {
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#F44336',
// // // //     borderRadius: 12,
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'flex-end',
// // // //     marginVertical: 4,
// // // //   },
// // // //   deleteButton: {
// // // //     width: 100,
// // // //     height: '100%',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   deleteText: {
// // // //     color: '#FFF',
// // // //     fontWeight: '600',
// // // //   },
// // // //   listContent: {
// // // //     paddingBottom: 24,
// // // //     flexGrow: 1,
// // // //   },
// // // //   separator: {
// // // //     height: 8,
// // // //   },
// // // // });

// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   View, Text, StyleSheet, ActivityIndicator,
// // //   TouchableOpacity, Alert, RefreshControl, TextInput
// // // } from 'react-native';
// // // import { SwipeListView } from 'react-native-swipe-list-view';
// // // import { supabase } from '../lib/supabase';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // export default function History({ navigation }) {
// // //   const [expenses, setExpenses] = useState([]);
// // //   const [filteredExpenses, setFilteredExpenses] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [user, setUser] = useState(null);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'

// // //   useEffect(() => {
// // //     async function fetchUser() {
// // //       const { data: { user } } = await supabase.auth.getUser();
// // //       setUser(user);
// // //     }
// // //     fetchUser();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (user) getExpenses();
// // //   }, [user]);

// // //   useEffect(() => {
// // //     filterExpenses();
// // //   }, [expenses, searchQuery, timeFilter]);

// // //   function filterExpenses() {
// // //     let result = [...expenses];
    
// // //     // Apply time filter
// // //     const now = new Date();
// // //     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// // //     const yesterdayStart = new Date(todayStart);
// // //     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
// // //     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
// // //     if (timeFilter === 'today') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= todayStart
// // //       );
// // //     } else if (timeFilter === 'yesterday') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= yesterdayStart && 
// // //         new Date(expense.created_at) < todayStart
// // //       );
// // //     } else if (timeFilter === 'month') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= monthStart
// // //       );
// // //     }
    
// // //     // Apply search filter
// // //     if (searchQuery) {
// // //       const query = searchQuery.toLowerCase();
// // //       result = result.filter(expense => 
// // //         expense.friendUsername?.toLowerCase().includes(query) ||
// // //         expense.description?.toLowerCase().includes(query)
// // //       );
// // //     }
    
// // //     setFilteredExpenses(result);
// // //   }

// // //   async function getExpenses(isRefresh = false) {
// // //     if (isRefresh) setRefreshing(true);
// // //     else setLoading(true);

// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('expenses')
// // //         .select(`
// // //           id,
// // //           group_id,
// // //           amount,
// // //           description,
// // //           created_at,
// // //           user_id,
// // //           friend_id,
// // //           split_type,
// // //           total_amount,
// // //           total_people,
// // //           payer:profiles!expenses_user_id_fkey(username),
// // //           receiver:profiles!expenses_friend_id_fkey(username)
// // //         `)
// // //         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
// // //         .order('created_at', { ascending: false });

// // //       if (error) throw error;

// // //       // Group expenses by group_id (or by id for old records)
// // //       const groupedExpenses = data.reduce((acc, expense) => {
// // //         const groupId = expense.group_id || expense.id; // Fallback to id
// // //         if (!acc[groupId]) {
// // //           acc[groupId] = {
// // //             id: groupId,
// // //             expenses: [],
// // //             total_amount: expense.total_amount,
// // //             description: expense.description,
// // //             created_at: expense.created_at,
// // //             total_people: expense.total_people,
// // //             split_type: expense.split_type
// // //           };
// // //         }
// // //         acc[groupId].expenses.push(expense);
// // //         return acc;
// // //       }, {});

// // //       // Convert to array and transform
// // //       const transformed = Object.values(groupedExpenses).map(group => {
// // //         const userExpense = group.expenses.find(e => 
// // //           e.user_id === user.id || e.friend_id === user.id
// // //         );
        
// // //         const isPaidByUser = userExpense?.user_id === user.id;
// // //         const friend = isPaidByUser 
// // //           ? userExpense.receiver 
// // //           : userExpense?.payer;

// // //         // Calculate user's net amount for this group
// // //         let amount = 0;
// // //         if (isPaidByUser) {
// // //           // User is payer: owed money from others
// // //           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
// // //         } else {
// // //           // User is participant: owes money
// // //           const userRecord = group.expenses.find(e => e.friend_id === user.id);
// // //           if (userRecord) amount = -userRecord.amount;
// // //         }

// // //         return {
// // //           ...group,
// // //           isPaidByUser,
// // //           friendUsername: friend?.username || 'Unknown',
// // //           amount: parseFloat(amount.toFixed(2))
// // //         };
// // //       });

// // //       setExpenses(transformed);
// // //     } catch (error) {
// // //       console.error('Error fetching expenses:', error);
// // //     } finally {
// // //       setLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   }

// // //   const confirmSettle = (groupId) => {
// // //     Alert.alert(
// // //       'Confirm Settlement',
// // //       'Are you sure you want to mark this as settled?',
// // //       [
// // //         { 
// // //           text: 'Cancel', 
// // //           style: 'cancel',
// // //         },
// // //         { 
// // //           text: 'Confirm', 
// // //           onPress: () => handleSettle(groupId),
// // //           style: 'destructive'
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const handleSettle = async (groupId) => {
// // //     try {
// // //       // Delete all expenses in this group
// // //       const { error } = await supabase
// // //         .from('expenses')
// // //         .delete()
// // //         .eq('group_id', groupId);

// // //       if (error) throw error;

// // //       setExpenses(prev => prev.filter(expense => expense.id !== groupId));
// // //       Alert.alert('Success', 'Expense settled successfully!');
// // //     } catch (error) {
// // //       Alert.alert('Error', 'Failed to settle expense group');
// // //     }
// // //   };

// // //   const getStatusText = (expense) => {
// // //     if (expense.isPaidByUser) {
// // //       return expense.split_type === 'equal'
// // //         ? `You paid • Split with ${expense.total_people - 1} people`
// // //         : expense.split_type === 'custom'
// // //           ? 'You organized custom split'
// // //           : `You lent to ${expense.friendUsername}`;
// // //     }
// // //     return expense.split_type === 'equal'
// // //       ? `${expense.friendUsername} paid • Split with you`
// // //       : expense.split_type === 'custom'
// // //         ? 'Custom split expense'
// // //         : `You borrowed from ${expense.friendUsername}`;
// // //   };

// // //   const viewGroupDetails = (groupId) => {
// // //     navigation.navigate('GroupExpenseDetail', { groupId });
// // //   };

// // //   const renderItem = ({ item }) => (
// // //     <View style={styles.expenseCard}>
// // //       <View style={styles.cardContent}>
// // //         <View style={styles.expenseInfo}>
// // //           <Text style={styles.description} numberOfLines={1}>
// // //             {item.description || 'Expense'}
// // //           </Text>
// // //           <View style={styles.statusContainer}>
// // //             <Text style={styles.statusText}>{getStatusText(item)}</Text>
// // //           </View>
// // //           <Text style={styles.date}>
// // //             {new Date(item.created_at).toLocaleDateString('en-IN', {
// // //               day: 'numeric', month: 'short', year: 'numeric'
// // //             })}
// // //           </Text>
// // //         </View>
        
// // //         <View style={styles.amountSection}>
// // //           <Text style={[
// // //             styles.amount,
// // //             item.isPaidByUser ? styles.owedToYou : styles.youOwe
// // //           ]}>
// // //             {item.isPaidByUser ? '' : ''}Rs{Math.abs(item.amount).toFixed(2)}
// // //           </Text>
// // //         </View>
// // //       </View>
      
// // //       <View style={styles.actionRow}>
// // //         {(item.split_type === 'equal' && item.total_people > 2) || 
// // //         item.split_type === 'custom' ? (
// // //           <TouchableOpacity
// // //             style={styles.viewDetailsButton}
// // //             onPress={() => viewGroupDetails(item.id)}
// // //             activeOpacity={0.7}
// // //           >
// // //             <Text style={styles.viewDetailsButtonText}>View Details</Text>
// // //           </TouchableOpacity>
// // //         ) : null}
        
// // //         <TouchableOpacity
// // //           style={styles.settleButton}
// // //           onPress={() => confirmSettle(item.id)}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Text style={styles.settleButtonText}>Settle</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );

// // //   const renderHiddenItem = (data) => (
// // //     <View style={styles.rowBack}>
// // //       <TouchableOpacity
// // //         style={styles.deleteButton}
// // //         onPress={() => confirmSettle(data.item.id)}
// // //         activeOpacity={0.8}
// // //       >
// // //         <Text style={styles.deleteText}>Delete</Text>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   const TimeFilterButton = ({ label, value }) => (
// // //     <TouchableOpacity
// // //       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
// // //       onPress={() => setTimeFilter(value)}
// // //     >
// // //       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
// // //         {label}
// // //       </Text>
// // //     </TouchableOpacity>
// // //   );

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Search Bar */}
// // //       <View style={styles.searchContainer}>
// // //         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search by name or description"
// // //           placeholderTextColor="#888"
// // //           value={searchQuery}
// // //           onChangeText={setSearchQuery}
// // //           clearButtonMode="while-editing"
// // //         />
// // //       </View>
      
// // //       {/* Time Filters */}
// // //       <View style={styles.timeFilterContainer}>
// // //         <TimeFilterButton label="All" value="all" />
// // //         <TimeFilterButton label="Today" value="today" />
// // //         <TimeFilterButton label="Yesterday" value="yesterday" />
// // //         <TimeFilterButton label="Month" value="month" />
// // //       </View>

// // //       {loading ? (
// // //         <View style={styles.loadingContainer}>
// // //           <ActivityIndicator size="large" color="#D2B48C" />
// // //         </View>
// // //       ) : (
// // //         <SwipeListView
// // //           data={filteredExpenses}
// // //           keyExtractor={(item) => item.id}
// // //           renderItem={renderItem}
// // //           renderHiddenItem={renderHiddenItem}
// // //           rightOpenValue={-100}
// // //           disableRightSwipe
// // //           refreshControl={
// // //             <RefreshControl 
// // //               refreshing={refreshing} 
// // //               onRefresh={() => getExpenses(true)}
// // //               tintColor="#D2B48C"
// // //               colors={['#D2B48C']}
// // //             />
// // //           }
// // //           ListEmptyComponent={
// // //             <View style={styles.emptyContainer}>
// // //               <Text style={styles.emptyTitle}>No Transactions Found</Text>
// // //               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
// // //             </View>
// // //           }
// // //           contentContainerStyle={styles.listContent}
// // //           ItemSeparatorComponent={() => <View style={styles.separator} />}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: 'black',
// // //     paddingHorizontal: 16,
// // //   },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 16,
// // //     marginVertical: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   searchIcon: {
// // //     marginRight: 10,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     color: '#FFF0DC',
// // //     paddingVertical: 12,
// // //     fontSize: 16,
// // //   },
// // //   timeFilterContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 12,
// // //   },
// // //   timeFilterButton: {
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     backgroundColor: '#1E1E1E',
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   activeTimeFilter: {
// // //     backgroundColor: '#543A14',
// // //     borderColor: '#D2B48C',
// // //   },
// // //   timeFilterText: {
// // //     color: '#D2B48C',
// // //     fontSize: 14,
// // //   },
// // //   activeTimeFilterText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   expenseCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   cardContent: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //   },
// // //   expenseInfo: {
// // //     flex: 1,
// // //     marginRight: 12,
// // //   },
// // //   description: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#FFF0DC',
// // //     marginBottom: 6,
// // //   },
// // //   statusContainer: {
// // //     marginBottom: 6,
// // //   },
// // //   statusText: {
// // //     fontSize: 13,
// // //     color: '#BBB',
// // //   },
// // //   date: {
// // //     fontSize: 12,
// // //     color: '#888',
// // //   },
// // //   amountSection: {
// // //     alignItems: 'flex-end',
// // //     justifyContent: 'space-between',
// // //   },
// // //   amount: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     marginBottom: 8,
// // //   },
// // //   owedToYou: {
// // //     color: '#4CAF50',
// // //   },
// // //   youOwe: {
// // //     color: '#F44336',
// // //   },
// // //   actionRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'flex-end',
// // //     padding: 16,
// // //     paddingTop: 0,
// // //   },
// // //   viewDetailsButton: {
// // //     backgroundColor: '#1E2E1A',
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     marginRight: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#4CAF50',
// // //   },
// // //   viewDetailsButtonText: {
// // //     color: '#4CAF50',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   settleButton: {
// // //     backgroundColor: '#543A14',
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#D2B48C',
// // //   },
// // //   settleButtonText: {
// // //     color: '#FFF0DC',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   emptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingVertical: 100,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     color: '#FFF0DC',
// // //     marginBottom: 8,
// // //     fontWeight: '600',
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: '#888',
// // //     textAlign: 'center',
// // //     maxWidth: 250,
// // //   },
// // //   rowBack: {
// // //     alignItems: 'center',
// // //     backgroundColor: '#F44336',
// // //     borderRadius: 12,
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     justifyContent: 'flex-end',
// // //     marginVertical: 4,
// // //   },
// // //   deleteButton: {
// // //     width: 100,
// // //     height: '100%',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   deleteText: {
// // //     color: '#FFF',
// // //     fontWeight: '600',
// // //   },
// // //   listContent: {
// // //     paddingBottom: 24,
// // //     flexGrow: 1,
// // //   },
// // //   separator: {
// // //     height: 8,
// // //   },
// // // });

// // // // screens/History.js
// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   View, Text, StyleSheet, ActivityIndicator,
// // //   TouchableOpacity, Alert, RefreshControl, TextInput
// // // } from 'react-native';
// // // import { SwipeListView } from 'react-native-swipe-list-view';
// // // import { supabase } from '../lib/supabase';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // export default function History({ navigation }) {
// // //   const [expenses, setExpenses] = useState([]);
// // //   const [filteredExpenses, setFilteredExpenses] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [user, setUser] = useState(null);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'

// // //   useEffect(() => {
// // //     async function fetchUser() {
// // //       const { data: { user } } = await supabase.auth.getUser();
// // //       setUser(user);
// // //     }
// // //     fetchUser();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (user) getExpenses();
// // //   }, [user]);

// // //   useEffect(() => {
// // //     filterExpenses();
// // //   }, [expenses, searchQuery, timeFilter]);

// // //   function filterExpenses() {
// // //     let result = [...expenses];
    
// // //     // Apply time filter
// // //     const now = new Date();
// // //     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// // //     const yesterdayStart = new Date(todayStart);
// // //     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
// // //     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
// // //     if (timeFilter === 'today') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= todayStart
// // //       );
// // //     } else if (timeFilter === 'yesterday') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= yesterdayStart && 
// // //         new Date(expense.created_at) < todayStart
// // //       );
// // //     } else if (timeFilter === 'month') {
// // //       result = result.filter(expense => 
// // //         new Date(expense.created_at) >= monthStart
// // //       );
// // //     }
    
// // //     // Apply search filter
// // //     if (searchQuery) {
// // //       const query = searchQuery.toLowerCase();
// // //       result = result.filter(expense => 
// // //         expense.friendUsername?.toLowerCase().includes(query) ||
// // //         expense.description?.toLowerCase().includes(query)
// // //       );
// // //     }
    
// // //     setFilteredExpenses(result);
// // //   }

// // //   async function getExpenses(isRefresh = false) {
// // //     if (isRefresh) setRefreshing(true);
// // //     else setLoading(true);

// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('expenses')
// // //         .select(`
// // //           id,
// // //           group_id,
// // //           amount,
// // //           description,
// // //           created_at,
// // //           user_id,
// // //           friend_id,
// // //           split_type,
// // //           total_amount,
// // //           total_people,
// // //           payer:profiles!expenses_user_id_fkey(username),
// // //           receiver:profiles!expenses_friend_id_fkey(username)
// // //         `)
// // //         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
// // //         .order('created_at', { ascending: false });

// // //       if (error) throw error;

// // //       // Group expenses by group_id (or by id for old records)
// // //       const groupedExpenses = data.reduce((acc, expense) => {
// // //         const groupId = expense.group_id || expense.id; // Fallback to id
// // //         if (!acc[groupId]) {
// // //           acc[groupId] = {
// // //             id: groupId,
// // //             expenses: [],
// // //             total_amount: expense.total_amount,
// // //             description: expense.description,
// // //             created_at: expense.created_at,
// // //             total_people: expense.total_people,
// // //             split_type: expense.split_type
// // //           };
// // //         }
// // //         acc[groupId].expenses.push(expense);
// // //         return acc;
// // //       }, {});

// // //       // Convert to array and transform
// // //       const transformed = Object.values(groupedExpenses).map(group => {
// // //         const userExpense = group.expenses.find(e => 
// // //           e.user_id === user.id || e.friend_id === user.id
// // //         );
        
// // //         const isPaidByUser = userExpense?.user_id === user.id;
// // //         const friend = isPaidByUser 
// // //           ? userExpense.receiver 
// // //           : userExpense?.payer;

// // //         // Calculate user's net amount for this group
// // //         let amount = 0;
// // //         if (isPaidByUser) {
// // //           // User is payer: owed money from others
// // //           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
// // //         } else {
// // //           // User is participant: owes money
// // //           const userRecord = group.expenses.find(e => e.friend_id === user.id);
// // //           if (userRecord) amount = -userRecord.amount;
// // //         }

// // //         return {
// // //           ...group,
// // //           isPaidByUser,
// // //           friendUsername: friend?.username || 'Unknown',
// // //           amount: parseFloat(amount.toFixed(2))
// // //         };
// // //       });

// // //       setExpenses(transformed);
// // //     } catch (error) {
// // //       console.error('Error fetching expenses:', error);
// // //     } finally {
// // //       setLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   }

// // //   const confirmSettle = (groupId) => {
// // //     Alert.alert(
// // //       'Confirm Settlement',
// // //       'Are you sure you want to mark this as settled?',
// // //       [
// // //         { 
// // //           text: 'Cancel', 
// // //           style: 'cancel',
// // //         },
// // //         { 
// // //           text: 'Confirm', 
// // //           onPress: () => handleSettle(groupId),
// // //           style: 'destructive'
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const handleSettle = async (groupId) => {
// // //     try {
// // //       // Delete all expenses in this group
// // //       const { error } = await supabase
// // //         .from('expenses')
// // //         .delete()
// // //         .eq('group_id', groupId);

// // //       if (error) throw error;

// // //       setExpenses(prev => prev.filter(expense => expense.id !== groupId));
// // //       Alert.alert('Success', 'Expense settled successfully!');
// // //     } catch (error) {
// // //       Alert.alert('Error', 'Failed to settle expense group');
// // //     }
// // //   };

// // //   const getStatusText = (expense) => {
// // //     if (expense.isPaidByUser) {
// // //       return expense.split_type === 'equal'
// // //         ? `You paid • Split with ${expense.total_people - 1} people`
// // //         : expense.split_type === 'custom'
// // //           ? 'You organized custom split'
// // //           : `You lent to ${expense.friendUsername}`;
// // //     }
// // //     return expense.split_type === 'equal'
// // //       ? `${expense.friendUsername} paid • Split with you`
// // //       : expense.split_type === 'custom'
// // //         ? 'Custom split expense'
// // //         : `You borrowed from ${expense.friendUsername}`;
// // //   };

// // //   const viewGroupDetails = (groupId) => {
// // //     navigation.navigate('GroupExpenseDetail', { groupId });
// // //   };

// // //   const renderItem = ({ item }) => (
// // //     <View style={styles.expenseCard}>
// // //       <View style={styles.cardContent}>
// // //         <View style={styles.expenseInfo}>
// // //           <Text style={styles.description} numberOfLines={1}>
// // //             {item.description || 'Expense'}
// // //           </Text>
// // //           <View style={styles.statusContainer}>
// // //             <Text style={styles.statusText}>{getStatusText(item)}</Text>
// // //           </View>
// // //           <Text style={styles.date}>
// // //             {new Date(item.created_at).toLocaleDateString('en-IN', {
// // //               day: 'numeric', month: 'short', year: 'numeric'
// // //             })}
// // //           </Text>
// // //         </View>
        
// // //         <View style={styles.amountSection}>
// // //           <Text style={[
// // //             styles.amount,
// // //             item.isPaidByUser ? styles.owedToYou : styles.youOwe
// // //           ]}>
// // //             {item.isPaidByUser ? '' : ''}Rs{Math.abs(item.amount).toFixed(2)}
// // //           </Text>
// // //         </View>
// // //       </View>
      
// // //       <View style={styles.actionRow}>
// // //         {(item.split_type === 'equal' && item.total_people > 2) || 
// // //         item.split_type === 'custom' ? (
// // //           <TouchableOpacity
// // //             style={styles.viewDetailsButton}
// // //             onPress={() => viewGroupDetails(item.id)}
// // //             activeOpacity={0.7}
// // //           >
// // //             <Text style={styles.viewDetailsButtonText}>View Details</Text>
// // //           </TouchableOpacity>
// // //         ) : null}
        
// // //         <TouchableOpacity
// // //           style={styles.settleButton}
// // //           onPress={() => confirmSettle(item.id)}
// // //           activeOpacity={0.7}
// // //         >
// // //           <Text style={styles.settleButtonText}>Settle</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );

// // //   const renderHiddenItem = (data) => (
// // //     <View style={styles.rowBack}>
// // //       <TouchableOpacity
// // //         style={styles.deleteButton}
// // //         onPress={() => confirmSettle(data.item.id)}
// // //         activeOpacity={0.8}
// // //       >
// // //         <Text style={styles.deleteText}>Delete</Text>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   const TimeFilterButton = ({ label, value }) => (
// // //     <TouchableOpacity
// // //       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
// // //       onPress={() => setTimeFilter(value)}
// // //     >
// // //       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
// // //         {label}
// // //       </Text>
// // //     </TouchableOpacity>
// // //   );

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Search Bar */}
// // //       <View style={styles.searchContainer}>
// // //         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search by name or description"
// // //           placeholderTextColor="#888"
// // //           value={searchQuery}
// // //           onChangeText={setSearchQuery}
// // //           clearButtonMode="while-editing"
// // //         />
// // //       </View>
      
// // //       {/* Time Filters */}
// // //       <View style={styles.timeFilterContainer}>
// // //         <TimeFilterButton label="All" value="all" />
// // //         <TimeFilterButton label="Today" value="today" />
// // //         <TimeFilterButton label="Yesterday" value="yesterday" />
// // //         <TimeFilterButton label="Month" value="month" />
// // //       </View>

// // //       {loading ? (
// // //         <View style={styles.loadingContainer}>
// // //           <ActivityIndicator size="large" color="#D2B48C" />
// // //         </View>
// // //       ) : (
// // //         <SwipeListView
// // //           data={filteredExpenses}
// // //           keyExtractor={(item) => item.id}
// // //           renderItem={renderItem}
// // //           renderHiddenItem={renderHiddenItem}
// // //           rightOpenValue={-100}
// // //           disableRightSwipe
// // //           refreshControl={
// // //             <RefreshControl 
// // //               refreshing={refreshing} 
// // //               onRefresh={() => getExpenses(true)}
// // //               tintColor="#D2B48C"
// // //               colors={['#D2B48C']}
// // //             />
// // //           }
// // //           ListEmptyComponent={
// // //             <View style={styles.emptyContainer}>
// // //               <Text style={styles.emptyTitle}>No Transactions Found</Text>
// // //               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
// // //             </View>
// // //           }
// // //           contentContainerStyle={styles.listContent}
// // //           ItemSeparatorComponent={() => <View style={styles.separator} />}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: 'black',
// // //     paddingHorizontal: 16,
// // //   },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 16,
// // //     marginVertical: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   searchIcon: {
// // //     marginRight: 10,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     color: '#FFF0DC',
// // //     paddingVertical: 12,
// // //     fontSize: 16,
// // //   },
// // //   timeFilterContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 12,
// // //   },
// // //   timeFilterButton: {
// // //     paddingVertical: 8,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     backgroundColor: '#1E1E1E',
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //   },
// // //   activeTimeFilter: {
// // //     backgroundColor: '#543A14',
// // //     borderColor: '#D2B48C',
// // //   },
// // //   timeFilterText: {
// // //     color: '#D2B48C',
// // //     fontSize: 14,
// // //   },
// // //   activeTimeFilterText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   expenseCard: {
// // //     backgroundColor: '#1E1E1E',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#333',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   cardContent: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //   },
// // //   expenseInfo: {
// // //     flex: 1,
// // //     marginRight: 12,
// // //   },
// // //   description: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#FFF0DC',
// // //     marginBottom: 6,
// // //   },
// // //   statusContainer: {
// // //     marginBottom: 6,
// // //   },
// // //   statusText: {
// // //     fontSize: 13,
// // //     color: '#BBB',
// // //   },
// // //   date: {
// // //     fontSize: 12,
// // //     color: '#888',
// // //   },
// // //   amountSection: {
// // //     alignItems: 'flex-end',
// // //     justifyContent: 'space-between',
// // //   },
// // //   amount: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     marginBottom: 8,
// // //   },
// // //   owedToYou: {
// // //     color: '#4CAF50',
// // //   },
// // //   youOwe: {
// // //     color: '#F44336',
// // //   },
// // //   actionRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'flex-end',
// // //     padding: 16,
// // //     paddingTop: 0,
// // //   },
// // //   viewDetailsButton: {
// // //     backgroundColor: '#1E2E1A',
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     marginRight: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#4CAF50',
// // //   },
// // //   viewDetailsButtonText: {
// // //     color: '#4CAF50',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   settleButton: {
// // //     backgroundColor: '#543A14',
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#D2B48C',
// // //   },
// // //   settleButtonText: {
// // //     color: '#FFF0DC',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   emptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingVertical: 100,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     color: '#FFF0DC',
// // //     marginBottom: 8,
// // //     fontWeight: '600',
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: '#888',
// // //     textAlign: 'center',
// // //     maxWidth: 250,
// // //   },
// // //   rowBack: {
// // //     alignItems: 'center',
// // //     backgroundColor: '#F44336',
// // //     borderRadius: 12,
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     justifyContent: 'flex-end',
// // //     marginVertical: 4,
// // //   },
// // //   deleteButton: {
// // //     width: 100,
// // //     height: '100%',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   deleteText: {
// // //     color: '#FFF',
// // //     fontWeight: '600',
// // //   },
// // //   listContent: {
// // //     paddingBottom: 24,
// // //     flexGrow: 1,
// // //   },
// // //   separator: {
// // //     height: 8,
// // //   },
// // // });

// // screens/History.js
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ActivityIndicator,
//   TouchableOpacity, Alert, RefreshControl, TextInput
// } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function History({ navigation }) {
//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) getExpenses();
//   }, [user]);

//   useEffect(() => {
//     filterExpenses();
//   }, [expenses, searchQuery, timeFilter]);

//   function filterExpenses() {
//     let result = [...expenses];

//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterdayStart = new Date(todayStart);
//     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//     if (timeFilter === 'today') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= todayStart
//       );
//     } else if (timeFilter === 'yesterday') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= yesterdayStart &&
//         new Date(expense.created_at) < todayStart
//       );
//     } else if (timeFilter === 'month') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= monthStart
//       );
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(expense =>
//         expense.friendUsername?.toLowerCase().includes(query) ||
//         expense.description?.toLowerCase().includes(query)
//       );
//     }

//     setFilteredExpenses(result);
//   }

//   async function getExpenses(isRefresh = false) {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);

//     try {
//       const { data, error } = await supabase
//         .from('expenses')
//         .select(`
//           id,
//           group_id,
//           amount,
//           description,
//           created_at,
//           user_id,
//           friend_id,
//           split_type,
//           total_amount,
//           total_people,
//           payer:profiles!expenses_user_id_fkey(username),
//           receiver:profiles!expenses_friend_id_fkey(username)
//         `)
//         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const groupedExpenses = data.reduce((acc, expense) => {
//         const groupId = expense.group_id || expense.id;
//         if (!acc[groupId]) {
//           acc[groupId] = {
//             id: groupId,
//             expenses: [],
//             total_amount: expense.total_amount,
//             description: expense.description,
//             created_at: expense.created_at,
//             total_people: expense.total_people,
//             split_type: expense.split_type
//           };
//         }
//         acc[groupId].expenses.push(expense);
//         return acc;
//       }, {});

//       const transformed = Object.values(groupedExpenses).map(group => {
//         const userExpense = group.expenses.find(e =>
//           e.user_id === user.id || e.friend_id === user.id
//         );

//         const isPaidByUser = userExpense?.user_id === user.id;
//         const friend = isPaidByUser
//           ? userExpense.receiver
//           : userExpense?.payer;

//         let amount = 0;
//         if (isPaidByUser) {
//           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
//         } else {
//           const userRecord = group.expenses.find(e => e.friend_id === user.id);
//           if (userRecord) amount = -userRecord.amount;
//         }

//         return {
//           ...group,
//           isPaidByUser,
//           friendUsername: friend?.username || 'Unknown',
//           amount: parseFloat(amount.toFixed(2))
//         };
//       });

//       setExpenses(transformed);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }

//   const confirmSettle = (groupId) => {
//     Alert.alert(
//       'Confirm Settlement',
//       'Are you sure you want to mark this as settled?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Confirm',
//           onPress: () => handleSettle(groupId),
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   const handleSettle = async (groupId) => {
//     try {
//       const { error } = await supabase
//         .from('expenses')
//         .delete()
//         .eq('group_id', groupId);

//       if (error) throw error;

//       setExpenses(prev => prev.filter(expense => expense.id !== groupId));
//       Alert.alert('Success', 'Expense settled successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to settle expense group');
//     }
//   };

//   const getStatusText = (expense) => {
//     if (expense.isPaidByUser) {
//       return expense.split_type === 'equal'
//         ? `You paid • Split with ${expense.total_people - 1} people`
//         : expense.split_type === 'custom'
//           ? 'You organized custom split'
//           : `You lent to ${expense.friendUsername}`;
//     }
//     return expense.split_type === 'equal'
//       ? `${expense.friendUsername} paid • Split with you`
//       : expense.split_type === 'custom'
//         ? 'Custom split expense'
//         : `You borrowed from ${expense.friendUsername}`;
//   };

//   const viewGroupDetails = (groupId) => {
//     navigation.navigate('GroupExpenseDetail', { groupId });
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.expenseCard}>
//       <View style={styles.cardContent}>
//         <View style={styles.expenseInfo}>
//           <Text style={styles.description} numberOfLines={1}>
//             {item.description || 'Expense'}
//           </Text>
//           <View style={styles.statusContainer}>
//             <Text style={styles.statusText}>{getStatusText(item)}</Text>
//           </View>
//           <Text style={styles.date}>
//             {new Date(item.created_at).toLocaleDateString('en-IN', {
//               day: 'numeric', month: 'short', year: 'numeric'
//             })}
//           </Text>
//         </View>

//         <View style={styles.amountSection}>
//           <Text style={[
//             styles.amount,
//             item.isPaidByUser ? styles.owedToYou : styles.youOwe
//           ]}>
//             Rs{Math.abs(item.amount).toFixed(2)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         {(item.split_type === 'equal' && item.total_people > 2) ||
//         item.split_type === 'custom' ? (
//           <TouchableOpacity
//             style={styles.viewDetailsButton}
//             onPress={() => viewGroupDetails(item.id)}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.viewDetailsButtonText}>View Details</Text>
//           </TouchableOpacity>
//         ) : null}

//         <TouchableOpacity
//           style={styles.settleButton}
//           onPress={() => confirmSettle(item.id)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.settleButtonText}>Settle</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderHiddenItem = (data) => (
//     <View style={styles.rowBack}>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => confirmSettle(data.item.id)}
//         activeOpacity={0.8}
//       >
//         <Text style={styles.deleteText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const TimeFilterButton = ({ label, value }) => (
//     <TouchableOpacity
//       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
//       onPress={() => setTimeFilter(value)}
//     >
//       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name or description"
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           clearButtonMode="while-editing"
//         />
//       </View>

//       {/* Time Filters */}
//       <View style={styles.timeFilterContainer}>
//         <TimeFilterButton label="All" value="all" />
//         <TimeFilterButton label="Today" value="today" />
//         <TimeFilterButton label="Yesterday" value="yesterday" />
//         <TimeFilterButton label="Month" value="month" />
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#D2B48C" />
//         </View>
//       ) : (
//         <SwipeListView
//           data={filteredExpenses}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           renderHiddenItem={renderHiddenItem}
//           rightOpenValue={-100}
//           disableRightSwipe
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => getExpenses(true)}
//               tintColor="#D2B48C"
//               colors={['#D2B48C']}
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyTitle}>No Transactions Found</Text>
//               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
//             </View>
//           }
//           contentContainerStyle={styles.listContent}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     paddingHorizontal: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginVertical: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#FFF0DC',
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   timeFilterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   timeFilterButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     backgroundColor: '#1E1E1E',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   activeTimeFilter: {
//     backgroundColor: '#543A14',
//     borderColor: '#D2B48C',
//   },
//   timeFilterText: {
//     color: '#D2B48C',
//     fontSize: 14,
//   },
//   activeTimeFilterText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   expenseCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   expenseInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF0DC',
//     marginBottom: 6,
//   },
//   statusContainer: {
//     marginBottom: 6,
//   },
//   statusText: {
//     fontSize: 13,
//     color: '#BBB',
//   },
//   date: {
//     fontSize: 12,
//     color: '#888',
//   },
//   amountSection: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
//   amount: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 8,
//   },
//   owedToYou: {
//     color: '#4CAF50',
//   },
//   youOwe: {
//     color: '#F44336',
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 16,
//     paddingTop: 0,
//   },
//   viewDetailsButton: {
//     backgroundColor: '#1E2E1A',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//   },
//   viewDetailsButtonText: {
//     color: '#4CAF50',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   settleButton: {
//     backgroundColor: '#543A14',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   settleButtonText: {
//     color: '#FFF0DC',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 100,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     color: '#FFF0DC',
//     marginBottom: 8,
//     fontWeight: '600',
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     maxWidth: 250,
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     borderRadius: 12,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginVertical: 4,
//   },
//   deleteButton: {
//     width: 100,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   deleteText: {
//     color: '#FFF',
//     fontWeight: '600',
//   },
//   listContent: {
//     paddingBottom: 24,
//     flexGrow: 1,
//   },
//   separator: {
//     height: 8,
//   },
// });

// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, StyleSheet, ActivityIndicator,
// //   TouchableOpacity, FlatList, Alert
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import { useNavigation } from '@react-navigation/native';

// // export default function History() {
// //   const [loading, setLoading] = useState(true);
// //   const [standardExpenses, setStandardExpenses] = useState([]);
// //   const [customExpenses, setCustomExpenses] = useState([]);
// //   const navigation = useNavigation();

// //   useEffect(() => {
// //     fetchExpenses();
// //   }, []);

// //   const fetchExpenses = async () => {
// //     setLoading(true);

// //     // Fetch standard expenses (equal/full)
// //     const { data: standardData, error: standardError } = await supabase
// //       .from('expenses')
// //       .select('*')
// //       .order('created_at', { ascending: false });

// //     // Fetch custom expenses
// //     const { data: customData, error: customError } = await supabase
// //       .from('custom_expenses')
// //       .select('*')
// //       .order('created_at', { ascending: false });

// //     if (standardError || customError) {
// //       Alert.alert('Error fetching expenses');
// //     } else {
// //       setStandardExpenses(standardData || []);
// //       setCustomExpenses(customData || []);
// //     }

// //     setLoading(false);
// //   };

// //   const renderStandardItem = ({ item }) => (
// //     <View style={styles.expenseCard}>
// //       <View style={styles.row}>
// //         <Text style={styles.description}>{item.description}</Text>
// //         <Text style={styles.amount}>Rs {item.amount}</Text>
// //       </View>
// //       <Text style={styles.splitType}>{item.split_type.toUpperCase()} SPLIT</Text>
// //       <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('en-IN')}</Text>
// //     </View>
// //   );

// //   const renderCustomItem = ({ item }) => (
// //     <TouchableOpacity
// //       style={styles.expenseCardCustom}
// //       onPress={() => navigation.navigate('GroupExpenseDetail', {
// //         groupId: item.id
// //       })}
// //     >
// //       <View style={styles.row}>
// //         <Text style={styles.description}>{item.description}</Text>
// //         <Text style={styles.amountYellow}>Rs {item.total_amount}</Text>
// //       </View>
// //       <View style={styles.row}>
// //         <Text style={styles.splitType}>CUSTOM SPLIT</Text>
// //         <Text style={styles.viewDetails}>View Details →</Text>
// //       </View>
// //       <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('en-IN')}</Text>
// //     </TouchableOpacity>
// //   );

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={[...customExpenses, ...standardExpenses]}
// //         keyExtractor={(item, index) => item.id + '-' + index}
// //         renderItem={({ item }) => {
// //           if (item.split_type === 'custom' || item.participants) {
// //             return renderCustomItem({ item });
// //           } else {
// //             return renderStandardItem({ item });
// //           }
// //         }}
// //         ListHeaderComponent={() => (
// //           <Text style={styles.header}>Expense History</Text>
// //         )}
// //         contentContainerStyle={{ paddingBottom: 80 }}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#121212',
// //     padding: 16,
// //   },
// //   header: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 16,
// //   },
// //   expenseCard: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderColor: '#333',
// //     borderWidth: 1,
// //   },
// //   expenseCardCustom: {
// //     backgroundColor: '#1A1A1A',
// //     borderRadius: 10,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderColor: '#D2B48C',
// //     borderWidth: 1,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   description: {
// //     fontSize: 16,
// //     color: '#FFF0DC',
// //     fontWeight: '600',
// //   },
// //   amount: {
// //     fontSize: 16,
// //     color: '#4CAF50',
// //     fontWeight: 'bold',
// //   },
// //   amountYellow: {
// //     fontSize: 16,
// //     color: '#FFD700',
// //     fontWeight: 'bold',
// //   },
// //   splitType: {
// //     marginTop: 4,
// //     fontSize: 13,
// //     color: '#888',
// //     fontStyle: 'italic',
// //   },
// //   date: {
// //     marginTop: 6,
// //     fontSize: 12,
// //     color: '#555',
// //   },
// //   viewDetails: {
// //     fontSize: 14,
// //     color: '#D2B48C',
// //     fontWeight: '600',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#121212',
// //   },
// // });


//ios test

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ActivityIndicator,
//   TouchableOpacity, Alert, RefreshControl, TextInput, FlatList
// } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';

// export default function History() {
//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'
//   const navigation = useNavigation();

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) getExpenses();
//   }, [user]);

//   useEffect(() => {
//     filterExpenses();
//   }, [expenses, searchQuery, timeFilter]);

//   function filterExpenses() {
//     let result = [...expenses];

//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterdayStart = new Date(todayStart);
//     yesterdayStart.setDate(yesterdayStart.getDate() - 1);
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//     if (timeFilter === 'today') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= todayStart
//       );
//     } else if (timeFilter === 'yesterday') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= yesterdayStart &&
//         new Date(expense.created_at) < todayStart
//       );
//     } else if (timeFilter === 'month') {
//       result = result.filter(expense =>
//         new Date(expense.created_at) >= monthStart
//       );
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(expense =>
//         expense.friendUsername?.toLowerCase().includes(query) ||
//         expense.description?.toLowerCase().includes(query)
//       );
//     }

//     setFilteredExpenses(result);
//   }

//   async function getExpenses(isRefresh = false) {
//     if (isRefresh) setRefreshing(true);
//     else setLoading(true);

//     try {
//       // Fetch standard expenses
//       const { data: standardData, error: standardError } = await supabase
//         .from('expenses')
//         .select(`
//           id,
//           group_id,
//           amount,
//           description,
//           created_at,
//           user_id,
//           friend_id,
//           split_type,
//           total_amount,
//           total_people,
//           payer:profiles!expenses_user_id_fkey(username),
//           receiver:profiles!expenses_friend_id_fkey(username)
//         `)
//         .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
//         .order('created_at', { ascending: false });

//       if (standardError) throw standardError;

//       // Fetch custom expenses
//       const { data: customData, error: customError } = await supabase
//         .from('custom_expenses')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (customError) throw customError;

//       // Transform standard expenses
//       const standardGroups = standardData.reduce((acc, expense) => {
//         const groupId = expense.group_id || expense.id;
//         if (!acc[groupId]) {
//           acc[groupId] = {
//             id: groupId,
//             expenses: [],
//             total_amount: expense.total_amount,
//             description: expense.description,
//             created_at: expense.created_at,
//             total_people: expense.total_people,
//             split_type: expense.split_type,
//             type: 'standard'
//           };
//         }
//         acc[groupId].expenses.push(expense);
//         return acc;
//       }, {});

//       const transformedStandard = Object.values(standardGroups).map(group => {
//         const userExpense = group.expenses.find(e =>
//           e.user_id === user.id || e.friend_id === user.id
//         );

//         const isPaidByUser = userExpense?.user_id === user.id;
//         const friend = isPaidByUser
//           ? userExpense.receiver
//           : userExpense?.payer;

//         let amount = 0;
//         if (isPaidByUser) {
//           amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
//         } else {
//           const userRecord = group.expenses.find(e => e.friend_id === user.id);
//           if (userRecord) amount = -userRecord.amount;
//         }

//         return {
//           ...group,
//           isPaidByUser,
//           friendUsername: friend?.username || 'Unknown',
//           amount: parseFloat(amount.toFixed(2))
//         };
//       });

//       // Transform custom expenses
//       const transformedCustom = (customData || []).map(item => {
//         const userParticipant = item.participants?.find(p => p.id === user.id);
//         const paidByUser = parseFloat(userParticipant?.paid) || 0;
//         const equalShare = item.total_amount / item.total_people;
//         const net = paidByUser - equalShare;

//         return {
//           id: item.id,
//           type: 'custom',
//           description: item.description,
//           total_amount: item.total_amount,
//           created_at: item.created_at,
//           total_people: item.total_people,
//           split_type: 'custom',
//           amount: parseFloat(net.toFixed(2)),
//           friendUsername: null,
//           isPaidByUser: null
//         };
//       });

//       // Combine and sort
//       const allExpenses = [...transformedStandard, ...transformedCustom].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );

//       setExpenses(allExpenses);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//       Alert.alert('Error', 'Failed to load expenses');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }

//   const confirmSettle = (expense) => {
//     Alert.alert(
//       'Confirm Settlement',
//       'Are you sure you want to mark this as settled?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Confirm',
//           onPress: () => handleSettle(expense),
//           style: 'destructive'
//         }
//       ]
//     );
//   };

//   const handleSettle = async (expense) => {
//     try {
//       if (expense.type === 'standard') {
//         const { error } = await supabase
//           .from('expenses')
//           .delete()
//           .eq('group_id', expense.id);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase
//           .from('custom_expenses')
//           .delete()
//           .eq('id', expense.id);
//         if (error) throw error;
//       }

//       setExpenses(prev => prev.filter(e => e.id !== expense.id));
//       Alert.alert('Success', 'Expense settled successfully!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to settle expense');
//     }
//   };

//   const getStatusText = (expense) => {
//     if (expense.type === 'custom') {
//       return 'Custom split expense';
//     }

//     if (expense.isPaidByUser) {
//       return expense.split_type === 'equal'
//         ? `You paid • Split with ${expense.total_people - 1} people`
//         : `You lent to ${expense.friendUsername}`;
//     } else {
//       return expense.split_type === 'equal'
//         ? `${expense.friendUsername} paid • Split with you`
//         : `You borrowed from ${expense.friendUsername}`;
//     }
//   };

//   const viewGroupDetails = (expense) => {
//     if (expense.type === 'custom') {
//       navigation.navigate('GroupExpenseDetail', { groupId: expense.id });
//     } else if (expense.split_type === 'equal' && expense.total_people > 2) {
//       navigation.navigate('GroupExpenseDetail', { groupId: expense.id });
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.expenseCard}>
//       <View style={styles.cardContent}>
//         <View style={styles.expenseInfo}>
//           <Text style={styles.description} numberOfLines={1}>
//             {item.description || 'Expense'}
//           </Text>
//           <View style={styles.statusContainer}>
//             <Text style={styles.statusText}>{getStatusText(item)}</Text>
//           </View>
//           <Text style={styles.date}>
//             {new Date(item.created_at).toLocaleDateString('en-IN', {
//               day: 'numeric', month: 'short', year: 'numeric'
//             })}
//           </Text>
//         </View>

//         <View style={styles.amountSection}>
//           <Text style={[
//             styles.amount,
//             item.amount >= 0 ? styles.owedToYou : styles.youOwe
//           ]}>
//             Rs{Math.abs(item.amount).toFixed(2)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.actionRow}>
//         {(item.type === 'custom' || 
//          (item.split_type === 'equal' && item.total_people > 2)) && (
//           <TouchableOpacity
//             style={styles.viewDetailsButton}
//             onPress={() => viewGroupDetails(item)}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.viewDetailsButtonText}>View Details</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           style={styles.settleButton}
//           onPress={() => confirmSettle(item)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.settleButtonText}>Settle</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderHiddenItem = (data) => (
//     <View style={styles.rowBack}>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => confirmSettle(data.item)}
//         activeOpacity={0.8}
//       >
//         <Text style={styles.deleteText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const TimeFilterButton = ({ label, value }) => (
//     <TouchableOpacity
//       style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
//       onPress={() => setTimeFilter(value)}
//     >
//       <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by name or description"
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           clearButtonMode="while-editing"
//         />
//       </View>

//       {/* Time Filters */}
//       <View style={styles.timeFilterContainer}>
//         <TimeFilterButton label="All" value="all" />
//         <TimeFilterButton label="Today" value="today" />
//         <TimeFilterButton label="Yesterday" value="yesterday" />
//         <TimeFilterButton label="Month" value="month" />
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#D2B48C" />
//         </View>
//       ) : (
//         <SwipeListView
//           data={filteredExpenses}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           renderHiddenItem={renderHiddenItem}
//           rightOpenValue={-100}
//           disableRightSwipe
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={() => getExpenses(true)}
//               tintColor="#D2B48C"
//               colors={['#D2B48C']}
//             />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyTitle}>No Transactions Found</Text>
//               <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
//             </View>
//           }
//           contentContainerStyle={styles.listContent}
//           ItemSeparatorComponent={() => <View style={styles.separator} />}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     paddingHorizontal: 16,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginVertical: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#FFF0DC',
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   timeFilterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   timeFilterButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     backgroundColor: '#1E1E1E',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   activeTimeFilter: {
//     backgroundColor: '#543A14',
//     borderColor: '#D2B48C',
//   },
//   timeFilterText: {
//     color: '#D2B48C',
//     fontSize: 14,
//   },
//   activeTimeFilterText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   expenseCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   expenseInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   description: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF0DC',
//     marginBottom: 6,
//   },
//   statusContainer: {
//     marginBottom: 6,
//   },
//   statusText: {
//     fontSize: 13,
//     color: '#BBB',
//   },
//   date: {
//     fontSize: 12,
//     color: '#888',
//   },
//   amountSection: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
//   amount: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 8,
//   },
//   owedToYou: {
//     color: '#4CAF50',
//   },
//   youOwe: {
//     color: '#F44336',
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 16,
//     paddingTop: 0,
//   },
//   viewDetailsButton: {
//     backgroundColor: '#1E2E1A',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//   },
//   viewDetailsButtonText: {
//     color: '#4CAF50',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   settleButton: {
//     backgroundColor: '#543A14',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   settleButtonText: {
//     color: '#FFF0DC',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 100,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     color: '#FFF0DC',
//     marginBottom: 8,
//     fontWeight: '600',
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     maxWidth: 250,
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     borderRadius: 12,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginVertical: 4,
//   },
//   deleteButton: {
//     width: 100,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   deleteText: {
//     color: '#FFF',
//     fontWeight: '600',
//   },
//   listContent: {
//     paddingBottom: 24,
//     flexGrow: 1,
//   },
//   separator: {
//     height: 8,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, RefreshControl, TextInput, FlatList
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';
import { useNavigation } from '@react-navigation/native';

export default function History() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'yesterday', 'month', 'all'
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) getExpenses();
  }, [user]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, timeFilter]);

  function filterExpenses() {
    let result = [...expenses];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    if (timeFilter === 'today') {
      result = result.filter(expense =>
        new Date(expense.created_at) >= todayStart
      );
    } else if (timeFilter === 'yesterday') {
      result = result.filter(expense =>
        new Date(expense.created_at) >= yesterdayStart &&
        new Date(expense.created_at) < todayStart
      );
    } else if (timeFilter === 'month') {
      result = result.filter(expense =>
        new Date(expense.created_at) >= monthStart
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(expense =>
        expense.friendUsername?.toLowerCase().includes(query) ||
        expense.description?.toLowerCase().includes(query)
      );
    }

    setFilteredExpenses(result);
  }

  async function getExpenses(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Fetch standard expenses
      const { data: standardData, error: standardError } = await supabase
        .from('expenses')
        .select(`
          id,
          group_id,
          amount,
          description,
          created_at,
          user_id,
          friend_id,
          split_type,
          total_amount,
          total_people,
          payer:profiles!expenses_user_id_fkey(username),
          receiver:profiles!expenses_friend_id_fkey(username)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (standardError) throw standardError;

      // Fetch custom expenses
      const { data: customData, error: customError } = await supabase
        .from('custom_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (customError) throw customError;

      // Transform standard expenses
      const standardGroups = standardData.reduce((acc, expense) => {
        const groupId = expense.group_id || expense.id;
        if (!acc[groupId]) {
          acc[groupId] = {
            id: groupId,
            expenses: [],
            total_amount: expense.total_amount,
            description: expense.description,
            created_at: expense.created_at,
            total_people: expense.total_people,
            split_type: expense.split_type,
            type: 'standard'
          };
        }
        acc[groupId].expenses.push(expense);
        return acc;
      }, {});

      const transformedStandard = Object.values(standardGroups).map(group => {
        const userExpense = group.expenses.find(e =>
          e.user_id === user.id || e.friend_id === user.id
        );

        const isPaidByUser = userExpense?.user_id === user.id;
        const friend = isPaidByUser
          ? userExpense.receiver
          : userExpense?.payer;

        let amount = 0;
        if (isPaidByUser) {
          amount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
        } else {
          const userRecord = group.expenses.find(e => e.friend_id === user.id);
          if (userRecord) amount = -userRecord.amount;
        }

        return {
          ...group,
          isPaidByUser,
          friendUsername: friend?.username || 'Unknown',
          amount: parseFloat(amount.toFixed(2))
        };
      });

      // Transform custom expenses
      const transformedCustom = (customData || []).map(item => {
        const userParticipant = item.participants?.find(p => p.id === user.id);
        const paidByUser = parseFloat(userParticipant?.paid) || 0;
        const equalShare = item.total_amount / item.total_people;
        const net = paidByUser - equalShare;

        return {
          id: item.id,
          type: 'custom',
          description: item.description,
          total_amount: item.total_amount,
          created_at: item.created_at,
          total_people: item.total_people,
          split_type: 'custom',
          amount: parseFloat(net.toFixed(2)),
          friendUsername: null,
          isPaidByUser: null
        };
      });

      // Combine and sort
      const allExpenses = [...transformedStandard, ...transformedCustom].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setExpenses(allExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      Alert.alert('Error', 'Failed to load expenses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const confirmSettle = (expense) => {
    Alert.alert(
      'Confirm Settlement',
      'Are you sure you want to mark this as settled?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleSettle(expense),
          style: 'destructive'
        }
      ]
    );
  };

  const handleSettle = async (expense) => {
    try {
      if (expense.type === 'standard') {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('group_id', expense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('custom_expenses')
          .delete()
          .eq('id', expense.id);
        if (error) throw error;
      }

      setExpenses(prev => prev.filter(e => e.id !== expense.id));
      Alert.alert('Success', 'Expense settled successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to settle expense');
    }
  };

  const getStatusText = (expense) => {
    if (expense.type === 'custom') {
      return 'Custom split expense';
    }

    if (expense.isPaidByUser) {
      return expense.split_type === 'equal'
        ? `You paid • Split with ${expense.total_people - 1} people`
        : `You lent to ${expense.friendUsername}`;
    } else {
      return expense.split_type === 'equal'
        ? `${expense.friendUsername} paid • Split with you`
        : `You borrowed from ${expense.friendUsername}`;
    }
  };

  const viewGroupDetails = (expense) => {
    if (expense.type === 'custom') {
      navigation.navigate('GroupExpenseDetail', { groupId: expense.id });
    } else if (expense.split_type === 'equal' && expense.total_people > 2) {
      navigation.navigate('GroupExpenseDetail', { groupId: expense.id });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.cardContent}>
        <View style={styles.expenseInfo}>
          <Text style={styles.description} numberOfLines={1}>
            {item.description || 'Expense'}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={[
            styles.amount,
            item.amount >= 0 ? styles.owedToYou : styles.youOwe
          ]}>
            Rs{Math.abs(item.amount).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {(item.type === 'custom' || 
         (item.split_type === 'equal' && item.total_people > 2)) && (
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => viewGroupDetails(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.settleButton}
          onPress={() => confirmSettle(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.settleButtonText}>Settle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmSettle(data.item)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const TimeFilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[styles.timeFilterButton, timeFilter === value && styles.activeTimeFilter]}
      onPress={() => setTimeFilter(value)}
    >
      <Text style={[styles.timeFilterText, timeFilter === value && styles.activeTimeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or description"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Time Filters */}
      <View style={styles.timeFilterContainer}>
        <TimeFilterButton label="All" value="all" />
        <TimeFilterButton label="Today" value="today" />
        <TimeFilterButton label="Yesterday" value="yesterday" />
        <TimeFilterButton label="Month" value="month" />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D2B48C" />
        </View>
      ) : (
        <SwipeListView
          data={filteredExpenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          disableRightSwipe
          closeOnRowBeginSwipe={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getExpenses(true)}
              tintColor="#D2B48C"
              colors={['#D2B48C']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF0DC',
    paddingVertical: 12,
    fontSize: 16,
  },
  timeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeTimeFilter: {
    backgroundColor: '#543A14',
    borderColor: '#D2B48C',
  },
  timeFilterText: {
    color: '#D2B48C',
    fontSize: 14,
  },
  activeTimeFilterText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF0DC',
    marginBottom: 6,
  },
  statusContainer: {
    marginBottom: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#BBB',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  amountSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  owedToYou: {
    color: '#4CAF50',
  },
  youOwe: {
    color: '#F44336',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 0,
  },
  viewDetailsButton: {
    backgroundColor: '#1E2E1A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  viewDetailsButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  settleButton: {
    backgroundColor: '#543A14',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  settleButtonText: {
    color: '#FFF0DC',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#FFF0DC',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 250,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteButton: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336',
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
});