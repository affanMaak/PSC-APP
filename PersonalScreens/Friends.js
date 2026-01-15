// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, StyleSheet, FlatList, TextInput, 
// //   TouchableOpacity, ActivityIndicator, Alert, ScrollView 
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function Friends({ navigation }) {
// //   const [friends, setFriends] = useState([]);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [showAllPending, setShowAllPending] = useState(false);

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) {
// //         console.error('Error fetching user:', error);
// //         return;
// //       }
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) {
// //       getFriends();
// //       getPendingRequests();
// //     }
    
// //     const subscription = supabase
// //       .channel('friends')
// //       .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
// //         getPendingRequests();
// //       })
// //       .subscribe();

// //     return () => subscription.unsubscribe();
// //   }, [user]);

// //   async function searchUsers(query) {
// //     setSearchQuery(query);
    
// //     if (query.length < 1) {
// //       setSearchResults([]);
// //       return;
// //     }
  
// //     // Changed to prefix search for exact matches
// //     const { data, error } = await supabase
// //       .from('profiles')
// //       .select('id, username')
// //       .ilike('username', `${query}%`) // Only matches beginning of username
// //       .neq('id', user.id);
  
// //     if (error) console.error('Search error:', error);
// //     setSearchResults(data || []);
// //   }

// //   async function getFriends() {
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
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'accepted');
  
// //       if (error) {
// //         console.error('Friends fetch error:', error);
// //         return;
// //       }
  
// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id 
// //           ? friendship.receiver
// //           : friendship.sender
// //       }));
  
// //       setFriends(transformed || []);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // async function getAllUsers() {
// //   //   try {
// //   //     const { data, error } = await supabase
// //   //       .from('profiles')
// //   //       .select('id, username')
// //   //       .neq('id', user.id);

// //   //     if (error) throw error;
// //   //     setSearchResults(data || []);
// //   //   } catch (error) {
// //   //     console.error('All users error:', error);
// //   //   }
// //   // }

// //   async function getPendingRequests() {
// //     if (!user) return;
  
// //     try {
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
// //         .eq('status', 'pending')
// //         .order('created_at', { ascending: false }); // Order by most recent
  
// //       if (error) {
// //         console.error('Pending requests error:', error);
// //         return;
// //       }
      
// //       const transformed = data.map(req => ({
// //         ...req,
// //         isOutgoing: req.user_id === user.id,
// //         otherUser: req.user_id === user.id ? req.receiver : req.sender,
// //         canCancel: req.user_id === user.id,
// //         canReject: req.friends_id === user.id
// //       }));
      
// //       setPendingRequests(transformed || []);
// //     } catch (error) {
// //       console.error('Pending requests catch error:', error);
// //     }
// //   }


// //    async function sendFriendRequest(friendId) {
// //     if (!user) return;
  
// //     try {
// //       if (user.id === friendId) {
// //         Alert.alert('Error', 'You cannot add yourself');
// //         return;
// //       }
  
// //       const { data: existing, error: checkError } = await supabase
// //         .from('friends')
// //         .select('*')
// //         .or(
// //           `and(user_id.eq.${user.id},friends_id.eq.${friendId}),` +
// //           `and(user_id.eq.${friendId},friends_id.eq.${user.id})`
// //         );
  
// //       if (checkError) throw checkError;
  
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
  
// //       const { error } = await supabase
// //         .from('friends')
// //         .insert([{ 
// //           user_id: user.id, 
// //           friends_id: friendId, 
// //           status: 'pending',
// //           created_at: new Date().toISOString()
// //         }]);
  
// //       if (error) throw error;
      
// //       //main ye tha jab req kro tw sare users atey thay nazar ab nai ayeinge muah
// //      // await Promise.all([getPendingRequests(), getAllUsers()]);
// //       await Promise.all([getPendingRequests()]);
// //     } catch (error) {
// //       console.error('Send request error:', error);
// //       Alert.alert('Error', error.message);
// //     }
// //   }

// //   async function acceptFriendRequest(requestId) {
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .update({ status: 'accepted' })
// //         .eq('id', requestId)
// //         .select();

// //       if (error) throw error;
      
// //       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
// //       setFriends(prev => [...prev, data[0]]);
      
// //       await Promise.all([getFriends(), getPendingRequests()]);
// //     } catch (error) {
// //       console.error('Accept request error:', error);
// //       Alert.alert('Error', error.message);
// //       await Promise.all([getFriends(), getPendingRequests()]);
// //     }
// //   }

// //   async function cancelFriendRequest(requestId) {
// //     try {
// //       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  
// //       const { error } = await supabase
// //         .from('friends')
// //         .delete()
// //         .eq('id', requestId);

// //       if (error) throw error;
// //     } catch (error) {
// //       console.error('Cancel request failed:', error);
// //       Alert.alert('Error', 'Failed to cancel the request. Please try again.');
// //     } finally {
// //       await getPendingRequests();
// //     }
// //   }

// //   // NEW: Function to remove a friend
// //   async function removeFriend(friendshipId) {
// //     try {
// //       Alert.alert(
// //         'Confirm',
// //         'Are you sure you want to remove this friend?',
// //         [
// //           {
// //             text: 'Cancel',
// //             style: 'cancel'
// //           },
// //           {
// //             text: 'Remove',
// //             onPress: async () => {
// //               const { error } = await supabase
// //                 .from('friends')
// //                 .delete()
// //                 .eq('id', friendshipId);
              
// //               if (error) throw error;
              
// //               setFriends(prev => prev.filter(f => f.id !== friendshipId));
// //               Alert.alert('Success', 'Friend removed successfully');
// //             }
// //           }
// //         ]
// //       );
// //     } catch (error) {
// //       console.error('Remove friend error:', error);
// //       Alert.alert('Error', 'Failed to remove friend');
// //     }
// //   }
  
// //   // Pending Request Item Component
// //   const PendingRequestItem = ({ item }) => (
// //     <View style={styles.userItem}>
// //       <View style={styles.userInfo}>
// //         <Icon 
// //           name={item.isOutgoing ? "person-outline" : "person-add"} 
// //           size={24} 
// //           color="#D2B48C" 
// //           style={styles.userIcon} 
// //         />
// //         <View>
// //           <Text style={styles.username}>{item.otherUser?.username || "Unknown User"}</Text>
// //           <Text style={styles.requestStatus}>
// //             {item.isOutgoing ? "Outgoing request" : "Incoming request"}
// //           </Text>
// //         </View>
// //       </View>
      
// //       <View style={styles.actionsContainer}>
// //         {item.canReject && (
// //           <TouchableOpacity 
// //             style={styles.actionButton}
// //             onPress={() => acceptFriendRequest(item.id)}
// //           >
// //             <Icon name="check" size={20} color="#4CAF50" />
// //           </TouchableOpacity>
// //         )}
// //         {(item.canCancel || item.canReject) && (
// //           <TouchableOpacity 
// //             style={styles.actionButton}
// //             onPress={() => cancelFriendRequest(item.id)}
// //           >
// //             <Icon name="close" size={20} color="#F44336" />
// //           </TouchableOpacity>
// //         )}
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <ScrollView contentContainerStyle={styles.scrollContainer}>
// //       <Text style={styles.header}>Friends</Text>

// //       {/* Search Section */}
// //       <View style={styles.inputContainer}>
// //         <Icon name="search" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Search users..."
// //           placeholderTextColor="#888"
// //           onChangeText={searchUsers}
// //           value={searchQuery}
// //         />
// //       </View>

// //       {/* Search Results */}
// //       <FlatList
// //         data={searchResults}
// //         keyExtractor={(item) => item.id}
// //         scrollEnabled={false}
// //         contentContainerStyle={styles.listContent}
// //         renderItem={({ item }) => (
// //           <View style={styles.userItem}>
// //             <View style={styles.userInfo}>
// //               <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
// //               <Text style={styles.username}>{item.username}</Text>
// //             </View>
// //             <TouchableOpacity 
// //               style={styles.addButton} 
// //               onPress={() => sendFriendRequest(item.id)}
// //             >
// //               <Icon name="person-add" size={20} color="#D2B48C" />
// //             </TouchableOpacity>
// //           </View>
// //         )}
// //         ListEmptyComponent={
// //           searchQuery.length > 0 && (
// //             <Text style={styles.emptyText}>No users found</Text>
// //           )
// //         }
// //       />

// //       {/* Pending Requests Section */}
// //       {pendingRequests.length > 0 && (
// //         <>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Pending Requests</Text>
// //             <Text style={styles.countBadge}>{pendingRequests.length}</Text>
// //           </View>
          
// //           {/* Show only first request when collapsed */}
// //           {!showAllPending && pendingRequests.length > 0 && (
// //             <PendingRequestItem item={pendingRequests[0]} />
// //           )}
          
// //           {/* Show all requests when expanded */}
// //           {showAllPending && (
// //             <FlatList
// //               data={pendingRequests}
// //               keyExtractor={(item) => item.id}
// //               scrollEnabled={false}
// //               contentContainerStyle={styles.listContent}
// //               renderItem={({ item }) => <PendingRequestItem item={item} />}
// //             />
// //           )}
          
// //           {/* See More/Hide Button */}
// //           <TouchableOpacity
// //             style={styles.seeMoreButton}
// //             onPress={() => setShowAllPending(!showAllPending)}
// //           >
// //             <Text style={styles.seeMoreText}>
// //               {showAllPending 
// //                 ? "Hide Requests" 
// //                 : pendingRequests.length > 1
// //                   ? `${pendingRequests[0]?.otherUser?.username || 'Someone'} + ${pendingRequests.length - 1} others`
// //                   : "See More"}
// //             </Text>
// //             <Icon 
// //               name={showAllPending ? "expand-less" : "expand-more"} 
// //               size={20} 
// //               color="#D2B48C" 
// //             />
// //           </TouchableOpacity>
// //         </>
// //       )}

// //       {/* Friends List Section */}
// //       <View style={styles.sectionHeader}>
// //         <Text style={styles.sectionTitle}>Your Friends</Text>
// //         <Text style={styles.countBadge}>{friends.length}</Text>
// //       </View>
      
// //       {friends.length === 0 ? (
// //         <View style={styles.emptyContainer}>
// //           <Icon name="people-outline" size={48} color="#D2B48C" />
// //           <Text style={styles.emptyText}>No friends yet</Text>
// //           <Text style={styles.emptySubtext}>Search for users to add friends</Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={friends}
// //           keyExtractor={(item) => item.id}
// //           scrollEnabled={false}
// //           contentContainerStyle={styles.listContent}
// //           renderItem={({ item }) => (
// //             <View style={styles.userItem}>
// //               <View style={styles.userInfo}>
// //                 <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
// //                 <Text style={styles.username}>
// //                   {item.friendProfile?.username || "Unknown User"}
// //                 </Text>
// //               </View>
              
// //               <TouchableOpacity 
// //                 style={styles.removeButton}
// //                 onPress={() => removeFriend(item.id)}
// //               >
// //                 <Icon name="person-remove" size={20} color="#F44336" />
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         />
// //       )}
// //     </ScrollView>
// //   );
// // }


// // const styles = StyleSheet.create({
// //   scrollContainer: {
// //     padding: 16,
// //     backgroundColor: '#121212',
// //     paddingBottom: 40,
// //     minHeight: '100%',
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //     paddingBottom: 12,
// //     marginTop: 8,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     height: 48,
// //   },
// //   icon: {
// //     marginRight: 8,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     paddingVertical: 0, // Remove fixed padding for better text alignment
// //     height: '100%', // Take full height of container
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //     paddingBottom: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //   },
// //   sectionTitle: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   countBadge: {
// //     backgroundColor: '#543A14',
// //     color: '#FFF0DC',
// //     borderRadius: 10,
// //     paddingVertical: 2,
// //     paddingHorizontal: 6,
// //     fontSize: 12,
// //     minWidth: 20,
// //     textAlign: 'center',
// //   },
// //   listContent: {
// //     paddingBottom: 16,
// //   },
// //   userItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 8,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     minHeight: 60, // Ensure consistent height
// //   },
// //   userInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1, // Take available space
// //   },
// //   userIcon: {
// //     marginRight: 10,
// //   },
// //   username: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //     fontWeight: '500',
// //     flexShrink: 1, // Allow text to wrap if needed
// //   },
// //   requestStatus: {
// //     fontSize: 11,
// //     color: '#888',
// //     marginTop: 2,
// //   },
// //   actionsContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   actionButton: {
// //     marginLeft: 8,
// //     padding: 4, // Better touch target
// //   },
// //   addButton: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 18,
// //     padding: 5,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     width: 32,
// //     height: 32,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   removeButton: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 18,
// //     padding: 5,
// //     borderWidth: 1,
// //     borderColor: '#F44336',
// //     width: 32,
// //     height: 32,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 24,
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     marginTop: 8,
// //     marginHorizontal: 16,
// //   },
// //   emptyText: {
// //     color: '#FFF0DC',
// //     fontSize: 15,
// //     marginTop: 8,
// //     textAlign: 'center',
// //   },
// //   emptySubtext: {
// //     color: '#888',
// //     fontSize: 13,
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },
// //   seeMoreButton: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     padding: 10,
// //     marginTop: 4,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     width: '100%',
// //   },
// //   seeMoreText: {
// //     color: '#D2B48C',
// //     marginRight: 6,
// //     fontWeight: '500',
// //     fontSize: 14,
// //   },
// //   // Add responsive spacing
// //   responsiveMargin: {
// //     marginHorizontal: Platform.select({
// //       ios: 4,
// //       android: 4,
// //       default: 8,
// //     }),
// //   },
// // });

// //working affan se phele
// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, StyleSheet, FlatList, TextInput, 
// //   TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image 
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function Friends({ navigation }) {
// //   const [friends, setFriends] = useState([]);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [showAllPending, setShowAllPending] = useState(false);

// //   // Function to get public avatar URLs
// //   function getAvatarUrl(avatarPath) {
// //     if (!avatarPath) return null;
// //     return `${supabase.supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`;
// //   }

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) {
// //         console.error('Error fetching user:', error);
// //         return;
// //       }
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) {
// //       getFriends();
// //       getPendingRequests();
// //     }
    
// //     const subscription = supabase
// //       .channel('friends')
// //       .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
// //         getPendingRequests();
// //       })
// //       .subscribe();

// //     return () => subscription.unsubscribe();
// //   }, [user]);

// //   async function searchUsers(query) {
// //     setSearchQuery(query);
    
// //     if (query.length < 1) {
// //       setSearchResults([]);
// //       return;
// //     }
  
// //     const { data, error } = await supabase
// //       .from('profiles')
// //       .select('id, username, avatar_url')
// //       .ilike('username', `${query}%`)
// //       .neq('id', user.id);
  
// //     if (error) console.error('Search error:', error);
// //     setSearchResults(data || []);
// //   }

// //   async function getFriends() {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`
// //           id,
// //           user_id,
// //           friends_id,
// //           status,
// //           sender:profiles!user_id(id, username, avatar_url),
// //           receiver:profiles!friends_id(id, username, avatar_url)
// //         `)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'accepted');
  
// //       if (error) {
// //         console.error('Friends fetch error:', error);
// //         return;
// //       }
  
// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id 
// //           ? friendship.receiver
// //           : friendship.sender
// //       }));
  
// //       setFriends(transformed || []);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function getPendingRequests() {
// //     if (!user) return;
  
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`
// //           id,
// //           user_id,
// //           friends_id,
// //           status,
// //           created_at,
// //           sender:profiles!user_id(id, username, avatar_url),
// //           receiver:profiles!friends_id(id, username, avatar_url)
// //         `)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'pending')
// //         .order('created_at', { ascending: false });
  
// //       if (error) {
// //         console.error('Pending requests error:', error);
// //         return;
// //       }
      
// //       const transformed = data.map(req => ({
// //         ...req,
// //         isOutgoing: req.user_id === user.id,
// //         otherUser: req.user_id === user.id ? req.receiver : req.sender,
// //         canCancel: req.user_id === user.id,
// //         canReject: req.friends_id === user.id
// //       }));
      
// //       setPendingRequests(transformed || []);
// //     } catch (error) {
// //       console.error('Pending requests catch error:', error);
// //     }
// //   }

// //   async function sendFriendRequest(friendId) {
// //     if (!user) return;
  
// //     try {
// //       if (user.id === friendId) {
// //         Alert.alert('Error', 'You cannot add yourself');
// //         return;
// //       }
  
// //       const { data: existing, error: checkError } = await supabase
// //         .from('friends')
// //         .select('*')
// //         .or(
// //           `and(user_id.eq.${user.id},friends_id.eq.${friendId}),` +
// //           `and(user_id.eq.${friendId},friends_id.eq.${user.id})`
// //         );
  
// //       if (checkError) throw checkError;
  
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
  
// //       const { error } = await supabase
// //         .from('friends')
// //         .insert([{ 
// //           user_id: user.id, 
// //           friends_id: friendId, 
// //           status: 'pending',
// //           created_at: new Date().toISOString()
// //         }]);
  
// //       if (error) throw error;
      
// //       await Promise.all([getPendingRequests()]);
// //     } catch (error) {
// //       console.error('Send request error:', error);
// //       Alert.alert('Error', error.message);
// //     }
// //   }

// //   async function acceptFriendRequest(requestId) {
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .update({ status: 'accepted' })
// //         .eq('id', requestId)
// //         .select();

// //       if (error) throw error;
      
// //       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
// //       setFriends(prev => [...prev, data[0]]);
      
// //       await Promise.all([getFriends(), getPendingRequests()]);
// //     } catch (error) {
// //       console.error('Accept request error:', error);
// //       Alert.alert('Error', error.message);
// //       await Promise.all([getFriends(), getPendingRequests()]);
// //     }
// //   }

// //   async function cancelFriendRequest(requestId) {
// //     try {
// //       setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  
// //       const { error } = await supabase
// //         .from('friends')
// //         .delete()
// //         .eq('id', requestId);

// //       if (error) throw error;
// //     } catch (error) {
// //       console.error('Cancel request failed:', error);
// //       Alert.alert('Error', 'Failed to cancel the request. Please try again.');
// //     } finally {
// //       await getPendingRequests();
// //     }
// //   }

// //   async function removeFriend(friendshipId) {
// //     try {
// //       Alert.alert(
// //         'Confirm',
// //         'Are you sure you want to remove this friend?',
// //         [
// //           {
// //             text: 'Cancel',
// //             style: 'cancel'
// //           },
// //           {
// //             text: 'Remove',
// //             onPress: async () => {
// //               const { error } = await supabase
// //                 .from('friends')
// //                 .delete()
// //                 .eq('id', friendshipId);
              
// //               if (error) throw error;
              
// //               setFriends(prev => prev.filter(f => f.id !== friendshipId));
// //               Alert.alert('Success', 'Friend removed successfully');
// //             }
// //           }
// //         ]
// //       );
// //     } catch (error) {
// //       console.error('Remove friend error:', error);
// //       Alert.alert('Error', 'Failed to remove friend');
// //     }
// //   }
  
// //   const PendingRequestItem = ({ item }) => (
// //     <View style={styles.userItem}>
// //       <View style={styles.userInfo}>
// //         {item.otherUser?.avatar_url ? (
// //           <Image
// //             source={{ uri: getAvatarUrl(item.otherUser.avatar_url) }}
// //             style={styles.avatarImage}
// //             onError={(e) => console.log('Image error:', e.nativeEvent.error)}
// //           />
// //         ) : (
// //           <Icon 
// //             name={item.isOutgoing ? "person-outline" : "person-add"} 
// //             size={24} 
// //             color="#D2B48C" 
// //             style={styles.userIcon} 
// //           />
// //         )}
// //         <View>
// //           <Text style={styles.username}>{item.otherUser?.username || "Unknown User"}</Text>
// //           <Text style={styles.requestStatus}>
// //             {item.isOutgoing ? "Outgoing request" : "Incoming request"}
// //           </Text>
// //         </View>
// //       </View>
      
// //       <View style={styles.actionsContainer}>
// //         {item.canReject && (
// //           <TouchableOpacity 
// //             style={styles.actionButton}
// //             onPress={() => acceptFriendRequest(item.id)}
// //           >
// //             <Icon name="check" size={20} color="#4CAF50" />
// //           </TouchableOpacity>
// //         )}
// //         {(item.canCancel || item.canReject) && (
// //           <TouchableOpacity 
// //             style={styles.actionButton}
// //             onPress={() => cancelFriendRequest(item.id)}
// //           >
// //             <Icon name="close" size={20} color="#F44336" />
// //           </TouchableOpacity>
// //         )}
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <ScrollView contentContainerStyle={styles.scrollContainer}>
// //       <Text style={styles.header}>Friends</Text>

// //       <View style={styles.inputContainer}>
// //         <Icon name="search" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Search users..."
// //           placeholderTextColor="#888"
// //           onChangeText={searchUsers}
// //           value={searchQuery}
// //         />
// //       </View>

// //       <FlatList
// //         data={searchResults}
// //         keyExtractor={(item) => item.id}
// //         scrollEnabled={false}
// //         contentContainerStyle={styles.listContent}
// //         renderItem={({ item }) => (
// //           <View style={styles.userItem}>
// //             <View style={styles.userInfo}>
// //               {item.avatar_url ? (
// //                 <Image
// //                   source={{ uri: getAvatarUrl(item.avatar_url) }}
// //                   style={styles.avatarImage}
// //                   onError={(e) => console.log('Image error:', e.nativeEvent.error)}
// //                 />
// //               ) : (
// //                 <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
// //               )}
// //               <Text style={styles.username}>{item.username}</Text>
// //             </View>
// //             <TouchableOpacity 
// //               style={styles.addButton} 
// //               onPress={() => sendFriendRequest(item.id)}
// //             >
// //               <Icon name="person-add" size={20} color="#D2B48C" />
// //             </TouchableOpacity>
// //           </View>
// //         )}
// //         ListEmptyComponent={
// //           searchQuery.length > 0 && (
// //             <Text style={styles.emptyText}>No users found</Text>
// //           )
// //         }
// //       />

// //       {pendingRequests.length > 0 && (
// //         <>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Pending Requests</Text>
// //             <Text style={styles.countBadge}>{pendingRequests.length}</Text>
// //           </View>
          
// //           {!showAllPending && pendingRequests.length > 0 && (
// //             <PendingRequestItem item={pendingRequests[0]} />
// //           )}
          
// //           {showAllPending && (
// //             <FlatList
// //               data={pendingRequests}
// //               keyExtractor={(item) => item.id}
// //               scrollEnabled={false}
// //               contentContainerStyle={styles.listContent}
// //               renderItem={({ item }) => <PendingRequestItem item={item} />}
// //             />
// //           )}
          
// //           <TouchableOpacity
// //             style={styles.seeMoreButton}
// //             onPress={() => setShowAllPending(!showAllPending)}
// //           >
// //             <Text style={styles.seeMoreText}>
// //               {showAllPending 
// //                 ? "Hide Requests" 
// //                 : pendingRequests.length > 1
// //                   ? `${pendingRequests[0]?.otherUser?.username || 'Someone'} + ${pendingRequests.length - 1} others`
// //                   : "See More"}
// //             </Text>
// //             <Icon 
// //               name={showAllPending ? "expand-less" : "expand-more"} 
// //               size={20} 
// //               color="#D2B48C" 
// //             />
// //           </TouchableOpacity>
// //         </>
// //       )}

// //       <View style={styles.sectionHeader}>
// //         <Text style={styles.sectionTitle}>Your Friends</Text>
// //         <Text style={styles.countBadge}>{friends.length}</Text>
// //       </View>
      
// //       {friends.length === 0 ? (
// //         <View style={styles.emptyContainer}>
// //           <Icon name="people-outline" size={48} color="#D2B48C" />
// //           <Text style={styles.emptyText}>No friends yet</Text>
// //           <Text style={styles.emptySubtext}>Search for users to add friends</Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={friends}
// //           keyExtractor={(item) => item.id}
// //           scrollEnabled={false}
// //           contentContainerStyle={styles.listContent}
// //           renderItem={({ item }) => (
// //             <View style={styles.userItem}>
// //               <View style={styles.userInfo}>
// //                 {item.friendProfile?.avatar_url ? (
// //                   <Image
// //                     source={{ uri: getAvatarUrl(item.friendProfile.avatar_url) }}
// //                     style={styles.avatarImage}
// //                     onError={(e) => console.log('Image error:', e.nativeEvent.error)}
// //                   />
// //                 ) : (
// //                   <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
// //                 )}
// //                 <Text style={styles.username}>
// //                   {item.friendProfile?.username || "Unknown User"}
// //                 </Text>
// //               </View>
              
// //               <TouchableOpacity 
// //                 style={styles.removeButton}
// //                 onPress={() => removeFriend(item.id)}
// //               >
// //                 <Icon name="person-remove" size={20} color="#F44336" />
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         />
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   scrollContainer: {
// //     padding: 16,
// //     backgroundColor: 'black',
// //     paddingBottom: 40,
// //     minHeight: '100%',
// //   },
// //   header: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //     paddingBottom: 12,
// //     marginTop: 8,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     height: 48,
// //   },
// //   icon: {
// //     marginRight: 8,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     paddingVertical: 0,
// //     height: '100%',
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //     paddingBottom: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //   },
// //   sectionTitle: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   countBadge: {
// //     backgroundColor: '#543A14',
// //     color: '#FFF0DC',
// //     borderRadius: 10,
// //     paddingVertical: 2,
// //     paddingHorizontal: 6,
// //     fontSize: 12,
// //     minWidth: 20,
// //     textAlign: 'center',
// //   },
// //   listContent: {
// //     paddingBottom: 16,
// //   },
// //   userItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 8,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     minHeight: 60,
// //   },
// //   userInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   avatarImage: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     marginRight: 10,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     backgroundColor: '#2A2A2A',
// //   },
// //   userIcon: {
// //     marginRight: 10,
// //   },
// //   username: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //     fontWeight: '500',
// //     flexShrink: 1,
// //   },
// //   requestStatus: {
// //     fontSize: 11,
// //     color: '#888',
// //     marginTop: 2,
// //   },
// //   actionsContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   actionButton: {
// //     marginLeft: 8,
// //     padding: 4,
// //   },
// //   addButton: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 18,
// //     padding: 5,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     width: 32,
// //     height: 32,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   removeButton: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 18,
// //     padding: 5,
// //     borderWidth: 1,
// //     borderColor: '#F44336',
// //     width: 32,
// //     height: 32,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 24,
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //     marginTop: 8,
// //     marginHorizontal: 16,
// //   },
// //   emptyText: {
// //     color: '#FFF0DC',
// //     fontSize: 15,
// //     marginTop: 8,
// //     textAlign: 'center',
// //   },
// //   emptySubtext: {
// //     color: '#888',
// //     fontSize: 13,
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },
// //   seeMoreButton: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     padding: 10,
// //     marginTop: 4,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     width: '100%',
// //   },
// //   seeMoreText: {
// //     color: '#D2B48C',
// //     marginRight: 6,
// //     fontWeight: '500',
// //     fontSize: 14,
// //   },
// // });


// //ios test

// import React, { useEffect, useState } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TextInput, 
//   TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image 
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
//   const [showAllPending, setShowAllPending] = useState(false);
//   const [sentRequestIds, setSentRequestIds] = useState(new Set()); // Track sent requests

//   // Function to get public avatar URLs
//   function getAvatarUrl(avatarPath) {
//     if (!avatarPath) return null;
//     return `${supabase.supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`;
//   }

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
//       setSentRequestIds(new Set()); // Clear sent requests when search is cleared
//       return;
//     }
  
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('id, username, avatar_url')
//       .ilike('username', `${query}%`)
//       .neq('id', user.id);
  
//     if (error) console.error('Search error:', error);
//     setSearchResults(data || []);
//     setSentRequestIds(new Set()); // Reset sent requests for new search
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
//           sender:profiles!user_id(id, username, avatar_url),
//           receiver:profiles!friends_id(id, username, avatar_url)
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
//           sender:profiles!user_id(id, username, avatar_url),
//           receiver:profiles!friends_id(id, username, avatar_url)
//         `)
//         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
//         .eq('status', 'pending')
//         .order('created_at', { ascending: false });
  
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
      
//       // Add to sent requests set to show "Request Sent" state
//       setSentRequestIds(prev => new Set([...prev, friendId]));
      
//       // Only refresh pending requests, don't clear search results
//       await getPendingRequests();
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

//   // Function to check if user is already a friend or has pending request
//   function getUserStatus(userId) {
//     // Check if already friends
//     const isFriend = friends.some(friend => friend.friendProfile?.id === userId);
//     if (isFriend) return 'friend';
    
//     // Check if there's a pending request
//     const hasPendingRequest = pendingRequests.some(req => 
//       (req.user_id === userId && req.friends_id === user.id) ||
//       (req.user_id === user.id && req.friends_id === userId)
//     );
//     if (hasPendingRequest) return 'pending';
    
//     // Check if request was just sent (local state)
//     if (sentRequestIds.has(userId)) return 'sent';
    
//     return 'none';
//   }

//   // Function to clear search results
//   function clearSearch() {
//     setSearchQuery('');
//     setSearchResults([]);
//     setSentRequestIds(new Set());
//   }
  
//   const PendingRequestItem = ({ item }) => (
//     <View style={styles.userItem}>
//       <View style={styles.userInfo}>
//         {item.otherUser?.avatar_url ? (
//           <Image
//             source={{ uri: getAvatarUrl(item.otherUser.avatar_url) }}
//             style={styles.avatarImage}
//             onError={(e) => console.log('Image error:', e.nativeEvent.error)}
//           />
//         ) : (
//           <Icon 
//             name={item.isOutgoing ? "person-outline" : "person-add"} 
//             size={24} 
//             color="#D2B48C" 
//             style={styles.userIcon} 
//           />
//         )}
//         <View>
//           <Text style={styles.username}>{item.otherUser?.username || "Unknown User"}</Text>
//           <Text style={styles.requestStatus}>
//             {item.isOutgoing ? "Outgoing request" : "Incoming request"}
//           </Text>
//         </View>
//       </View>
      
//       <View style={styles.actionsContainer}>
//         {item.canReject && (
//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => acceptFriendRequest(item.id)}
//           >
//             <Icon name="check" size={20} color="#4CAF50" />
//           </TouchableOpacity>
//         )}
//         {(item.canCancel || item.canReject) && (
//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => cancelFriendRequest(item.id)}
//           >
//             <Icon name="close" size={20} color="#F44336" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}>Friends</Text>

//       <View style={styles.inputContainer}>
//         <Icon name="search" size={20} color="#D2B48C" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Search users..."
//           placeholderTextColor="#888"
//           onChangeText={searchUsers}
//           value={searchQuery}
//         />
//       </View>

//       {/* Hide button - only show when there are search results */}
//       {searchResults.length > 0 && (
//         <TouchableOpacity style={styles.hideButton} onPress={clearSearch}>
//           <Text style={styles.hideButtonText}>Hide Search Results</Text>
//         </TouchableOpacity>
//       )}
   
//       <FlatList
//         data={searchResults}
//         keyExtractor={(item) => item.id}
//         scrollEnabled={false}
//         contentContainerStyle={styles.listContent}
//         renderItem={({ item }) => {
//           const userStatus = getUserStatus(item.id);
//           return (
//             <View style={styles.userItem}>
//               <View style={styles.userInfo}>
//                 {item.avatar_url ? (
//                   <Image
//                     source={{ uri: getAvatarUrl(item.avatar_url) }}
//                     style={styles.avatarImage}
//                     onError={(e) => console.log('Image error:', e.nativeEvent.error)}
//                   />
//                 ) : (
//                   <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
//                 )}
//                 <Text style={styles.username}>{item.username}</Text>
//               </View>
              
//               {userStatus === 'friend' ? (
//                 <View style={styles.statusButton}>
//                   <Icon name="check" size={16} color="#4CAF50" />
//                   <Text style={styles.statusText}>Friends</Text>
//                 </View>
//               ) : userStatus === 'pending' ? (
//                 <View style={styles.statusButton}>
//                   <Icon name="schedule" size={16} color="#FF9800" />
//                   <Text style={styles.statusText}>Pending</Text>
//                 </View>
//               ) : userStatus === 'sent' ? (
//                 <View style={styles.statusButton}>
//                   <Icon name="check" size={16} color="#4CAF50" />
//                   <Text style={styles.statusText}>Sent</Text>
//                 </View>
//               ) : (
//                 <TouchableOpacity 
//                   style={styles.addButton} 
//                   onPress={() => sendFriendRequest(item.id)}
//                 >
//                   <Icon name="person-add" size={20} color="#D2B48C" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           );
//         }}
//         ListEmptyComponent={
//           searchQuery.length > 0 && (
//             <Text style={styles.emptyText}>No users found</Text>
//           )
//         }
//       />

//       {pendingRequests.length > 0 && (
//         <>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Pending Requests</Text>
//             <Text style={styles.countBadge}>{pendingRequests.length}</Text>
//           </View>
          
//           {!showAllPending && pendingRequests.length > 0 && (
//             <PendingRequestItem item={pendingRequests[0]} />
//           )}
          
//           {showAllPending && (
//             <FlatList
//               data={pendingRequests}
//               keyExtractor={(item) => item.id}
//               scrollEnabled={false}
//               contentContainerStyle={styles.listContent}
//               renderItem={({ item }) => <PendingRequestItem item={item} />}
//             />
//           )}
          
//           <TouchableOpacity
//             style={styles.seeMoreButton}
//             onPress={() => setShowAllPending(!showAllPending)}
//           >
//             <Text style={styles.seeMoreText}>
//               {showAllPending 
//                 ? "Hide Requests" 
//                 : pendingRequests.length > 1
//                   ? `${pendingRequests[0]?.otherUser?.username || 'Someone'} + ${pendingRequests.length - 1} others`
//                   : "See More"}
//             </Text>
//             <Icon 
//               name={showAllPending ? "expand-less" : "expand-more"} 
//               size={20} 
//               color="#D2B48C" 
//             />
//           </TouchableOpacity>
//         </>
//       )}

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Your Friends</Text>
//         <Text style={styles.countBadge}>{friends.length}</Text>
//       </View>
      
//       {friends.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Icon name="people-outline" size={48} color="#D2B48C" />
//           <Text style={styles.emptyText}>No friends yet</Text>
//           <Text style={styles.emptySubtext}>Search for users to add friends</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item.id}
//           scrollEnabled={false}
//           contentContainerStyle={styles.listContent}
//           renderItem={({ item }) => (
//             <View style={styles.userItem}>
//               <View style={styles.userInfo}>
//                 {item.friendProfile?.avatar_url ? (
//                   <Image
//                     source={{ uri: getAvatarUrl(item.friendProfile.avatar_url) }}
//                     style={styles.avatarImage}
//                     onError={(e) => console.log('Image error:', e.nativeEvent.error)}
//                   />
//                 ) : (
//                   <Icon name="person" size={24} color="#D2B48C" style={styles.userIcon} />
//                 )}
//                 <Text style={styles.username}>
//                   {item.friendProfile?.username || "Unknown User"}
//                 </Text>
//               </View>
              
//               <TouchableOpacity 
//                 style={styles.removeButton}
//                 onPress={() => removeFriend(item.id)}
//               >
//                 <Icon name="person-remove" size={20} color="#F44336" />
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 16,
//     backgroundColor: 'black',
//     paddingBottom: 40,
//     minHeight: '100%',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 20,
//     textAlign: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 12,
//     marginTop: 8,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 100,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#333',
//     height: 48,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     color: '#FFF0DC',
//     fontSize: 14,
//     paddingVertical: 0,
//     height: '100%',
//   },
//   hideButton: {
//     borderRadius: 8,
//     marginBottom: 12,
//     alignItems: 'flex-end',
//   },
//   hideButtonText: {
//     color: '#D2B48C',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//   },
//   sectionTitle: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   countBadge: {
//     backgroundColor: '#543A14',
//     color: '#FFF0DC',
//     borderRadius: 10,
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     fontSize: 12,
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   userItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 50,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#333',
//     minHeight: 60,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatarImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     backgroundColor: '#2A2A2A',
//   },
//   userIcon: {
//     marginRight: 10,
//   },
//   username: {
//     fontSize: 15,
//     color: '#FFF0DC',
//     fontWeight: '500',
//     flexShrink: 1,
//   },
//   requestStatus: {
//     fontSize: 11,
//     color: '#888',
//     marginTop: 2,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actionButton: {
//     marginLeft: 8,
//     padding: 4,
//   },
//   addButton: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 18,
//     padding: 5,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 18,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   statusText: {
//     color: '#FFF0DC',
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   removeButton: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 18,
//     padding: 5,
//     borderWidth: 1,
//     borderColor: '#F44336',
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#333',
//     marginTop: 8,
//     marginHorizontal: 16,
//   },
//   emptyText: {
//     color: '#FFF0DC',
//     fontSize: 15,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   emptySubtext: {
//     color: '#888',
//     fontSize: 13,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   seeMoreButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 100,
//     padding: 10,
//     marginTop: 4,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     width: '100%',
//   },
//   seeMoreText: {
//     color: '#D2B48C',
//     marginRight: 6,
//     fontWeight: '500',
//     fontSize: 14,
//   },
// });

import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert, ScrollView, Image 
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
  const [showAllPending, setShowAllPending] = useState(false);
  const [sentRequestIds, setSentRequestIds] = useState(new Set());

  // Function to get public avatar URLs
  function getAvatarUrl(avatarPath) {
    if (!avatarPath) return null;
    return `${supabase.supabaseUrl}/storage/v1/object/public/avatars/${avatarPath}`;
  }

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
      setSentRequestIds(new Set());
      return;
    }
  
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .ilike('username', `${query}%`)
      .neq('id', user.id);
  
    if (error) console.error('Search error:', error);
    setSearchResults(data || []);
    setSentRequestIds(new Set());
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
          sender:profiles!user_id(id, username, avatar_url),
          receiver:profiles!friends_id(id, username, avatar_url)
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
          sender:profiles!user_id(id, username, avatar_url),
          receiver:profiles!friends_id(id, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
  
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
      
      setSentRequestIds(prev => new Set([...prev, friendId]));
      await getPendingRequests();
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

  function getUserStatus(userId) {
    const isFriend = friends.some(friend => friend.friendProfile?.id === userId);
    if (isFriend) return 'friend';
    
    const hasPendingRequest = pendingRequests.some(req => 
      (req.user_id === userId && req.friends_id === user.id) ||
      (req.user_id === user.id && req.friends_id === userId)
    );
    if (hasPendingRequest) return 'pending';
    
    if (sentRequestIds.has(userId)) return 'sent';
    
    return 'none';
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults([]);
    setSentRequestIds(new Set());
  }
  
  const PendingRequestItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        {item.otherUser?.avatar_url ? (
          <Image
            source={{ uri: getAvatarUrl(item.otherUser.avatar_url) }}
            style={styles.avatarImage}
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
          />
        ) : (
          <Icon 
            name={item.isOutgoing ? "person-outline" : "person-add"} 
            size={24} 
            style={{ color: '#D2B48C' }} 
          />
        )}
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
            <Icon name="check" size={20} style={{ color: '#4CAF50' }} />
          </TouchableOpacity>
        )}
        {(item.canCancel || item.canReject) && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => cancelFriendRequest(item.id)}
          >
            <Icon name="close" size={20} style={{ color: '#F44336' }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Friends</Text>

      <View style={styles.inputContainer}>
        <Icon name="search" size={20} style={[styles.icon, { color: '#D2B48C' }]} />
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          placeholderTextColor="#888"
          onChangeText={searchUsers}
          value={searchQuery}
        />
      </View>

      {searchResults.length > 0 && (
        <TouchableOpacity style={styles.hideButton} onPress={clearSearch}>
          <Text style={styles.hideButtonText}>Hide Search Results</Text>
        </TouchableOpacity>
      )}
   
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const userStatus = getUserStatus(item.id);
          return (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                {item.avatar_url ? (
                  <Image
                    source={{ uri: getAvatarUrl(item.avatar_url) }}
                    style={styles.avatarImage}
                    onError={(e) => console.log('Image error:', e.nativeEvent.error)}
                  />
                ) : (
                  <Icon name="person" size={24} style={{ color: '#D2B48C' }} />
                )}
                <Text style={styles.username}>{item.username}</Text>
              </View>
              
              {userStatus === 'friend' ? (
                <View style={styles.statusButton}>
                  <Icon name="check" size={16} style={{ color: '#4CAF50' }} />
                  <Text style={styles.statusText}>Friends</Text>
                </View>
              ) : userStatus === 'pending' ? (
                <View style={styles.statusButton}>
                  <Icon name="schedule" size={16} style={{ color: '#FF9800' }} />
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              ) : userStatus === 'sent' ? (
                <View style={styles.statusButton}>
                  <Icon name="check" size={16} style={{ color: '#4CAF50' }} />
                  <Text style={styles.statusText}>Sent</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => sendFriendRequest(item.id)}
                >
                  <Icon name="person-add" size={20} style={{ color: '#D2B48C' }} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          searchQuery.length > 0 && (
            <Text style={styles.emptyText}>No users found</Text>
          )
        }
      />

      {pendingRequests.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <Text style={styles.countBadge}>{pendingRequests.length}</Text>
          </View>
          
          {!showAllPending && pendingRequests.length > 0 && (
            <PendingRequestItem item={pendingRequests[0]} />
          )}
          
          {showAllPending && (
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <PendingRequestItem item={item} />}
            />
          )}
          
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => setShowAllPending(!showAllPending)}
          >
            <Text style={styles.seeMoreText}>
              {showAllPending 
                ? "Hide Requests" 
                : pendingRequests.length > 1
                  ? `${pendingRequests[0]?.otherUser?.username || 'Someone'} + ${pendingRequests.length - 1} others`
                  : "See More"}
            </Text>
            <Icon 
              name={showAllPending ? "expand-less" : "expand-more"} 
              size={20} 
              style={{ color: '#D2B48C' }} 
            />
          </TouchableOpacity>
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Friends</Text>
        <Text style={styles.countBadge}>{friends.length}</Text>
      </View>
      
      {friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={48} style={{ color: '#D2B48C' }} />
          <Text style={styles.emptyText}>No friends yet</Text>
          <Text style={styles.emptySubtext}>Search for users to add friends</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                {item.friendProfile?.avatar_url ? (
                  <Image
                    source={{ uri: getAvatarUrl(item.friendProfile.avatar_url) }}
                    style={styles.avatarImage}
                    onError={(e) => console.log('Image error:', e.nativeEvent.error)}
                  />
                ) : (
                  <Icon name="person" size={24} style={{ color: '#D2B48C' }} />
                )}
                <Text style={styles.username}>
                  {item.friendProfile?.username || "Unknown User"}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFriend(item.id)}
              >
                <Icon name="person-remove" size={20} style={{ color: '#F44336' }} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: 'black',
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
    paddingBottom: 12,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 100,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFF0DC',
    fontSize: 14,
    paddingVertical: 0,
    height: '100%',
  },
  hideButton: {
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  hideButtonText: {
    color: '#D2B48C',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
  },
  sectionTitle: {
    color: '#FFF0DC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#543A14',
    color: '#FFF0DC',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 60,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#543A14',
    backgroundColor: '#2A2A2A',
  },
  username: {
    fontSize: 15,
    color: '#FFF0DC',
    fontWeight: '500',
    flexShrink: 1,
  },
  requestStatus: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
  addButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 5,
    borderWidth: 1,
    borderColor: '#543A14',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  statusText: {
    color: '#FFF0DC',
    fontSize: 12,
    marginLeft: 4,
  },
  removeButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 5,
    borderWidth: 1,
    borderColor: '#F44336',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 8,
    marginHorizontal: 16,
  },
  emptyText: {
    color: '#FFF0DC',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  seeMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 100,
    padding: 10,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#543A14',
    width: '100%',
  },
  seeMoreText: {
    color: '#D2B48C',
    marginRight: 6,
    fontWeight: '500',
    fontSize: 14,
  },
});