// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert 
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';


// // export default function Friends({ navigation }) {
// //   const [friends, setFriends] = useState([]);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);

// //   // Add console logs for all state changes
// //   useEffect(() => {
// //     console.log('Friends state updated:', friends);
// //   }, [friends]);

// //   useEffect(() => {
// //     console.log('Pending requests updated:', pendingRequests);
// //   }, [pendingRequests]);

// //   useEffect(() => {
// //     console.log('Search results updated:', searchResults);
// //   }, [searchResults]);

// //   useEffect(() => {
// //     async function fetchUser() {
// //       console.log('Starting user fetch...');
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) {
// //         console.error('🚨 Error fetching user:', error);
// //         return;
// //       }
// //       console.log('✅ User fetched successfully:', user?.id);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);


// //   useEffect(() => {
// //     if (user) {
// //       console.log('👤 User detected, fetching data...');
// //       getFriends();
// //       getPendingRequests();
// //     }// Add in useEffect


    
// // const subscription = supabase
// // .channel('friends')
// // .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
// //   getPendingRequests();
// // })
// // .subscribe();

// // return () => subscription.unsubscribe();
// //   }, [user]);
  
// //   async function searchUsers(query) {
// //     setSearchQuery(query);
    
// //     // Clear results if search is empty
// //     if (query.length < 1) {
// //       setSearchResults([]);
// //       return;
// //     }
  
// //     // Only search when query has at least 1 character
// //     const { data, error } = await supabase
// //       .from('profiles')
// //       .select('id, username')
// //       .ilike('username', `%${query}%`)
// //       .neq('id', user.id);
  
// //     if (error) console.error('Search error:', error);
// //     setSearchResults(data || []);
// //   }

// //   async function getFriends() {
// //     console.log('Starting friends fetch...');
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`
// //           id,
// //           user_id,
// //           friends_id,
// //           status,
// //           sender:profiles!user_id(id, username),
// //           receiver:profiles!friends_id(id, username)
// //         `)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`) // Get both sender/receiver roles
// //         .eq('status', 'accepted');
  
// //       if (error) {
// //         console.error('🚨 Friends fetch error:', error);
// //         return;
// //       }
  
// //       // Transform data to show the OTHER user as the friend
// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id 
// //           ? friendship.receiver  // If user is sender, friend is receiver
// //           : friendship.sender    // If user is receiver, friend is sender
// //       }));
  
// //       console.log('✅ Friends fetched successfully:', transformed);
// //       setFriends(transformed || []);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function getAllUsers() {
// //     console.log('Fetching all users...');
// //     try {
// //       const { data, error } = await supabase
// //         .from('profiles')
// //         .select('id, username')
// //         .neq('id', user.id);

// //       if (error) throw error;
// //       console.log('✅ All users fetched:', data);
// //       setSearchResults(data || []);
// //     } catch (error) {
// //       console.error('🚨 All users error:', error);
// //     }
// //   }

// //   async function getPendingRequests() {
// //     console.log('🔄 Fetching pending requests...');
// //     if (!user) {
// //       console.log('No user - skipping pending requests fetch');
// //       return;
// //     }
  
// //     try {
// //       console.log(`🔎 Querying for user ${user.id} `);
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`
// //           id,
// //           user_id,
// //           friends_id,
// //           status,
// //           created_at,
// //           sender:profiles!user_id(id, username),
// //           receiver:profiles!friends_id(id, username)
// //         `)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'pending');
  
// //       if (error) {
// //         console.error('🚨 Pending requests error:', error);
// //         return;
// //       }
      
// //       console.log('✅ Raw pending requests data:', JSON.stringify(data, null, 2));
  
// //       const transformed = data.map(req => ({
// //         ...req,
// //         isOutgoing: req.user_id === user.id,
// //         otherUser: req.user_id === user.id ? req.receiver : req.sender,
// //         canCancel: req.user_id === user.id, // Sender can cancel
// //         canReject: req.friends_id === user.id // Receiver can reject
// //       }));
      
// //       console.log('🔄 Transformed pending requests:', JSON.stringify(transformed, null, 2));
// //       setPendingRequests(transformed || []);
// //     } catch (error) {
// //       console.error('🚨 Pending requests catch error:', error);
// //     }
// //   }

// //   async function sendFriendRequest(friendId) {
// //     console.log('Sending friend request to:', friendId);
// //     if (!user) {
// //       console.log('No user - cannot send request');
// //       return;
// //     }
  
// //     try {
// //       // 1. Check if trying to add self
// //       if (user.id === friendId) {
// //         Alert.alert('Error', 'You cannot add yourself');
// //         return;
// //       }
  
// //       // 2. Check existing relationships
// //       const { data: existing, error: checkError } = await supabase
// //         .from('friends')
// //         .select('*')
// //         .or(
// //           `and(user_id.eq.${user.id},friends_id.eq.${friendId}),` +
// //           `and(user_id.eq.${friendId},friends_id.eq.${user.id})`
// //         );
  
// //       if (checkError) throw checkError;
  
// //       // 3. If any existing relationship found
// //       if (existing && existing.length > 0) {
// //         const status = existing[0].status;
// //         Alert.alert(
// //           'Already exists', 
// //           status === 'pending' 
// //             ? 'Friend request already pending' 
// //             : 'User is already your friend'
// //         );
// //         return;
// //       }
  
// //       // 4. Proceed with new request
// //       const { error } = await supabase
// //         .from('friends')
// //         .insert([{ 
// //           user_id: user.id, 
// //           friends_id: friendId, 
// //           status: 'pending',
// //           created_at: new Date().toISOString()
// //         }]);
  
// //       if (error) throw error;
      
// //       console.log('✅ Request sent successfully');
// //       await Promise.all([getPendingRequests(), getAllUsers()]);
// //     } catch (error) {
// //       console.error('🚨 Send request error:', error);
// //       Alert.alert('Error', error.message);
// //     }
// //   }

// //   async function acceptFriendRequest(requestId) {
// //     console.log('🔵 Accepting request ID:', requestId);
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .update({ status: 'accepted' })
// //         .eq('id', requestId)
// //         .select(); // Add select to verify update
  
// //       if (error) throw error;
      
// //       console.log('✅ Request accepted successfully. Updated record:', data);
      
// //       // Immediate UI update instead of waiting for refresh
// //       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
// //       setFriends(prev => [...prev, data[0]]);
      
// //       // Still refresh from server
// //       await Promise.all([getFriends(), getPendingRequests()]);
      
// //     } catch (error) {
// //       console.error('🔴 Accept request error:', error);
// //       Alert.alert('Error', error.message);
// //       // Re-fetch to ensure consistency
// //       await Promise.all([getFriends(), getPendingRequests()]);
// //     }
// //   }

// //   async function cancelFriendRequest(requestId) {
// //     console.log('Canceling friend request with ID:', requestId);
// //     if (!user) {
// //       console.log('No user - cannot cancel request');
// //       return;
// //     }
  
// //     try {
// //       setPendingRequests((prevRequests) =>
// //         prevRequests.filter((req) => req.id !== requestId)
// //       );
  
// //       const { error } = await supabase
// //         .from('friends')
// //         .delete()
// //         .eq('id', requestId); // TEMP: try without user.id to debug
  
// //       if (error) {
// //         console.error('🚨 Cancel request error:', JSON.stringify(error, null, 2));
// //         throw error;
// //       }
  
// //       console.log('✅ Request canceled successfully');
// //     } catch (error) {
// //       console.error('🚨 Cancel request failed:', error);
// //       Alert.alert('Error', 'Failed to cancel the request. Please try again.');
// //     } finally {
// //       await getPendingRequests(); // always refetch
// //     }
// //   }
  

// //   return (
// //     <View style={styles.container}>

// //       <Text style={styles.title}>Add Friends</Text>

// //       <TextInput
// //         style={styles.searchInput}
// //         placeholder="Search users..."
// //         onChangeText={searchUsers}
// //         value={searchQuery}/>
// //       <FlatList
// //         data={searchResults}
// //   keyExtractor={(item) => item.id}
// //   renderItem={({ item }) => (
// //     <View style={styles.userItem}>
// //       <Text style={styles.username}>{item.username}</Text>
// //       <TouchableOpacity 
// //         style={styles.addButton} 
// //         onPress={() => sendFriendRequest(item.id)}
// //       >
// //         <Text style={styles.addButtonText}>Add</Text>
// //       </TouchableOpacity>
// //     </View>
// //   )}
// //   ListEmptyComponent={
// //     searchQuery.length > 0 && <Text style={styles.emptyText}>No users found</Text>
// //         }
// //       />

// // <Text style={styles.subtitle}>Pending Requests</Text>
// // <FlatList
// //   data={pendingRequests}
// //   keyExtractor={(item) => item.id}
// //   renderItem={({ item }) => (
// //     <View style={styles.userItem}>
// //       <Text style={styles.username}>
// //         {item.isOutgoing 
// //           ? `Sent to ${item.otherUser?.username || 'Loading...'}`
// //           : `From ${item.otherUser?.username || 'Loading...'}`}
// //       </Text>

// //       {/* Display Accept button for incoming requests */}
    
// //       {!item.isOutgoing && (
// //         <TouchableOpacity 
// //           style={styles.acceptButton}
// //           onPress={() => {
// //             acceptFriendRequest(item.id);
// //           }}
// //         >
// //           <Text style={styles.addButtonText}>Accept</Text>
// //         </TouchableOpacity>
// //       )}

// //       {/* Display Cancel button for outgoing requests */}
// //       {true && (
// //   <TouchableOpacity 
// //     style={styles.cancelButton}
// //     onPress={() => {
// //       cancelFriendRequest(item.id);
// //     }}
// //   >
// //     <Text style={styles.cancelButtonText}>Cancel</Text>
// //   </TouchableOpacity>
// // )}
// //       </View>
// //   )}
// // />
// //     </View>
// //   );
  
// // }
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: 'black',
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 10,
// //     color: '#FFF0DC',
// //   },
// //   subtitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginTop: 20,
// //     marginBottom: 5,
// //     color: '#543A14',
// //   },
// //   searchInput: {
// //     borderWidth: 1,
// //     borderColor: '#888',
// //     padding: 10,
// //     borderRadius: 10,
// //     fontSize: 16,
// //     marginBottom: 10,
// //     backgroundColor: '#333',
// //     color: '#FFF0DC',
// //   },
// //   userItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     padding: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#555',
// //     color: '#FFF0DC',
// //   },
// //   username: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //   },
// //   addButton: {
// //     backgroundColor: '#543A14',
// //     paddingVertical: 5,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   addButtonText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //   },
// //   acceptButton: {
// //     backgroundColor: '#543A14',
// //     paddingVertical: 5,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   cancelButton: {
// //     backgroundColor: '#543A14',
// //     paddingVertical: 5,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   cancelButtonText: {
// //     color: '#FFF',
// //     fontSize: 14,
// //   },
// //   emptyText: {
// //     textAlign: 'center',
// //     color: '#666',
// //     marginTop: 20,
// //   },
  
// // });




// //ios test
// import React, { useEffect, useState } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TextInput, 
//   TouchableOpacity, ActivityIndicator, Alert, ScrollView 
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function Friends({ navigation }) {
//   const [friends, setFriends] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) {
//         console.error('Error fetching user:', error);
//         return;
//       }
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       getFriends();
//       getPendingRequests();
//     }
    
//     const subscription = supabase
//       .channel('friends')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
//         getPendingRequests();
//       })
//       .subscribe();

//     return () => subscription.unsubscribe();
//   }, [user]);

//   async function searchUsers(query) {
//     setSearchQuery(query);
    
//     if (query.length < 1) {
//       setSearchResults([]);
//       return;
//     }
  
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('id, username')
//       .ilike('username', `%${query}%`)
//       .neq('id', user.id);
  
//     if (error) console.error('Search error:', error);
//     setSearchResults(data || []);
//   }

//   async function getFriends() {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('friends')
//         .select(`
//           id,
//           user_id,
//           friends_id,
//           status,
//           sender:profiles!user_id(id, username),
//           receiver:profiles!friends_id(id, username)
//         `)
//         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
//         .eq('status', 'accepted');
  
//       if (error) {
//         console.error('Friends fetch error:', error);
//         return;
//       }
  
//       const transformed = data.map((friendship) => ({
//         ...friendship,
//         friendProfile: friendship.user_id === user.id 
//           ? friendship.receiver
//           : friendship.sender
//       }));
  
//       setFriends(transformed || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function getAllUsers() {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('id, username')
//         .neq('id', user.id);

//       if (error) throw error;
//       setSearchResults(data || []);
//     } catch (error) {
//       console.error('All users error:', error);
//     }
//   }

//   async function getPendingRequests() {
//     if (!user) return;
  
//     try {
//       const { data, error } = await supabase
//         .from('friends')
//         .select(`
//           id,
//           user_id,
//           friends_id,
//           status,
//           created_at,
//           sender:profiles!user_id(id, username),
//           receiver:profiles!friends_id(id, username)
//         `)
//         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
//         .eq('status', 'pending');
  
//       if (error) {
//         console.error('Pending requests error:', error);
//         return;
//       }
      
//       const transformed = data.map(req => ({
//         ...req,
//         isOutgoing: req.user_id === user.id,
//         otherUser: req.user_id === user.id ? req.receiver : req.sender,
//         canCancel: req.user_id === user.id,
//         canReject: req.friends_id === user.id
//       }));
      
//       setPendingRequests(transformed || []);
//     } catch (error) {
//       console.error('Pending requests catch error:', error);
//     }
//   }

//   async function sendFriendRequest(friendId) {
//     if (!user) return;
  
//     try {
//       if (user.id === friendId) {
//         Alert.alert('Error', 'You cannot add yourself');
//         return;
//       }
  
//       const { data: existing, error: checkError } = await supabase
//         .from('friends')
//         .select('*')
//         .or(
//           `and(user_id.eq.${user.id},friends_id.eq.${friendId}),` +
//           `and(user_id.eq.${friendId},friends_id.eq.${user.id})`
//         );
  
//       if (checkError) throw checkError;
  
//       if (existing && existing.length > 0) {
//         const status = existing[0].status;
//         Alert.alert(
//           'Already exists', 
//           status === 'pending' 
//             ? 'Friend request already pending' 
//             : 'User is already your friend'
//         );
//         return;
//       }
  
//       const { error } = await supabase
//         .from('friends')
//         .insert([{ 
//           user_id: user.id, 
//           friends_id: friendId, 
//           status: 'pending',
//           created_at: new Date().toISOString()
//         }]);
  
//       if (error) throw error;
      
//       await Promise.all([getPendingRequests(), getAllUsers()]);
//     } catch (error) {
//       console.error('Send request error:', error);
//       Alert.alert('Error', error.message);
//     }
//   }

//   async function acceptFriendRequest(requestId) {
//     try {
//       const { data, error } = await supabase
//         .from('friends')
//         .update({ status: 'accepted' })
//         .eq('id', requestId)
//         .select();

//       if (error) throw error;
      
//       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
//       setFriends(prev => [...prev, data[0]]);
      
//       await Promise.all([getFriends(), getPendingRequests()]);
//     } catch (error) {
//       console.error('Accept request error:', error);
//       Alert.alert('Error', error.message);
//       await Promise.all([getFriends(), getPendingRequests()]);
//     }
//   }

//   async function cancelFriendRequest(requestId) {
//     try {
//       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  
//       const { error } = await supabase
//         .from('friends')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//     } catch (error) {
//       console.error('Cancel request failed:', error);
//       Alert.alert('Error', 'Failed to cancel the request. Please try again.');
//     } finally {
//       await getPendingRequests();
//     }
//   }

//   // Function to remove a friend
//   async function removeFriend(friendshipId) {
//     try {
//       Alert.alert(
//         'Confirm',
//         'Are you sure you want to remove this friend?',
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel'
//           },
//           {
//             text: 'Remove',
//             onPress: async () => {
//               const { error } = await supabase
//                 .from('friends')
//                 .delete()
//                 .eq('id', friendshipId);
              
//               if (error) throw error;
              
//               setFriends(prev => prev.filter(f => f.id !== friendshipId));
//               Alert.alert('Success', 'Friend removed successfully');
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       console.error('Remove friend error:', error);
//       Alert.alert('Error', 'Failed to remove friend');
//     }
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}> Add Friends</Text>

//       {/* Search Section */}
//       <View style={styles.inputContainer}>
//         <Icon name="search" size={20} color="#FFF0DC" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Search users..."
//           placeholderTextColor="#888"
//           onChangeText={searchUsers}
//           value={searchQuery}
//         />
//       </View>

//       {/* Search Results */}
//       <FlatList
//         data={searchResults}
//         keyExtractor={(item) => item.id}
//         scrollEnabled={false}
//         contentContainerStyle={styles.listContent}
//         renderItem={({ item }) => (
//           <View style={styles.userItem}>
//             <View style={styles.userInfo}>
//               <Icon name="person" size={24} color="#FFF0DC" style={styles.userIcon} />
//               <Text style={styles.username}>{item.username}</Text>
//             </View>
//             <TouchableOpacity 
//               style={styles.addButton} 
//               onPress={() => sendFriendRequest(item.id)}
//             >
//               <Icon name="person-add" size={20} color="#FFF0DC" />
//             </TouchableOpacity>
//           </View>
//         )}
//         ListEmptyComponent={
//           searchQuery.length > 0 && (
//             <Text style={styles.emptyText}>No users found</Text>
//           )
//         }
//       />

//       {/* Pending Requests Section */}
//       {pendingRequests.length > 0 && (
//         <>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Pending Requests</Text>
//             <Text style={styles.countBadge}>{pendingRequests.length}</Text>
//           </View>
          
//           <FlatList
//             data={pendingRequests}
//             keyExtractor={(item) => item.id}
//             scrollEnabled={false}
//             contentContainerStyle={styles.listContent}
//             renderItem={({ item }) => (
//               <View style={styles.userItem}>
//                 <View style={styles.userInfo}>
//                   <Icon 
//                     name={item.isOutgoing ? "person-outline" : "person-add"} 
//                     size={24} 
//                     color="#FFF0DC" 
//                     style={styles.userIcon} 
//                   />
//                   <View>
//                     <Text style={styles.username}>{item.otherUser?.username || "Unknown User"}</Text>
//                     <Text style={styles.requestStatus}>
//                       {item.isOutgoing ? "Outgoing request" : "Incoming request"}
//                     </Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.actionsContainer}>
//                   {item.canReject && (
//                     <TouchableOpacity 
//                       style={styles.actionButton}
//                       onPress={() => acceptFriendRequest(item.id)}
//                     >
//                       <Icon name="check" size={20} color="#4CAF50" />
//                     </TouchableOpacity>
//                   )}
//                   {(item.canCancel || item.canReject) && (
//                     <TouchableOpacity 
//                       style={styles.actionButton}
//                       onPress={() => cancelFriendRequest(item.id)}
//                     >
//                       <Icon name="close" size={20} color="#F44336" />
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             )}
//           />
//         </>
//       )}

      
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flex : 1,
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor : 'black'
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 25,
//     textAlign: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 15,
//     backgroundColor : 'black'
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: '#FFF0DC',
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//   },
//   sectionTitle: {
//     color: '#FFF0DC',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   countBadge: {
//     backgroundColor: '#543A14',
//     color: '#FFF0DC',
//     borderRadius: 12,
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     fontSize: 12,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   userItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userIcon: {
//     marginRight: 12,
//   },
//   username: {
//     fontSize: 16,
//     color: '#FFF0DC',
//     fontWeight: '500',
//   },
//   requestStatus: {
//     fontSize: 12,
//     color: '#888',
//     marginTop: 4,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     marginLeft: 10,
//   },
//   addButton: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 20,
//     padding: 6,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   removeButton: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 20,
//     padding: 6,
//     borderWidth: 1,
//     borderColor: '#F44336',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 30,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#333',
//     marginTop: 10,
//   },
//   emptyText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   emptySubtext: {
//     color: '#888',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   pendingButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 16,
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   pendingButtonText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });


import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert, ScrollView 
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

export default function Friends({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      getFriends();
      getPendingRequests();
    }
    
    const subscription = supabase
      .channel('friends')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
        getPendingRequests();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user]);

  async function searchUsers(query) {
    setSearchQuery(query);
    
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
  
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', `%${query}%`)
      .neq('id', user.id);
  
    if (error) console.error('Search error:', error);
    setSearchResults(data || []);
  }

  async function getFriends() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friends_id,
          status,
          sender:profiles!user_id(id, username),
          receiver:profiles!friends_id(id, username)
        `)
        .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
        .eq('status', 'accepted');
  
      if (error) {
        console.error('Friends fetch error:', error);
        return;
      }
  
      const transformed = data.map((friendship) => ({
        ...friendship,
        friendProfile: friendship.user_id === user.id 
          ? friendship.receiver
          : friendship.sender
      }));
  
      setFriends(transformed || []);
    } finally {
      setLoading(false);
    }
  }

  async function getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .neq('id', user.id);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('All users error:', error);
    }
  }

  async function getPendingRequests() {
    if (!user) return;
  
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friends_id,
          status,
          created_at,
          sender:profiles!user_id(id, username),
          receiver:profiles!friends_id(id, username)
        `)
        .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
        .eq('status', 'pending');
  
      if (error) {
        console.error('Pending requests error:', error);
        return;
      }
      
      const transformed = data.map(req => ({
        ...req,
        isOutgoing: req.user_id === user.id,
        otherUser: req.user_id === user.id ? req.receiver : req.sender,
        canCancel: req.user_id === user.id,
        canReject: req.friends_id === user.id
      }));
      
      setPendingRequests(transformed || []);
    } catch (error) {
      console.error('Pending requests catch error:', error);
    }
  }

  async function sendFriendRequest(friendId) {
    if (!user) return;
  
    try {
      if (user.id === friendId) {
        Alert.alert('Error', 'You cannot add yourself');
        return;
      }
  
      const { data: existing, error: checkError } = await supabase
        .from('friends')
        .select('*')
        .or(
          `and(user_id.eq.${user.id},friends_id.eq.${friendId}),` +
          `and(user_id.eq.${friendId},friends_id.eq.${user.id})`
        );
  
      if (checkError) throw checkError;
  
      if (existing && existing.length > 0) {
        const status = existing[0].status;
        Alert.alert(
          'Already exists', 
          status === 'pending' 
            ? 'Friend request already pending' 
            : 'User is already your friend'
        );
        return;
      }
  
      const { error } = await supabase
        .from('friends')
        .insert([{ 
          user_id: user.id, 
          friends_id: friendId, 
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
  
      if (error) throw error;
      
      await Promise.all([getPendingRequests(), getAllUsers()]);
    } catch (error) {
      console.error('Send request error:', error);
      Alert.alert('Error', error.message);
    }
  }

  async function acceptFriendRequest(requestId) {
    try {
      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select();

      if (error) throw error;
      
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setFriends(prev => [...prev, data[0]]);
      
      await Promise.all([getFriends(), getPendingRequests()]);
    } catch (error) {
      console.error('Accept request error:', error);
      Alert.alert('Error', error.message);
      await Promise.all([getFriends(), getPendingRequests()]);
    }
  }

  async function cancelFriendRequest(requestId) {
    try {
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
    } catch (error) {
      console.error('Cancel request failed:', error);
      Alert.alert('Error', 'Failed to cancel the request. Please try again.');
    } finally {
      await getPendingRequests();
    }
  }

  async function removeFriend(friendshipId) {
    try {
      Alert.alert(
        'Confirm',
        'Are you sure you want to remove this friend?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Remove',
            onPress: async () => {
              const { error } = await supabase
                .from('friends')
                .delete()
                .eq('id', friendshipId);
              
              if (error) throw error;
              
              setFriends(prev => prev.filter(f => f.id !== friendshipId));
              Alert.alert('Success', 'Friend removed successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Remove friend error:', error);
      Alert.alert('Error', 'Failed to remove friend');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}> Add Friends</Text>

      {/* Search Section */}
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color="#FFF0DC" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          placeholderTextColor="#888"
          onChangeText={searchUsers}
          value={searchQuery}
        />
      </View>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userInfo}>
              <Icon name="person" size={24} color="#FFF0DC" style={styles.userIcon} />
              <Text style={styles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => sendFriendRequest(item.id)}
            >
              <Icon name="person-add" size={20} color="#FFF0DC" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          searchQuery.length > 0 && (
            <Text style={styles.emptyText}>No users found</Text>
          )
        }
      />

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <Text style={styles.countBadge}>{pendingRequests.length}</Text>
          </View>
          
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <View style={styles.userInfo}>
                  <Icon 
                    name={item.isOutgoing ? "person-outline" : "person-add"} 
                    size={24} 
                    color="#FFF0DC" 
                    style={styles.userIcon} 
                  />
                  <View>
                    <Text style={styles.username}>{item.otherUser?.username || "Unknown User"}</Text>
                    <Text style={styles.requestStatus}>
                      {item.isOutgoing ? "Outgoing request" : "Incoming request"}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.actionsContainer}>
                  {item.canReject && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => acceptFriendRequest(item.id)}
                    >
                      <Icon name="check" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                  )}
                  {(item.canCancel || item.canReject) && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => cancelFriendRequest(item.id)}
                    >
                      <Icon name="close" size={20} color="#F44336" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'black'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 25,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
    paddingBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF0DC',
    paddingVertical: 12,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
  },
  sectionTitle: {
    color: '#FFF0DC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#543A14',
    color: '#FFF0DC',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: '#FFF0DC',
    fontWeight: '500',
  },
  requestStatus: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
  },
  addButton: {
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  removeButton: {
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  emptyText: {
    color: '#FFF0DC',
    fontSize: 16,
    marginTop: 10,
  },
});
