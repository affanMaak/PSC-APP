
// // recent custom thek but full and equal khrb
// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator,
// //   Alert, StyleSheet, ScrollView, Modal
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';

// // export default function Add() {
// //   const [friends, setFriends] = useState([]);
// //   const [selectedFriends, setSelectedFriends] = useState([]);
// //   const [enteredAmount, setEnteredAmount] = useState('');
// //   const [enteredDescription, setEnteredDescription] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [splitType, setSplitType] = useState('equal');
// //   const [selectedPayer, setSelectedPayer] = useState('user');
// //   const [payerFriendId, setPayerFriendId] = useState(null);
// //   const [showPayerModal, setShowPayerModal] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [customPaid, setCustomPaid] = useState({});
// //   const [friendSearchQuery, setFriendSearchQuery] = useState('');
// //   const [showAllFriends, setShowAllFriends] = useState(false);
// //   const [pinnedFriends, setPinnedFriends] = useState([]);
// //   const getPayerName = () => {
// //     if (!payerFriendId) return "Select Friend";
// //     const friend = friends.find(f => f.friendProfile?.id === payerFriendId);
// //     return friend?.friendProfile?.username || "Unknown";
// //   };

// //  // Filter friends based on search query
// // const filteredFriends = friends.filter(friend => 
// //   friend.friendProfile?.username?.toLowerCase().includes(friendSearchQuery.toLowerCase())
// // );

// // // Toggle pin status for a friend
// // const togglePinFriend = (friendId) => {
// //   if (pinnedFriends.some(f => f.friendProfile?.id === friendId)) {
// //     // Unpin
// //     setPinnedFriends(pinnedFriends.filter(f => f.friendProfile?.id !== friendId));
// //   } else {
// //     // Pin (max 3)
// //     if (pinnedFriends.length >= 3) {
// //       Alert.alert('Pin Limit', 'You can only pin up to 3 friends');
// //       return;
// //     }
// //     const friendToPin = friends.find(f => f.friendProfile?.id === friendId);
// //     if (friendToPin) {
// //       setPinnedFriends([...pinnedFriends, friendToPin]);
// //     }
// //   }
// // };

// // const FriendItem = ({ 
// //   friend, 
// //   selectedFriends, 
// //   toggleFriendSelection, 
// //   togglePinFriend,
// //   isPinned
// // }) => {
// //   const friendId = friend.friendProfile?.id;
  
// //   return (
// //     <TouchableOpacity
// //       style={[
// //         styles.friendItem,
// //         selectedFriends.includes(friendId) && styles.selectedFriend
// //       ]}
// //       onPress={() => toggleFriendSelection(friendId)}
// //       onLongPress={() => togglePinFriend(friendId)}
// //     >
// //       <View style={styles.friendInfo}>
// //         <Icon
// //           name={
// //             selectedFriends.includes(friendId)
// //               ? "check-box"
// //               : "check-box-outline-blank"
// //           }
// //           size={24}
// //           color="#D2B48C"
// //           style={styles.userIcon}
// //         />
// //         <Text style={styles.username}>
// //           {friend.friendProfile?.username || "Unknown User"}
// //         </Text>
// //       </View>
      
// //       <TouchableOpacity 
// //         onPress={() => togglePinFriend(friendId)}
// //         style={styles.pinButton}
// //       >
// //         <Icon
// //           name={isPinned ? "push-pin" : "push-pin-outlined"}
// //           size={20}
// //           color={isPinned ? "#D2B48C" : "#555"}
// //         />
// //       </TouchableOpacity>
// //     </TouchableOpacity>
// //   );
// // };

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) console.error('Error fetching user:', error);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) getFriends();
// //   }, [user]);

// //   async function getFriends() {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`id, user_id, friends_id, status,
// //           sender:profiles!user_id(id, username),
// //           receiver:profiles!friends_id(id, username)`)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'accepted');

// //       if (error) return console.error('Error fetching friends:', error);

// //       const transformed = data.map(friendship => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// //       }));

// //       setFriends(transformed || []);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   const toggleFriendSelection = (friendId) => {
// //     setSelectedFriends(prev => prev.includes(friendId)
// //       ? prev.filter(id => id !== friendId)
// //       : [...prev, friendId]);
// //   };

// //   const handlePayerSelection = (friendId) => {
// //     setPayerFriendId(friendId);
// //     setShowPayerModal(false);
// //   };

// //   const generateGroupId = () => `expense_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// //   const handleCustomPaidChange = (id, value) => {
// //     setCustomPaid(prev => ({ ...prev, [id]: value }));
// //   };

// //   function getSettlementBreakdown(payments) {
// //     const total = Object.values(payments).reduce((sum, val) => sum + val, 0);
// //     const names = Object.keys(payments);
// //     const equalShare = total / names.length;
// //     const balances = names.map(name => ({
// //       name,
// //       balance: parseFloat((payments[name] - equalShare).toFixed(2))
// //     }));
// //     const debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p, balance: -p.balance }));
// //     const creditors = balances.filter(p => p.balance > 0);
// //     const settlements = [];
// //     let i = 0, j = 0;
// //     while (i < debtors.length && j < creditors.length) {
// //       const debtor = debtors[i];
// //       const creditor = creditors[j];
// //       const amount = Math.min(debtor.balance, creditor.balance);
// //       settlements.push({ from: debtor.name, to: creditor.name, amount: parseFloat(amount.toFixed(2)) });
// //       debtor.balance -= amount;
// //       creditor.balance -= amount;
// //       if (debtor.balance < 0.01) i++;
// //       if (creditor.balance < 0.01) j++;
// //     }
// //     return { equalShare, settlements };
// //   }

// //   async function sendExpense() {
// //     if (!user) return Alert.alert('Error', 'User not logged in');
// //     if (selectedFriends.length === 0) return Alert.alert('Error', 'Please select at least one friend');

// //     const amountValue = parseFloat(enteredAmount);
// //     if (isNaN(amountValue) && splitType !== 'custom') return Alert.alert('Error', 'Enter valid amount');

// //     const groupId = generateGroupId();
// //     const participants = [...selectedFriends, user.id];

// //     if (splitType === 'custom') {
// //       const paidMap = {};
// //       let total = 0;
// //       participants.forEach(id => {
// //         const paid = parseFloat(customPaid[id]) || 0;
// //         paidMap[id] = paid;
// //         total += paid;
// //       });
// //       const result = getSettlementBreakdown(paidMap);
// //       const dbData = {
// //         user_id: user.id,
// //         group_id: groupId,
// //         description: enteredDescription,
// //         total_amount: parseFloat(total.toFixed(2)),
// //         total_people: participants.length,
// //         participants: participants.map(id => ({
// //           id,
// //           username: id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username,
// //           paid: parseFloat(customPaid[id]) || 0
// //         })),
// //         settlements: result.settlements,
// //       };
// //       const { error } = await supabase.from('custom_expenses').insert([dbData]);
// //       if (error) return Alert.alert("Error", error.message);
// //       Alert.alert("Success", "Custom expense saved!");
// //       setCustomPaid({});
// //       setSelectedFriends([]);
// //       setEnteredDescription('');
// //       return;
// //     }

// //     let splitAmount = amountValue / participants.length;
// //     let payerId = selectedPayer === 'friend' ? payerFriendId : user.id;
// //     if (selectedPayer === 'friend' && !payerFriendId) return setShowPayerModal(true);

// //     const expenses = participants.filter(id => id !== payerId).map(participantId => ({
// //       user_id: payerId,
// //       friend_id: participantId,
// //       amount: parseFloat(splitAmount.toFixed(2)),
// //       description: enteredDescription,
// //       split_type: splitType,
// //       total_amount: amountValue,
// //       total_people: participants.length,
// //       group_id: groupId,
// //       created_at: new Date().toISOString()
// //     }));

// //     const { error } = await supabase.from('expenses').insert(expenses);
// //     if (error) return Alert.alert('Error', error.message);
// //     Alert.alert('Success', `Expense of Rs${amountValue.toFixed(2)} saved!`);
// //     setEnteredAmount('');
// //     setEnteredDescription('');
// //     setSelectedFriends([]);
// //     setPayerFriendId(null);
// //   }

// //    const renderCustomPaidInputs = () => {
// //     const people = [...selectedFriends, user.id];
// //     return (
// //       <View>
// //         <Text style={styles.sectionTitle}>Who Paid How Much:</Text>
// //         {people.map((id) => {
// //           const name = id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username;
// //           return (
// //             <View key={id} style={styles.friendItem}>
// //               <Text style={styles.username}>{name}</Text>
// //               <TextInput
// //                 placeholder="Amount paid"
// //                 keyboardType="numeric"
// //                 style={[styles.input, { marginLeft: 10 }]}
// //                 onChangeText={(val) => handleCustomPaidChange(id, val)}
// //                 value={customPaid[id]?.toString() || ''}
// //                 placeholderTextColor="#888"
// //               />
// //             </View>
// //           );
// //         })}
// //       </View>
// //     );
// //   };
  

// //   return (
// //   <ScrollView contentContainerStyle={styles.scrollContainer}>
// //     <Text style={styles.header}>Add Expense</Text>

// //     {/* Amount Input */}
// //     <View style={styles.inputContainer}>
// //      <Text style={styles.pkrIcon}>₨</Text>    
// //        <TextInput
// //         style={styles.input}
// //         placeholder="Enter amount"
// //         placeholderTextColor="#888"
// //         keyboardType="numeric"
// //         value={enteredAmount}
// //         onChangeText={setEnteredAmount}
// //       />
// //     </View>

// //     {/* Description Input */}
// //     <View style={styles.inputContainer}>
// //       <Icon name="description" size={20} color="#D2B48C" style={styles.icon} />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Enter description"
// //         placeholderTextColor="#888"
// //         value={enteredDescription}
// //         onChangeText={setEnteredDescription}
// //       />
// //     </View>

  

// //     {/* Split Type */}
// //     <Text style={styles.sectionTitle}>Split Type</Text>
// //     <View style={styles.selectionContainer}>
// //       <TouchableOpacity
// //         style={[styles.optionButton, splitType === 'equal' && styles.selectedOption]}
// //         onPress={() => setSplitType('equal')}
// //       >
// //         <Icon name="call-split" size={20} color={splitType === 'equal' ? '#121212' : '#D2B48C'} />
// //         <Text style={[styles.optionText, splitType === 'equal' && styles.selectedText]}>Equal</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={[styles.optionButton, splitType === 'full' && styles.selectedOption]}
// //         onPress={() => setSplitType('full')}
// //       >
// //         <Icon name="all-inclusive" size={20} color={splitType === 'full' ? '#121212' : '#D2B48C'} />
// //         <Text style={[styles.optionText, splitType === 'full' && styles.selectedText]}>Full</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={[styles.optionButton, splitType === 'custom' && styles.selectedOption]}
// //         onPress={() => setSplitType('custom')}
// //       >
// //         <Icon name="pie-chart" size={20} color={splitType === 'custom' ? '#121212' : '#D2B48C'} />
// //         <Text style={[styles.optionText, splitType === 'custom' && styles.selectedText]}>Custom</Text>
// //       </TouchableOpacity>
// //     </View>

// //       {/* Paid By */}
// //       <Text style={styles.sectionTitle}>Paid By</Text>
// //       <View style={styles.selectionContainer}>
// //         <TouchableOpacity
// //           style={[styles.optionButton, selectedPayer === 'user' && styles.selectedOption]}
// //           onPress={() => {
// //             setSelectedPayer('user');
// //             setPayerFriendId(null);
// //           }}
// //         >
// //           <Icon 
// //             name="person" 
// //             size={20} 
// //             color={selectedPayer === 'user' ? '#121212' : '#D2B48C'} 
// //           />
// //           <Text style={[styles.optionText, selectedPayer === 'user' && styles.selectedText]}>
// //             You
// //           </Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.optionButton, selectedPayer === 'friend' && styles.selectedOption]}
// //           onPress={() => setSelectedPayer('friend')}
// //         >
// //           <Icon 
// //             name="people" 
// //             size={20} 
// //             color={selectedPayer === 'friend' ? '#121212' : '#D2B48C'} 
// //           />
// //           <Text style={[styles.optionText, selectedPayer === 'friend' && styles.selectedText]}>
// //             Friend
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
      
// //       {/* Payer Friend Selection */}
// //       {selectedPayer === 'friend' && (
// //         <TouchableOpacity
// //           style={styles.payerSelector}
// //           onPress={() => setShowPayerModal(true)}
// //         >
// //           <Text style={styles.payerLabel}>Payer:</Text>
// //           <Text style={styles.payerName}>{getPayerName()}</Text>
// //           <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
// //         </TouchableOpacity>
// //       )}

// //     {/* Friend Selection */}
// //     {/* <View style={styles.friendSelectionHeader}>
// //       <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
// //       {splitType === 'equal' && selectedFriends.length > 0 && (
// //         <Text style={styles.splitInfo}>
// //           Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
// //         </Text>
// //       )}
// //     </View> */}

// // <View style={styles.friendSelectionHeader}>
// //   <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
// //   {splitType === 'equal' && selectedFriends.length > 0 && (
// //     <Text style={styles.splitInfo}>
// //       Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
// //     </Text>
// //   )}
// // </View>

// // {/* Search Bar */}
// // <View style={styles.searchContainer}>
// //   <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// //   <TextInput
// //     style={styles.searchInput}
// //     placeholder="Search friends"
// //     placeholderTextColor="#888"
// //     value={friendSearchQuery}
// //     onChangeText={setFriendSearchQuery}
// //   />
// // </View>

// // {loading ? (
// //   <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
// // ) : (
// //   <View>
// //     {/* Pinned Friends Section */}
// //     {pinnedFriends.length > 0 && (
// //       <View style={styles.sectionContainer}>
// //         <Text style={styles.sectionSubtitle}>Pinned Friends</Text>
// //         {pinnedFriends.map(friend => (
// //           <FriendItem 
// //             key={friend.id} 
// //             friend={friend} 
// //             selectedFriends={selectedFriends}
// //             toggleFriendSelection={toggleFriendSelection}
// //             togglePinFriend={togglePinFriend}
// //             isPinned={true}
// //           />
// //         ))}
// //       </View>
// //     )}

// //     {/* All Friends Section */}
// //     <View style={styles.sectionContainer}>
// //       <Text style={styles.sectionSubtitle}>All Friends</Text>
// //       {filteredFriends
// //         .slice(0, showAllFriends ? undefined : 5)
// //         .map(friend => (
// //           <FriendItem 
// //             key={friend.id} 
// //             friend={friend} 
// //             selectedFriends={selectedFriends}
// //             toggleFriendSelection={toggleFriendSelection}
// //             togglePinFriend={togglePinFriend}
// //             isPinned={false}
// //           />
// //         ))}
      
// //       {!showAllFriends && filteredFriends.length > 5 && (
// //         <TouchableOpacity
// //           style={styles.seeMoreButton}
// //           onPress={() => setShowAllFriends(true)}
// //         >
// //           <Text style={styles.seeMoreText}>
// //             See More ({filteredFriends.length - 5})
// //           </Text>
// //           <Icon name="keyboard-arrow-down" size={20} color="#D2B48C" />
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   </View>
// // )}
// //     {loading ? (
// //       <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
// //     ) : (
// //       <FlatList
// //         data={friends}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={styles.listContent}
// //         scrollEnabled={false}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={[
// //               styles.friendItem,
// //               selectedFriends.includes(item.friendProfile?.id) && styles.selectedFriend
// //             ]}
// //             onPress={() => toggleFriendSelection(item.friendProfile?.id)}
// //           >
// //             <View style={styles.friendInfo}>
// //               <Icon
// //                 name={
// //                   selectedFriends.includes(item.friendProfile?.id)
// //                     ? "check-box"
// //                     : "check-box-outline-blank"
// //                 }
// //                 size={24}
// //                 color="#D2B48C"
// //                 style={styles.userIcon}
// //               />
// //               <Text style={styles.username}>
// //                 {item.friendProfile?.username || "Unknown User"}
// //               </Text>
// //             </View>
// //           </TouchableOpacity>
// //         )}
// //         ListEmptyComponent={
// //           <Text style={styles.emptyText}>
// //             No friends found. Add friends to split expenses.
// //           </Text>
// //         }
// //       />
// //     )}

// //     {/* Custom Paid Inputs */}
// //     {splitType === 'custom' && renderCustomPaidInputs()}

// //     {/* Submit Button */}
// //     {selectedFriends.length > 0 && (
// //       <TouchableOpacity
// //         style={[
// //           styles.submitButton,
// //           (!enteredDescription || (splitType !== 'custom' && !enteredAmount)) && styles.disabledButton
// //         ]}
// //         onPress={sendExpense}
// //         disabled={!enteredDescription || (splitType !== 'custom' && !enteredAmount)}
// //       >
// //         {saving ? (
// //           <ActivityIndicator color="#FFF0DC" />
// //         ) : (
// //           <Text style={styles.submitButtonText}>
// //             {splitType === 'equal'
// //               ? `Split Rs${enteredAmount} among ${selectedFriends.length + 1} people`
// //               : splitType === 'full'
// //               ? `Record full Rs${enteredAmount} for ${selectedFriends.length} friend(s)`
// //               : `Record Custom Expense`}
// //           </Text>
// //         )}
// //       </TouchableOpacity>
// //     )}
// //         {/* Payer Selection Modal */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={showPayerModal}
// //         onRequestClose={() => setShowPayerModal(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Select Payer</Text>
            
// //             <FlatList
// //               data={friends.filter(f => selectedFriends.includes(f.friendProfile?.id))}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.modalOption}
// //                   onPress={() => handlePayerSelection(item.friendProfile?.id)}
// //                 >
// //                   <Icon 
// //                     name={payerFriendId === item.friendProfile?.id ? "radio-button-checked" : "radio-button-unchecked"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                   />
// //                   <Text style={styles.modalOptionText}>
// //                     {item.friendProfile?.username || "Unknown User"}
// //                   </Text>
// //                 </TouchableOpacity>
// //               )}
// //               ListEmptyComponent={
// //                 <Text style={styles.emptyText}>No friends selected</Text>
// //               }
// //             />
            
// //             <TouchableOpacity
// //               style={styles.modalCloseButton}
// //               onPress={() => setShowPayerModal(false)}
// //             >
// //               <Text style={styles.modalCloseText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //   </ScrollView>
// // );
// // }

// // const styles = StyleSheet.create({
// //   scrollContainer: {
// //     padding: 20,
// //     backgroundColor: 'black',
// //     paddingBottom: 80,
// //   },
// //   header: {
// //     fontSize: 26,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#543A14',
// //     paddingBottom: 10,
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
// //   pkrIcon: {
// //     color: '#D2B48C',
// //     fontSize: 20,
// //     marginRight: 10,
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
// //   selectionContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 15,
// //   },
// //   optionButton: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 8,
// //     padding: 10,
// //     marginHorizontal: 4,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     flexDirection: 'row',
// //   },
// //   selectedOption: {
// //     backgroundColor: '#543A14',
// //     borderColor: '#D2B48C',
// //   },
// //   optionText: {
// //     color: '#D2B48C',
// //     marginLeft: 8,
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   selectedText: {
// //     color: 'black',
// //     fontWeight: 'bold',
// //   },
// //   listContent: {
// //     paddingBottom: 20,
// //   },
// //   friendItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   selectedFriend: {
// //     backgroundColor: '#1E2E1A',
// //     borderColor: '#4CAF50',
// //   },
// //   friendInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   userIcon: {
// //     marginRight: 12,
// //   },
// //   username: {
// //     fontSize: 15,
// //     color: '#FFF0DC',
// //   },
// //   emptyText: {
// //     color: '#888',
// //     textAlign: 'center',
// //     marginTop: 20,
// //     fontSize: 14,
// //   },
// //   loader: {
// //     marginTop: 30,
// //   },
// //   friendSelectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   splitInfo: {
// //     color: '#4CAF50',
// //     fontSize: 12,
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
// //   disabledButton: {
// //     backgroundColor: '#333',
// //     borderColor: '#555',
// //   },
// //   submitButtonText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //   },
// //   payerSelector: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   payerLabel: {
// //     color: '#D2B48C',
// //     marginRight: 10,
// //     fontWeight: '500',
// //   },
// //   payerName: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     fontSize: 15,
// //   },
// //   // Modal styles
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //   },
// //   modalContent: {
// //     width: '85%',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 15,
// //     padding: 20,
// //     borderWidth: 2,
// //     borderColor: '#543A14',
// //   },
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     textAlign: 'center',
// //     marginBottom: 15,
// //   },
// //   modalOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#333',
// //   },
// //   modalOptionText: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     marginLeft: 15,
// //   },
// //   modalCloseButton: {
// //     marginTop: 20,
// //     padding: 12,
// //     backgroundColor: '#543A14',
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   modalCloseText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   // Custom split modal styles
// //   totalAmountText: {
// //     color: '#D2B48C',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 15,
// //   },
// //   customSplitSummary: {
// //     backgroundColor: '#2a2a2a',
// //     padding: 10,
// //     borderRadius: 8,
// //     marginTop: 10,
// //   },
// //   summaryText: {
// //     color: '#FFF0DC',
// //     fontSize: 14,
// //     marginBottom: 4,
// //   },
// //   customInput: {
// //     backgroundColor: '#2a2a2a',
// //     color: '#FFF0DC',
// //     padding: 12,
// //     borderRadius: 8,
// //     fontSize: 16,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   customSplitRow: {
// //     marginVertical: 8,
// //   },
// //   customSplitLabel: {
// //     color: '#FFF0DC', 
// //     marginBottom: 4,
// //     fontSize: 15,
// //   },
// //   // Search styles
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   searchInput: {
// //     flex: 1,
// //     color: '#FFF0DC',
// //     paddingVertical: 12,
// //     fontSize: 16,
// //   },
// //   // Scrollable sections
// //   scrollableSection: {
// //     maxHeight: 300,
// //   },
// //    modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //   },
// //   modalContent: {
// //     width: '80%',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 15,
// //     padding: 20,
// //     borderWidth: 2,
// //     borderColor: '#543A14',
// //     maxHeight: '80%',
// //   },
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#FFF0DC',
// //     textAlign: 'center',
// //     marginBottom: 15,
// //   },
// //   modalOption: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#333',
// //   },
// //   modalOptionText: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //     marginLeft: 15,
// //   },
// //   modalCloseButton: {
// //     marginTop: 20,
// //     padding: 12,
// //     backgroundColor: '#543A14',
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   modalCloseText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// //   searchContainer: {
// //   flexDirection: 'row',
// //   alignItems: 'center',
// //   backgroundColor: '#1E1E1E',
// //   borderRadius: 12,
// //   paddingHorizontal: 16,
// //   marginBottom: 16,
// //   borderWidth: 1,
// //   borderColor: '#333',
// // },
// // searchIcon: {
// //   marginRight: 10,
// // },
// // searchInput: {
// //   flex: 1,
// //   color: '#FFF0DC',
// //   paddingVertical: 12,
// //   fontSize: 16,
// // },
// // sectionContainer: {
// //   marginBottom: 20,
// // },
// // sectionSubtitle: {
// //   color: '#D2B48C',
// //   fontSize: 16,
// //   fontWeight: '600',
// //   marginBottom: 12,
// // },
// // seeMoreButton: {
// //   flexDirection: 'row',
// //   alignItems: 'center',
// //   justifyContent: 'center',
// //   padding: 12,
// //   backgroundColor: '#1E1E1E',
// //   borderRadius: 10,
// //   borderWidth: 1,
// //   borderColor: '#333',
// //   marginTop: 8,
// // },
// // seeMoreText: {
// //   color: '#D2B48C',
// //   marginRight: 5,
// //   fontWeight: '600',
// // },
// // pinButton: {
// //   padding: 8,
// //   marginLeft: 10,
// // },
// // });



// //ios test
// //fucked up 
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator,
//   Alert, StyleSheet, ScrollView, Modal
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// export default function Add() {
//   const [friends, setFriends] = useState([]);
//   const [selectedFriends, setSelectedFriends] = useState([]);
//   const [enteredAmount, setEnteredAmount] = useState('');
//   const [enteredDescription, setEnteredDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [splitType, setSplitType] = useState('equal');
//   const [selectedPayer, setSelectedPayer] = useState('user');
//   const [payerFriendId, setPayerFriendId] = useState(null);
//   const [showPayerModal, setShowPayerModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [customPaid, setCustomPaid] = useState({});
//   const [friendSearchQuery, setFriendSearchQuery] = useState('');
//   const [showAllFriends, setShowAllFriends] = useState(false);
//   const [pinnedFriends, setPinnedFriends] = useState([]);

//   // Load pinned friends on component mount
//   useEffect(() => {
//     const loadPinnedFriends = async () => {
//       try {
//         const savedPinned = await AsyncStorage.getItem('pinnedFriends');
//         if (savedPinned) {
//           setPinnedFriends(JSON.parse(savedPinned));
//         }
//       } catch (error) {
//         console.error('Error loading pinned friends:', error);
//       }
//     };
    
//     loadPinnedFriends();
//   }, []);

//   // Save pinned friends when they change
//   useEffect(() => {
//     const savePinnedFriends = async () => {
//       try {
//         await AsyncStorage.setItem('pinnedFriends', JSON.stringify(pinnedFriends));
//       } catch (error) {
//         console.error('Error saving pinned friends:', error);
//       }
//     };
    
//     if (pinnedFriends.length > 0) {
//       savePinnedFriends();
//     }
//   }, [pinnedFriends]);

//   const getPayerName = () => {
//     if (!payerFriendId) return "Select Friend";
//     const friend = friends.find(f => f.friendProfile?.id === payerFriendId);
//     return friend?.friendProfile?.username || "Unknown";
//   };

//   // Filter friends based on search query
//   const filteredFriends = friends.filter(friend => 
//     friend.friendProfile?.username?.toLowerCase().includes(friendSearchQuery.toLowerCase())
//   );

//   // Toggle pin status for a friend
//   const togglePinFriend = (friendId) => {
//     const isPinned = pinnedFriends.includes(friendId);
    
//     if (isPinned) {
//       // Unpin
//       setPinnedFriends(prev => prev.filter(id => id !== friendId));
//     } else {
//       // Pin (max 3)
//       if (pinnedFriends.length >= 3) {
//         Alert.alert('Pin Limit', 'You can only pin up to 3 friends');
//         return;
//       }
//       setPinnedFriends(prev => [...prev, friendId]);
//     }
//   };


// const FriendItem = ({ 
//   friend, 
//   selectedFriends, 
//   toggleFriendSelection, 
//   togglePinFriend,
// }) => {
//   const friendId = friend.friendProfile?.id;
//   const isPinned = pinnedFriends.includes(friendId);
  
//   return (
//     <TouchableOpacity
//       style={[
//         styles.friendItem,
//         selectedFriends.includes(friendId) && styles.selectedFriend
//       ]}
//       onPress={() => toggleFriendSelection(friendId)}
//       onLongPress={() => togglePinFriend(friendId)}
//     >
//       <View style={styles.friendInfo}>
//         <Icon
//           name={
//             selectedFriends.includes(friendId)
//               ? "check-box"
//               : "check-box-outline-blank"
//           }
//           size={24}
//           color="#D2B48C"
//           style={styles.userIcon}
//         />
//         <Text style={styles.username}>
//           {friend.friendProfile?.username || "Unknown User"}
//         </Text>
//       </View>
      
//       <TouchableOpacity 
//         onPress={() => togglePinFriend(friendId)}
//         style={styles.pinButton}
//       >
//         <Icon
//           name={isPinned ? "push-pin" : "bookmark-outline"}
//           size={20}
//           color={isPinned ? "#D2B48C" : "#555"}
//         />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );
// };

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) getFriends();
//   }, [user]);

//   async function getFriends() {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('friends')
//         .select(`id, user_id, friends_id, status,
//           sender:profiles!user_id(id, username),
//           receiver:profiles!friends_id(id, username)`)
//         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
//         .eq('status', 'accepted');

//       if (error) return console.error('Error fetching friends:', error);

//       const transformed = data.map(friendship => ({
//         ...friendship,
//         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
//       }));

//       setFriends(transformed || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const toggleFriendSelection = (friendId) => {
//     setSelectedFriends(prev => prev.includes(friendId)
//       ? prev.filter(id => id !== friendId)
//       : [...prev, friendId]);
//   };

//   const handlePayerSelection = (friendId) => {
//     setPayerFriendId(friendId);
//     setShowPayerModal(false);
//   };

//   const generateGroupId = () => `expense_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

//   const handleCustomPaidChange = (id, value) => {
//     setCustomPaid(prev => ({ ...prev, [id]: value }));
//   };

//   function getSettlementBreakdown(payments) {
//     const total = Object.values(payments).reduce((sum, val) => sum + val, 0);
//     const names = Object.keys(payments);
//     const equalShare = total / names.length;
//     const balances = names.map(name => ({
//       name,
//       balance: parseFloat((payments[name] - equalShare).toFixed(2))
//     }));
//     const debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p, balance: -p.balance }));
//     const creditors = balances.filter(p => p.balance > 0);
//     const settlements = [];
//     let i = 0, j = 0;
//     while (i < debtors.length && j < creditors.length) {
//       const debtor = debtors[i];
//       const creditor = creditors[j];
//       const amount = Math.min(debtor.balance, creditor.balance);
//       settlements.push({ from: debtor.name, to: creditor.name, amount: parseFloat(amount.toFixed(2)) });
//       debtor.balance -= amount;
//       creditor.balance -= amount;
//       if (debtor.balance < 0.01) i++;
//       if (creditor.balance < 0.01) j++;
//     }
//     return { equalShare, settlements };
//   }

//   async function sendExpense() {
//     if (!user) return Alert.alert('Error', 'User not logged in');
//     if (selectedFriends.length === 0) return Alert.alert('Error', 'Please select at least one friend');

//     const amountValue = parseFloat(enteredAmount);
//     if (isNaN(amountValue) && splitType !== 'custom') return Alert.alert('Error', 'Enter valid amount');

//     const groupId = generateGroupId();
//     const participants = [...selectedFriends, user.id];

//     if (splitType === 'custom') {
//       const paidMap = {};
//       let total = 0;
//       participants.forEach(id => {
//         const paid = parseFloat(customPaid[id]) || 0;
//         paidMap[id] = paid;
//         total += paid;
//       });
//       const result = getSettlementBreakdown(paidMap);
//       const dbData = {
//         user_id: user.id,
//         group_id: groupId,
//         description: enteredDescription,
//         total_amount: parseFloat(total.toFixed(2)),
//         total_people: participants.length,
//         participants: participants.map(id => ({
//           id,
//           username: id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username,
//           paid: parseFloat(customPaid[id]) || 0
//         })),
//         settlements: result.settlements,
//       };
//       const { error } = await supabase.from('custom_expenses').insert([dbData]);
//       if (error) return Alert.alert("Error", error.message);
//       Alert.alert("Success", "Custom expense saved!");
//       setCustomPaid({});
//       setSelectedFriends([]);
//       setEnteredDescription('');
//       return;
//     }

//     let splitAmount = amountValue / participants.length;
//     let payerId = selectedPayer === 'friend' ? payerFriendId : user.id;
//     if (selectedPayer === 'friend' && !payerFriendId) return setShowPayerModal(true);

//     const expenses = participants.filter(id => id !== payerId).map(participantId => ({
//       user_id: payerId,
//       friend_id: participantId,
//       amount: parseFloat(splitAmount.toFixed(2)),
//       description: enteredDescription,
//       split_type: splitType,
//       total_amount: amountValue,
//       total_people: participants.length,
//       group_id: groupId,
//       created_at: new Date().toISOString()
//     }));

//     const { error } = await supabase.from('expenses').insert(expenses);
//     if (error) return Alert.alert('Error', error.message);
//     Alert.alert('Success', `Expense of Rs${amountValue.toFixed(2)} saved!`);
//     setEnteredAmount('');
//     setEnteredDescription('');
//     setSelectedFriends([]);
//     setPayerFriendId(null);
//   }

//   const renderCustomPaidInputs = () => {
//     const people = [...selectedFriends, user.id];
//     return (
//       <View>
//         <Text style={styles.sectionTitle}>Who Paid How Much:</Text>
//         {people.map((id) => {
//           const name = id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username;
//           return (
//             <View key={id} style={styles.friendItem}>
//               <Text style={styles.username}>{name}</Text>
//               <TextInput
//                 placeholder="Amount paid"
//                 keyboardType="numeric"
//                 style={[styles.input, { marginLeft: 10 }]}
//                 onChangeText={(val) => handleCustomPaidChange(id, val)}
//                 value={customPaid[id]?.toString() || ''}
//                 placeholderTextColor="#888"
//               />
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}>Add Expense</Text>

//       {/* Amount Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.pkrIcon}>₨</Text>    
//         <TextInput
//           style={styles.input}
//           placeholder="Enter amount"
//           placeholderTextColor="#888"
//           keyboardType="numeric"
//           value={enteredAmount}
//           onChangeText={setEnteredAmount}
//         />
//       </View>

//       {/* Description Input */}
//       <View style={styles.inputContainer}>
//         <Icon name="description" size={20} color="#D2B48C" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter description"
//           placeholderTextColor="#888"
//           value={enteredDescription}
//           onChangeText={setEnteredDescription}
//         />
//       </View>

//       {/* Split Type */}
//       <Text style={styles.sectionTitle}>Split Type</Text>
//       <View style={styles.selectionContainer}>
//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'equal' && styles.selectedOption]}
//           onPress={() => setSplitType('equal')}
//         >
//           <Icon name="call-split" size={20} color={splitType === 'equal' ? '#121212' : '#D2B48C'} />
//           <Text style={[styles.optionText, splitType === 'equal' && styles.selectedText]}>Equal</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'full' && styles.selectedOption]}
//           onPress={() => setSplitType('full')}
//         >
//           <Icon name="all-inclusive" size={20} color={splitType === 'full' ? '#121212' : '#D2B48C'} />
//           <Text style={[styles.optionText, splitType === 'full' && styles.selectedText]}>Full</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'custom' && styles.selectedOption]}
//           onPress={() => setSplitType('custom')}
//         >
//           <Icon name="pie-chart" size={20} color={splitType === 'custom' ? '#121212' : '#D2B48C'} />
//           <Text style={[styles.optionText, splitType === 'custom' && styles.selectedText]}>Custom</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Paid By */}
//       <Text style={styles.sectionTitle}>Paid By</Text>
//       <View style={styles.selectionContainer}>
//         <TouchableOpacity
//           style={[styles.optionButton, selectedPayer === 'user' && styles.selectedOption]}
//           onPress={() => {
//             setSelectedPayer('user');
//             setPayerFriendId(null);
//           }}
//         >
//           <Icon 
//             name="person" 
//             size={20} 
//             color={selectedPayer === 'user' ? '#121212' : '#D2B48C'} 
//           />
//           <Text style={[styles.optionText, selectedPayer === 'user' && styles.selectedText]}>
//             You
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, selectedPayer === 'friend' && styles.selectedOption]}
//           onPress={() => setSelectedPayer('friend')}
//         >
//           <Icon 
//             name="people" 
//             size={20} 
//             color={selectedPayer === 'friend' ? '#121212' : '#D2B48C'} 
//           />
//           <Text style={[styles.optionText, selectedPayer === 'friend' && styles.selectedText]}>
//             Friend
//           </Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Payer Friend Selection */}
//       {selectedPayer === 'friend' && (
//         <TouchableOpacity
//           style={styles.payerSelector}
//           onPress={() => setShowPayerModal(true)}
//         >
//           <Text style={styles.payerLabel}>Payer:</Text>
//           <Text style={styles.payerName}>{getPayerName()}</Text>
//           <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
//         </TouchableOpacity>
//       )}

//       {/* Friend Selection Header */}
//       <View style={styles.friendSelectionHeader}>
//         <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
//         {splitType === 'equal' && selectedFriends.length > 0 && (
//           <Text style={styles.splitInfo}>
//             Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
//           </Text>
//         )}
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search friends"
//           placeholderTextColor="#888"
//           value={friendSearchQuery}
//           onChangeText={setFriendSearchQuery}
//         />
//       </View>

//       {/* Friends List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
//       ) : (
//         <View>
//           {/* Pinned Friends Section */}
//           {pinnedFriends.length > 0 && (
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionSubtitle}>Pinned Friends</Text>
//               {friends
//                 .filter(friend => pinnedFriends.includes(friend.friendProfile?.id))
//                 .map(friend => (
//                   <FriendItem 
//                     key={friend.id} 
//                     friend={friend} 
//                     selectedFriends={selectedFriends}
//                     toggleFriendSelection={toggleFriendSelection}
//                     togglePinFriend={togglePinFriend}
//                   />
//                 ))}
//             </View>
//           )}

//           {/* All Friends Section */}
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionSubtitle}>All Friends</Text>
//             {filteredFriends
//               .filter(friend => !pinnedFriends.includes(friend.friendProfile?.id))
//               .slice(0, showAllFriends ? undefined : 5)
//               .map(friend => (
//                 <FriendItem 
//                   key={friend.id} 
//                   friend={friend} 
//                   selectedFriends={selectedFriends}
//                   toggleFriendSelection={toggleFriendSelection}
//                   togglePinFriend={togglePinFriend}
//                 />
//               ))}
            
//             {/* Show/Hide Button - only appears if there are more than 5 friends */}
//             {filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length > 5 && (
//               <TouchableOpacity
//                 style={styles.seeMoreButton}
//                 onPress={() => setShowAllFriends(!showAllFriends)}
//               >
//                 <Text style={styles.seeMoreText}>
//                   {showAllFriends 
//                     ? "Hide" 
//                     : `See More (${filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length - 5})`}
//                 </Text>
//                 <Icon 
//                   name={showAllFriends ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
//                   size={20} 
//                   color="#D2B48C" 
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}

//       {/* Custom Paid Inputs */}
//       {splitType === 'custom' && renderCustomPaidInputs()}

//       {/* Submit Button */}
//       {selectedFriends.length > 0 && (
//         <TouchableOpacity
//           style={[
//             styles.submitButton,
//             (!enteredDescription || (splitType !== 'custom' && !enteredAmount)) && styles.disabledButton
//           ]}
//           onPress={sendExpense}
//           disabled={!enteredDescription || (splitType !== 'custom' && !enteredAmount)}
//         >
//           {saving ? (
//             <ActivityIndicator color="#FFF0DC" />
//           ) : (
//             <Text style={styles.submitButtonText}>
//               {splitType === 'equal'
//                 ? `Split Rs${enteredAmount} among ${selectedFriends.length + 1} people`
//                 : splitType === 'full'
//                 ? `Record full Rs${enteredAmount} for ${selectedFriends.length} friend(s)`
//                 : `Record Custom Expense`}
//             </Text>
//           )}
//         </TouchableOpacity>
//       )}
      
//       {/* Payer Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showPayerModal}
//         onRequestClose={() => setShowPayerModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Payer</Text>
            
//             <FlatList
//               data={friends.filter(f => selectedFriends.includes(f.friendProfile?.id))}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalOption}
//                   onPress={() => handlePayerSelection(item.friendProfile?.id)}
//                 >
//                   <Icon 
//                     name={payerFriendId === item.friendProfile?.id ? "radio-button-checked" : "radio-button-unchecked"} 
//                     size={24} 
//                     color="#D2B48C" 
//                   />
//                   <Text style={styles.modalOptionText}>
//                     {item.friendProfile?.username || "Unknown User"}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No friends selected</Text>
//               }
//             />
            
//             <TouchableOpacity
//               style={styles.modalCloseButton}
//               onPress={() => setShowPayerModal(false)}
//             >
//               <Text style={styles.modalCloseText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }


// // import React, { useEffect, useState } from 'react';
// // import {
// //   View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator,
// //   Alert, StyleSheet, ScrollView, Modal
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';

// // export default function Add() {
// //   const [friends, setFriends] = useState([]);
// //   const [selectedFriends, setSelectedFriends] = useState([]);
// //   const [enteredAmount, setEnteredAmount] = useState('');
// //   const [enteredDescription, setEnteredDescription] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [splitType, setSplitType] = useState('equal');
// //   const [selectedPayer, setSelectedPayer] = useState('user');
// //   const [payerFriendId, setPayerFriendId] = useState(null);
// //   const [showPayerModal, setShowPayerModal] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [customPaid, setCustomPaid] = useState({});
// //   const [friendSearchQuery, setFriendSearchQuery] = useState('');
// //   const [showAllFriends, setShowAllFriends] = useState(false);
// //   const [pinnedFriends, setPinnedFriends] = useState([]);

// //   const getPayerName = () => {
// //     if (!payerFriendId) return "Select Friend";
// //     const friend = friends.find(f => f.friendProfile?.id === payerFriendId);
// //     return friend?.friendProfile?.username || "Unknown";
// //   };

// //   // Filter friends based on search query
// //   const filteredFriends = friends.filter(friend => 
// //     friend.friendProfile?.username?.toLowerCase().includes(friendSearchQuery.toLowerCase())
// //   );

// //   // Toggle pin status for a friend
// //   const togglePinFriend = (friendId) => {
// //     if (pinnedFriends.some(f => f.friendProfile?.id === friendId)) {
// //       // Unpin
// //       setPinnedFriends(pinnedFriends.filter(f => f.friendProfile?.id !== friendId));
// //     } else {
// //       // Pin (max 3)
// //       if (pinnedFriends.length >= 3) {
// //         Alert.alert('Pin Limit', 'You can only pin up to 3 friends');
// //         return;
// //       }
// //       const friendToPin = friends.find(f => f.friendProfile?.id === friendId);
// //       if (friendToPin) {
// //         setPinnedFriends([...pinnedFriends, friendToPin]);
// //       }
// //     }
// //   };

// //   const FriendItem = ({ 
// //     friend, 
// //     selectedFriends, 
// //     toggleFriendSelection, 
// //     togglePinFriend,
// //     isPinned
// //   }) => {
// //     const friendId = friend.friendProfile?.id;
    
// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.friendItem,
// //           selectedFriends.includes(friendId) && styles.selectedFriend
// //         ]}
// //         onPress={() => toggleFriendSelection(friendId)}
// //         onLongPress={() => togglePinFriend(friendId)}
// //       >
// //         <View style={styles.friendInfo}>
// //           <Icon
// //             name={
// //               selectedFriends.includes(friendId)
// //                 ? "check-box"
// //                 : "check-box-outline-blank"
// //             }
// //             size={24}
// //             color="#D2B48C"
// //             style={styles.userIcon}
// //           />
// //           <Text style={styles.username}>
// //             {friend.friendProfile?.username || "Unknown User"}
// //           </Text>
// //         </View>
        
// //         <TouchableOpacity 
// //           onPress={() => togglePinFriend(friendId)}
// //           style={styles.pinButton}
// //         >
// //           <Icon
// //             name={isPinned ? "push-pin" : "push-pin-outlined"}
// //             size={20}
// //             color={isPinned ? "#D2B48C" : "#555"}
// //           />
// //         </TouchableOpacity>
// //       </TouchableOpacity>
// //     );
// //   };

// //   useEffect(() => {
// //     async function fetchUser() {
// //       const { data: { user }, error } = await supabase.auth.getUser();
// //       if (error) console.error('Error fetching user:', error);
// //       setUser(user);
// //     }
// //     fetchUser();
// //   }, []);

// //   useEffect(() => {
// //     if (user) getFriends();
// //   }, [user]);

// //   async function getFriends() {
// //     setLoading(true);
// //     try {
// //       const { data, error } = await supabase
// //         .from('friends')
// //         .select(`id, user_id, friends_id, status,
// //           sender:profiles!user_id(id, username),
// //           receiver:profiles!friends_id(id, username)`)
// //         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
// //         .eq('status', 'accepted');

// //       if (error) return console.error('Error fetching friends:', error);

// //       const transformed = data.map(friendship => ({
// //         ...friendship,
// //         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
// //       }));

// //       setFriends(transformed || []);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   const toggleFriendSelection = (friendId) => {
// //     setSelectedFriends(prev => prev.includes(friendId)
// //       ? prev.filter(id => id !== friendId)
// //       : [...prev, friendId]);
// //   };

// //   const handlePayerSelection = (friendId) => {
// //     setPayerFriendId(friendId);
// //     setShowPayerModal(false);
// //   };

// //   const generateGroupId = () => `expense_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// //   const handleCustomPaidChange = (id, value) => {
// //     setCustomPaid(prev => ({ ...prev, [id]: value }));
// //   };

// //   function getSettlementBreakdown(payments) {
// //     const total = Object.values(payments).reduce((sum, val) => sum + val, 0);
// //     const names = Object.keys(payments);
// //     const equalShare = total / names.length;
// //     const balances = names.map(name => ({
// //       name,
// //       balance: parseFloat((payments[name] - equalShare).toFixed(2))
// //     }));
// //     const debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p, balance: -p.balance }));
// //     const creditors = balances.filter(p => p.balance > 0);
// //     const settlements = [];
// //     let i = 0, j = 0;
// //     while (i < debtors.length && j < creditors.length) {
// //       const debtor = debtors[i];
// //       const creditor = creditors[j];
// //       const amount = Math.min(debtor.balance, creditor.balance);
// //       settlements.push({ from: debtor.name, to: creditor.name, amount: parseFloat(amount.toFixed(2)) });
// //       debtor.balance -= amount;
// //       creditor.balance -= amount;
// //       if (debtor.balance < 0.01) i++;
// //       if (creditor.balance < 0.01) j++;
// //     }
// //     return { equalShare, settlements };
// //   }

// //   async function sendExpense() {
// //     if (!user) return Alert.alert('Error', 'User not logged in');
// //     if (selectedFriends.length === 0) return Alert.alert('Error', 'Please select at least one friend');

// //     const amountValue = parseFloat(enteredAmount);
// //     if (isNaN(amountValue) && splitType !== 'custom') return Alert.alert('Error', 'Enter valid amount');

// //     const groupId = generateGroupId();
// //     const participants = [...selectedFriends, user.id];

// //     if (splitType === 'custom') {
// //       const paidMap = {};
// //       let total = 0;
// //       participants.forEach(id => {
// //         const paid = parseFloat(customPaid[id]) || 0;
// //         paidMap[id] = paid;
// //         total += paid;
// //       });
// //       const result = getSettlementBreakdown(paidMap);
// //       const dbData = {
// //         user_id: user.id,
// //         group_id: groupId,
// //         description: enteredDescription,
// //         total_amount: parseFloat(total.toFixed(2)),
// //         total_people: participants.length,
// //         participants: participants.map(id => ({
// //           id,
// //           username: id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username,
// //           paid: parseFloat(customPaid[id]) || 0
// //         })),
// //         settlements: result.settlements,
// //       };
// //       const { error } = await supabase.from('custom_expenses').insert([dbData]);
// //       if (error) return Alert.alert("Error", error.message);
// //       Alert.alert("Success", "Custom expense saved!");
// //       setCustomPaid({});
// //       setSelectedFriends([]);
// //       setEnteredDescription('');
// //       return;
// //     }

// //     let splitAmount = amountValue / participants.length;
// //     let payerId = selectedPayer === 'friend' ? payerFriendId : user.id;
// //     if (selectedPayer === 'friend' && !payerFriendId) return setShowPayerModal(true);

// //     const expenses = participants.filter(id => id !== payerId).map(participantId => ({
// //       user_id: payerId,
// //       friend_id: participantId,
// //       amount: parseFloat(splitAmount.toFixed(2)),
// //       description: enteredDescription,
// //       split_type: splitType,
// //       total_amount: amountValue,
// //       total_people: participants.length,
// //       group_id: groupId,
// //       created_at: new Date().toISOString()
// //     }));

// //     const { error } = await supabase.from('expenses').insert(expenses);
// //     if (error) return Alert.alert('Error', error.message);
// //     Alert.alert('Success', `Expense of Rs${amountValue.toFixed(2)} saved!`);
// //     setEnteredAmount('');
// //     setEnteredDescription('');
// //     setSelectedFriends([]);
// //     setPayerFriendId(null);
// //   }

// //   const renderCustomPaidInputs = () => {
// //     const people = [...selectedFriends, user.id];
// //     return (
// //       <View>
// //         <Text style={styles.sectionTitle}>Who Paid How Much:</Text>
// //         {people.map((id) => {
// //           const name = id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username;
// //           return (
// //             <View key={id} style={styles.friendItem}>
// //               <Text style={styles.username}>{name}</Text>
// //               <TextInput
// //                 placeholder="Amount paid"
// //                 keyboardType="numeric"
// //                 style={[styles.input, { marginLeft: 10 }]}
// //                 onChangeText={(val) => handleCustomPaidChange(id, val)}
// //                 value={customPaid[id]?.toString() || ''}
// //                 placeholderTextColor="#888"
// //               />
// //             </View>
// //           );
// //         })}
// //       </View>
// //     );
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.scrollContainer}>
// //       <Text style={styles.header}>Add Expense</Text>

// //       {/* Amount Input */}
// //       <View style={styles.inputContainer}>
// //         <Text style={styles.pkrIcon}>₨</Text>    
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter amount"
// //           placeholderTextColor="#888"
// //           keyboardType="numeric"
// //           value={enteredAmount}
// //           onChangeText={setEnteredAmount}
// //         />
// //       </View>

// //       {/* Description Input */}
// //       <View style={styles.inputContainer}>
// //         <Icon name="description" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter description"
// //           placeholderTextColor="#888"
// //           value={enteredDescription}
// //           onChangeText={setEnteredDescription}
// //         />
// //       </View>

// //       {/* Split Type */}
// //       <Text style={styles.sectionTitle}>Split Type</Text>
// //       <View style={styles.selectionContainer}>
// //         <TouchableOpacity
// //           style={[styles.optionButton, splitType === 'equal' && styles.selectedOption]}
// //           onPress={() => setSplitType('equal')}
// //         >
// //           <Icon name="call-split" size={20} color={splitType === 'equal' ? '#121212' : '#D2B48C'} />
// //           <Text style={[styles.optionText, splitType === 'equal' && styles.selectedText]}>Equal</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.optionButton, splitType === 'full' && styles.selectedOption]}
// //           onPress={() => setSplitType('full')}
// //         >
// //           <Icon name="all-inclusive" size={20} color={splitType === 'full' ? '#121212' : '#D2B48C'} />
// //           <Text style={[styles.optionText, splitType === 'full' && styles.selectedText]}>Full</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.optionButton, splitType === 'custom' && styles.selectedOption]}
// //           onPress={() => setSplitType('custom')}
// //         >
// //           <Icon name="pie-chart" size={20} color={splitType === 'custom' ? '#121212' : '#D2B48C'} />
// //           <Text style={[styles.optionText, splitType === 'custom' && styles.selectedText]}>Custom</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Paid By */}
// //       <Text style={styles.sectionTitle}>Paid By</Text>
// //       <View style={styles.selectionContainer}>
// //         <TouchableOpacity
// //           style={[styles.optionButton, selectedPayer === 'user' && styles.selectedOption]}
// //           onPress={() => {
// //             setSelectedPayer('user');
// //             setPayerFriendId(null);
// //           }}
// //         >
// //           <Icon 
// //             name="person" 
// //             size={20} 
// //             color={selectedPayer === 'user' ? '#121212' : '#D2B48C'} 
// //           />
// //           <Text style={[styles.optionText, selectedPayer === 'user' && styles.selectedText]}>
// //             You
// //           </Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.optionButton, selectedPayer === 'friend' && styles.selectedOption]}
// //           onPress={() => setSelectedPayer('friend')}
// //         >
// //           <Icon 
// //             name="people" 
// //             size={20} 
// //             color={selectedPayer === 'friend' ? '#121212' : '#D2B48C'} 
// //           />
// //           <Text style={[styles.optionText, selectedPayer === 'friend' && styles.selectedText]}>
// //             Friend
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
      
// //       {/* Payer Friend Selection */}
// //       {selectedPayer === 'friend' && (
// //         <TouchableOpacity
// //           style={styles.payerSelector}
// //           onPress={() => setShowPayerModal(true)}
// //         >
// //           <Text style={styles.payerLabel}>Payer:</Text>
// //           <Text style={styles.payerName}>{getPayerName()}</Text>
// //           <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
// //         </TouchableOpacity>
// //       )}

// //       {/* Friend Selection Header */}
// //       <View style={styles.friendSelectionHeader}>
// //         <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
// //         {splitType === 'equal' && selectedFriends.length > 0 && (
// //           <Text style={styles.splitInfo}>
// //             Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
// //           </Text>
// //         )}
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search friends"
// //           placeholderTextColor="#888"
// //           value={friendSearchQuery}
// //           onChangeText={setFriendSearchQuery}
// //         />
// //       </View>

// //       {/* Friends List */}
// //       {loading ? (
// //         <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
// //       ) : (
// //         <View>
// //           {/* Pinned Friends Section */}
// //           {pinnedFriends.length > 0 && (
// //             <View style={styles.sectionContainer}>
// //               <Text style={styles.sectionSubtitle}>Pinned Friends</Text>
// //               {pinnedFriends.map(friend => (
// //                 <FriendItem 
// //                   key={friend.id} 
// //                   friend={friend} 
// //                   selectedFriends={selectedFriends}
// //                   toggleFriendSelection={toggleFriendSelection}
// //                   togglePinFriend={togglePinFriend}
// //                   isPinned={true}
// //                 />
// //               ))}
// //             </View>
// //           )}


// // <View style={styles.sectionContainer}>
// //   <Text style={styles.sectionSubtitle}>All Friends</Text>
  
// //   {/* Pinned friends should not appear in All Friends when pinned */}
// //   {filteredFriends
// //     .filter(friend => !pinnedFriends.some(pf => pf.id === friend.id))
// //     .slice(0, showAllFriends ? undefined : 5)
// //     .map(friend => (
// //       <FriendItem 
// //         key={friend.id} 
// //         friend={friend} 
// //         selectedFriends={selectedFriends}
// //         toggleFriendSelection={toggleFriendSelection}
// //         togglePinFriend={togglePinFriend}
// //         isPinned={pinnedFriends.some(f => f.id === friend.id)}
// //       />
// //     ))}
  
// //   {/* Show/Hide Button - only appears if there are more than 5 friends */}
// //   {filteredFriends.filter(friend => !pinnedFriends.some(pf => pf.id === friend.id)).length > 5 && (
// //     <TouchableOpacity
// //       style={styles.seeMoreButton}
// //       onPress={() => setShowAllFriends(!showAllFriends)}
// //     >
// //       <Text style={styles.seeMoreText}>
// //         {showAllFriends 
// //           ? "Hide" 
// //           : `See More (${filteredFriends.filter(friend => !pinnedFriends.some(pf => pf.id === friend.id)).length - 5})`}
// //       </Text>
// //       <Icon 
// //         name={showAllFriends ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
// //         size={20} 
// //         color="#D2B48C" 
// //       />
// //     </TouchableOpacity>
// //   )}
// // </View>
// //         </View>
// //       )}

// //       {/* Custom Paid Inputs */}
// //       {splitType === 'custom' && renderCustomPaidInputs()}

// //       {/* Submit Button */}
// //       {selectedFriends.length > 0 && (
// //         <TouchableOpacity
// //           style={[
// //             styles.submitButton,
// //             (!enteredDescription || (splitType !== 'custom' && !enteredAmount)) && styles.disabledButton
// //           ]}
// //           onPress={sendExpense}
// //           disabled={!enteredDescription || (splitType !== 'custom' && !enteredAmount)}
// //         >
// //           {saving ? (
// //             <ActivityIndicator color="#FFF0DC" />
// //           ) : (
// //             <Text style={styles.submitButtonText}>
// //               {splitType === 'equal'
// //                 ? `Split Rs${enteredAmount} among ${selectedFriends.length + 1} people`
// //                 : splitType === 'full'
// //                 ? `Record full Rs${enteredAmount} for ${selectedFriends.length} friend(s)`
// //                 : `Record Custom Expense`}
// //             </Text>
// //           )}
// //         </TouchableOpacity>
// //       )}
      
// //       {/* Payer Selection Modal */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={showPayerModal}
// //         onRequestClose={() => setShowPayerModal(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Select Payer</Text>
            
// //             <FlatList
// //               data={friends.filter(f => selectedFriends.includes(f.friendProfile?.id))}
// //               keyExtractor={(item) => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.modalOption}
// //                   onPress={() => handlePayerSelection(item.friendProfile?.id)}
// //                 >
// //                   <Icon 
// //                     name={payerFriendId === item.friendProfile?.id ? "radio-button-checked" : "radio-button-unchecked"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                   />
// //                   <Text style={styles.modalOptionText}>
// //                     {item.friendProfile?.username || "Unknown User"}
// //                   </Text>
// //                 </TouchableOpacity>
// //               )}
// //               ListEmptyComponent={
// //                 <Text style={styles.emptyText}>No friends selected</Text>
// //               }
// //             />
            
// //             <TouchableOpacity
// //               style={styles.modalCloseButton}
// //               onPress={() => setShowPayerModal(false)}
// //             >
// //               <Text style={styles.modalCloseText}>Cancel</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </ScrollView>
// //   );
// // }



// //ios test
// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 20,
//     backgroundColor: 'black',
//     paddingBottom: 80,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 20,
//     textAlign: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
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
//   pkrIcon: {
//     color: '#D2B48C',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   seeMoreButton: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: 12,
//   backgroundColor: '#1E1E1E',
//   borderRadius: 10,
//   borderWidth: 1,
//   borderColor: '#333',
//   marginTop: 8,
// },
// seeMoreText: {
//   color: '#D2B48C',
//   marginRight: 5,
//   fontWeight: '600',
// },
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
//   selectionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   optionButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 8,
//     padding: 10,
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     flexDirection: 'row',
//   },
//   selectedOption: {
//     backgroundColor: '#543A14',
//     borderColor: '#D2B48C',
//   },
//   optionText: {
//     color: '#D2B48C',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   selectedText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   friendItem: {
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
//   selectedFriend: {
//     backgroundColor: '#1E2E1A',
//     borderColor: '#4CAF50',
//   },
//   friendInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userIcon: {
//     marginRight: 12,
//   },
//   username: {
//     fontSize: 15,
//     color: '#FFF0DC',
//   },
//   emptyText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 14,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   friendSelectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   splitInfo: {
//     color: '#4CAF50',
//     fontSize: 12,
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
//   disabledButton: {
//     backgroundColor: '#333',
//     borderColor: '#555',
//   },
//   submitButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   payerSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   payerLabel: {
//     color: '#D2B48C',
//     marginRight: 10,
//     fontWeight: '500',
//   },
//   payerName: {
//     flex: 1,
//     color: '#FFF0DC',
//     fontSize: 15,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: '#543A14',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   modalOptionText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginLeft: 15,
//   },
//   modalCloseButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: '#543A14',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalCloseText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
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
//   sectionContainer: {
//     marginBottom: 20,
//   },
//   sectionSubtitle: {
//     color: '#D2B48C',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   seeMoreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#333',
//     marginTop: 8,
//   },
//   seeMoreText: {
//     color: '#D2B48C',
//     marginRight: 5,
//     fontWeight: '600',
//   },
//   pinButton: {
//     padding: 8,
//     marginLeft: 10,
//   },
// });

//IPHONE pe ok white cheez expand ki 
// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator,
//   Alert, StyleSheet, ScrollView, Modal
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Icon from '../components/IconWrapper';

// export default function Add() {
//   const [friends, setFriends] = useState([]);
//   const [selectedFriends, setSelectedFriends] = useState([]);
//   const [enteredAmount, setEnteredAmount] = useState('');
//   const [enteredDescription, setEnteredDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [splitType, setSplitType] = useState('equal');
//   const [selectedPayer, setSelectedPayer] = useState('user');
//   const [payerFriendId, setPayerFriendId] = useState(null);
//   const [showPayerModal, setShowPayerModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [customPaid, setCustomPaid] = useState({});
//   const [friendSearchQuery, setFriendSearchQuery] = useState('');
//   const [showAllFriends, setShowAllFriends] = useState(false);
//   const [pinnedFriends, setPinnedFriends] = useState([]);

//   // Load pinned friends on component mount
//   useEffect(() => {
//     const loadPinnedFriends = async () => {
//       try {
//         const savedPinned = await AsyncStorage.getItem('pinnedFriends');
//         if (savedPinned) {
//           setPinnedFriends(JSON.parse(savedPinned));
//         }
//       } catch (error) {
//         console.error('Error loading pinned friends:', error);
//       }
//     };
    
//     loadPinnedFriends();
//   }, []);

//   // Save pinned friends when they change
//   useEffect(() => {
//     const savePinnedFriends = async () => {
//       try {
//         await AsyncStorage.setItem('pinnedFriends', JSON.stringify(pinnedFriends));
//       } catch (error) {
//         console.error('Error saving pinned friends:', error);
//       }
//     };
    
//     if (pinnedFriends.length > 0) {
//       savePinnedFriends();
//     }
//   }, [pinnedFriends]);

//   const getPayerName = () => {
//     if (!payerFriendId) return "Select Friend";
//     const friend = friends.find(f => f.friendProfile?.id === payerFriendId);
//     return friend?.friendProfile?.username || "Unknown";
//   };

//   // Filter friends based on search query
//   const filteredFriends = friends.filter(friend =>
//     friend.friendProfile?.username?.toLowerCase().includes(friendSearchQuery.toLowerCase())
//   );

//   // Toggle pin status for a friend
//   const togglePinFriend = (friendId) => {
//     const isPinned = pinnedFriends.includes(friendId);
    
//     if (isPinned) {
//       // Unpin
//       setPinnedFriends(prev => prev.filter(id => id !== friendId));
//     } else {
//       // Pin (max 3)
//       if (pinnedFriends.length >= 3) {
//         Alert.alert('Pin Limit', 'You can only pin up to 3 friends');
//         return;
//       }
//       setPinnedFriends(prev => [...prev, friendId]);
//     }
//   };

//   const FriendItem = ({
//     friend,
//     selectedFriends,
//     toggleFriendSelection,
//     togglePinFriend,
//   }) => {
//     const friendId = friend.friendProfile?.id;
//     const isPinned = pinnedFriends.includes(friendId);
    
//     return (
//       <TouchableOpacity
//         style={[
//           styles.friendItem,
//           selectedFriends.includes(friendId) && styles.selectedFriend
//         ]}
//         onPress={() => toggleFriendSelection(friendId)}
//         onLongPress={() => togglePinFriend(friendId)}
//       >
//         <View style={styles.friendInfo}>
//           <Icon
//             name={
//               selectedFriends.includes(friendId)
//                 ? "check-box"
//                 : "check-box-outline-blank"
//             }
//             size={24}
//             style={[styles.userIcon, { color: "#D2B48C" }]}
//           />
//           <Text style={styles.username}>
//             {friend.friendProfile?.username || "Unknown User"}
//           </Text>
//         </View>
        
//         <TouchableOpacity
//           onPress={() => togglePinFriend(friendId)}
//           style={styles.pinButton}
//         >
//           <Icon
//             name={isPinned ? "push-pin" : "bookmark-outline"}
//             size={20}
//             style={{ color: isPinned ? "#D2B48C" : "#555" }}
//           />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (user) getFriends();
//   }, [user]);

//   async function getFriends() {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('friends')
//         .select(`id, user_id, friends_id, status,
//           sender:profiles!user_id(id, username),
//           receiver:profiles!friends_id(id, username)`)
//         .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
//         .eq('status', 'accepted');

//       if (error) return console.error('Error fetching friends:', error);

//       const transformed = data.map(friendship => ({
//         ...friendship,
//         friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
//       }));

//       setFriends(transformed || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const toggleFriendSelection = (friendId) => {
//     setSelectedFriends(prev => prev.includes(friendId)
//       ? prev.filter(id => id !== friendId)
//       : [...prev, friendId]);
//   };

//   const handlePayerSelection = (friendId) => {
//     setPayerFriendId(friendId);
//     setShowPayerModal(false);
//   };

//   const generateGroupId = () => `expense_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

//   const handleCustomPaidChange = (id, value) => {
//     setCustomPaid(prev => ({ ...prev, [id]: value }));
//   };

//   function getSettlementBreakdown(payments) {
//     const total = Object.values(payments).reduce((sum, val) => sum + val, 0);
//     const names = Object.keys(payments);
//     const equalShare = total / names.length;
//     const balances = names.map(name => ({
//       name,
//       balance: parseFloat((payments[name] - equalShare).toFixed(2))
//     }));
//     const debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p, balance: -p.balance }));
//     const creditors = balances.filter(p => p.balance > 0);
//     const settlements = [];
//     let i = 0, j = 0;
//     while (i < debtors.length && j < creditors.length) {
//       const debtor = debtors[i];
//       const creditor = creditors[j];
//       const amount = Math.min(debtor.balance, creditor.balance);
//       settlements.push({ from: debtor.name, to: creditor.name, amount: parseFloat(amount.toFixed(2)) });
//       debtor.balance -= amount;
//       creditor.balance -= amount;
//       if (debtor.balance < 0.01) i++;
//       if (creditor.balance < 0.01) j++;
//     }
//     return { equalShare, settlements };
//   }

//   async function sendExpense() {
//     if (!user) return Alert.alert('Error', 'User not logged in');
//     if (selectedFriends.length === 0) return Alert.alert('Error', 'Please select at least one friend');

//     const amountValue = parseFloat(enteredAmount);
//     if (isNaN(amountValue) && splitType !== 'custom') return Alert.alert('Error', 'Enter valid amount');

//     const groupId = generateGroupId();
//     const participants = [...selectedFriends, user.id];

//     if (splitType === 'custom') {
//       const paidMap = {};
//       let total = 0;
//       participants.forEach(id => {
//         const paid = parseFloat(customPaid[id]) || 0;
//         paidMap[id] = paid;
//         total += paid;
//       });
//       const result = getSettlementBreakdown(paidMap);
//       const dbData = {
//         user_id: user.id,
//         group_id: groupId,
//         description: enteredDescription,
//         total_amount: parseFloat(total.toFixed(2)),
//         total_people: participants.length,
//         participants: participants.map(id => ({
//           id,
//           username: id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username,
//           paid: parseFloat(customPaid[id]) || 0
//         })),
//         settlements: result.settlements,
//       };
//       const { error } = await supabase.from('custom_expenses').insert([dbData]);
//       if (error) return Alert.alert("Error", error.message);
//       Alert.alert("Success", "Custom expense saved!");
//       setCustomPaid({});
//       setSelectedFriends([]);
//       setEnteredDescription('');
//       return;
//     }

//     let splitAmount = amountValue / participants.length;
//     let payerId = selectedPayer === 'friend' ? payerFriendId : user.id;
//     if (selectedPayer === 'friend' && !payerFriendId) return setShowPayerModal(true);

//     const expenses = participants.filter(id => id !== payerId).map(participantId => ({
//       user_id: payerId,
//       friend_id: participantId,
//       amount: parseFloat(splitAmount.toFixed(2)),
//       description: enteredDescription,
//       split_type: splitType,
//       total_amount: amountValue,
//       total_people: participants.length,
//       group_id: groupId,
//       created_at: new Date().toISOString()
//     }));

//     const { error } = await supabase.from('expenses').insert(expenses);
//     if (error) return Alert.alert('Error', error.message);
//     Alert.alert('Success', `Expense of Rs${amountValue.toFixed(2)} saved!`);
//     setEnteredAmount('');
//     setEnteredDescription('');
//     setSelectedFriends([]);
//     setPayerFriendId(null);
//   }

//   const renderCustomPaidInputs = () => {
//     const people = [...selectedFriends, user.id];
//     return (
//       <View>
//         <Text style={styles.sectionTitle}>Who Paid How Much:</Text>
//         {people.map((id) => {
//           const name = id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username;
//           return (
//             <View key={id} style={styles.friendItem}>
//               <Text style={styles.username}>{name}</Text>
//               <TextInput
//                 placeholder="Amount paid"
//                 keyboardType="numeric"
//                 style={[styles.input, { marginLeft: 10 }]}
//                 onChangeText={(val) => handleCustomPaidChange(id, val)}
//                 value={customPaid[id]?.toString() || ''}
//                 placeholderTextColor="#888"
//               />
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}>Add Expense</Text>

//       {/* Amount Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.pkrIcon}>₨</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter amount"
//           placeholderTextColor="#888"
//           keyboardType="numeric"
//           value={enteredAmount}
//           onChangeText={setEnteredAmount}
//         />
//       </View>

//       {/* Description Input */}
//       <View style={styles.inputContainer}>
//         <Icon name="description" size={20} style={[styles.icon, { color: "#D2B48C" }]} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter description"
//           placeholderTextColor="#888"
//           value={enteredDescription}
//           onChangeText={setEnteredDescription}
//         />
//       </View>

//       {/* Split Type */}
//       <Text style={styles.sectionTitle}>Split Type</Text>
//       <View style={styles.selectionContainer}>
//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'equal' && styles.selectedOption]}
//           onPress={() => setSplitType('equal')}
//         >
//           <Icon name="call-split" size={20} style={{ color: splitType === 'equal' ? '#121212' : '#D2B48C' }} />
//           <Text style={[styles.optionText, splitType === 'equal' && styles.selectedText]}>Equal</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'full' && styles.selectedOption]}
//           onPress={() => setSplitType('full')}
//         >
//           <Icon name="all-inclusive" size={20} style={{ color: splitType === 'full' ? '#121212' : '#D2B48C' }} />
//           <Text style={[styles.optionText, splitType === 'full' && styles.selectedText]}>Full</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, splitType === 'custom' && styles.selectedOption]}
//           onPress={() => setSplitType('custom')}
//         >
//           <Icon name="pie-chart" size={20} style={{ color: splitType === 'custom' ? '#121212' : '#D2B48C' }} />
//           <Text style={[styles.optionText, splitType === 'custom' && styles.selectedText]}>Custom</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Paid By */}
//       <Text style={styles.sectionTitle}>Paid By</Text>
//       <View style={styles.selectionContainer}>
//         <TouchableOpacity
//           style={[styles.optionButton, selectedPayer === 'user' && styles.selectedOption]}
//           onPress={() => {
//             setSelectedPayer('user');
//             setPayerFriendId(null);
//           }}
//         >
//           <Icon
//             name="person"
//             size={20}
//             style={{ color: selectedPayer === 'user' ? '#121212' : '#D2B48C' }}
//           />
//           <Text style={[styles.optionText, selectedPayer === 'user' && styles.selectedText]}>
//             You
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.optionButton, selectedPayer === 'friend' && styles.selectedOption]}
//           onPress={() => setSelectedPayer('friend')}
//         >
//           <Icon
//             name="people"
//             size={20}
//             style={{ color: selectedPayer === 'friend' ? '#121212' : '#D2B48C' }}
//           />
//           <Text style={[styles.optionText, selectedPayer === 'friend' && styles.selectedText]}>
//             Friend
//           </Text>
//         </TouchableOpacity>
//       </View>
      
//       {/* Payer Friend Selection */}
//       {selectedPayer === 'friend' && (
//         <TouchableOpacity
//           style={styles.payerSelector}
//           onPress={() => setShowPayerModal(true)}
//         >
//           <Text style={styles.payerLabel}>Payer:</Text>
//           <Text style={styles.payerName}>{getPayerName()}</Text>
//           <Icon name="arrow-drop-down" size={24} style={{ color: "#D2B48C" }} />
//         </TouchableOpacity>
//       )}

//       {/* Friend Selection Header */}
//       <View style={styles.friendSelectionHeader}>
//         <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
//         {splitType === 'equal' && selectedFriends.length > 0 && (
//           <Text style={styles.splitInfo}>
//             Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
//           </Text>
//         )}
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} style={[styles.searchIcon, { color: "#888" }]} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search friends"
//           placeholderTextColor="#888"
//           value={friendSearchQuery}
//           onChangeText={setFriendSearchQuery}
//         />
//       </View>

//       {/* Friends List */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
//       ) : (
//         <View>
//           {/* Pinned Friends Section */}
//           {pinnedFriends.length > 0 && (
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionSubtitle}>Pinned Friends</Text>
//               {friends
//                 .filter(friend => pinnedFriends.includes(friend.friendProfile?.id))
//                 .map(friend => (
//                   <FriendItem
//                     key={friend.id}
//                     friend={friend}
//                     selectedFriends={selectedFriends}
//                     toggleFriendSelection={toggleFriendSelection}
//                     togglePinFriend={togglePinFriend}
//                   />
//                 ))}
//             </View>
//           )}

//           {/* All Friends Section */}
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionSubtitle}>All Friends</Text>
//             {filteredFriends
//               .filter(friend => !pinnedFriends.includes(friend.friendProfile?.id))
//               .slice(0, showAllFriends ? undefined : 5)
//               .map(friend => (
//                 <FriendItem
//                   key={friend.id}
//                   friend={friend}
//                   selectedFriends={selectedFriends}
//                   toggleFriendSelection={toggleFriendSelection}
//                   togglePinFriend={togglePinFriend}
//                 />
//               ))}
            
//             {/* Show/Hide Button - only appears if there are more than 5 friends */}
//             {filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length > 5 && (
//               <TouchableOpacity
//                 style={styles.seeMoreButton}
//                 onPress={() => setShowAllFriends(!showAllFriends)}
//               >
//                 <Text style={styles.seeMoreText}>
//                   {showAllFriends
//                     ? "Hide"
//                     : `See More (${filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length - 5})`}
//                 </Text>
//                 <Icon
//                   name={showAllFriends ? "keyboard-arrow-up" : "keyboard-arrow-down"}
//                   size={20}
//                   style={{ color: "#D2B48C" }}
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}

//       {/* Custom Paid Inputs */}
//       {splitType === 'custom' && renderCustomPaidInputs()}

//       {/* Submit Button */}
//       {selectedFriends.length > 0 && (
//         <TouchableOpacity
//           style={[
//             styles.submitButton,
//             (!enteredDescription || (splitType !== 'custom' && !enteredAmount)) && styles.disabledButton
//           ]}
//           onPress={sendExpense}
//           disabled={!enteredDescription || (splitType !== 'custom' && !enteredAmount)}
//         >
//           {saving ? (
//             <ActivityIndicator color="#FFF0DC" />
//           ) : (
//             <Text style={styles.submitButtonText}>
//               {splitType === 'equal'
//                 ? `Split Rs${enteredAmount} among ${selectedFriends.length + 1} people`
//                 : splitType === 'full'
//                 ? `Record full Rs${enteredAmount} for ${selectedFriends.length} friend(s)`
//                 : `Record Custom Expense`}
//             </Text>
//           )}
//         </TouchableOpacity>
//       )}
      
//       {/* Payer Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showPayerModal}
//         onRequestClose={() => setShowPayerModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Payer</Text>
            
//             <FlatList
//               data={friends.filter(f => selectedFriends.includes(f.friendProfile?.id))}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalOption}
//                   onPress={() => handlePayerSelection(item.friendProfile?.id)}
//                 >
//                   <Icon
//                     name={payerFriendId === item.friendProfile?.id ? "radio-button-checked" : "radio-button-unchecked"}
//                     size={24}
//                     style={{ color: "#D2B48C" }}
//                   />
//                   <Text style={styles.modalOptionText}>
//                     {item.friendProfile?.username || "Unknown User"}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No friends selected</Text>
//               }
//             />
            
//             <TouchableOpacity
//               style={styles.modalCloseButton}
//               onPress={() => setShowPayerModal(false)}
//             >
//               <Text style={styles.modalCloseText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     padding: 20,
//     backgroundColor: 'black',
//     paddingBottom: 80,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     marginBottom: 20,
//     textAlign: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#543A14',
//     paddingBottom: 10,
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
//   pkrIcon: {
//     color: '#D2B48C',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   seeMoreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 12,
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#333',
//     marginTop: 8,
//   },
//   seeMoreText: {
//     color: '#D2B48C',
//     marginRight: 5,
//     fontWeight: '600',
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
//   selectionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   optionButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 8,
//     padding: 10,
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     flexDirection: 'row',
//   },
//   selectedOption: {
//     backgroundColor: '#543A14',
//     borderColor: '#D2B48C',
//   },
//   optionText: {
//     color: '#D2B48C',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   selectedText: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   friendItem: {
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
//   selectedFriend: {
//     backgroundColor: '#1E2E1A',
//     borderColor: '#4CAF50',
//   },
//   friendInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userIcon: {
//     marginRight: 12,
//   },
//   username: {
//     fontSize: 15,
//     color: '#FFF0DC',
//   },
//   emptyText: {
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 14,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   friendSelectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   splitInfo: {
//     color: '#4CAF50',
//     fontSize: 12,
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
//   disabledButton: {
//     backgroundColor: '#333',
//     borderColor: '#555',
//   },
//   submitButtonText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   payerSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//   payerLabel: {
//     color: '#D2B48C',
//     marginRight: 10,
//     fontWeight: '500',
//   },
//   payerName: {
//     flex: 1,
//     color: '#FFF0DC',
//     fontSize: 15,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 15,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: '#543A14',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF0DC',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   modalOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   modalOptionText: {
//     color: '#FFF0DC',
//     fontSize: 16,
//     marginLeft: 15,
//   },
//   modalCloseButton: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: '#543A14',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalCloseText: {
//     color: '#FFF0DC',
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
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
//   sectionContainer: {
//     marginBottom: 20,
//   },
//   sectionSubtitle: {
//     color: '#D2B48C',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   pinButton: {
//     padding: 8,
//     marginLeft: 10,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator,
  Alert, StyleSheet, ScrollView, Modal, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Add() {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [splitType, setSplitType] = useState('equal');
  const [selectedPayer, setSelectedPayer] = useState('user');
  const [payerFriendId, setPayerFriendId] = useState(null);
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customPaid, setCustomPaid] = useState({});
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [pinnedFriends, setPinnedFriends] = useState([]);

  // Load pinned friends on component mount
  useEffect(() => {
    const loadPinnedFriends = async () => {
      try {
        const savedPinned = await AsyncStorage.getItem('pinnedFriends');
        if (savedPinned) {
          setPinnedFriends(JSON.parse(savedPinned));
        }
      } catch (error) {
        console.error('Error loading pinned friends:', error);
      }
    };
    
    loadPinnedFriends();
  }, []);

  // Save pinned friends when they change
  useEffect(() => {
    const savePinnedFriends = async () => {
      try {
        await AsyncStorage.setItem('pinnedFriends', JSON.stringify(pinnedFriends));
      } catch (error) {
        console.error('Error saving pinned friends:', error);
      }
    };
    
    if (pinnedFriends.length > 0) {
      savePinnedFriends();
    }
  }, [pinnedFriends]);

  const getPayerName = () => {
    if (!payerFriendId) return "Select Friend";
    const friend = friends.find(f => f.friendProfile?.id === payerFriendId);
    return friend?.friendProfile?.username || "Unknown";
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend =>
    friend.friendProfile?.username?.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  // Toggle pin status for a friend
  const togglePinFriend = (friendId) => {
    const isPinned = pinnedFriends.includes(friendId);
    
    if (isPinned) {
      // Unpin
      setPinnedFriends(prev => prev.filter(id => id !== friendId));
    } else {
      // Pin (max 3)
      if (pinnedFriends.length >= 3) {
        Alert.alert('Pin Limit', 'You can only pin up to 3 friends');
        return;
      }
      setPinnedFriends(prev => [...prev, friendId]);
    }
  };

  const FriendItem = ({
    friend,
    selectedFriends,
    toggleFriendSelection,
    togglePinFriend,
  }) => {
    const friendId = friend.friendProfile?.id;
    const isPinned = pinnedFriends.includes(friendId);
    
    return (
      <TouchableOpacity
        style={[
          styles.friendItem,
          selectedFriends.includes(friendId) && styles.selectedFriend
        ]}
        onPress={() => toggleFriendSelection(friendId)}
        onLongPress={() => togglePinFriend(friendId)}
      >
        <View style={styles.friendInfo}>
          <MaterialIcons
            name={
              selectedFriends.includes(friendId)
                ? "check-box"
                : "check-box-outline-blank"
            }
            size={24}
            color="#D2B48C"
            style={styles.userIcon}
          />
          <Text style={styles.username}>
            {friend.friendProfile?.username || "Unknown User"}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => togglePinFriend(friendId)}
          style={styles.pinButton}
        >
          <Ionicons
            name={isPinned ? "ios-pin" : "ios-pin-outline"}
            size={20}
            color={isPinned ? "#D2B48C" : "#555"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error);
      setUser(user);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) getFriends();
  }, [user]);

  async function getFriends() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`id, user_id, friends_id, status,
          sender:profiles!user_id(id, username),
          receiver:profiles!friends_id(id, username)`)
        .or(`user_id.eq.${user.id},friends_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) return console.error('Error fetching friends:', error);

      const transformed = data.map(friendship => ({
        ...friendship,
        friendProfile: friendship.user_id === user.id ? friendship.receiver : friendship.sender
      }));

      setFriends(transformed || []);
    } finally {
      setLoading(false);
    }
  }

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => prev.includes(friendId)
      ? prev.filter(id => id !== friendId)
      : [...prev, friendId]);
  };

  const handlePayerSelection = (friendId) => {
    setPayerFriendId(friendId);
    setShowPayerModal(false);
  };

  const generateGroupId = () => `expense_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const handleCustomPaidChange = (id, value) => {
    setCustomPaid(prev => ({ ...prev, [id]: value }));
  };

  function getSettlementBreakdown(payments) {
    const total = Object.values(payments).reduce((sum, val) => sum + val, 0);
    const names = Object.keys(payments);
    const equalShare = total / names.length;
    const balances = names.map(name => ({
      name,
      balance: parseFloat((payments[name] - equalShare).toFixed(2))
    }));
    const debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p, balance: -p.balance }));
    const creditors = balances.filter(p => p.balance > 0);
    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.balance, creditor.balance);
      settlements.push({ from: debtor.name, to: creditor.name, amount: parseFloat(amount.toFixed(2)) });
      debtor.balance -= amount;
      creditor.balance -= amount;
      if (debtor.balance < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }
    return { equalShare, settlements };
  }

  async function sendExpense() {
    if (!user) return Alert.alert('Error', 'User not logged in');
    if (selectedFriends.length === 0) return Alert.alert('Error', 'Please select at least one friend');

    const amountValue = parseFloat(enteredAmount);
    if (isNaN(amountValue) && splitType !== 'custom') return Alert.alert('Error', 'Enter valid amount');

    const groupId = generateGroupId();
    const participants = [...selectedFriends, user.id];

    if (splitType === 'custom') {
      const paidMap = {};
      let total = 0;
      participants.forEach(id => {
        const paid = parseFloat(customPaid[id]) || 0;
        paidMap[id] = paid;
        total += paid;
      });
      const result = getSettlementBreakdown(paidMap);
      const dbData = {
        user_id: user.id,
        group_id: groupId,
        description: enteredDescription,
        total_amount: parseFloat(total.toFixed(2)),
        total_people: participants.length,
        participants: participants.map(id => ({
          id,
          username: id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username,
          paid: parseFloat(customPaid[id]) || 0
        })),
        settlements: result.settlements,
      };
      const { error } = await supabase.from('custom_expenses').insert([dbData]);
      if (error) return Alert.alert("Error", error.message);
      Alert.alert("Success", "Custom expense saved!");
      setCustomPaid({});
      setSelectedFriends([]);
      setEnteredDescription('');
      return;
    }

    let splitAmount = amountValue / participants.length;
    let payerId = selectedPayer === 'friend' ? payerFriendId : user.id;
    if (selectedPayer === 'friend' && !payerFriendId) return setShowPayerModal(true);

    const expenses = participants.filter(id => id !== payerId).map(participantId => ({
      user_id: payerId,
      friend_id: participantId,
      amount: parseFloat(splitAmount.toFixed(2)),
      description: enteredDescription,
      split_type: splitType,
      total_amount: amountValue,
      total_people: participants.length,
      group_id: groupId,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('expenses').insert(expenses);
    if (error) return Alert.alert('Error', error.message);
    Alert.alert('Success', `Expense of Rs${amountValue.toFixed(2)} saved!`);
    setEnteredAmount('');
    setEnteredDescription('');
    setSelectedFriends([]);
    setPayerFriendId(null);
  }

  const renderCustomPaidInputs = () => {
    const people = [...selectedFriends, user.id];
    return (
      <View>
        <Text style={styles.sectionTitle}>Who Paid How Much:</Text>
        {people.map((id) => {
          const name = id === user.id ? 'You' : friends.find(f => f.friendProfile?.id === id)?.friendProfile?.username;
          return (
            <View key={id} style={styles.friendItem}>
              <Text style={styles.username}>{name}</Text>
              <TextInput
                placeholder="Amount paid"
                keyboardType="numeric"
                style={[styles.input, { marginLeft: 10 }]}
                onChangeText={(val) => handleCustomPaidChange(id, val)}
                value={customPaid[id]?.toString() || ''}
                placeholderTextColor="#888"
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        <Text style={styles.header}>Add Expense</Text>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.pkrIcon}>₨</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={enteredAmount}
            onChangeText={setEnteredAmount}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="description" size={20} color="#D2B48C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            placeholderTextColor="#888"
            value={enteredDescription}
            onChangeText={setEnteredDescription}
          />
        </View>

        {/* Split Type */}
        <Text style={styles.sectionTitle}>Split Type</Text>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, splitType === 'equal' && styles.selectedOption]}
            onPress={() => setSplitType('equal')}
          >
            <MaterialIcons 
              name="call-split" 
              size={20} 
              color={splitType === 'equal' ? '#121212' : '#D2B48C'} 
            />
            <Text style={[styles.optionText, splitType === 'equal' && styles.selectedText]}>Equal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, splitType === 'full' && styles.selectedOption]}
            onPress={() => setSplitType('full')}
          >
            <MaterialIcons 
              name="all-inclusive" 
              size={20} 
              color={splitType === 'full' ? '#121212' : '#D2B48C'} 
            />
            <Text style={[styles.optionText, splitType === 'full' && styles.selectedText]}>Full</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, splitType === 'custom' && styles.selectedOption]}
            onPress={() => setSplitType('custom')}
          >
            <MaterialIcons 
              name="pie-chart" 
              size={20} 
              color={splitType === 'custom' ? '#121212' : '#D2B48C'} 
            />
            <Text style={[styles.optionText, splitType === 'custom' && styles.selectedText]}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Paid By */}
        <Text style={styles.sectionTitle}>Paid By</Text>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, selectedPayer === 'user' && styles.selectedOption]}
            onPress={() => {
              setSelectedPayer('user');
              setPayerFriendId(null);
            }}
          >
            <MaterialIcons
              name="person"
              size={20}
              color={selectedPayer === 'user' ? '#121212' : '#D2B48C'}
            />
            <Text style={[styles.optionText, selectedPayer === 'user' && styles.selectedText]}>
              You
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, selectedPayer === 'friend' && styles.selectedOption]}
            onPress={() => setSelectedPayer('friend')}
          >
            <MaterialIcons
              name="people"
              size={20}
              color={selectedPayer === 'friend' ? '#121212' : '#D2B48C'}
            />
            <Text style={[styles.optionText, selectedPayer === 'friend' && styles.selectedText]}>
              Friend
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Payer Friend Selection */}
        {selectedPayer === 'friend' && (
          <TouchableOpacity
            style={styles.payerSelector}
            onPress={() => setShowPayerModal(true)}
          >
            <Text style={styles.payerLabel}>Payer:</Text>
            <Text style={styles.payerName}>{getPayerName()}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#D2B48C" />
          </TouchableOpacity>
        )}

        {/* Friend Selection Header */}
        <View style={styles.friendSelectionHeader}>
          <Text style={styles.sectionTitle}>Select Friends ({selectedFriends.length} selected)</Text>
          {splitType === 'equal' && selectedFriends.length > 0 && (
            <Text style={styles.splitInfo}>
              Rs{(parseFloat(enteredAmount || 0) / (selectedFriends.length + 1)).toFixed(2)} per person
            </Text>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends"
            placeholderTextColor="#888"
            value={friendSearchQuery}
            onChangeText={setFriendSearchQuery}
          />
        </View>

        {/* Friends List */}
        {loading ? (
          <ActivityIndicator size="large" color="#D2B48C" style={styles.loader} />
        ) : (
          <View>
            {/* Pinned Friends Section */}
            {pinnedFriends.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionSubtitle}>Pinned Friends</Text>
                {friends
                  .filter(friend => pinnedFriends.includes(friend.friendProfile?.id))
                  .map(friend => (
                    <FriendItem
                      key={friend.id}
                      friend={friend}
                      selectedFriends={selectedFriends}
                      toggleFriendSelection={toggleFriendSelection}
                      togglePinFriend={togglePinFriend}
                    />
                  ))}
              </View>
            )}

            {/* All Friends Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionSubtitle}>All Friends</Text>
              {filteredFriends
                .filter(friend => !pinnedFriends.includes(friend.friendProfile?.id))
                .slice(0, showAllFriends ? undefined : 5)
                .map(friend => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    selectedFriends={selectedFriends}
                    toggleFriendSelection={toggleFriendSelection}
                    togglePinFriend={togglePinFriend}
                  />
                ))}
              
              {/* Show/Hide Button - only appears if there are more than 5 friends */}
              {filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length > 5 && (
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => setShowAllFriends(!showAllFriends)}
                >
                  <Text style={styles.seeMoreText}>
                    {showAllFriends
                      ? "Hide"
                      : `See More (${filteredFriends.filter(friend => !pinnedFriends.includes(friend.friendProfile?.id)).length - 5})`}
                  </Text>
                  <MaterialIcons
                    name={showAllFriends ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={20}
                    color="#D2B48C"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Custom Paid Inputs */}
        {splitType === 'custom' && renderCustomPaidInputs()}

        {/* Submit Button */}
        {selectedFriends.length > 0 && (
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!enteredDescription || (splitType !== 'custom' && !enteredAmount)) && styles.disabledButton
            ]}
            onPress={sendExpense}
            disabled={!enteredDescription || (splitType !== 'custom' && !enteredAmount)}
          >
            {saving ? (
              <ActivityIndicator color="#FFF0DC" />
            ) : (
              <Text style={styles.submitButtonText}>
                {splitType === 'equal'
                  ? `Split Rs${enteredAmount} among ${selectedFriends.length + 1} people`
                  : splitType === 'full'
                  ? `Record full Rs${enteredAmount} for ${selectedFriends.length} friend(s)`
                  : `Record Custom Expense`}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* Payer Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPayerModal}
        onRequestClose={() => setShowPayerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payer</Text>
            
            <FlatList
              data={friends.filter(f => selectedFriends.includes(f.friendProfile?.id))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handlePayerSelection(item.friendProfile?.id)}
                >
                  <MaterialIcons
                    name={payerFriendId === item.friendProfile?.id ? "radio-button-checked" : "radio-button-unchecked"}
                    size={24}
                    color="#D2B48C"
                  />
                  <Text style={styles.modalOptionText}>
                    {item.friendProfile?.username || "Unknown User"}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No friends selected</Text>
              }
            />
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPayerModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
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
  },
  scrollView: {
    backgroundColor: 'black',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF0DC',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#543A14',
    paddingBottom: 10,
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
  pkrIcon: {
    color: '#D2B48C',
    fontSize: 20,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 8,
  },
  seeMoreText: {
    color: '#D2B48C',
    marginRight: 5,
    fontWeight: '600',
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
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#543A14',
    flexDirection: 'row',
  },
  selectedOption: {
    backgroundColor: '#543A14',
    borderColor: '#D2B48C',
  },
  optionText: {
    color: '#D2B48C',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: 'black',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  friendItem: {
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
  selectedFriend: {
    backgroundColor: '#1E2E1A',
    borderColor: '#4CAF50',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    marginRight: 12,
  },
  username: {
    fontSize: 15,
    color: '#FFF0DC',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  loader: {
    marginTop: 30,
  },
  friendSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  splitInfo: {
    color: '#4CAF50',
    fontSize: 12,
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
  disabledButton: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  submitButtonText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  payerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  payerLabel: {
    color: '#D2B48C',
    marginRight: 10,
    fontWeight: '500',
  },
  payerName: {
    flex: 1,
    color: '#FFF0DC',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#543A14',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF0DC',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: '#FFF0DC',
    fontSize: 16,
    marginLeft: 15,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#543A14',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFF0DC',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    color: '#D2B48C',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pinButton: {
    padding: 8,
    marginLeft: 10,
  },
});