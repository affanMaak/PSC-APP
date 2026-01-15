// //working 
// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   ActivityIndicator,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Alert,
// // } from 'react-native';
// // import { SwipeListView } from 'react-native-swipe-list-view';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function GroupHistory({ route }) {
// //   const { groupId } = route.params;
// //   const [balances, setBalances] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchBalances = async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from('balances')
// //           .select(`
// //             id,
// //             amount,
// //             description,
// //             created_at,
// //             from_user:from_user_id (id, username),
// //             to_user:to_user_id (id, username)
// //           `)
// //           .eq('group_id', groupId)
// //           .order('created_at', { ascending: false });

// //         if (error) throw error;
// //         setBalances(data || []);
// //       } catch (err) {
// //         setError(err.message);
// //         Alert.alert('Error', 'Failed to fetch history');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchBalances();
// //   }, [groupId]);

// //   const confirmDelete = (balanceId) => {
// //     Alert.alert(
// //       'Confirm Delete',
// //       'Are you sure you want to delete this entry?',
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Delete',
// //           style: 'destructive',
// //           onPress: () => deleteBalance(balanceId),
// //         },
// //       ]
// //     );
// //   };

// //   const deleteBalance = async (balanceId) => {
// //     try {
// //       const { error } = await supabase
// //         .from('balances')
// //         .delete()
// //         .eq('id', balanceId);

// //       if (error) throw error;

// //       setBalances((prev) => prev.filter((balance) => balance.id !== balanceId));
// //     } catch (error) {
// //       Alert.alert('Error', 'Failed to delete balance');
// //       console.error('Delete error:', error);
// //     }
// //   };

// //   const renderItem = ({ item }) => (
// //     <View style={styles.balanceItem}>
// //       <View style={styles.balanceHeader}>
// //         <Text style={styles.description}>{item.description || 'Expense'}</Text>
// //         <Text style={styles.date}>
// //           {new Date(item.created_at).toLocaleDateString()}
// //         </Text>
// //       </View>
// //       <View style={styles.balanceDetails}>
// //         <View style={styles.owedContainer}>
// //           <Text style={styles.owedText}>
// //             <Text style={styles.username}>{item.from_user.username}</Text> owes{' '}
// //             <Text style={styles.username}>{item.to_user.username}</Text>
// //           </Text>
// //           <Text style={styles.amount}>Rs {item.amount.toFixed(2)}</Text>
// //         </View>
// //         <TouchableOpacity
// //           style={styles.settleButton}
// //           onPress={() => confirmDelete(item.id)}
// //         >
// //           <Text style={styles.settleButtonText}>Settle</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   const renderHiddenItem = (data) => (
// //     <View style={styles.rowBack}>
// //       <TouchableOpacity
// //         style={styles.deleteButton}
// //         onPress={() => confirmDelete(data.item.id)}
// //       >
// //         <Text style={styles.deleteButtonText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
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
// //       <Text style={styles.header}>Group History</Text>

// //       {error ? (
// //         <View style={styles.errorContainer}>
// //           <Text style={styles.errorText}>{error}</Text>
// //         </View>
// //       ) : balances.length === 0 ? (
// //         <View style={styles.emptyContainer}>
// //           <Icon name="history" size={40} color="#888" />
// //           <Text style={styles.emptyText}>No transactions yet</Text>
// //         </View>
// //       ) : (
// //         <View style={styles.listContainer}>
// //           <SwipeListView
// //             data={balances}
// //             renderItem={renderItem}
// //             renderHiddenItem={renderHiddenItem}
// //             rightOpenValue={-80}
// //             disableRightSwipe
// //             keyExtractor={(item) => item.id}
// //             contentContainerStyle={styles.listContent}
// //             style={styles.fullFlex}
// //           />
// //         </View>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#121212',
// //     paddingHorizontal: 20,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#121212',
// //   },
// //   header: {
// //     fontSize: 26,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginVertical: 20,
// //     textAlign: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //     paddingBottom: 10,
// //   },
// //   balanceItem: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   balanceHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 8,
// //   },
// //   description: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     fontWeight: '500',
// //     flexShrink: 1,
// //   },
// //   date: {
// //     color: '#888',
// //     fontSize: 14,
// //     marginLeft: 10,
// //   },
// //   balanceDetails: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   owedContainer: {
// //     flex: 1,
// //   },
// //   owedText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //   },
// //   username: {
// //     fontWeight: 'bold',
// //     color: '#D2B48C',
// //   },
// //   amount: {
// //     color: '#4CAF50',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginTop: 4,
// //   },
// //   settleButton: {
// //     backgroundColor: '#543A14',
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     marginLeft: 10,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   settleButtonText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   rowBack: {
// //     alignItems: 'center',
// //     backgroundColor: '#F44336',
// //     flex: 1,
// //     flexDirection: 'row',
// //     justifyContent: 'flex-end',
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     paddingRight: 20,
// //   },
// //   deleteButton: {
// //     backgroundColor: '#F44336',
// //     paddingVertical: 12,
// //     paddingHorizontal: 20,
// //     borderRadius: 6,
// //   },
// //   deleteButtonText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingBottom: 100,
// //   },
// //   emptyText: {
// //     color: '#888',
// //     textAlign: 'center',
// //     marginTop: 10,
// //     fontSize: 16,
// //   },
// //   errorContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingBottom: 100,
// //   },
// //   errorText: {
// //     color: '#F44336',
// //     textAlign: 'center',
// //     fontSize: 16,
// //   },
// //   listContainer: {
// //     flex: 1,
// //     width: '100%',
// //   },
// //   listContent: {
// //     paddingBottom: 20,
// //   },
// //   fullFlex: {
// //     flex: 1,
// //   },
// // });

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   TextInput,
//   FlatList,
//   RefreshControl,
//   ScrollView, // Add ScrollView import
// } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function GroupHistory({ route }) {
//   const { groupId } = route.params;
//   const [balances, setBalances] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false); // Add refreshing state
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//   const [showDeleteFriendModal, setShowDeleteFriendModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     fetchBalances();
//   }, [groupId]);

//   useEffect(() => {
//     if (showDeleteFriendModal && user) {
//       fetchGroupMembers();
//     }
//   }, [showDeleteFriendModal, user]);

//   // Add pull-to-refresh handler
//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         fetchBalances(false), // Pass false to prevent setting loading state
//         user && showDeleteFriendModal ? fetchGroupMembers() : Promise.resolve()
//       ]);
//     } catch (err) {
//       console.error('Refresh error:', err);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Modified fetchBalances to handle refresh vs initial load
//   const fetchBalances = async (showLoadingSpinner = true) => {
//     try {
//       if (showLoadingSpinner) setLoading(true);
//       const { data, error } = await supabase
//         .from('balances')
//         .select(`
//           id,
//           amount,
//           description,
//           created_at,
//           created_by,
//           from_user_id,
//           to_user_id,
//           from_user:from_user_id (id, username),
//           to_user:to_user_id (id, username)
//         `)
//         .eq('group_id', groupId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setBalances(data || []);
//       setError(null); // Clear any previous errors on successful fetch
//     } catch (err) {
//       setError(err.message);
//       if (showLoadingSpinner) {
//         Alert.alert('Error', 'Failed to fetch history');
//       }
//     } finally {
//       if (showLoadingSpinner) setLoading(false);
//     }
//   };

//   const fetchGroupMembers = async () => {
//     try {
//       console.log('Fetching group members for group:', groupId, 'excluding user:', user?.id);
      
//       const { data, error } = await supabase
//         .from('group_members')
//         .select(`
//           user_id,
//           users:user_id (id, username)
//         `)
//         .eq('group_id', groupId)
//         .neq('user_id', user.id); // Exclude current user from the list

//       if (error) {
//         console.error('Fetch group members error:', error);
//         throw error;
//       }
      
//       console.log('Raw group members data:', data);
      
//       // Filter out null users (in case some user records don't exist)
//       const validMembers = data?.filter(member => member.users && member.users.username) || [];
//       console.log('Valid group members:', validMembers);
      
//       setGroupMembers(validMembers);
//     } catch (err) {
//       console.error('Fetch group members error:', err);
//       Alert.alert('Error', 'Failed to fetch group members');
//     }
//   };

//   const searchUsers = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setSearchLoading(true);
//     try {
//       // Step 1: Get all friends_id for current user (note: using friends_id based on your sendFriendRequest function)
//       const { data: friendLinks, error: friendError } = await supabase
//         .from('friends')
//         .select('friends_id')  // Changed from 'friend_id' to 'friends_id'
//         .eq('user_id', user.id)
//         .eq('status', 'accepted'); // Only get accepted friends

//       if (friendError) throw friendError;

//       const friendIds = friendLinks.map(f => f.friends_id); // Changed from friend_id to friends_id

//       // Also get friends where current user is the friend (bidirectional friendship)
//       const { data: reverseFriendLinks, error: reverseError } = await supabase
//         .from('friends')
//         .select('user_id')
//         .eq('friends_id', user.id)
//         .eq('status', 'accepted');

//       if (reverseError) throw reverseError;

//       const reverseFriendIds = reverseFriendLinks.map(f => f.user_id);
      
//       // Combine both directions
//       const allFriendIds = [...friendIds, ...reverseFriendIds];

//       if (allFriendIds.length === 0) {
//         setSearchResults([]);
//         return;
//       }

//       // Step 2: Get usernames from profiles for friend_ids only
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username')
//         .in('id', allFriendIds)
//         .ilike('username', `%${query}%`);

//       if (profileError) throw profileError;

//       // Step 3: Filter out users already in the group
//       const { data: existingMembers, error: membersError } = await supabase
//         .from('group_members')
//         .select('user_id')
//         .eq('group_id', groupId);

//       if (membersError) throw membersError;

//       const existingUserIds = existingMembers?.map(m => m.user_id) || [];

//       // Step 4: Exclude existing group members from search results
//       const finalResults = profiles.filter(p => !existingUserIds.includes(p.id));

//       setSearchResults(finalResults);
//     } catch (err) {
//       console.error('Search friends error:', err);
//       Alert.alert('Error', 'Could not search your friends');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const addFriendToGroup = async (friendId) => {
//     try {
//       const { data: existingMember, error: checkError } = await supabase
//         .from('group_members')
//         .select('user_id')
//         .eq('group_id', groupId)
//         .eq('user_id', friendId)
//         .single();

//       if (checkError && checkError.code !== 'PGRST116') throw checkError;
//       if (existingMember) {
//         Alert.alert('Error', 'User is already in this group');
//         return;
//       }

//       const { error: insertError } = await supabase
//         .from('group_members')
//         .insert([{ group_id: groupId, user_id: friendId }]);

//       if (insertError) throw insertError;

//       Alert.alert('Success', 'Friend added to group successfully!');
//       setShowAddFriendModal(false);
//       setSearchQuery('');
//       setSearchResults([]);

//       // ✅ Refresh both balances and group members immediately
//       await Promise.all([
//         fetchBalances(false),    // Don't show loading spinner for refresh
//         fetchGroupMembers() // Refresh the group members list
//       ]);

//     } catch (err) {
//       console.error('Error in addFriendToGroup:', err);
//       Alert.alert('Error', err.message || 'Something went wrong');
//     }
//   };

//   const deleteFriendFromGroup = async (userId) => {
//     try {
//       // First, delete all balances involving this user in this group
//       const { error: balanceError } = await supabase
//         .from('balances')
//         .delete()
//         .eq('group_id', groupId)
//         .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

//       if (balanceError) throw balanceError;

//       // Then, remove the user from the group
//       const { error: memberError } = await supabase
//         .from('group_members')
//         .delete()
//         .eq('group_id', groupId)
//         .eq('user_id', userId);

//       if (memberError) throw memberError;

//       Alert.alert('Success', 'Friend removed from group successfully!');
//       setShowDeleteFriendModal(false);

//       // ✅ Refresh both balances and group members immediately
//       await Promise.all([
//         fetchBalances(false),    // Don't show loading spinner for refresh
//         fetchGroupMembers() // Refresh the group members list
//       ]);

//     } catch (err) {
//       console.error('Error in deleteFriendFromGroup:', err);
//       Alert.alert('Error', err.message || 'Failed to remove friend from group');
//     }
//   };

//   const confirmDeleteFriend = (friend) => {
//     if (!friend || !friend.users || !friend.users.username) {
//       console.error('Invalid friend data:', friend);
//       Alert.alert('Error', 'Invalid user data');
//       return;
//     }

//     Alert.alert(
//       'Remove Friend',
//       `Are you sure you want to remove ${friend.users.username} from the group? This will also remove all their transaction history from this group.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: () => deleteFriendFromGroup(friend.user_id),
//         },
//       ]
//     );
//   };

//   const confirmSettlement = (balanceId) => {
//     Alert.alert(
//       'Confirm Settlement',
//       'Are you sure you want to mark this as settled?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Settle',
//           style: 'destructive',
//           onPress: () => settleBalance(balanceId),
//         },
//       ]
//     );
//   };

//   const settleBalance = async (balanceId) => {
//     try {
//       const { error } = await supabase
//         .from('balances')
//         .delete()
//         .eq('id', balanceId);

//       if (error) throw error;

//       setBalances((prev) => prev.filter((balance) => balance.id !== balanceId));
//       Alert.alert('Success', 'Transaction settled successfully');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to settle balance');
//       console.error('Settlement error:', error);
//     }
//   };

//   const handleUnauthorizedSettle = () => {
//     Alert.alert(
//       "Access Denied",
//       "Only the person who is owed money can settle this transaction",
//       [{ text: "OK" }]
//     );
//   };

//   const renderItem = ({ item }) => {
//     // Check if both users still exist and are in the group
//     if (!item.from_user || !item.to_user) {
//       return null; // Don't render if user data is missing
//     }

//     return (
//       <View style={styles.balanceItem}>
//         <View style={styles.balanceHeader}>
//           <Text style={styles.description}>{item.description || 'Expense'}</Text>
//           <Text style={styles.date}>
//             {new Date(item.created_at).toLocaleDateString()}
//           </Text>
//         </View>
//         <View style={styles.balanceDetails}>
//           <View style={styles.owedContainer}>
//             <Text style={styles.owedText}>
//               <Text style={styles.username}>{item.from_user.username}</Text> owes{' '}
//               <Text style={styles.username}>{item.to_user.username}</Text>
//             </Text>
//             <Text style={styles.amount}>Rs {item.amount.toFixed(2)}</Text>
//           </View>
//           {user && item.to_user_id === user.id ? (
//             <TouchableOpacity
//               style={styles.settleButton}
//               onPress={() => confirmSettlement(item.id)}
//             >
//               <Text style={styles.settleButtonText}>Settle</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.disabledButton}
//               onPress={handleUnauthorizedSettle}
//             >
//               <Text style={styles.disabledText}>Settle</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderHiddenItem = (data) => {
//     if (user && data.item.to_user_id === user.id) {
//       return (
//         <View style={styles.rowBack}>
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() => confirmSettlement(data.item.id)}
//           >
//             <Text style={styles.deleteButtonText}>Settle</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return null;
//     }
//   };

//   const handleUnauthorizedSwipe = (item) => {
//     if (user && item.to_user_id !== user.id) {
//       Alert.alert(
//         "Access Denied",
//         "Only the person owed money can settle this transaction",
//         [{ text: "OK" }]
//       );
//     }
//   };

//   const renderSearchUser = ({ item }) => (
//     <TouchableOpacity
//       style={styles.searchResultItem}
//       onPress={() => addFriendToGroup(item.id)}
//     >
//       <Text style={styles.searchResultText}>{item.username}</Text>
//       <Icon name="person-add" size={20} color="#D2B48C" />
//     </TouchableOpacity>
//   );

//   const renderGroupMember = ({ item }) => {
//     if (!item.users || !item.users.username) {
//       console.warn('Invalid member data:', item);
//       return null; // Don't render if user data is invalid
//     }

//     return (
//       <TouchableOpacity
//         style={styles.memberItem}
//         onPress={() => confirmDeleteFriend(item)}
//       >
//         <Text style={styles.memberText}>{item.users.username}</Text>
//         <Icon name="delete" size={20} color="#F44336" />
//       </TouchableOpacity>
//     );
//   };

//   // Filter balances to only show those where both users still exist
//   const validBalances = balances.filter(balance => 
//     balance.from_user && balance.to_user
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#D2B48C" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Group History</Text>
//         <TouchableOpacity
//           style={styles.settingsIcon}
//           onPress={() => setShowSettingsModal(true)}
//         >
//           <Icon name="settings" size={24} color="#D2B48C" />
//         </TouchableOpacity>
//       </View>

//       {error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : validBalances.length === 0 ? (
//         <ScrollView
//           contentContainerStyle={styles.emptyContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#D2B48C']} // Android
//               tintColor="#D2B48C" // iOS
//               title="Pull to refresh"
//               titleColor="#D2B48C"
//             />
//           }
//         >
//           <Icon name="history" size={40} color="#888" />
//           <Text style={styles.emptyText}>No transactions yet</Text>
//           <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
//         </ScrollView>
//       ) : (
//         <SwipeListView
//           data={validBalances}
//           renderItem={renderItem}
//           renderHiddenItem={renderHiddenItem}
//           getRightContentOpenValue={(item) => 
//             user && item.to_user_id === user.id ? -80 : 0
//           }
//           onRowOpen={(rowKey, rowMap, rowDirection) => {
//             const item = validBalances.find(b => b.id === rowKey);
//             if (item && user && item.to_user_id !== user.id) {
//               handleUnauthorizedSwipe(item);
//               rowMap[rowKey].closeRow();
//             }
//           }}
//           disableRightSwipe={true}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContent}
//           style={styles.fullFlex}
//           onRefresh={onRefresh}
//           refreshing={refreshing}
//         />
//       )}

//       {/* Settings Modal */}
//       <Modal
//         visible={showSettingsModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowSettingsModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Group Settings</Text>
//               <TouchableOpacity
//                 onPress={() => setShowSettingsModal(false)}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 setShowSettingsModal(false);
//                 setShowAddFriendModal(true);
//               }}
//             >
//               <Icon name="person-add" size={24} color="#D2B48C" />
//               <Text style={styles.modalOptionText}>Add Friend</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 setShowSettingsModal(false);
//                 setShowDeleteFriendModal(true);
//               }}
//             >
//               <Icon name="person-remove" size={24} color="#F44336" />
//               <Text style={styles.modalOptionText}>Remove Friend</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Add Friend Modal */}
//       <Modal
//         visible={showAddFriendModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowAddFriendModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Friend</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddFriendModal(false);
//                   setSearchQuery('');
//                   setSearchResults([]);
//                 }}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search username..."
//               placeholderTextColor="#888"
//               value={searchQuery}
//               onChangeText={(text) => {
//                 setSearchQuery(text);
//                 searchUsers(text);
//               }}
//             />
            
//             {searchLoading ? (
//               <ActivityIndicator size="small" color="#D2B48C" style={styles.searchLoader} />
//             ) : (
//               <FlatList
//                 data={searchResults}
//                 renderItem={renderSearchUser}
//                 keyExtractor={(item) => item.id}
//                 style={styles.searchResults}
//                 ListEmptyComponent={
//                   searchQuery.trim() ? (
//                     <Text style={styles.emptySearchText}>No users found</Text>
//                   ) : null
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Friend Modal */}
//       <Modal
//         visible={showDeleteFriendModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowDeleteFriendModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Remove Friend</Text>
//               <TouchableOpacity
//                 onPress={() => setShowDeleteFriendModal(false)}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <FlatList
//               data={groupMembers}
//               renderItem={renderGroupMember}
//               keyExtractor={(item) => item.user_id}
//               style={styles.membersList}
//               ListEmptyComponent={
//                 <Text style={styles.emptySearchText}>No group members found</Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   pullRefreshHint: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 8,
//   },

//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     paddingHorizontal: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//   },
//   settingsIcon: {
//     padding: 8,
//   },
//   balanceItem: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   balanceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   description: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '500',
//     flexShrink: 1,
//   },
//   date: {
//     color: '#888',
//     fontSize: 14,
//     marginLeft: 10,
//   },
//   balanceDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   owedContainer: {
//     flex: 1,
//   },
//   owedText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//   },
//   username: {
//     fontWeight: 'bold',
//     color: '#D2B48C',
//   },
//   amount: {
//     color: '#4CAF50',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   settleButton: {
//     backgroundColor: '#543A14',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginLeft: 10,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   settleButtonText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   disabledButton: {
//     backgroundColor: '#333',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginLeft: 10,
//     borderWidth: 1,
//     borderColor: '#666',
//   },
//   disabledText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     borderRadius: 10,
//     marginBottom: 12,
//     paddingRight: 20,
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   deleteButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 100,
//   },
//   emptyText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 100,
//   },
//   errorText: {
//     color: '#F44336',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   listContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   fullFlex: {
//     flex: 1,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     width: '90%',
//     maxHeight: '70%',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
//   },
//   modalTitle: {
//     color: '#FFF0DC',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   modalOptionText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginLeft: 15,
//   },
//   searchInput: {
//     backgroundColor: '#333',
//     color: '#FFF0DC',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   searchLoader: {
//     marginVertical: 20,
//   },
//   searchResults: {
//     maxHeight: 300,
//   },
//   searchResultItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   searchResultText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
//   emptySearchText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
//   membersList: {
//     maxHeight: 400,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   memberText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
// });


// //ios test
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   TextInput,
//   FlatList,
//   RefreshControl,
//   ScrollView,
// } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function GroupHistory({ route }) {
//   const { groupId } = route.params;
//   const [balances, setBalances] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [showAddFriendModal, setShowAddFriendModal] = useState(false);
//   const [showDeleteFriendModal, setShowDeleteFriendModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     fetchBalances();
//   }, [groupId]);

//   useEffect(() => {
//     if (showDeleteFriendModal && user) {
//       fetchGroupMembers();
//     }
//   }, [showDeleteFriendModal, user]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         fetchBalances(false),
//         user && showDeleteFriendModal ? fetchGroupMembers() : Promise.resolve()
//       ]);
//     } catch (err) {
//       console.error('Refresh error:', err);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const fetchBalances = async (showLoadingSpinner = true) => {
//     try {
//       if (showLoadingSpinner) setLoading(true);
//       const { data, error } = await supabase
//         .from('balances')
//         .select(`
//           id,
//           amount,
//           description,
//           created_at,
//           created_by,
//           from_user_id,
//           to_user_id,
//           from_user:from_user_id (id, username),
//           to_user:to_user_id (id, username)
//         `)
//         .eq('group_id', groupId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setBalances(data || []);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       if (showLoadingSpinner) {
//         Alert.alert('Error', 'Failed to fetch history');
//       }
//     } finally {
//       if (showLoadingSpinner) setLoading(false);
//     }
//   };

//   const fetchGroupMembers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('group_members')
//         .select(`
//           user_id,
//           users:user_id (id, username)
//         `)
//         .eq('group_id', groupId)
//         .neq('user_id', user.id);

//       if (error) throw error;
      
//       const validMembers = data?.filter(member => member.users && member.users.username) || [];
//       setGroupMembers(validMembers);
//     } catch (err) {
//       console.error('Fetch group members error:', err);
//       Alert.alert('Error', 'Failed to fetch group members');
//     }
//   };

//   const searchUsers = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setSearchLoading(true);
//     try {
//       const { data: friendLinks, error: friendError } = await supabase
//         .from('friends')
//         .select('friends_id')
//         .eq('user_id', user.id)
//         .eq('status', 'accepted');

//       if (friendError) throw friendError;

//       const friendIds = friendLinks.map(f => f.friends_id);

//       const { data: reverseFriendLinks, error: reverseError } = await supabase
//         .from('friends')
//         .select('user_id')
//         .eq('friends_id', user.id)
//         .eq('status', 'accepted');

//       if (reverseError) throw reverseError;

//       const reverseFriendIds = reverseFriendLinks.map(f => f.user_id);
//       const allFriendIds = [...friendIds, ...reverseFriendIds];

//       if (allFriendIds.length === 0) {
//         setSearchResults([]);
//         return;
//       }

//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('id, username')
//         .in('id', allFriendIds)
//         .ilike('username', `%${query}%`);

//       if (profileError) throw profileError;

//       const { data: existingMembers, error: membersError } = await supabase
//         .from('group_members')
//         .select('user_id')
//         .eq('group_id', groupId);

//       if (membersError) throw membersError;

//       const existingUserIds = existingMembers?.map(m => m.user_id) || [];
//       const finalResults = profiles.filter(p => !existingUserIds.includes(p.id));

//       setSearchResults(finalResults);
//     } catch (err) {
//       console.error('Search friends error:', err);
//       Alert.alert('Error', 'Could not search your friends');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const addFriendToGroup = async (friendId) => {
//     try {
//       const { data: existingMember, error: checkError } = await supabase
//         .from('group_members')
//         .select('user_id')
//         .eq('group_id', groupId)
//         .eq('user_id', friendId)
//         .single();

//       if (checkError && checkError.code !== 'PGRST116') throw checkError;
//       if (existingMember) {
//         Alert.alert('Error', 'User is already in this group');
//         return;
//       }

//       const { error: insertError } = await supabase
//         .from('group_members')
//         .insert([{ group_id: groupId, user_id: friendId }]);

//       if (insertError) throw insertError;

//       Alert.alert('Success', 'Friend added to group successfully!');
//       setShowAddFriendModal(false);
//       setSearchQuery('');
//       setSearchResults([]);

//       await Promise.all([
//         fetchBalances(false),
//         fetchGroupMembers()
//       ]);

//     } catch (err) {
//       console.error('Error in addFriendToGroup:', err);
//       Alert.alert('Error', err.message || 'Something went wrong');
//     }
//   };

//   const deleteFriendFromGroup = async (userId) => {
//     try {
//       const { error: balanceError } = await supabase
//         .from('balances')
//         .delete()
//         .eq('group_id', groupId)
//         .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

//       if (balanceError) throw balanceError;

//       const { error: memberError } = await supabase
//         .from('group_members')
//         .delete()
//         .eq('group_id', groupId)
//         .eq('user_id', userId);

//       if (memberError) throw memberError;

//       Alert.alert('Success', 'Friend removed from group successfully!');
//       setShowDeleteFriendModal(false);

//       await Promise.all([
//         fetchBalances(false),
//         fetchGroupMembers()
//       ]);

//     } catch (err) {
//       console.error('Error in deleteFriendFromGroup:', err);
//       Alert.alert('Error', err.message || 'Failed to remove friend from group');
//     }
//   };

//   const confirmDeleteFriend = (friend) => {
//     if (!friend || !friend.users || !friend.users.username) {
//       console.error('Invalid friend data:', friend);
//       Alert.alert('Error', 'Invalid user data');
//       return;
//     }

//     Alert.alert(
//       'Remove Friend',
//       `Are you sure you want to remove ${friend.users.username} from the group? This will also remove all their transaction history from this group.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: () => deleteFriendFromGroup(friend.user_id),
//         },
//       ]
//     );
//   };

//   const confirmSettlement = (balanceId) => {
//     Alert.alert(
//       'Confirm Settlement',
//       'Are you sure you want to mark this as settled?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Settle',
//           style: 'destructive',
//           onPress: () => settleBalance(balanceId),
//         },
//       ]
//     );
//   };

//   const settleBalance = async (balanceId) => {
//     try {
//       const { error } = await supabase
//         .from('balances')
//         .delete()
//         .eq('id', balanceId);

//       if (error) throw error;

//       setBalances((prev) => prev.filter((balance) => balance.id !== balanceId));
//       Alert.alert('Success', 'Transaction settled successfully');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to settle balance');
//       console.error('Settlement error:', error);
//     }
//   };

//   const handleUnauthorizedSettle = () => {
//     Alert.alert(
//       "Access Denied",
//       "Only the person who is owed money can settle this transaction",
//       [{ text: "OK" }]
//     );
//   };

//   const renderItem = ({ item }) => {
//     if (!item.from_user || !item.to_user) {
//       return null;
//     }

//     return (
//       <View style={styles.balanceItem}>
//         <View style={styles.balanceHeader}>
//           <Text style={styles.description}>{item.description || 'Expense'}</Text>
//           <Text style={styles.date}>
//             {new Date(item.created_at).toLocaleDateString()}
//           </Text>
//         </View>
//         <View style={styles.balanceDetails}>
//           <View style={styles.owedContainer}>
//             <Text style={styles.owedText}>
//               <Text style={styles.username}>{item.from_user.username}</Text> owes{' '}
//               <Text style={styles.username}>{item.to_user.username}</Text>
//             </Text>
//             <Text style={styles.amount}>Rs {item.amount.toFixed(2)}</Text>
//           </View>
//           {user && item.to_user_id === user.id ? (
//             <TouchableOpacity
//               style={styles.settleButton}
//               onPress={() => confirmSettlement(item.id)}
//             >
//               <Text style={styles.settleButtonText}>Settle</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.disabledButton}
//               onPress={handleUnauthorizedSettle}
//             >
//               <Text style={styles.disabledText}>Settle</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderHiddenItem = (data) => {
//     if (user && data.item.to_user_id === user.id) {
//       return (
//         <View style={styles.rowBack}>
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() => confirmSettlement(data.item.id)}
//           >
//             <Text style={styles.deleteButtonText}>Settle</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return null;
//     }
//   };

//   const handleUnauthorizedSwipe = (item) => {
//     if (user && item.to_user_id !== user.id) {
//       Alert.alert(
//         "Access Denied",
//         "Only the person owed money can settle this transaction",
//         [{ text: "OK" }]
//       );
//     }
//   };

//   const renderSearchUser = ({ item }) => (
//     <TouchableOpacity
//       style={styles.searchResultItem}
//       onPress={() => addFriendToGroup(item.id)}
//     >
//       <Text style={styles.searchResultText}>{item.username}</Text>
//       <Icon name="person-add" size={20} color="#D2B48C" />
//     </TouchableOpacity>
//   );

//   const renderGroupMember = ({ item }) => {
//     if (!item.users || !item.users.username) {
//       return null;
//     }

//     return (
//       <TouchableOpacity
//         style={styles.memberItem}
//         onPress={() => confirmDeleteFriend(item)}
//       >
//         <Text style={styles.memberText}>{item.users.username}</Text>
//         <Icon name="delete" size={20} color="#F44336" />
//       </TouchableOpacity>
//     );
//   };

//   const validBalances = balances.filter(balance => 
//     balance.from_user && balance.to_user
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#D2B48C" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Group History</Text>
//         <TouchableOpacity
//           style={styles.settingsIcon}
//           onPress={() => setShowSettingsModal(true)}
//         >
//           <Icon name="settings" size={24} color="#D2B48C" />
//         </TouchableOpacity>
//       </View>

//       {error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : validBalances.length === 0 ? (
//         <ScrollView
//           contentContainerStyle={styles.emptyContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#D2B48C']}
//               tintColor="#D2B48C"
//               title="Pull to refresh"
//               titleColor="#D2B48C"
//             />
//           }
//         >
//           <Icon name="history" size={40} color="#888" />
//           <Text style={styles.emptyText}>No transactions yet</Text>
//           <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
//         </ScrollView>
//       ) : (
//         <SwipeListView
//           data={validBalances}
//           renderItem={renderItem}
//           renderHiddenItem={renderHiddenItem}
//           getRightContentOpenValue={(item) => 
//             user && item.to_user_id === user.id ? -80 : 0
//           }
//           onRowOpen={(rowKey, rowMap, rowDirection) => {
//             const item = validBalances.find(b => b.id === rowKey);
//             if (item && user && item.to_user_id !== user.id) {
//               handleUnauthorizedSwipe(item);
//               rowMap[rowKey].closeRow();
//             }
//           }}
//           disableRightSwipe={true}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContent}
//           style={styles.fullFlex}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#D2B48C']}
//               tintColor="#D2B48C"
//               title="Pull to refresh"
//               titleColor="#D2B48C"
//             />
//           }
//         />
//       )}

//       {/* Settings Modal */}
//       <Modal
//         visible={showSettingsModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowSettingsModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Group Settings</Text>
//               <TouchableOpacity
//                 onPress={() => setShowSettingsModal(false)}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 setShowSettingsModal(false);
//                 setShowAddFriendModal(true);
//               }}
//             >
//               <Icon name="person-add" size={24} color="#D2B48C" />
//               <Text style={styles.modalOptionText}>Add Friend</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 setShowSettingsModal(false);
//                 setShowDeleteFriendModal(true);
//               }}
//             >
//               <Icon name="person-remove" size={24} color="#F44336" />
//               <Text style={styles.modalOptionText}>Remove Friend</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Add Friend Modal */}
//       <Modal
//         visible={showAddFriendModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowAddFriendModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Friend</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddFriendModal(false);
//                   setSearchQuery('');
//                   setSearchResults([]);
//                 }}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search username..."
//               placeholderTextColor="#888"
//               value={searchQuery}
//               onChangeText={(text) => {
//                 setSearchQuery(text);
//                 searchUsers(text);
//               }}
//             />
            
//             {searchLoading ? (
//               <ActivityIndicator size="small" color="#D2B48C" style={styles.searchLoader} />
//             ) : (
//               <FlatList
//                 data={searchResults}
//                 renderItem={renderSearchUser}
//                 keyExtractor={(item) => item.id}
//                 style={styles.searchResults}
//                 ListEmptyComponent={
//                   searchQuery.trim() ? (
//                     <Text style={styles.emptySearchText}>No users found</Text>
//                   ) : null
//                 }
//               />
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* Delete Friend Modal */}
//       <Modal
//         visible={showDeleteFriendModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowDeleteFriendModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Remove Friend</Text>
//               <TouchableOpacity
//                 onPress={() => setShowDeleteFriendModal(false)}
//                 style={styles.closeButton}
//               >
//                 <Icon name="close" size={24} color="#D2B48C" />
//               </TouchableOpacity>
//             </View>
            
//             <FlatList
//               data={groupMembers}
//               renderItem={renderGroupMember}
//               keyExtractor={(item) => item.user_id}
//               style={styles.membersList}
//               ListEmptyComponent={
//                 <Text style={styles.emptySearchText}>No group members found</Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     paddingHorizontal: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//   },
//   settingsIcon: {
//     padding: 8,
//   },
//   balanceItem: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   balanceHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   description: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '500',
//     flexShrink: 1,
//   },
//   date: {
//     color: '#888',
//     fontSize: 14,
//     marginLeft: 10,
//   },
//   balanceDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   owedContainer: {
//     flex: 1,
//   },
//   owedText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//   },
//   username: {
//     fontWeight: 'bold',
//     color: '#D2B48C',
//   },
//   amount: {
//     color: '#4CAF50',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   settleButton: {
//     backgroundColor: '#543A14',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginLeft: 10,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   settleButtonText: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   disabledButton: {
//     backgroundColor: '#333',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginLeft: 10,
//     borderWidth: 1,
//     borderColor: '#666',
//   },
//   disabledText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#F44336',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     borderRadius: 10,
//     marginBottom: 12,
//     paddingRight: 20,
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   deleteButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 100,
//   },
//   emptyText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 10,
//     fontSize: 16,
//   },
//   pullRefreshHint: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 8,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 100,
//   },
//   errorText: {
//     color: '#F44336',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   fullFlex: {
//     flex: 1,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     width: '90%',
//     maxHeight: '70%',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
//   },
//   modalTitle: {
//     color: '#FFF0DC',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   modalOptionText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginLeft: 15,
//   },
//   searchInput: {
//     backgroundColor: '#333',
//     color: '#FFF0DC',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   searchLoader: {
//     marginVertical: 20,
//   },
//   searchResults: {
//     maxHeight: 300,
//   },
//   searchResultItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   searchResultText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
//   emptySearchText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//   },
//   membersList: {
//     maxHeight: 400,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   memberText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
// });



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

export default function GroupHistory({ route }) {
  const { groupId } = route.params;
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showDeleteFriendModal, setShowDeleteFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error);
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    fetchBalances();
  }, [groupId]);

  useEffect(() => {
    if (showDeleteFriendModal && user) {
      fetchGroupMembers();
    }
  }, [showDeleteFriendModal, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchBalances(false),
        user && showDeleteFriendModal ? fetchGroupMembers() : Promise.resolve()
      ]);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchBalances = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      const { data, error } = await supabase
        .from('balances')
        .select(`
          id,
          amount,
          description,
          created_at,
          created_by,
          from_user_id,
          to_user_id,
          from_user:from_user_id (id, username),
          to_user:to_user_id (id, username)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBalances(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (showLoadingSpinner) {
        Alert.alert('Error', 'Failed to fetch history');
      }
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          users:user_id (id, username)
        `)
        .eq('group_id', groupId)
        .neq('user_id', user.id);

      if (error) throw error;
      
      const validMembers = data?.filter(member => member.users && member.users.username) || [];
      setGroupMembers(validMembers);
    } catch (err) {
      console.error('Fetch group members error:', err);
      Alert.alert('Error', 'Failed to fetch group members');
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data: friendLinks, error: friendError } = await supabase
        .from('friends')
        .select('friends_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (friendError) throw friendError;

      const friendIds = friendLinks.map(f => f.friends_id);

      const { data: reverseFriendLinks, error: reverseError } = await supabase
        .from('friends')
        .select('user_id')
        .eq('friends_id', user.id)
        .eq('status', 'accepted');

      if (reverseError) throw reverseError;

      const reverseFriendIds = reverseFriendLinks.map(f => f.user_id);
      const allFriendIds = [...friendIds, ...reverseFriendIds];

      if (allFriendIds.length === 0) {
        setSearchResults([]);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', allFriendIds)
        .ilike('username', `%${query}%`);

      if (profileError) throw profileError;

      const { data: existingMembers, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (membersError) throw membersError;

      const existingUserIds = existingMembers?.map(m => m.user_id) || [];
      const finalResults = profiles.filter(p => !existingUserIds.includes(p.id));

      setSearchResults(finalResults);
    } catch (err) {
      console.error('Search friends error:', err);
      Alert.alert('Error', 'Could not search your friends');
    } finally {
      setSearchLoading(false);
    }
  };

  const addFriendToGroup = async (friendId) => {
    try {
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('user_id', friendId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingMember) {
        Alert.alert('Error', 'User is already in this group');
        return;
      }

      const { error: insertError } = await supabase
        .from('group_members')
        .insert([{ group_id: groupId, user_id: friendId }]);

      if (insertError) throw insertError;

      Alert.alert('Success', 'Friend added to group successfully!');
      setShowAddFriendModal(false);
      setSearchQuery('');
      setSearchResults([]);

      await Promise.all([
        fetchBalances(false),
        fetchGroupMembers()
      ]);

    } catch (err) {
      console.error('Error in addFriendToGroup:', err);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const deleteFriendFromGroup = async (userId) => {
    try {
      const { error: balanceError } = await supabase
        .from('balances')
        .delete()
        .eq('group_id', groupId)
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

      if (balanceError) throw balanceError;

      const { error: memberError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (memberError) throw memberError;

      Alert.alert('Success', 'Friend removed from group successfully!');
      setShowDeleteFriendModal(false);

      await Promise.all([
        fetchBalances(false),
        fetchGroupMembers()
      ]);

    } catch (err) {
      console.error('Error in deleteFriendFromGroup:', err);
      Alert.alert('Error', err.message || 'Failed to remove friend from group');
    }
  };

  const confirmDeleteFriend = (friend) => {
    if (!friend || !friend.users || !friend.users.username) {
      console.error('Invalid friend data:', friend);
      Alert.alert('Error', 'Invalid user data');
      return;
    }

    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend.users.username} from the group? This will also remove all their transaction history from this group.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteFriendFromGroup(friend.user_id),
        },
      ]
    );
  };

  const confirmSettlement = (balanceId) => {
    Alert.alert(
      'Confirm Settlement',
      'Are you sure you want to mark this as settled?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          style: 'destructive',
          onPress: () => settleBalance(balanceId),
        },
      ]
    );
  };

  const settleBalance = async (balanceId) => {
    try {
      const { error } = await supabase
        .from('balances')
        .delete()
        .eq('id', balanceId);

      if (error) throw error;

      setBalances((prev) => prev.filter((balance) => balance.id !== balanceId));
      Alert.alert('Success', 'Transaction settled successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to settle balance');
      console.error('Settlement error:', error);
    }
  };

  const handleUnauthorizedSettle = () => {
    Alert.alert(
      "Access Denied",
      "Only the person who is owed money can settle this transaction",
      [{ text: "OK" }]
    );
  };

  const renderItem = ({ item }) => {
    if (!item.from_user || !item.to_user) {
      return null;
    }

    return (
      <View style={styles.balanceItem}>
        <View style={styles.balanceHeader}>
          <Text style={styles.description}>{item.description || 'Expense'}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.balanceDetails}>
          <View style={styles.owedContainer}>
            <Text style={styles.owedText}>
              <Text style={styles.username}>{item.from_user.username}</Text> owes{' '}
              <Text style={styles.username}>{item.to_user.username}</Text>
            </Text>
            <Text style={styles.amount}>Rs {item.amount.toFixed(2)}</Text>
          </View>
          {user && item.to_user_id === user.id ? (
            <TouchableOpacity
              style={styles.settleButton}
              onPress={() => confirmSettlement(item.id)}
            >
              <Text style={styles.settleButtonText}>Settle</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.disabledButton}
              onPress={handleUnauthorizedSettle}
            >
              <Text style={styles.disabledText}>Settle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderHiddenItem = (data) => {
    if (user && data.item.to_user_id === user.id) {
      return (
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmSettlement(data.item.id)}
          >
            <Text style={styles.deleteButtonText}>Settle</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View style={styles.hiddenRow} />;
    }
  };

  const handleUnauthorizedSwipe = (item) => {
    if (user && item.to_user_id !== user.id) {
      Alert.alert(
        "Access Denied",
        "Only the person owed money can settle this transaction",
        [{ text: "OK" }]
      );
    }
  };

  const renderSearchUser = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => addFriendToGroup(item.id)}
    >
      <Text style={styles.searchResultText}>{item.username}</Text>
      <Icon name="person-add" size={20} color="#D2B48C" />
    </TouchableOpacity>
  );

  const renderGroupMember = ({ item }) => {
    if (!item.users || !item.users.username) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.memberItem}
        onPress={() => confirmDeleteFriend(item)}
      >
        <Text style={styles.memberText}>{item.users.username}</Text>
        <Icon name="delete" size={20} color="#F44336" />
      </TouchableOpacity>
    );
  };

  const validBalances = balances.filter(balance => 
    balance.from_user && balance.to_user
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D2B48C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Group History</Text>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => setShowSettingsModal(true)}
        >
          <Icon name="settings" size={24} color="#D2B48C" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : validBalances.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // colors={['#D2B48C']}
              tintColor="#D2B48C"
              title="Pull to refresh"
              titleColor="#D2B48C"
            />
          }
        >
          <Icon name="history" size={40} color="#888" />
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
        </ScrollView>
      ) : (
        <SwipeListView
          data={validBalances}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          getRightContentOpenValue={(item) => 
            user && item.to_user_id === user.id ? -80 : 0
          }
          onRowOpen={(rowKey, rowMap, rowDirection) => {
            const item = validBalances.find(b => b.id === rowKey);
            if (item && user && item.to_user_id !== user.id) {
              handleUnauthorizedSwipe(item);
              rowMap[rowKey].closeRow();
            }
          }}
          disableRightSwipe={true}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          style={styles.fullFlex}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // colors={['#D2B48C']}
              tintColor="#D2B48C"
              title="Pull to refresh"
              titleColor="#D2B48C"
            />
          }
        />
      )}

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Group Settings</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#D2B48C" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowSettingsModal(false);
                setShowAddFriendModal(true);
              }}
            >
              <Icon name="person-add" size={24} color="#D2B48C" />
              <Text style={styles.modalOptionText}>Add Friend</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowSettingsModal(false);
                setShowDeleteFriendModal(true);
              }}
            >
              <Icon name="person-remove" size={24} color="#F44336" />
              <Text style={styles.modalOptionText}>Remove Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriendModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddFriendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Friend</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddFriendModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#D2B48C" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search username..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchUsers(text);
              }}
            />
            
            {searchLoading ? (
              <ActivityIndicator size="small" color="#D2B48C" style={styles.searchLoader} />
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchUser}
                keyExtractor={(item) => item.id}
                style={styles.searchResults}
                ListEmptyComponent={
                  searchQuery.trim() ? (
                    <Text style={styles.emptySearchText}>No users found</Text>
                  ) : null
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Friend Modal */}
      <Modal
        visible={showDeleteFriendModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeleteFriendModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Remove Friend</Text>
              <TouchableOpacity
                onPress={() => setShowDeleteFriendModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#D2B48C" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={groupMembers}
              renderItem={renderGroupMember}
              keyExtractor={(item) => item.user_id}
              style={styles.membersList}
              ListEmptyComponent={
                <Text style={styles.emptySearchText}>No group members found</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
    paddingBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF0DC',
  },
  settingsIcon: {
    padding: 8,
  },
  balanceItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  description: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  date: {
    color: '#888',
    fontSize: 14,
    marginLeft: 10,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  owedContainer: {
    flex: 1,
  },
  owedText: {
    color: '#FFF0DC',
    fontSize: 14,
  },
  username: {
    fontWeight: 'bold',
    color: '#D2B48C',
  },
  amount: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  settleButton: {
    backgroundColor: '#543A14',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  settleButtonText: {
    color: '#FFF0DC',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  disabledText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#F44336',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 10,
    marginBottom: 12,
    paddingRight: 20,
  },
  hiddenRow: {
    width: 0,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  pullRefreshHint: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  fullFlex: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#FFF0DC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: '#FFF0DC',
    fontSize: 16,
    marginLeft: 15,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#FFF0DC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  searchLoader: {
    marginVertical: 20,
  },
  searchResults: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchResultText: {
    color: '#FFF0DC',
    fontSize: 16,
  },
  emptySearchText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  membersList: {
    maxHeight: 400,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  memberText: {
    color: '#FFF0DC',
    fontSize: 16,
  },
});