// // // import React, { useEffect, useState } from 'react';
// // // import { 
// // //   View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, FlatList 
// // // } from 'react-native';
// // // import { SwipeListView } from 'react-native-swipe-list-view';
// // // import { supabase } from '../lib/supabase';
// // // import { useNavigation } from '@react-navigation/native';

// // // export default function GroupsScreen() {
// // //   const navigation = useNavigation();
// // //   const [groups, setGroups] = useState([]);
// // //   const [friends, setFriends] = useState([]);
// // //   const [showGroupForm, setShowGroupForm] = useState(false);
// // //   const [newGroupName, setNewGroupName] = useState('');
// // //   const [selectedMembers, setSelectedMembers] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [user, setUser] = useState(null);

// // //   useEffect(() => {
// // //     async function fetchUser() {
// // //       const { data: { user }, error } = await supabase.auth.getUser();
// // //       if (error) console.error('Error fetching user:', error);
// // //       setUser(user);
// // //     }
// // //     fetchUser();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (user) {
// // //       getFriends();
// // //       getGroups();
// // //     }
// // //   }, [user]);

// // //   async function getFriends() {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('friends')
// // //         .select(`
// // //           id,
// // //           user_id,
// // //           friends_id,
// // //           status,
// // //           sender:profiles!user_id(id, username),
// // //           receiver:profiles!friends_id(id, username)
// // //         `)
// // //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// // //         .eq('status', 'accepted');

// // //       if (error) throw error;

// // //       const transformed = data.map((friendship) => ({
// // //         ...friendship,
// // //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// // //       }));

// // //       setFriends(transformed || []);
// // //     } catch (error) {
// // //       console.error('Error fetching friends:', error);
// // //     }
// // //   }

// // //   async function getGroups() {
// // //     setLoading(true);
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('group_members')
// // //         .select(`
// // //           group:groups!group_id (
// // //             id,
// // //             group_name,
// // //             created_by,
// // //             created_at,
// // //             members:group_members!group_id (user:profiles!user_id(id, username))
// // //           )
// // //         `)
// // //         .eq('user_id', user.id);

// // //       if (error) throw error;

// // //       const formattedGroups = data
// // //         .filter(item => item.group !== null)
// // //         .map(item => ({
// // //           ...item.group,
// // //           members: item.group.members.map(m => m.user)
// // //         }));

// // //       setGroups(formattedGroups);
// // //     } catch (error) {
// // //       console.error('Error fetching groups:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function createGroup() {
// // //     if (!newGroupName || selectedMembers.length === 0) {
// // //       Alert.alert('Error', 'Please fill group name and select at least one member');
// // //       return;
// // //     }

// // //     try {
// // //       // Create the group
// // //       const { data: group, error: groupError } = await supabase
// // //         .from('groups')
// // //         .insert([{ 
// // //           group_name: newGroupName,
// // //           created_by: user.id 
// // //         }])
// // //         .select()
// // //         .single();

// // //       if (groupError) throw groupError;

// // //       // Add members (including self) to the group_members table
// // //       const members = [user.id, ...selectedMembers];
// // //       const { error: membersError } = await supabase
// // //         .from('group_members')
// // //         .insert(members.map(user_id => ({
// // //           group_id: group.id,
// // //           user_id
// // //         })));

// // //       if (membersError) throw membersError;

// // //       Alert.alert('Success', 'Group created successfully');
// // //       setShowGroupForm(false);
// // //       setNewGroupName('');
// // //       setSelectedMembers([]);
// // //       await getGroups();
// // //     } catch (error) {
// // //       Alert.alert('Error', error.message || 'Failed to create group');
// // //     }
// // //   }

// // //   const toggleMember = (userId) => {
// // //     setSelectedMembers(prev => 
// // //       prev.includes(userId) 
// // //         ? prev.filter(id => id !== userId) 
// // //         : [...prev, userId]
// // //     );
// // //   };
// // //   const deleteGroup = async (groupId) => {
// // //     Alert.alert(
// // //       "Delete Group",
// // //       "Are you sure you want to delete this group?",
// // //       [
// // //         { text: "Cancel", style: "cancel" },
// // //         { 
// // //           text: "Delete", 
// // //           onPress: async () => {
// // //             try {
// // //               setLoading(true);
              
// // //               // Single delete operation with cascade
// // //               const { error } = await supabase
// // //                 .from('groups')
// // //                 .delete()
// // //                 .eq('id', groupId);

// // //               if (error) throw error;

// // //               // Update local state immediately
// // //               setGroups(prev => prev.filter(g => g.id !== groupId));
              
// // //               // Refresh from server
// // //               await getGroups();
// // //             } catch (error) {
// // //               Alert.alert("Error", error.message);
// // //             } finally {
// // //               setLoading(false);
// // //             }
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <TouchableOpacity
// // //         style={styles.createGroupButton}
// // //         onPress={() => setShowGroupForm(!showGroupForm)}
// // //       >
// // //         <Text style={styles.createGroupButtonText}>
// // //           {showGroupForm ? 'Cancel' : 'Create New Group'}
// // //         </Text>
// // //       </TouchableOpacity>

// // //       {showGroupForm && (
// // //         <View style={styles.groupForm}>
// // //           <TextInput
// // //             style={styles.input}
// // //             placeholder="Group Name"
// // //             placeholderTextColor="#888"
// // //             value={newGroupName}
// // //             onChangeText={setNewGroupName}
// // //           />

// // //           <Text style={styles.membersLabel}>Select Members:</Text>
          
// // //           <FlatList
// // //             data={friends}
// // //             keyExtractor={(item) => item.friendProfile.id}
// // //             renderItem={({ item }) => (
// // //               <TouchableOpacity
// // //                 style={[
// // //                   styles.memberItem,
// // //                   selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
// // //                 ]}
// // //                 onPress={() => toggleMember(item.friendProfile.id)}
// // //               >
// // //                 <Text style={styles.memberName}>
// // //                   {item.friendProfile.username}
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             )}
// // //             style={{ maxHeight: 200 }}
// // //           />

// // //           <TouchableOpacity
// // //             style={styles.submitButton}
// // //             onPress={createGroup}
// // //           >
// // //             <Text style={styles.submitButtonText}>Create Group</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#543A14" />
// // //       ) : (
// // //         <SwipeListView
// // //           data={groups}
// // //           keyExtractor={(item) => item.id}
// // //           renderItem={({ item }) => (
// // //             <View style={styles.groupCard}>
// // //               <View style={styles.groupHeader}>
// // //                 <Text style={styles.groupName}>{item.group_name}</Text>
// // //                 <TouchableOpacity 
// // //                   style={styles.actionButton}
// // //                   onPress={() => navigation.navigate('GroupExp', { 
// // //                     groupId: item.id,
// // //                     members: item.members
// // //                   })}
// // //                 >
// // //                   <Text style={styles.actionText}>Add Expense</Text>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               <View style={styles.subHeader}>
// // //                 <Text style={styles.memberCount}>{item.members.length} members</Text>
// // //                 <TouchableOpacity 
// // //                   style={styles.actionButton}
// // //                   onPress={() => navigation.navigate('GroupHistory', { 
// // //                     groupId: item.id,
// // //                     members: item.members
// // //                   })}
// // //                 >
// // //                   <Text style={styles.actionText}>View Details</Text>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               <View style={styles.memberList}>
// // //                 {item.members.map(member => (
// // //                   <Text key={member.id} style={styles.memberName}>
// // //                     {member.username}
// // //                   </Text>
// // //                 ))}
// // //               </View>
// // //             </View>
// // //           )}
// // //           renderHiddenItem={({ item }) => (
// // //             <View style={styles.rowBack}>
// // //               <TouchableOpacity 
// // //                 style={styles.deleteButton} 
// // //                 onPress={() => deleteGroup(item.id)}
// // //               >
// // //                 <Text style={styles.deleteText}>Delete</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}
// // //           leftOpenValue={0}
// // //           rightOpenValue={-80}
// // //           ListEmptyComponent={
// // //             <Text style={styles.emptyText}>No groups found</Text>
// // //           }
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 16,
// // //     backgroundColor: '#000',
// // //   },
// // //   createGroupButton: {
// // //     backgroundColor: '#543A14',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //     alignItems: 'center',
// // //   },
// // //   createGroupButtonText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //   },
// // //   groupForm: {
// // //     marginBottom: 16,
// // //   },
// // //   input: {
// // //     backgroundColor: '#333',
// // //     color: '#FFF0DC',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 12,
// // //     fontSize: 14,
// // //   },
// // //   membersLabel: {
// // //     color: '#FFF0DC',
// // //     marginBottom: 8,
// // //     fontSize: 14,
// // //     textAlign: 'center'
// // //   },
// // //   groupCard: {
// // //     backgroundColor: '#222',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     marginBottom: 12,
// // //   },
// // //   groupHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 4,
// // //   },
// // //   groupName: {
// // //     color: '#FFF0DC',
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     flex: 1,
// // //   },
// // //   subHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   memberCount: {
// // //     color: '#888',
// // //     fontSize: 14,
// // //   },
// // //   actionButton: {
// // //     backgroundColor: '#333',
// // //     paddingVertical: 6,
// // //     paddingHorizontal: 12,
// // //     borderRadius: 6,
// // //   },
// // //   actionText: {
// // //     color: '#4CAF50',
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //   },
// // //   memberList: {
// // //     marginLeft: 4,
// // //   },
// // //   memberName: {
// // //     color: '#FFF0DC',
// // //     fontSize: 14,
// // //     marginBottom: 2,
// // //   },
// // //   emptyText: {
// // //     color: '#888',
// // //     textAlign: 'center',
// // //     marginTop: 20,
// // //     fontSize: 16,
// // //   },
// // //   memberItem: {
// // //     padding: 10,
// // //     marginVertical: 5,
// // //     borderRadius: 8,
// // //     backgroundColor: '#333',
// // //     borderWidth: 1,
// // //     borderColor: '#444',
// // //   },
// // //   selectedMember: {
// // //     backgroundColor: '#543A14',
// // //     borderColor: '#543A14',
// // //   },
// // //   submitButton: {
// // //     backgroundColor: '#543A14',
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //     marginTop: 12,
// // //   },
// // //   submitButtonText: {
// // //     color: '#FFF0DC',
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //   },
// // //   rowBack: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'flex-end',
// // //     backgroundColor: '#F44336',
// // //     borderRadius: 8,
// // //     marginBottom: 12,
// // //   },
// // //   deleteButton: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     width: 80,
// // //     height: '100%',
// // //   },
// // //   deleteText: {
// // //     color: '#FFF',
// // //     fontWeight: 'bold',
// // //   },
// // // });


// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, FlatList 
// // } from 'react-native';
// // import { SwipeListView } from 'react-native-swipe-list-view';
// // import { supabase } from '../lib/supabase';
// // import { useNavigation } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function GroupsScreen() {
// //   const navigation = useNavigation();
// //   const [groups, setGroups] = useState([]);
// //   const [friends, setFriends] = useState([]);
// //   const [showGroupForm, setShowGroupForm] = useState(false);
// //   const [newGroupName, setNewGroupName] = useState('');
// //   const [selectedMembers, setSelectedMembers] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) console.error('Error fetching user:', error);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) {
// //       getFriends();
// //       getGroups();
// //     }
// //   }, [user]);

// //   async function getFriends() {
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

// //       if (error) throw error;

// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// //       }));

// //       setFriends(transformed || []);
// //     } catch (error) {
// //       console.error('Error fetching friends:', error);
// //     }
// //   }

// //   async function getGroups() {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('group_members')
// //         .select(`
// //           group:groups!group_id (
// //             id,
// //             group_name,
// //             created_by,
// //             created_at,
// //             members:group_members!group_id (user:profiles!user_id(id, username))
// //           )
// //         `)
// //         .eq('user_id', user.id);

// //       if (error) throw error;

// //       const formattedGroups = data
// //         .filter(item => item.group !== null)
// //         .map(item => ({
// //           ...item.group,
// //           members: item.group.members.map(m => m.user)
// //         }));

// //       setGroups(formattedGroups);
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function createGroup() {
// //     if (!newGroupName || selectedMembers.length === 0) {
// //       Alert.alert('Error', 'Please fill group name and select at least one member');
// //       return;
// //     }

// //     try {
// //       const { data: group, error: groupError } = await supabase
// //         .from('groups')
// //         .insert([{ 
// //           group_name: newGroupName,
// //           created_by: user.id 
// //         }])
// //         .select()
// //         .single();

// //       if (groupError) throw groupError;

// //       const members = [user.id, ...selectedMembers];
// //       const { error: membersError } = await supabase
// //         .from('group_members')
// //         .insert(members.map(user_id => ({
// //           group_id: group.id,
// //           user_id
// //         })));

// //       if (membersError) throw membersError;

// //       Alert.alert('Success', 'Group created successfully');
// //       setShowGroupForm(false);
// //       setNewGroupName('');
// //       setSelectedMembers([]);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to create group');
// //     }
// //   }

// //   const toggleMember = (userId) => {
// //     setSelectedMembers(prev => 
// //       prev.includes(userId) 
// //         ? prev.filter(id => id !== userId) 
// //         : [...prev, userId]
// //     );
// //   };

// //   const deleteGroup = async (groupId) => {
// //     Alert.alert(
// //       "Delete Group",
// //       "Are you sure you want to delete this group?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Delete", 
// //           onPress: async () => {
// //             try {
// //               setLoading(true);
              
// //               const { error } = await supabase
// //                 .from('groups')
// //                 .delete()
// //                 .eq('id', groupId);

// //               if (error) throw error;

// //               setGroups(prev => prev.filter(g => g.id !== groupId));
// //               await getGroups();
// //             } catch (error) {
// //               Alert.alert("Error", error.message);
// //             } finally {
// //               setLoading(false);
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity
// //         style={styles.createGroupButton}
// //         onPress={() => setShowGroupForm(!showGroupForm)}
// //       >
// //         <Text style={styles.createGroupButtonText}>
// //           {showGroupForm ? 'Cancel' : 'Create New Group'}
// //         </Text>
// //       </TouchableOpacity>

// //       {showGroupForm && (
// //         <View style={styles.groupForm}>
// //           <View style={styles.inputContainer}>
// //             <Icon name="group" size={20} color="#D2B48C" style={styles.icon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Group Name"
// //               placeholderTextColor="#888"
// //               value={newGroupName}
// //               onChangeText={setNewGroupName}
// //             />
// //           </View>

// //           <Text style={styles.sectionTitle}>Select Members:</Text>
          
// //           <FlatList
// //             data={friends}
// //             keyExtractor={(item) => item.friendProfile.id}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={[
// //                   styles.memberItem,
// //                   selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
// //                 ]}
// //                 onPress={() => toggleMember(item.friendProfile.id)}
// //               >
// //                 <View style={styles.memberInfo}>
// //                   <Icon 
// //                     name={selectedMembers.includes(item.friendProfile.id) ? "check-box" : "check-box-outline-blank"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                     style={styles.userIcon} 
// //                   />
// //                   <Text style={styles.memberText}>{item.friendProfile.username}</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             )}
// //             style={{ maxHeight: 200 }}
// //           />

// //           <TouchableOpacity
// //             style={styles.submitButton}
// //             onPress={createGroup}
// //           >
// //             <Text style={styles.submitText}>Create Group</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       ) : (
// //         <SwipeListView
// //           data={groups}
// //           keyExtractor={(item) => item.id}
// //           renderItem={({ item }) => (
// //             <View style={styles.groupCard}>
// //               <View style={styles.groupHeader}>
// //                 <Text style={styles.groupName}>{item.group_name}</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupExp', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>Add Expense</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.subHeader}>
// //                 <Text style={styles.memberCount}>{item.members.length} members</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupHistory', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>View Details</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.memberList}>
// //                 {item.members.map(member => (
// //                   <Text key={member.id} style={styles.memberName}>
// //                     {member.username}
// //                   </Text>
// //                 ))}
// //               </View>
// //             </View>
// //           )}
// //           renderHiddenItem={({ item }) => (
// //             <View style={styles.rowBack}>
// //               <TouchableOpacity 
// //                 style={styles.deleteButton} 
// //                 onPress={() => deleteGroup(item.id)}
// //               >
// //                 <Text style={styles.deleteText}>Delete</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //           leftOpenValue={0}
// //           rightOpenValue={-80}
// //           ListEmptyComponent={
// //             <Text style={styles.emptyText}>No groups found</Text>
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: 'black',
// //   },
// //   createGroupButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   createGroupButtonText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   groupForm: {
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     paddingVertical: 12,
// //     fontSize: 16,
// //   },
// //   sectionTitle: {
// //     color: '#D2B48C',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //     marginTop: 5,
// //   },
// //   memberItem: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   selectedMember: {
// //     backgroundColor: '#1E2E1A',
// //     borderColor: '#4CAF50',
// //   },
// //   memberInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   userIcon: {
// //     marginRight: 12,
// //   },
// //   memberText: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //   },
// //   submitButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginTop: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   submitText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   groupCard: {
// //     backgroundColor: '#1E1E1E',
// //     padding: 16,
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   groupHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   groupName: {
// //     color: '#FFF0DC',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   subHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   memberCount: {
// //     color: '#888',
// //     fontSize: 14,
// //   },
// //   actionButton: {
// //     backgroundColor: '#333',
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   actionText: {
// //     color: '#D2B48C',
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },
// //   memberList: {
// //     marginLeft: 4,
// //   },
// //   memberName: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     marginBottom: 2,
// //   },
// //   emptyText: {
// //     color: '#888',
// //     textAlign: 'center',
// //     marginTop: 20,
// //     fontSize: 16,
// //   },
// //   rowBack: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //     backgroundColor: '#F44336',
// //     borderRadius: 8,
// //     marginBottom: 12,
// //   },
// //   deleteButton: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: 80,
// //     height: '100%',
// //   },
// //   deleteText: {
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //   },
// // });

// //ok working after git 
// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, 
// //   StyleSheet, FlatList, Modal 
// // } from 'react-native';
// // import { SwipeListView } from 'react-native-swipe-list-view';
// // import { supabase } from '../lib/supabase';
// // import { useNavigation } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function GroupsScreen() {
// //   const navigation = useNavigation();
// //   const [groups, setGroups] = useState([]);
// //   const [friends, setFriends] = useState([]);
// //   const [showGroupForm, setShowGroupForm] = useState(false);
// //   const [newGroupName, setNewGroupName] = useState('');
// //   const [selectedMembers, setSelectedMembers] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
  
// //   // State for group management modal
// //   const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
// //   const [selectedGroup, setSelectedGroup] = useState(null);
// //   const [groupFriends, setGroupFriends] = useState([]);
// //   const [groupNonMembers, setGroupNonMembers] = useState([]);
// //   const [friendsToAdd, setFriendsToAdd] = useState([]);
// //   const [friendsToDelete, setFriendsToDelete] = useState([]);

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) console.error('Error fetching user:', error);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) {
// //       getFriends();
// //       getGroups();
// //     }
// //   }, [user]);

// //   async function getFriends() {
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

// //       if (error) throw error;

// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// //       }));

// //       setFriends(transformed || []);
// //     } catch (error) {
// //       console.error('Error fetching friends:', error);
// //     }
// //   }

// //   async function getGroups() {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('group_members')
// //         .select(`
// //           group:groups!group_id (
// //             id,
// //             group_name,
// //             created_by,
// //             created_at,
// //             members:group_members!group_id (user:profiles!user_id(id, username))
// //           )
// //         `)
// //         .eq('user_id', user.id);

// //       if (error) throw error;

// //       const formattedGroups = data
// //         .filter(item => item.group !== null)
// //         .map(item => ({
// //           ...item.group,
// //           members: item.group.members.map(m => m.user)
// //         }));

// //       setGroups(formattedGroups);
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function createGroup() {
// //     if (!newGroupName || selectedMembers.length === 0) {
// //       Alert.alert('Error', 'Please fill group name and select at least one member');
// //       return;
// //     }

// //     try {
// //       const { data: group, error: groupError } = await supabase
// //         .from('groups')
// //         .insert([{ 
// //           group_name: newGroupName,
// //           created_by: user.id 
// //         }])
// //         .select()
// //         .single();

// //       if (groupError) throw groupError;

// //       const members = [user.id, ...selectedMembers];
// //       const { error: membersError } = await supabase
// //         .from('group_members')
// //         .insert(members.map(user_id => ({
// //           group_id: group.id,
// //           user_id
// //         })));

// //       if (membersError) throw membersError;

// //       Alert.alert('Success', 'Group created successfully');
// //       setShowGroupForm(false);
// //       setNewGroupName('');
// //       setSelectedMembers([]);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to create group');
// //     }
// //   }

// //   const toggleMember = (userId) => {
// //     setSelectedMembers(prev => 
// //       prev.includes(userId) 
// //         ? prev.filter(id => id !== userId) 
// //         : [...prev, userId]
// //     );
// //   };

// //   const deleteGroup = async (groupId) => {
// //     Alert.alert(
// //       "Delete Group",
// //       "Are you sure you want to delete this group?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Delete", 
// //           onPress: async () => {
// //             try {
// //               setLoading(true);
// //               const { error } = await supabase
// //                 .from('groups')
// //                 .delete()
// //                 .eq('id', groupId);
// //               if (error) throw error;
// //               setGroups(prev => prev.filter(g => g.id !== groupId));
// //               await getGroups();
// //             } catch (error) {
// //               Alert.alert("Error", error.message);
// //             } finally {
// //               setLoading(false);
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // Prepare group management data
// //   const prepareGroupManagement = async (group) => {
// //     setSelectedGroup(group);
    
// //     // Get current group members
// //     const currentMemberIds = group.members.map(m => m.id);
    
// //     // Filter friends who are not in the group
// //     const nonMembers = friends.filter(
// //       f => !currentMemberIds.includes(f.friendProfile.id)
// //     );
    
// //     // Friends already in the group (excluding current user)
// //     const groupFriends = friends.filter(
// //       f => currentMemberIds.includes(f.friendProfile.id) && 
// //            f.friendProfile.id !== user.id
// //     );

// //     setGroupFriends(groupFriends);
// //     setGroupNonMembers(nonMembers);
// //     setFriendsToAdd([]);
// //     setFriendsToDelete([]);
// //     setIsGroupModalVisible(true);
// //   };

// //   // Add friends to group
// //   const addFriendsToGroup = async () => {
// //     if (friendsToAdd.length === 0) {
// //       Alert.alert('Info', 'Please select friends to add');
// //       return;
// //     }
    
// //     try {
// //       const newMembers = friendsToAdd.map(user_id => ({
// //         group_id: selectedGroup.id,
// //         user_id
// //       }));

// //       const { error } = await supabase
// //         .from('group_members')
// //         .insert(newMembers);

// //       if (error) throw error;

// //       Alert.alert('Success', 'Friends added to group');
// //       setIsGroupModalVisible(false);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to add friends');
// //     }
// //   };

// //   // Remove friends from group
// //   const removeFriendsFromGroup = async () => {
// //     if (friendsToDelete.length === 0) {
// //       Alert.alert('Info', 'Please select friends to remove');
// //       return;
// //     }
    
// //     try {
// //       const { error } = await supabase
// //         .from('group_members')
// //         .delete()
// //         .in('user_id', friendsToDelete)
// //         .eq('group_id', selectedGroup.id);

// //       if (error) throw error;

// //       Alert.alert('Success', 'Friends removed from group');
// //       setIsGroupModalVisible(false);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to remove friends');
// //     }
// //   };

// //   // Toggle friend selection for adding
// //   const toggleAddFriend = (friendId) => {
// //     setFriendsToAdd(prev => 
// //       prev.includes(friendId) 
// //         ? prev.filter(id => id !== friendId) 
// //         : [...prev, friendId]
// //     );
// //   };

// //   // Toggle friend selection for deletion
// //   const toggleDeleteFriend = (friendId) => {
// //     setFriendsToDelete(prev => 
// //       prev.includes(friendId) 
// //         ? prev.filter(id => id !== friendId) 
// //         : [...prev, friendId]
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity
// //         style={styles.createGroupButton}
// //         onPress={() => setShowGroupForm(!showGroupForm)}
// //       >
// //         <Text style={styles.createGroupButtonText}>
// //           {showGroupForm ? 'Cancel' : 'Create New Group'}
// //         </Text>
// //       </TouchableOpacity>

// //       {showGroupForm && (
// //         <View style={styles.groupForm}>
// //           <View style={styles.inputContainer}>
// //             <Icon name="group" size={20} color="#D2B48C" style={styles.icon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Group Name"
// //               placeholderTextColor="#888"
// //               value={newGroupName}
// //               onChangeText={setNewGroupName}
// //             />
// //           </View>

// //           <Text style={styles.sectionTitle}>Select Members:</Text>
          
// //           <FlatList
// //             data={friends}
// //             keyExtractor={(item) => item.friendProfile.id}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={[
// //                   styles.memberItem,
// //                   selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
// //                 ]}
// //                 onPress={() => toggleMember(item.friendProfile.id)}
// //               >
// //                 <View style={styles.memberInfo}>
// //                   <Icon 
// //                     name={selectedMembers.includes(item.friendProfile.id) ? "check-box" : "check-box-outline-blank"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                     style={styles.userIcon} 
// //                   />
// //                   <Text style={styles.memberText}>{item.friendProfile.username}</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             )}
// //             style={{ maxHeight: 200 }}
// //           />

// //           <TouchableOpacity
// //             style={styles.submitButton}
// //             onPress={createGroup}
// //           >
// //             <Text style={styles.submitText}>Create Group</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Group Management Modal */}
// //       <Modal
// //         visible={isGroupModalVisible}
// //         transparent={true}
// //         animationType="slide"
// //         onRequestClose={() => setIsGroupModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>
// //               Manage {selectedGroup?.group_name}
// //             </Text>
            
// //             {/* Add Friends Section */}
// //             <Text style={styles.sectionTitle}>Add Friends:</Text>
// //             {groupNonMembers.length > 0 ? (
// //               <FlatList
// //                 data={groupNonMembers}
// //                 keyExtractor={(item) => item.friendProfile.id}
// //                 renderItem={({ item }) => (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.memberItem,
// //                       friendsToAdd.includes(item.friendProfile.id) && styles.selectedMember
// //                     ]}
// //                     onPress={() => toggleAddFriend(item.friendProfile.id)}
// //                   >
// //                     <View style={styles.memberInfo}>
// //                       <Icon 
// //                         name={friendsToAdd.includes(item.friendProfile.id) 
// //                           ? "check-box" : "check-box-outline-blank"} 
// //                         size={24} 
// //                         color="#D2B48C" 
// //                       />
// //                       <Text style={styles.memberText}>
// //                         {item.friendProfile.username}
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>
// //                 )}
// //                 style={styles.modalList}
// //               />
// //             ) : (
// //               <Text style={styles.emptyText}>No friends to add</Text>
// //             )}
            
// //             {/* Delete Friends Section */}
// //             <Text style={styles.sectionTitle}>Remove Friends:</Text>
// //             {groupFriends.length > 0 ? (
// //               <FlatList
// //                 data={groupFriends}
// //                 keyExtractor={(item) => item.friendProfile.id}
// //                 renderItem={({ item }) => (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.memberItem,
// //                       friendsToDelete.includes(item.friendProfile.id) && styles.selectedDelete
// //                     ]}
// //                     onPress={() => toggleDeleteFriend(item.friendProfile.id)}
// //                   >
// //                     <View style={styles.memberInfo}>
// //                       <Icon 
// //                         name={friendsToDelete.includes(item.friendProfile.id) 
// //                           ? "check-box" : "check-box-outline-blank"} 
// //                         size={24} 
// //                         color="#F44336" 
// //                       />
// //                       <Text style={styles.memberText}>
// //                         {item.friendProfile.username}
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>
// //                 )}
// //                 style={styles.modalList}
// //               />
// //             ) : (
// //               <Text style={styles.emptyText}>No friends to remove</Text>
// //             )}

// //             {/* Action Buttons */}
// //             <View style={styles.modalActions}>
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.addButton]}
// //                 onPress={addFriendsToGroup}
// //                 disabled={friendsToAdd.length === 0}
// //               >
// //                 <Text style={styles.buttonText}>Add Selected</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.deleteButton]}
// //                 onPress={removeFriendsFromGroup}
// //                 disabled={friendsToDelete.length === 0}
// //               >
// //                 <Text style={styles.buttonText}>Remove Selected</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.cancelButton]}
// //                 onPress={() => setIsGroupModalVisible(false)}
// //               >
// //                 <Text style={styles.buttonText}>Close</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       ) : (
// //         <SwipeListView
// //           data={groups}
// //           keyExtractor={(item) => item.id}
// //           renderItem={({ item }) => (
// //             <View style={styles.groupCard}>
// //               <View style={styles.groupHeader}>
// //                 <Text style={styles.groupName}>{item.group_name}</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupExp', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>Add Expense</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.subHeader}>
// //                 <Text style={styles.memberCount}>{item.members.length} members</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupHistory', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>View Details</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.memberList}>
// //                 {item.members.map(member => (
// //                   <Text key={member.id} style={styles.memberName}>
// //                     {member.username}
// //                   </Text>
// //                 ))}
// //               </View>

// //               {/* Settings Icon */}
              
// //             </View>
// //           )}
// //           renderHiddenItem={({ item }) => (
// //             <View style={styles.rowBack}>
// //               <TouchableOpacity 
// //                 style={styles.deleteButton} 
// //                 onPress={() => deleteGroup(item.id)}
// //               >
// //                 <Text style={styles.deleteText}>Delete</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //           leftOpenValue={0}
// //           rightOpenValue={-80}
// //           ListEmptyComponent={
// //             <Text style={styles.emptyText}>No groups found</Text>
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: 'black',
// //   },
// //   createGroupButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   createGroupButtonText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   groupForm: {
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     paddingVertical: 12,
// //     fontSize: 16,
// //   },
// //   sectionTitle: {
// //     color: '#D2B48C',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //     marginTop: 5,
// //   },
// //   memberItem: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   selectedMember: {
// //     backgroundColor: '#1E2E1A',
// //     borderColor: '#4CAF50',
// //   },
// //   selectedDelete: {
// //     backgroundColor: '#2E1E1E',
// //     borderColor: '#F44336',
// //   },
// //   memberInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   userIcon: {
// //     marginRight: 12,
// //   },
// //   memberText: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //   },
// //   submitButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginTop: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   submitText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   groupCard: {
// //     position: 'relative',
// //     backgroundColor: '#1E1E1E',
// //     padding: 16,
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   groupHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   groupName: {
// //     color: '#FFF0DC',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   subHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   memberCount: {
// //     color: '#888',
// //     fontSize: 14,
// //   },
// //   actionButton: {
// //     backgroundColor: '#333',
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   actionText: {
// //     color: '#D2B48C',
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },
// //   memberList: {
// //     marginLeft: 4,
// //     paddingTop: 8,
// //   },
// //   memberName: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     marginBottom: 2,
// //   },
// //   settingsContainer: {
// //     position: 'absolute',
// //     right: 12,
// //     bottom: 12,
// //   },
// //   emptyText: {
// //     color: '#888',
// //     textAlign: 'center',
// //     marginTop: 20,
// //     fontSize: 16,
// //   },
// //   rowBack: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //     backgroundColor: '#F44336',
// //     borderRadius: 8,
// //     marginBottom: 12,
// //   },
// //   deleteButton: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: 80,
// //     height: '100%',
// //   },
// //   deleteText: {
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //   },
  
// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     backgroundColor: '#2A2A2A',
// //     borderRadius: 15,
// //     padding: 20,
// //     width: '90%',
// //     maxHeight: '80%',
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   modalTitle: {
// //     color: '#D2B48C',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 15,
// //   },
// //   modalList: {
// //     maxHeight: 150,
// //     marginBottom: 10,
// //   },
// //   modalActions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: 10,
// //     flexWrap: 'wrap',
// //   },
// //   modalButton: {
// //     padding: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     minWidth: '30%',
// //     marginVertical: 5,
// //   },
// //   addButton: {
// //     backgroundColor: '#4CAF50',
// //   },
// //   deleteButton: {
// //     backgroundColor: '#F44336',
// //   },
// //   cancelButton: {
// //     backgroundColor: '#333',
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// // });


// //LAUNCH DAY 
// // import React, { useEffect, useState } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, 
// //   StyleSheet, FlatList, Modal, ScrollView, RefreshControl
// // } from 'react-native';
// // import { SwipeListView } from 'react-native-swipe-list-view';
// // import { supabase } from '../lib/supabase';
// // import { useNavigation } from '@react-navigation/native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // export default function GroupsScreen() {
// //   const navigation = useNavigation();
// //   const [groups, setGroups] = useState([]);
// //   const [friends, setFriends] = useState([]);
// //   const [showGroupForm, setShowGroupForm] = useState(false);
// //   const [newGroupName, setNewGroupName] = useState('');
// //   const [selectedMembers, setSelectedMembers] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [refreshing, setRefreshing] = useState(false); // Added for pull-to-refresh
  
// //   // State for group management modal
// //   const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
// //   const [selectedGroup, setSelectedGroup] = useState(null);
// //   const [groupFriends, setGroupFriends] = useState([]);
// //   const [groupNonMembers, setGroupNonMembers] = useState([]);
// //   const [friendsToAdd, setFriendsToAdd] = useState([]);
// //   const [friendsToDelete, setFriendsToDelete] = useState([]);

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) console.error('Error fetching user:', error);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) {
// //       getFriends();
// //       getGroups();
// //     }
// //   }, [user]);

// //   // Pull-to-refresh handler
// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     try {
// //       await Promise.all([
// //         getGroups(true),  // Pass true to indicate it's a refresh
// //         getFriends()
// //       ]);
// //     } catch (error) {
// //       console.error('Refresh error:', error);
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   async function getFriends() {
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

// //       if (error) throw error;

// //       const transformed = data.map((friendship) => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// //       }));

// //       setFriends(transformed || []);
// //     } catch (error) {
// //       console.error('Error fetching friends:', error);
// //     }
// //   }

// //   async function getGroups(isRefresh = false) {
// //     if (!isRefresh) setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('group_members')
// //         .select(`
// //           group:groups!group_id (
// //             id,
// //             group_name,
// //             created_by,
// //             created_at,
// //             members:group_members!group_id (user:profiles!user_id(id, username))
// //           )
// //         `)
// //         .eq('user_id', user.id);

// //       if (error) throw error;

// //       const formattedGroups = data
// //         .filter(item => item.group !== null)
// //         .map(item => ({
// //           ...item.group,
// //           members: item.group.members.map(m => m.user)
// //         }));

// //       setGroups(formattedGroups);
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //     } finally {
// //       if (!isRefresh) setLoading(false);
// //     }
// //   }

// //   async function createGroup() {
// //     if (!newGroupName || selectedMembers.length === 0) {
// //       Alert.alert('Error', 'Please fill group name and select at least one member');
// //       return;
// //     }

// //     try {
// //       const { data: group, error: groupError } = await supabase
// //         .from('groups')
// //         .insert([{ 
// //           group_name: newGroupName,
// //           created_by: user.id 
// //         }])
// //         .select()
// //         .single();

// //       if (groupError) throw groupError;

// //       const members = [user.id, ...selectedMembers];
// //       const { error: membersError } = await supabase
// //         .from('group_members')
// //         .insert(members.map(user_id => ({
// //           group_id: group.id,
// //           user_id
// //         })));

// //       if (membersError) throw membersError;

// //       Alert.alert('Success', 'Group created successfully');
// //       setShowGroupForm(false);
// //       setNewGroupName('');
// //       setSelectedMembers([]);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to create group');
// //     }
// //   }

// //   const toggleMember = (userId) => {
// //     setSelectedMembers(prev => 
// //       prev.includes(userId) 
// //         ? prev.filter(id => id !== userId) 
// //         : [...prev, userId]
// //     );
// //   };

// //   const deleteGroup = async (groupId) => {
// //     Alert.alert(
// //       "Delete Group",
// //       "Are you sure you want to delete this group?",
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { 
// //           text: "Delete", 
// //           onPress: async () => {
// //             try {
// //               setLoading(true);
// //               const { error } = await supabase
// //                 .from('groups')
// //                 .delete()
// //                 .eq('id', groupId);
// //               if (error) throw error;
// //               setGroups(prev => prev.filter(g => g.id !== groupId));
// //               await getGroups();
// //             } catch (error) {
// //               Alert.alert("Error", error.message);
// //             } finally {
// //               setLoading(false);
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // Prepare group management data
// //   const prepareGroupManagement = async (group) => {
// //     setSelectedGroup(group);
    
// //     // Get current group members
// //     const currentMemberIds = group.members.map(m => m.id);
    
// //     // Filter friends who are not in the group
// //     const nonMembers = friends.filter(
// //       f => !currentMemberIds.includes(f.friendProfile.id)
// //     );
    
// //     // Friends already in the group (excluding current user)
// //     const groupFriends = friends.filter(
// //       f => currentMemberIds.includes(f.friendProfile.id) && 
// //            f.friendProfile.id !== user.id
// //     );

// //     setGroupFriends(groupFriends);
// //     setGroupNonMembers(nonMembers);
// //     setFriendsToAdd([]);
// //     setFriendsToDelete([]);
// //     setIsGroupModalVisible(true);
// //   };

// //   // Add friends to group
// //   const addFriendsToGroup = async () => {
// //     if (friendsToAdd.length === 0) {
// //       Alert.alert('Info', 'Please select friends to add');
// //       return;
// //     }
    
// //     try {
// //       const newMembers = friendsToAdd.map(user_id => ({
// //         group_id: selectedGroup.id,
// //         user_id
// //       }));

// //       const { error } = await supabase
// //         .from('group_members')
// //         .insert(newMembers);

// //       if (error) throw error;

// //       Alert.alert('Success', 'Friends added to group');
// //       setIsGroupModalVisible(false);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to add friends');
// //     }
// //   };

// //   // Remove friends from group
// //   const removeFriendsFromGroup = async () => {
// //     if (friendsToDelete.length === 0) {
// //       Alert.alert('Info', 'Please select friends to remove');
// //       return;
// //     }
    
// //     try {
// //       const { error } = await supabase
// //         .from('group_members')
// //         .delete()
// //         .in('user_id', friendsToDelete)
// //         .eq('group_id', selectedGroup.id);

// //       if (error) throw error;

// //       Alert.alert('Success', 'Friends removed from group');
// //       setIsGroupModalVisible(false);
// //       await getGroups();
// //     } catch (error) {
// //       Alert.alert('Error', error.message || 'Failed to remove friends');
// //     }
// //   };

// //   // Toggle friend selection for adding
// //   const toggleAddFriend = (friendId) => {
// //     setFriendsToAdd(prev => 
// //       prev.includes(friendId) 
// //         ? prev.filter(id => id !== friendId) 
// //         : [...prev, friendId]
// //     );
// //   };

// //   // Toggle friend selection for deletion
// //   const toggleDeleteFriend = (friendId) => {
// //     setFriendsToDelete(prev => 
// //       prev.includes(friendId) 
// //         ? prev.filter(id => id !== friendId) 
// //         : [...prev, friendId]
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity
// //         style={styles.createGroupButton}
// //         onPress={() => setShowGroupForm(!showGroupForm)}
// //       >
// //         <Text style={styles.createGroupButtonText}>
// //           {showGroupForm ? 'Cancel' : 'Create New Group'}
// //         </Text>
// //       </TouchableOpacity>

// //       {showGroupForm && (
// //         <View style={styles.groupForm}>
// //           <View style={styles.inputContainer}>
// //             <Icon name="group" size={20} color="#D2B48C" style={styles.icon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Group Name"
// //               placeholderTextColor="#888"
// //               value={newGroupName}
// //               onChangeText={setNewGroupName}
// //             />
// //           </View>

// //           <Text style={styles.sectionTitle}>Select Members:</Text>
          
// //           <FlatList
// //             data={friends}
// //             keyExtractor={(item) => item.friendProfile.id}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={[
// //                   styles.memberItem,
// //                   selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
// //                 ]}
// //                 onPress={() => toggleMember(item.friendProfile.id)}
// //               >
// //                 <View style={styles.memberInfo}>
// //                   <Icon 
// //                     name={selectedMembers.includes(item.friendProfile.id) ? "check-box" : "check-box-outline-blank"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                     style={styles.userIcon} 
// //                   />
// //                   <Text style={styles.memberText}>{item.friendProfile.username}</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             )}
// //             style={{ maxHeight: 200 }}
// //           />

// //           <TouchableOpacity
// //             style={styles.submitButton}
// //             onPress={createGroup}
// //           >
// //             <Text style={styles.submitText}>Create Group</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Group Management Modal */}
// //       <Modal
// //         visible={isGroupModalVisible}
// //         transparent={true}
// //         animationType="slide"
// //         onRequestClose={() => setIsGroupModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>
// //               Manage {selectedGroup?.group_name}
// //             </Text>
            
// //             {/* Add Friends Section */}
// //             <Text style={styles.sectionTitle}>Add Friends:</Text>
// //             {groupNonMembers.length > 0 ? (
// //               <FlatList
// //                 data={groupNonMembers}
// //                 keyExtractor={(item) => item.friendProfile.id}
// //                 renderItem={({ item }) => (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.memberItem,
// //                       friendsToAdd.includes(item.friendProfile.id) && styles.selectedMember
// //                     ]}
// //                     onPress={() => toggleAddFriend(item.friendProfile.id)}
// //                   >
// //                     <View style={styles.memberInfo}>
// //                       <Icon 
// //                         name={friendsToAdd.includes(item.friendProfile.id) 
// //                           ? "check-box" : "check-box-outline-blank"} 
// //                         size={24} 
// //                         color="#D2B48C" 
// //                       />
// //                       <Text style={styles.memberText}>
// //                         {item.friendProfile.username}
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>
// //                 )}
// //                 style={styles.modalList}
// //               />
// //             ) : (
// //               <Text style={styles.emptyText}>No friends to add</Text>
// //             )}
            
// //             {/* Delete Friends Section */}
// //             <Text style={styles.sectionTitle}>Remove Friends:</Text>
// //             {groupFriends.length > 0 ? (
// //               <FlatList
// //                 data={groupFriends}
// //                 keyExtractor={(item) => item.friendProfile.id}
// //                 renderItem={({ item }) => (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.memberItem,
// //                       friendsToDelete.includes(item.friendProfile.id) && styles.selectedDelete
// //                     ]}
// //                     onPress={() => toggleDeleteFriend(item.friendProfile.id)}
// //                   >
// //                     <View style={styles.memberInfo}>
// //                       <Icon 
// //                         name={friendsToDelete.includes(item.friendProfile.id) 
// //                           ? "check-box" : "check-box-outline-blank"} 
// //                         size={24} 
// //                         color="#F44336" 
// //                       />
// //                       <Text style={styles.memberText}>
// //                         {item.friendProfile.username}
// //                       </Text>
// //                     </View>
// //                   </TouchableOpacity>
// //                 )}
// //                 style={styles.modalList}
// //               />
// //             ) : (
// //               <Text style={styles.emptyText}>No friends to remove</Text>
// //             )}

// //             {/* Action Buttons */}
// //             <View style={styles.modalActions}>
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.addButton]}
// //                 onPress={addFriendsToGroup}
// //                 disabled={friendsToAdd.length === 0}
// //               >
// //                 <Text style={styles.buttonText}>Add Selected</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.deleteButton]}
// //                 onPress={removeFriendsFromGroup}
// //                 disabled={friendsToDelete.length === 0}
// //               >
// //                 <Text style={styles.buttonText}>Remove Selected</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.cancelButton]}
// //                 onPress={() => setIsGroupModalVisible(false)}
// //               >
// //                 <Text style={styles.buttonText}>Close</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#D2B48C" />
// //       ) : groups.length === 0 ? (
// //         <ScrollView
// //           contentContainerStyle={styles.emptyContainer}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               colors={['#D2B48C']}
// //               tintColor="#D2B48C"
// //               title="Pull to refresh"
// //               titleColor="#D2B48C"
// //             />
// //           }
// //         >
// //           <Text style={styles.emptyText}>No groups found</Text>
// //           <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
// //         </ScrollView>
// //       ) : (
// //         <SwipeListView
// //           data={groups}
// //           keyExtractor={(item) => item.id}
// //           renderItem={({ item }) => (
// //             <View style={styles.groupCard}>
// //               <View style={styles.groupHeader}>
// //                 <Text style={styles.groupName}>{item.group_name}</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupExp', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>Add Expense</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.subHeader}>
// //                 <Text style={styles.memberCount}>{item.members.length} members</Text>
// //                 <TouchableOpacity 
// //                   style={styles.actionButton}
// //                   onPress={() => navigation.navigate('GroupHistory', { 
// //                     groupId: item.id,
// //                     members: item.members
// //                   })}
// //                 >
// //                   <Text style={styles.actionText}>View Details</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.memberList}>
// //                 {item.members.map(member => (
// //                   <Text key={member.id} style={styles.memberName}>
// //                     {member.username}
// //                   </Text>
// //                 ))}
// //               </View>
// //             </View>
// //           )}
// //           renderHiddenItem={({ item }) => (
// //             <View style={styles.rowBack}>
// //               <TouchableOpacity 
// //                 style={styles.deleteButton} 
// //                 onPress={() => deleteGroup(item.id)}
// //               >
// //                 <Text style={styles.deleteText}>Delete</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //           leftOpenValue={0}
// //           rightOpenValue={-80}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               colors={['#D2B48C']}
// //               tintColor="#D2B48C"
// //               title="Pull to refresh"
// //               titleColor="#D2B48C"
// //             />
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: 'black',
// //   },
// //   createGroupButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   createGroupButtonText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   groupForm: {
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     paddingVertical: 12,
// //     fontSize: 16,
// //   },
// //   sectionTitle: {
// //     color: '#D2B48C',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginBottom: 10,
// //     marginTop: 5,
// //   },
// //   memberItem: {
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   selectedMember: {
// //     backgroundColor: '#1E2E1A',
// //     borderColor: '#4CAF50',
// //   },
// //   selectedDelete: {
// //     backgroundColor: '#2E1E1E',
// //     borderColor: '#F44336',
// //   },
// //   memberInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   userIcon: {
// //     marginRight: 12,
// //   },
// //   memberText: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //   },
// //   submitButton: {
// //     backgroundColor: '#543A14',
// //     borderRadius: 10,
// //     padding: 16,
// //     alignItems: 'center',
// //     marginTop: 20,
// //     borderWidth: 1,
// //     borderColor: '#D2B48C',
// //   },
// //   submitText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   groupCard: {
// //     position: 'relative',
// //     backgroundColor: '#1E1E1E',
// //     padding: 16,
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   groupHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   groupName: {
// //     color: '#FFF0DC',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     flex: 1,
// //   },
// //   subHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   memberCount: {
// //     color: '#888',
// //     fontSize: 14,
// //   },
// //   actionButton: {
// //     backgroundColor: '#333',
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   actionText: {
// //     color: '#D2B48C',
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },
// //   memberList: {
// //     marginLeft: 4,
// //     paddingTop: 8,
// //   },
// //   memberName: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     marginBottom: 2,
// //   },
// //   settingsContainer: {
// //     position: 'absolute',
// //     right: 12,
// //     bottom: 12,
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
// //     marginTop: 20,
// //     fontSize: 16,
// //   },
// //   pullRefreshHint: {
// //     fontSize: 14,
// //     color: '#888',
// //     marginTop: 8,
// //   },
// //   rowBack: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //     backgroundColor: '#F44336',
// //     borderRadius: 8,
// //     marginBottom: 12,
// //   },
// //   deleteButton: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: 80,
// //     height: '100%',
// //   },
// //   deleteText: {
// //     color: '#FFF',
// //     fontWeight: 'bold',
// //   },
  
// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalContent: {
// //     backgroundColor: '#2A2A2A',
// //     borderRadius: 15,
// //     padding: 20,
// //     width: '90%',
// //     maxHeight: '80%',
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   modalTitle: {
// //     color: '#D2B48C',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 15,
// //   },
// //   modalList: {
// //     maxHeight: 150,
// //     marginBottom: 10,
// //   },
// //   modalActions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: 10,
// //     flexWrap: 'wrap',
// //   },
// //   modalButton: {
// //     padding: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     minWidth: '30%',
// //     marginVertical: 5,
// //   },
// //   addButton: {
// //     backgroundColor: '#4CAF50',
// //   },
// //   deleteButton: {
// //     backgroundColor: '#F44336',
// //   },
// //   cancelButton: {
// //     backgroundColor: '#333',
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// // });


// //ios test
// import React, { useEffect, useState } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, 
//   StyleSheet, FlatList, Modal, ScrollView, RefreshControl
// } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { supabase } from '../lib/supabase';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// export default function GroupsScreen() {
//   const navigation = useNavigation();
//   const [groups, setGroups] = useState([]);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [showGroupForm, setShowGroupForm] = useState(false);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // State for group management modal
//   const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupFriends, setGroupFriends] = useState([]);
//   const [groupNonMembers, setGroupNonMembers] = useState([]);
//   const [friendsToAdd, setFriendsToAdd] = useState([]);
//   const [friendsToDelete, setFriendsToDelete] = useState([]);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       getFriends();
//       getGroups();
//     }
//   }, [user]);

//   useEffect(() => {
//     // Filter groups based on search query
//     if (searchQuery) {
//       const filtered = groups.filter(group => 
//         group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredGroups(filtered);
//     } else {
//       setFilteredGroups(groups);
//     }
//   }, [searchQuery, groups]);

//   // Pull-to-refresh handler
//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await Promise.all([
//         getGroups(true),
//         getFriends()
//       ]);
//     } catch (error) {
//       console.error('Refresh error:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   async function getFriends() {
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

//       if (error) throw error;

//       const transformed = data.map((friendship) => ({
//         ...friendship,
//         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
//       }));

//       setFriends(transformed || []);
//     } catch (error) {
//       console.error('Error fetching friends:', error);
//     }
//   }

//   async function getGroups(isRefresh = false) {
//     if (!isRefresh) setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('group_members')
//         .select(`
//           group:groups!group_id (
//             id,
//             group_name,
//             created_by,
//             created_at,
//             members:group_members!group_id (user:profiles!user_id(id, username))
//           )
//         `)
//         .eq('user_id', user.id);

//       if (error) throw error;

//       const formattedGroups = data
//         .filter(item => item.group !== null)
//         .map(item => ({
//           ...item.group,
//           members: item.group.members.map(m => m.user)
//         }));

//       setGroups(formattedGroups);
//       setFilteredGroups(formattedGroups);
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//     } finally {
//       if (!isRefresh) setLoading(false);
//     }
//   }

//   async function checkUserBalance(groupId) {
//     try {
//       // Fetch user's balance for this group
//       const { data, error } = await supabase
//         .from('user_group_balances')
//         .select('balance')
//         .eq('group_id', groupId)
//         .eq('user_id', user.id)
//         .single();

//       if (error) throw error;

//       // If balance exists and is not zero
//       return data && data.balance !== 0;
//     } catch (error) {
//       console.error('Error checking balance:', error);
//       return false;
//     }
//   }

//   async function createGroup() {
//     if (!newGroupName || selectedMembers.length === 0) {
//       Alert.alert('Error', 'Please fill group name and select at least one member');
//       return;
//     }

//     try {
//       const { data: group, error: groupError } = await supabase
//         .from('groups')
//         .insert([{ 
//           group_name: newGroupName,
//           created_by: user.id 
//         }])
//         .select()
//         .single();

//       if (groupError) throw groupError;

//       const members = [user.id, ...selectedMembers];
//       const { error: membersError } = await supabase
//         .from('group_members')
//         .insert(members.map(user_id => ({
//           group_id: group.id,
//           user_id
//         })));

//       if (membersError) throw membersError;

//       Alert.alert('Success', 'Group created successfully');
//       setShowGroupForm(false);
//       setNewGroupName('');
//       setSelectedMembers([]);
//       await getGroups();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to create group');
//     }
//   }

//   const toggleMember = (userId) => {
//     setSelectedMembers(prev => 
//       prev.includes(userId) 
//         ? prev.filter(id => id !== userId) 
//         : [...prev, userId]
//     );
//   };

//   const deleteGroup = async (groupId) => {
//     // Check if user has unsettled balance
//     const hasBalance = await checkUserBalance(groupId);
    
//     if (hasBalance) {
//       Alert.alert(
//         "Cannot Delete Group",
//         "You have unsettled amounts in this group. Settle all balances before deleting.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Group",
//       "Are you sure you want to delete this group?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Delete", 
//           onPress: async () => {
//             try {
//               setLoading(true);
//               const { error } = await supabase
//                 .from('groups')
//                 .delete()
//                 .eq('id', groupId);
//               if (error) throw error;
//               setGroups(prev => prev.filter(g => g.id !== groupId));
//               await getGroups();
//             } catch (error) {
//               Alert.alert("Error", error.message);
//             } finally {
//               setLoading(false);
//             }
//           }
//         }
//       ]
//     );
//   };

//   // Prepare group management data
//   const prepareGroupManagement = async (group) => {
//     setSelectedGroup(group);
    
//     // Get current group members
//     const currentMemberIds = group.members.map(m => m.id);
    
//     // Filter friends who are not in the group
//     const nonMembers = friends.filter(
//       f => !currentMemberIds.includes(f.friendProfile.id)
//     );
    
//     // Friends already in the group (excluding current user)
//     const groupFriends = friends.filter(
//       f => currentMemberIds.includes(f.friendProfile.id) && 
//            f.friendProfile.id !== user.id
//     );

//     setGroupFriends(groupFriends);
//     setGroupNonMembers(nonMembers);
//     setFriendsToAdd([]);
//     setFriendsToDelete([]);
//     setIsGroupModalVisible(true);
//   };

//   // Add friends to group
//   const addFriendsToGroup = async () => {
//     if (friendsToAdd.length === 0) {
//       Alert.alert('Info', 'Please select friends to add');
//       return;
//     }
    
//     try {
//       const newMembers = friendsToAdd.map(user_id => ({
//         group_id: selectedGroup.id,
//         user_id
//       }));

//       const { error } = await supabase
//         .from('group_members')
//         .insert(newMembers);

//       if (error) throw error;

//       Alert.alert('Success', 'Friends added to group');
//       setIsGroupModalVisible(false);
//       await getGroups();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to add friends');
//     }
//   };

//   // Remove friends from group
//   const removeFriendsFromGroup = async () => {
//     if (friendsToDelete.length === 0) {
//       Alert.alert('Info', 'Please select friends to remove');
//       return;
//     }
    
//     try {
//       const { error } = await supabase
//         .from('group_members')
//         .delete()
//         .in('user_id', friendsToDelete)
//         .eq('group_id', selectedGroup.id);

//       if (error) throw error;

//       Alert.alert('Success', 'Friends removed from group');
//       setIsGroupModalVisible(false);
//       await getGroups();
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to remove friends');
//     }
//   };

//   // Toggle friend selection for adding
//   const toggleAddFriend = (friendId) => {
//     setFriendsToAdd(prev => 
//       prev.includes(friendId) 
//         ? prev.filter(id => id !== friendId) 
//         : [...prev, friendId]
//     );
//   };

//   // Toggle friend selection for deletion
//   const toggleDeleteFriend = (friendId) => {
//     setFriendsToDelete(prev => 
//       prev.includes(friendId) 
//         ? prev.filter(id => id !== friendId) 
//         : [...prev, friendId]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search groups..."
//           placeholderTextColor="#888"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         {searchQuery ? (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Icon name="close" size={20} color="#888" />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       <TouchableOpacity
//         style={styles.createGroupButton}
//         onPress={() => setShowGroupForm(!showGroupForm)}
//       >
//         <Text style={styles.createGroupButtonText}>
//           {showGroupForm ? 'Cancel' : 'Create New Group'}
//         </Text>
//       </TouchableOpacity>
      
//       {showGroupForm && (
//         <View style={styles.groupForm}>
//           <View style={styles.inputContainer}>
//             <Icon name="group" size={20} color="#D2B48C" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Group Name"
//               placeholderTextColor="#888"
//               value={newGroupName}
//               onChangeText={setNewGroupName}
//             />
//           </View>

//           <Text style={styles.sectionTitle}>Select Members:</Text>
          
//           <FlatList
//             data={friends}
//             keyExtractor={(item) => item.friendProfile.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.memberItem,
//                   selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
//                 ]}
//                 onPress={() => toggleMember(item.friendProfile.id)}
//               >
//                 <View style={styles.memberInfo}>
//                   <Icon 
//                     name={selectedMembers.includes(item.friendProfile.id) ? "check-box" : "check-box-outline-blank"} 
//                     size={24} 
//                     color="#D2B48C" 
//                     style={styles.userIcon} 
//                   />
//                   <Text style={styles.memberText}>{item.friendProfile.username}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             style={{ maxHeight: 200 }}
//           />

//           <TouchableOpacity
//             style={styles.submitButton}
//             onPress={createGroup}
//           >
//             <Text style={styles.submitText}>Create Group</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Group Management Modal */}
//       <Modal
//         visible={isGroupModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setIsGroupModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               Manage {selectedGroup?.group_name}
//             </Text>
            
//             {/* Add Friends Section */}
//             <Text style={styles.sectionTitle}>Add Friends:</Text>
//             {groupNonMembers.length > 0 ? (
//               <FlatList
//                 data={groupNonMembers}
//                 keyExtractor={(item) => item.friendProfile.id}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={[
//                       styles.memberItem,
//                       friendsToAdd.includes(item.friendProfile.id) && styles.selectedMember
//                     ]}
//                     onPress={() => toggleAddFriend(item.friendProfile.id)}
//                   >
//                     <View style={styles.memberInfo}>
//                       <Icon 
//                         name={friendsToAdd.includes(item.friendProfile.id) 
//                           ? "check-box" : "check-box-outline-blank"} 
//                         size={24} 
//                         color="#D2B48C" 
//                       />
//                       <Text style={styles.memberText}>
//                         {item.friendProfile.username}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 )}
//                 style={styles.modalList}
//               />
//             ) : (
//               <Text style={styles.emptyText}>No friends to add</Text>
//             )}
            
//             {/* Delete Friends Section */}
//             <Text style={styles.sectionTitle}>Remove Friends:</Text>
//             {groupFriends.length > 0 ? (
//               <FlatList
//                 data={groupFriends}
//                 keyExtractor={(item) => item.friendProfile.id}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={[
//                       styles.memberItem,
//                       friendsToDelete.includes(item.friendProfile.id) && styles.selectedDelete
//                     ]}
//                     onPress={() => toggleDeleteFriend(item.friendProfile.id)}
//                   >
//                     <View style={styles.memberInfo}>
//                       <Icon 
//                         name={friendsToDelete.includes(item.friendProfile.id) 
//                           ? "check-box" : "check-box-outline-blank"} 
//                         size={24} 
//                         color="#F44336" 
//                       />
//                       <Text style={styles.memberText}>
//                         {item.friendProfile.username}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 )}
//                 style={styles.modalList}
//               />
//             ) : (
//               <Text style={styles.emptyText}>No friends to remove</Text>
//             )}

//             {/* Action Buttons */}
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.addButton]}
//                 onPress={addFriendsToGroup}
//                 disabled={friendsToAdd.length === 0}
//               >
//                 <Text style={styles.buttonText}>Add Selected</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.deleteButton]}
//                 onPress={removeFriendsFromGroup}
//                 disabled={friendsToDelete.length === 0}
//               >
//                 <Text style={styles.buttonText}>Remove Selected</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setIsGroupModalVisible(false)}
//               >
//                 <Text style={styles.buttonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {loading ? (
//         <ActivityIndicator size="large" color="#D2B48C" />
//       ) : filteredGroups.length === 0 ? (
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
//           <Text style={styles.emptyText}>
//             {searchQuery ? "No groups match your search" : "No groups found"}
//           </Text>
//           <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
//         </ScrollView>
//       ) : (
//         <SwipeListView
//           data={filteredGroups}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.groupCard}>
//               <View style={styles.groupHeader}>
//                 <Text style={styles.groupName}>{item.group_name}</Text>
//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => navigation.navigate('GroupExp', { 
//                     groupId: item.id,
//                     members: item.members
//                   })}
//                 >
//                   <Text style={styles.actionText}>Add Expense</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.subHeader}>
//                 <Text style={styles.memberCount}>{item.members.length} members</Text>
//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => navigation.navigate('GroupHistory', { 
//                     groupId: item.id,
//                     members: item.members
//                   })}
//                 >
//                   <Text style={styles.actionText}>View Details</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.memberList}>
//                 {item.members.map(member => (
//                   <Text key={member.id} style={styles.memberName}>
//                     {member.username}
//                   </Text>
//                 ))}
//               </View>
//             </View>
//           )}
//           renderHiddenItem={({ item }) => (
//             <View style={styles.rowBack}>
//               <TouchableOpacity 
//                 style={[styles.swipeButton, styles.manageButton]}
//                 onPress={() => prepareGroupManagement(item)}
//               >
//                 <Icon name="settings" size={20} color="white" />
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 style={[styles.swipeButton, styles.deleteButton]} 
//                 onPress={() => deleteGroup(item.id)}
//               >
//                 <Icon name="delete" size={20} color="white" />
//               </TouchableOpacity>
//             </View>
//           )}
//           leftOpenValue={75}
//           rightOpenValue={-75}
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
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: 'black',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 20,
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
//   createGroupButton: {
//     backgroundColor: '#543A14',
//     borderRadius: 10,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   createGroupButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   groupForm: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     marginBottom: 15,
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
//   sectionTitle: {
//     color: '#D2B48C',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 10,
//     marginTop: 5,
//   },
//   memberItem: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   selectedMember: {
//     backgroundColor: '#1E2E1A',
//     borderColor: '#4CAF50',
//   },
//   selectedDelete: {
//     backgroundColor: '#2E1E1E',
//     borderColor: '#F44336',
//   },
//   memberInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userIcon: {
//     marginRight: 12,
//   },
//   memberText: {
//     fontSize: 15,
//     color: '#FFF0DC',
//   },
//   submitButton: {
//     backgroundColor: '#543A14',
//     borderRadius: 10,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//   },
//   submitText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   groupCard: {
//     position: 'relative',
//     backgroundColor: '#1E1E1E',
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   groupHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   groupName: {
//     color: '#FFF0DC',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//   },
//   subHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   memberCount: {
//     color: '#888',
//     fontSize: 14,
//   },
//   actionButton: {
//     backgroundColor: '#333',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   actionText: {
//     color: '#D2B48C',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   memberList: {
//     marginLeft: 4,
//     paddingTop: 8,
//   },
//   memberName: {
//     color: '#FFF0DC',
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   settingsContainer: {
//     position: 'absolute',
//     right: 12,
//     bottom: 12,
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
//     marginTop: 20,
//     fontSize: 16,
//   },
//   pullRefreshHint: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 8,
//   },
//   rowBack: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     backgroundColor: 'black',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   swipeButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 70,
//     height: '100%',
//     borderRadius: 8,
//   },
//   manageButton: {
//     backgroundColor: '#D2B48C',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//   },
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#2A2A2A',
//     borderRadius: 15,
//     padding: 20,
//     width: '90%',
//     maxHeight: '80%',
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   modalTitle: {
//     color: '#D2B48C',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalList: {
//     maxHeight: 150,
//     marginBottom: 10,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     flexWrap: 'wrap',
//   },
//   modalButton: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     minWidth: '30%',
//     marginVertical: 5,
//   },
//   addButton: {
//     backgroundColor: '#4CAF50',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//   },
//   cancelButton: {
//     backgroundColor: '#333',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },

// });



import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, 
  StyleSheet, FlatList, Modal, ScrollView, RefreshControl
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from '../components/IconWrapper';

export default function GroupsScreen() {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for group management modal
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupFriends, setGroupFriends] = useState([]);
  const [groupNonMembers, setGroupNonMembers] = useState([]);
  const [friendsToAdd, setFriendsToAdd] = useState([]);
  const [friendsToDelete, setFriendsToDelete] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error);
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      getFriends();
      getGroups();
    }
  }, [user]);

  useEffect(() => {
    // Filter groups based on search query
    if (searchQuery) {
      const filtered = groups.filter(group => 
        group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchQuery, groups]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getGroups(true),
        getFriends()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  async function getFriends() {
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

      if (error) throw error;

      const transformed = data.map((friendship) => ({
        ...friendship,
        friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
      }));

      setFriends(transformed || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  async function getGroups(isRefresh = false) {
    if (!isRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group:groups!group_id (
            id,
            group_name,
            created_by,
            created_at,
            members:group_members!group_id (user:profiles!user_id(id, username))
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedGroups = data
        .filter(item => item.group !== null)
        .map(item => ({
          ...item.group,
          members: item.group.members.map(m => m.user)
        }));

      setGroups(formattedGroups);
      setFilteredGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }

  async function checkUserBalance(groupId) {
    try {
      // Fetch user's balance for this group
      const { data, error } = await supabase
        .from('user_group_balances')
        .select('balance')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // If balance exists and is not zero
      return data && data.balance !== 0;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  async function createGroup() {
    if (!newGroupName || selectedMembers.length === 0) {
      Alert.alert('Error', 'Please fill group name and select at least one member');
      return;
    }

    try {
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert([{ 
          group_name: newGroupName,
          created_by: user.id 
        }])
        .select()
        .single();

      if (groupError) throw groupError;

      const members = [user.id, ...selectedMembers];
      const { error: membersError } = await supabase
        .from('group_members')
        .insert(members.map(user_id => ({
          group_id: group.id,
          user_id
        })));

      if (membersError) throw membersError;

      Alert.alert('Success', 'Group created successfully');
      setShowGroupForm(false);
      setNewGroupName('');
      setSelectedMembers([]);
      await getGroups();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create group');
    }
  }

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const deleteGroup = async (groupId) => {
    // Check if user has unsettled balance
    const hasBalance = await checkUserBalance(groupId);
    
    if (hasBalance) {
      Alert.alert(
        "Cannot Delete Group",
        "You have unsettled amounts in this group. Settle all balances before deleting.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from('groups')
                .delete()
                .eq('id', groupId);
              if (error) throw error;
              setGroups(prev => prev.filter(g => g.id !== groupId));
              await getGroups();
            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Prepare group management data
  const prepareGroupManagement = async (group) => {
    setSelectedGroup(group);
    
    // Get current group members
    const currentMemberIds = group.members.map(m => m.id);
    
    // Filter friends who are not in the group
    const nonMembers = friends.filter(
      f => !currentMemberIds.includes(f.friendProfile.id)
    );
    
    // Friends already in the group (excluding current user)
    const groupFriends = friends.filter(
      f => currentMemberIds.includes(f.friendProfile.id) && 
           f.friendProfile.id !== user.id
    );

    setGroupFriends(groupFriends);
    setGroupNonMembers(nonMembers);
    setFriendsToAdd([]);
    setFriendsToDelete([]);
    setIsGroupModalVisible(true);
  };

  // Add friends to group
  const addFriendsToGroup = async () => {
    if (friendsToAdd.length === 0) {
      Alert.alert('Info', 'Please select friends to add');
      return;
    }
    
    try {
      const newMembers = friendsToAdd.map(user_id => ({
        group_id: selectedGroup.id,
        user_id
      }));

      const { error } = await supabase
        .from('group_members')
        .insert(newMembers);

      if (error) throw error;

      Alert.alert('Success', 'Friends added to group');
      setIsGroupModalVisible(false);
      await getGroups();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add friends');
    }
  };

  // Remove friends from group
  const removeFriendsFromGroup = async () => {
    if (friendsToDelete.length === 0) {
      Alert.alert('Info', 'Please select friends to remove');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .in('user_id', friendsToDelete)
        .eq('group_id', selectedGroup.id);

      if (error) throw error;

      Alert.alert('Success', 'Friends removed from group');
      setIsGroupModalVisible(false);
      await getGroups();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove friends');
    }
  };

  // Toggle friend selection for adding
  const toggleAddFriend = (friendId) => {
    setFriendsToAdd(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };

  // Toggle friend selection for deletion
  const toggleDeleteFriend = (friendId) => {
    setFriendsToDelete(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => setShowGroupForm(!showGroupForm)}
      >
        <Text style={styles.createGroupButtonText}>
          {showGroupForm ? 'Cancel' : 'Create New Group'}
        </Text>
      </TouchableOpacity>
      
      {showGroupForm && (
        <View style={styles.groupForm}>
          <View style={styles.inputContainer}>
            <Icon name="group" size={20} color="#D2B48C" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#888"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
          </View>

          <Text style={styles.sectionTitle}>Select Members:</Text>
          
          <FlatList
            data={friends}
            keyExtractor={(item) => item.friendProfile.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  selectedMembers.includes(item.friendProfile.id) && styles.selectedMember
                ]}
                onPress={() => toggleMember(item.friendProfile.id)}
              >
                <View style={styles.memberInfo}>
                  <Icon 
                    name={selectedMembers.includes(item.friendProfile.id) ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color="#D2B48C" 
                    style={styles.memberIcon} 
                  />
                  <Text style={styles.memberText}>{item.friendProfile.username}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 200 }}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={createGroup}
          >
            <Text style={styles.submitText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Group Management Modal */}
      <Modal
        visible={isGroupModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsGroupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Manage {selectedGroup?.group_name}
            </Text>
            
            {/* Add Friends Section */}
            <Text style={styles.sectionTitle}>Add Friends:</Text>
            {groupNonMembers.length > 0 ? (
              <FlatList
                data={groupNonMembers}
                keyExtractor={(item) => item.friendProfile.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.memberItem,
                      friendsToAdd.includes(item.friendProfile.id) && styles.selectedMember
                    ]}
                    onPress={() => toggleAddFriend(item.friendProfile.id)}
                  >
                    <View style={styles.memberInfo}>
                      <Icon 
                        name={friendsToAdd.includes(item.friendProfile.id) 
                          ? "check-box" : "check-box-outline-blank"} 
                        size={24} 
                        color="#D2B48C" 
                      />
                      <Text style={styles.memberText}>
                        {item.friendProfile.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
              />
            ) : (
              <Text style={styles.emptyText}>No friends to add</Text>
            )}
            
            {/* Delete Friends Section */}
            <Text style={styles.sectionTitle}>Remove Friends:</Text>
            {groupFriends.length > 0 ? (
              <FlatList
                data={groupFriends}
                keyExtractor={(item) => item.friendProfile.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.memberItem,
                      friendsToDelete.includes(item.friendProfile.id) && styles.selectedDelete
                    ]}
                    onPress={() => toggleDeleteFriend(item.friendProfile.id)}
                  >
                    <View style={styles.memberInfo}>
                      <Icon 
                        name={friendsToDelete.includes(item.friendProfile.id) 
                          ? "check-box" : "check-box-outline-blank"} 
                        size={24} 
                        color="#F44336" 
                      />
                      <Text style={styles.memberText}>
                        {item.friendProfile.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.modalList}
              />
            ) : (
              <Text style={styles.emptyText}>No friends to remove</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addFriendsToGroup}
                disabled={friendsToAdd.length === 0}
              >
                <Text style={styles.buttonText}>Add Selected</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.removeButton]}
                onPress={removeFriendsFromGroup}
                disabled={friendsToDelete.length === 0}
              >
                <Text style={styles.buttonText}>Remove Selected</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsGroupModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#D2B48C" />
      ) : filteredGroups.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              //colors={['#D2B48C']}
              tintColor="#D2B48C"
              title="Pull to refresh"
              titleColor="#D2B48C"
            />
          }
        >
          <Text style={styles.emptyText}>
            {searchQuery ? "No groups match your search" : "No groups found"}
          </Text>
          <Text style={styles.pullRefreshHint}>Pull down to refresh</Text>
        </ScrollView>
      ) : (
        <SwipeListView
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{item.group_name}</Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('GroupExp', { 
                    groupId: item.id,
                    members: item.members
                  })}
                >
                  <Text style={styles.actionText}>Add Expense</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.subHeader}>
                <Text style={styles.memberCount}>{item.members.length} members</Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('GroupHistory', { 
                    groupId: item.id,
                    members: item.members
                  })}
                >
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.memberList}>
                {item.members.map(member => (
                  <Text key={member.id} style={styles.memberName}>
                    {member.username}
                  </Text>
                ))}
              </View>
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity 
                style={[styles.swipeButton, styles.manageButton]}
                onPress={() => prepareGroupManagement(item)}
              >
                <Icon name="settings" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.swipeButton, styles.deleteSwipeButton]} 
                onPress={() => deleteGroup(item.id)}
              >
                <Icon name="delete" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              //colors={['#D2B48C']}
              tintColor="#D2B48C"
              title="Pull to refresh"
              titleColor="#D2B48C"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  createGroupButton: {
    backgroundColor: '#543A14',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  createGroupButtonText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupForm: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF0DC',
    paddingVertical: 12,
    fontSize: 16,
  },
  sectionTitle: {
    color: '#D2B48C',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },
  memberItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedMember: {
    backgroundColor: '#1E2E1A',
    borderColor: '#4CAF50',
  },
  selectedDelete: {
    backgroundColor: '#2E1E1E',
    borderColor: '#F44336',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberIcon: {
    marginRight: 12,
  },
  memberText: {
    fontSize: 15,
    color: '#FFF0DC',
  },
  submitButton: {
    backgroundColor: '#543A14',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  submitText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
  },
  groupCard: {
    position: 'relative',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    color: '#FFF0DC',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberCount: {
    color: '#888',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  actionText: {
    color: '#D2B48C',
    fontSize: 12,
    fontWeight: '500',
  },
  memberList: {
    marginLeft: 4,
    paddingTop: 8,
  },
  memberName: {
    color: '#FFF0DC',
    fontSize: 14,
    marginBottom: 2,
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
    marginTop: 20,
    fontSize: 16,
  },
  pullRefreshHint: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'black',
    borderRadius: 8,
    marginBottom: 12,
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 8,
  },
  manageButton: {
    backgroundColor: '#D2B48C',
  },
  deleteSwipeButton: {
    backgroundColor: '#F44336',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#543A14',
  },
  modalTitle: {
    color: '#D2B48C',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});