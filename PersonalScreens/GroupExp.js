// // import React, { useState, useEffect } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, ActivityIndicator } from 'react-native';
// // import { supabase } from '../lib/supabase';

// // export default function GroupExp({ navigation, route }) {
// //   const { groupId, members } = route.params;
// //   const [amount, setAmount] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [selectedPayer, setSelectedPayer] = useState(null);
// //   const [selectedMembers, setSelectedMembers] = useState([]);
// //   const [splitCount, setSplitCount] = useState(members.length);
// //   const [loading, setLoading] = useState(false);
// //   const [showPayerModal, setShowPayerModal] = useState(false);

// //   const toggleMember = (memberId) => {
// //     setSelectedMembers(prev => 
// //       prev.includes(memberId) 
// //         ? prev.filter(id => id !== memberId) 
// //         : [...prev, memberId]
// //     );
// //   };

// //   const calculateSplit = () => {
// //     const numericAmount = parseFloat(amount);
// //     if (isNaN(numericAmount)) return 0;
// //     return numericAmount / splitCount;
// //   };

// //   // const handleSubmit = async () => {
// //   //   if (!amount || !selectedPayer || selectedMembers.length === 0) {
// //   //     Alert.alert('Error', 'Please fill all required fields');
// //   //     return;
// //   //   }

// //   //   const splitAmount = calculateSplit();
// //   //   if (splitAmount <= 0) {
// //   //     Alert.alert('Error', 'Amount must be greater than 0');
// //   //     return;
// //   //   }

// //   //   setLoading(true);
// //   //   try {
// //   //     // Insert balance records directly
// //   //     const { error: balanceError } = await supabase
// //   //       .from('balances')
// //   //       .insert(
// //   //         selectedMembers
// //   //           .filter(memberId => memberId !== selectedPayer)
// //   //           .map(memberId => ({
// //   //             group_id: groupId,
// //   //             from_user_id: memberId,
// //   //             to_user_id: selectedPayer,
// //   //             amount: splitAmount,
// //   //             description: description || 'Expense settlement'
// //   //           }))
// //   //       );

// //   //     if (balanceError) throw balanceError;

// //   //     Alert.alert('Success', 'Expense added successfully');
// //   //     navigation.goBack();
// //   //   } catch (error) {
// //   //     console.error('Error adding expense:', error);
// //   //     Alert.alert('Error', error.message || 'Failed to add expense');
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };


// //   const handleSubmit = async () => {
// //     if (!amount || !selectedPayer || selectedMembers.length === 0) {
// //       Alert.alert('Error', 'Please fill all required fields');
// //       return;
// //     }
  
// //     const numericAmount = parseFloat(amount);
// //     if (isNaN(numericAmount)) {
// //       Alert.alert('Error', 'Invalid amount entered');
// //       return;
// //     }
  
// //     setLoading(true);
// //     try {
// //       const splitAmount = numericAmount / splitCount;
      
// //       // Insert directly into balances table
// //       const { error: balanceError } = await supabase
// //         .from('balances')
// //         .insert(
// //           selectedMembers
// //             .filter(memberId => memberId !== selectedPayer)
// //             .map(memberId => ({
// //               group_id: groupId,
// //               from_user_id: memberId,
// //               to_user_id: selectedPayer,
// //               amount: splitAmount,
// //               description: description || "Group Expense"
// //             }))
// //         );
  
// //       if (balanceError) throw balanceError;
  
// //       Alert.alert('Success', 'Expense added successfully');
// //       navigation.goBack();
// //     } catch (error) {
// //       console.error('Error adding expense:', error);
// //       Alert.alert('Error', error.message || 'Failed to add expense');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Amount"
// //         placeholderTextColor="#888"
// //         keyboardType="numeric"
// //         value={amount}
// //         onChangeText={setAmount}
// //       />

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Description"
// //         placeholderTextColor="#888"
// //         value={description}
// //         onChangeText={setDescription}
// //       />

// //       <Text style={styles.label}>Paid by:</Text>
// //       <TouchableOpacity
// //         style={styles.payerSelector}
// //         onPress={() => setShowPayerModal(true)}
// //       >
// //         <Text style={styles.payerText}>
// //           {selectedPayer 
// //             ? members.find(m => m.id === selectedPayer)?.username 
// //             : 'Select Payer'}
// //         </Text>
// //       </TouchableOpacity>

// //       <Modal
// //         visible={showPayerModal}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setShowPayerModal(false)}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <FlatList
// //               data={members}
// //               keyExtractor={item => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.modalItem}
// //                   onPress={() => {
// //                     setSelectedPayer(item.id);
// //                     setShowPayerModal(false);
// //                   }}
// //                 >
// //                   <Text style={styles.modalItemText}>{item.username}</Text>
// //                 </TouchableOpacity>
// //               )}
// //             />
// //           </View>
// //         </View>
// //       </Modal>

// //       <Text style={styles.label}>Split between:</Text>
// //       <FlatList
// //         data={members}
// //         keyExtractor={item => item.id}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={[
// //               styles.memberItem,
// //               selectedMembers.includes(item.id) && styles.selectedMember
// //             ]}
// //             onPress={() => toggleMember(item.id)}
// //           >
// //             <Text style={styles.memberText}>{item.username}</Text>
// //           </TouchableOpacity>
// //         )}
// //       />

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Number of people to split"
// //         placeholderTextColor="#888"
// //         keyboardType="numeric"
// //         value={String(splitCount)}
// //         onChangeText={text => setSplitCount(Math.max( parseInt(text) || 0))}
// //       />

// //       <Text style={styles.splitAmount}>
// //         Each person owes: ${calculateSplit().toFixed(2)}
// //       </Text>

// //       <TouchableOpacity
// //         style={styles.submitButton}
// //         onPress={handleSubmit}
// //         disabled={loading}
// //       >
// //         {loading ? (
// //           <ActivityIndicator color="white" />
// //         ) : (
// //           <Text style={styles.submitText}>Add Expense</Text>
// //         )}
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#000',
// //   },
// //   input: {
// //     backgroundColor: '#333',
// //     color: '#FFF0DC',
// //     padding: 15,
// //     borderRadius: 8,
// //     marginBottom: 15,
// //   },
// //   label: {
// //     color: '#FFF0DC',
// //     marginBottom: 10,
// //     fontSize: 16,
// //   },
// //   payerSelector: {
// //     backgroundColor: '#333',
// //     padding: 15,
// //     borderRadius: 8,
// //     marginBottom: 15,
// //   },
// //   payerText: {
// //     color: '#FFF0DC',
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#222',
// //     marginHorizontal: 20,
// //     borderRadius: 8,
// //     maxHeight: '60%',
// //   },
// //   modalItem: {
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#333',
// //   },
// //   modalItemText: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //   },
// //   memberItem: {
// //     backgroundColor: '#222',
// //     padding: 15,
// //     borderRadius: 8,
// //     marginBottom: 10,
// //   },
// //   selectedMember: {
// //     backgroundColor: '#543A14',
// //   },
// //   memberText: {
// //     color: '#FFF0DC',
// //   },
// //   splitAmount: {
// //     color: '#4CAF50',
// //     fontSize: 16,
// //     marginVertical: 10,
// //     textAlign: 'center',
// //   },
// //   submitButton: {
// //     backgroundColor: '#4CAF50',
// //     padding: 15,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 20,
// //   },
// //   submitText: {
// //     color: '#FFF0DC',
// //     fontWeight: 'bold',
// //   },
// // });

// //working
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// //   FlatList, Alert, Modal, ActivityIndicator, ScrollView 
// // } from 'react-native';
// // import { supabase } from '../lib/supabase';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';

// // export default function GroupExp({ navigation, route }) {
// //   const { groupId, members } = route.params;
// //   const [amount, setAmount] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [selectedPayer, setSelectedPayer] = useState(null);
// //   const [selectedMembers, setSelectedMembers] = useState([]);
// //   const [splitCount, setSplitCount] = useState(members.length);
// //   const [loading, setLoading] = useState(false);
// //   const [showPayerModal, setShowPayerModal] = useState(false);
// //   const [saving, setSaving] = useState(false);

// //   const toggleMember = (memberId) => {
// //     setSelectedMembers(prev => 
// //       prev.includes(memberId) 
// //         ? prev.filter(id => id !== memberId) 
// //         : [...prev, memberId]
// //     );
// //   };

// //   const calculateSplit = () => {
// //     const numericAmount = parseFloat(amount);
// //     if (isNaN(numericAmount)) return 0;
// //     return numericAmount / splitCount;
// //   };

// //   const handleSubmit = async () => {
// //     if (!amount || !selectedPayer || selectedMembers.length === 0) {
// //       Alert.alert('Error', 'Please fill all required fields');
// //       return;
// //     }
  
// //     const numericAmount = parseFloat(amount);
// //     if (isNaN(numericAmount)) {
// //       Alert.alert('Error', 'Invalid amount entered');
// //       return;
// //     }
  
// //     setSaving(true);
// //     try {
// //       const splitAmount = numericAmount / splitCount;
      
// //       // Insert directly into balances table
// //       const { error: balanceError } = await supabase
// //         .from('balances')
// //         .insert(
// //           selectedMembers
// //             .filter(memberId => memberId !== selectedPayer)
// //             .map(memberId => ({
// //               group_id: groupId,
// //               from_user_id: memberId,
// //               to_user_id: selectedPayer,
// //               amount: splitAmount,
// //               description: description || "Group Expense"
// //             }))
// //         );
  
// //       if (balanceError) throw balanceError;
  
// //       Alert.alert('Success', 'Expense added successfully');
// //       navigation.goBack();
// //     } catch (error) {
// //       console.error('Error adding expense:', error);
// //       Alert.alert('Error', error.message || 'Failed to add expense');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.scrollContainer}>
// //       <Text style={styles.header}>Add Group Expense</Text>

// //       {/* Amount Input */}
// //       <View style={styles.inputContainer}>
// //         <FontAwesome name="rupee" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter amount"
// //           placeholderTextColor="#888"
// //           keyboardType="numeric"
// //           value={amount}
// //           onChangeText={setAmount}
// //         />
// //       </View>

// //       {/* Description Input */}
// //       <View style={styles.inputContainer}>
// //         <Icon name="description" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter description"
// //           placeholderTextColor="#888"
// //           value={description}
// //           onChangeText={setDescription}
// //         />
// //       </View>

// //       {/* Paid By */}
// //       <Text style={styles.sectionTitle}>Paid By</Text>
// //       <TouchableOpacity
// //         style={styles.payerSelector}
// //         onPress={() => setShowPayerModal(true)}
// //       >
// //         <Text style={styles.payerText}>
// //           {selectedPayer 
// //             ? members.find(m => m.id === selectedPayer)?.username 
// //             : 'Select Payer'}
// //         </Text>
// //         <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
// //       </TouchableOpacity>

// //       {/* Split Between */}
// //       <Text style={styles.sectionTitle}>Split Between</Text>
// //       <FlatList
// //         data={members}
// //         keyExtractor={item => item.id}
// //         scrollEnabled={false}
// //         contentContainerStyle={styles.listContent}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={[
// //               styles.memberItem,
// //               selectedMembers.includes(item.id) && styles.selectedMember
// //             ]}
// //             onPress={() => toggleMember(item.id)}
// //           >
// //             <View style={styles.memberInfo}>
// //               <Icon 
// //                 name={selectedMembers.includes(item.id) ? "check-box" : "check-box-outline-blank"} 
// //                 size={24} 
// //                 color="#D2B48C" 
// //                 style={styles.userIcon} 
// //               />
// //               <Text style={styles.memberText}>{item.username}</Text>
// //             </View>
// //           </TouchableOpacity>
// //         )}
// //       />

// //       {/* Split Count */}
// //       <Text style={styles.sectionTitle}>Number of People to Split</Text>
// //       <View style={styles.inputContainer}>
// //         <Icon name="people" size={20} color="#D2B48C" style={styles.icon} />
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter number of people"
// //           placeholderTextColor="#888"
// //           keyboardType="numeric"
// //           value={String(splitCount)}
// //           onChangeText={text => setSplitCount(Math.max( parseInt(text) || 0))}
// //         />
// //       </View>

// //       {/* Split Amount */}
// //       <View style={styles.splitContainer}>
// //         <Text style={styles.splitLabel}>Each person owes:</Text>
// //         <Text style={styles.splitAmount}>Rs{calculateSplit().toFixed(2)}</Text>
// //       </View>

// //       {/* Submit Button */}
// //       <TouchableOpacity
// //         style={styles.submitButton}
// //         onPress={handleSubmit}
// //         disabled={saving}
// //       >
// //         {saving ? (
// //           <ActivityIndicator color="#FFF0DC" />
// //         ) : (
// //           <Text style={styles.submitText}>Add Expense</Text>
// //         )}
// //       </TouchableOpacity>

// //       {/* Payer Selection Modal */}
// //       <Modal
// //         visible={showPayerModal}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setShowPayerModal(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>Select Payer</Text>
            
// //             <FlatList
// //               data={members}
// //               keyExtractor={item => item.id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.modalOption}
// //                   onPress={() => {
// //                     setSelectedPayer(item.id);
// //                     setShowPayerModal(false);
// //                   }}
// //                 >
// //                   <Icon 
// //                     name={selectedPayer === item.id ? "radio-button-checked" : "radio-button-unchecked"} 
// //                     size={24} 
// //                     color="#D2B48C" 
// //                   />
// //                   <Text style={styles.modalOptionText}>
// //                     {item.username}
// //                   </Text>
// //                 </TouchableOpacity>
// //               )}
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

// // const styles = StyleSheet.create({
// //   scrollContainer: {
// //     padding: 20,
// //     backgroundColor: '#121212',
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
// //   payerSelector: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 15,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //     justifyContent: 'space-between',
// //   },
// //   payerText: {
// //     color: '#FFF0DC',
// //     fontSize: 15,
// //   },
// //   listContent: {
// //     paddingBottom: 20,
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
// //   splitContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#1E1E1E',
// //     borderRadius: 10,
// //     padding: 16,
// //     marginVertical: 15,
// //     borderWidth: 1,
// //     borderColor: '#543A14',
// //   },
// //   splitLabel: {
// //     color: '#FFF0DC',
// //     fontSize: 16,
// //   },
// //   splitAmount: {
// //     color: '#4CAF50',
// //     fontSize: 16,
// //     fontWeight: 'bold',
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
// //   // Modal styles
// //   modalOverlay: {
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
// // });



// //ios test
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, 
//   FlatList, Alert, Modal, ActivityIndicator, ScrollView 
// } from 'react-native';
// import { supabase } from '../lib/supabase';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// export default function GroupExp({ navigation, route }) {
//   const { groupId, members } = route.params;
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedPayer, setSelectedPayer] = useState(null);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [splitCount, setSplitCount] = useState(members.length);
//   const [loading, setLoading] = useState(false);
//   const [showPayerModal, setShowPayerModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [user, setUser] = useState(null); // Add user state

//   // Fetch current user
//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error) console.error('Error fetching user:', error);
//       setUser(user);
//     }
//     fetchUser();
//   }, []);

//   const toggleMember = (memberId) => {
//     setSelectedMembers(prev => 
//       prev.includes(memberId) 
//         ? prev.filter(id => id !== memberId) 
//         : [...prev, memberId]
//     );
//   };

//   const calculateSplit = () => {
//     const numericAmount = parseFloat(amount);
//     if (isNaN(numericAmount)) return 0;
//     return numericAmount / splitCount;
//   };

//   const handleSubmit = async () => {
//     if (!amount || !selectedPayer || selectedMembers.length === 0) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }
  
//     const numericAmount = parseFloat(amount);
//     if (isNaN(numericAmount)) {
//       Alert.alert('Error', 'Invalid amount entered');
//       return;
//     }
  
//     setSaving(true);
//     try {
//       const splitAmount = numericAmount / splitCount;
      
//       // Insert expense with creator information
//       const { error: balanceError } = await supabase
//         .from('balances')
//         .insert(
//           selectedMembers
//             .filter(memberId => memberId !== selectedPayer)
//             .map(memberId => ({
//               group_id: groupId,
//               from_user_id: memberId,
//               to_user_id: selectedPayer,
//               amount: splitAmount,
//               description: description || "Group Expense",
//               created_by: user.id // Store creator ID
//             }))
//         );
  
//       if (balanceError) throw balanceError;
  
//       Alert.alert('Success', 'Expense added successfully');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       Alert.alert('Error', error.message || 'Failed to add expense');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}>Add Group Expense</Text>

//       {/* Amount Input */}
//       {/* <View style={styles.inputContainer}>
//         <FontAwesome name="rupee" size={20} color="#D2B48C" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter amount"
//           placeholderTextColor="#888"
//           keyboardType="numeric"
//           value={amount}
//           onChangeText={setAmount}
//         />
//       </View> */}

//       <View style={styles.inputContainer}>
//               <Text style={styles.pkrIcon}>₨</Text>    
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 placeholderTextColor="#888"
//                 keyboardType="numeric"
//                 value={amount}
//                 onChangeText={setAmount}
//               />
//             </View>

//       {/* Description Input */}
//       <View style={styles.inputContainer}>
//         <Icon name="description" size={20} color="#D2B48C" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter description"
//           placeholderTextColor="#888"
//           value={description}
//           onChangeText={setDescription}
//         />
//       </View>

//       {/* Paid By */}
//       <Text style={styles.sectionTitle}>Paid By</Text>
//       <TouchableOpacity
//         style={styles.payerSelector}
//         onPress={() => setShowPayerModal(true)}
//       >
//         <Text style={styles.payerText}>
//           {selectedPayer 
//             ? members.find(m => m.id === selectedPayer)?.username 
//             : 'Select Payer'}
//         </Text>
//         <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
//       </TouchableOpacity>

//       {/* Split Between */}
//       <Text style={styles.sectionTitle}>Split Between</Text>
//       <FlatList
//         data={members}
//         keyExtractor={item => item.id}
//         scrollEnabled={false}
//         contentContainerStyle={styles.listContent}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.memberItem,
//               selectedMembers.includes(item.id) && styles.selectedMember
//             ]}
//             onPress={() => toggleMember(item.id)}
//           >
//             <View style={styles.memberInfo}>
//               <Icon 
//                 name={selectedMembers.includes(item.id) ? "check-box" : "check-box-outline-blank"} 
//                 size={24} 
//                 color="#D2B48C" 
//                 style={styles.userIcon} 
//               />
//               <Text style={styles.memberText}>{item.username}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />

//       {/* Split Count */}
//       <Text style={styles.sectionTitle}>Number of People to Split</Text>
//       <View style={styles.inputContainer}>
//         <Icon name="people" size={20} color="#D2B48C" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter number of people"
//           placeholderTextColor="#888"
//           keyboardType="numeric"
//           value={String(splitCount)}
//           onChangeText={text => setSplitCount(Math.max( parseInt(text) || 0))}
//         />
//       </View>

//       {/* Split Amount */}
//       <View style={styles.splitContainer}>
//         <Text style={styles.splitLabel}>Each person owes:</Text>
//         <Text style={styles.splitAmount}>Rs{calculateSplit().toFixed(2)}</Text>
//       </View>

//       {/* Submit Button */}
//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={handleSubmit}
//         disabled={saving}
//       >
//         {saving ? (
//           <ActivityIndicator color="#FFF0DC" />
//         ) : (
//           <Text style={styles.submitText}>Add Expense</Text>
//         )}
//       </TouchableOpacity>

//       {/* Payer Selection Modal */}
//       <Modal
//         visible={showPayerModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowPayerModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Payer</Text>
            
//             <FlatList
//               data={members}
//               keyExtractor={item => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalOption}
//                   onPress={() => {
//                     setSelectedPayer(item.id);
//                     setShowPayerModal(false);
//                   }}
//                 >
//                   <Icon 
//                     name={selectedPayer === item.id ? "radio-button-checked" : "radio-button-unchecked"} 
//                     size={24} 
//                     color="#D2B48C" 
//                   />
//                   <Text style={styles.modalOptionText}>
//                     {item.username}
//                   </Text>
//                 </TouchableOpacity>
//               )}
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
//   payerSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#543A14',
//     justifyContent: 'space-between',
//   },
//   payerText: {
//     color: '#FFF0DC',
//     fontSize: 15,
//   },
//   listContent: {
//     paddingBottom: 20,
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
//   splitContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 16,
//     marginVertical: 15,
//     borderWidth: 1,
//     borderColor: '#543A14',
//   },
//    pkrIcon: {
//     color: '#D2B48C',
//     fontSize: 20,
//     marginRight: 10,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   splitLabel: {
//     color: '#FFF0DC',
//     fontSize: 16,
//   },
//   splitAmount: {
//     color: '#4CAF50',
//     fontSize: 16,
//     fontWeight: 'bold',
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
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     width: '80%',
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
// });

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, Alert, Modal, ActivityIndicator, ScrollView 
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Icon from '../components/IconWrapper';

export default function GroupExp({ navigation, route }) {
  const { groupId, members } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitCount, setSplitCount] = useState(members.length);
  const [loading, setLoading] = useState(false);
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null); // Add user state

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Error fetching user:', error);
      setUser(user);
    }
    fetchUser();
  }, []);

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  const calculateSplit = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return 0;
    return numericAmount / splitCount;
  };

  const handleSubmit = async () => {
    if (!amount || !selectedPayer || selectedMembers.length === 0) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
  
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      Alert.alert('Error', 'Invalid amount entered');
      return;
    }
  
    setSaving(true);
    try {
      const splitAmount = numericAmount / splitCount;
      
      // Insert expense with creator information
      const { error: balanceError } = await supabase
        .from('balances')
        .insert(
          selectedMembers
            .filter(memberId => memberId !== selectedPayer)
            .map(memberId => ({
              group_id: groupId,
              from_user_id: memberId,
              to_user_id: selectedPayer,
              amount: splitAmount,
              description: description || "Group Expense",
              created_by: user.id // Store creator ID
            }))
        );
  
      if (balanceError) throw balanceError;
  
      Alert.alert('Success', 'Expense added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', error.message || 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Add Group Expense</Text>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.pkrIcon}>₨</Text>    
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Icon name="description" size={20} color="#D2B48C" style={styles.descriptionIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Paid By */}
      <Text style={styles.sectionTitle}>Paid By</Text>
      <TouchableOpacity
        style={styles.payerSelector}
        onPress={() => setShowPayerModal(true)}
      >
        <Text style={styles.payerText}>
          {selectedPayer 
            ? members.find(m => m.id === selectedPayer)?.username 
            : 'Select Payer'}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#D2B48C" />
      </TouchableOpacity>

      {/* Split Between */}
      <Text style={styles.sectionTitle}>Split Between</Text>
      <FlatList
        data={members}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.memberItem,
              selectedMembers.includes(item.id) && styles.selectedMember
            ]}
            onPress={() => toggleMember(item.id)}
          >
            <View style={styles.memberInfo}>
              <Icon 
                name={selectedMembers.includes(item.id) ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color="#D2B48C" 
                style={styles.memberIcon} 
              />
              <Text style={styles.memberText}>{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Split Count */}
      <Text style={styles.sectionTitle}>Number of People to Split</Text>
      <View style={styles.inputContainer}>
        <Icon name="people" size={20} color="#D2B48C" style={styles.peopleIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter number of people"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={String(splitCount)}
          onChangeText={text => setSplitCount(Math.max(parseInt(text) || 0))}
        />
      </View>

      {/* Split Amount */}
      <View style={styles.splitContainer}>
        <Text style={styles.splitLabel}>Each person owes:</Text>
        <Text style={styles.splitAmount}>Rs{calculateSplit().toFixed(2)}</Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF0DC" />
        ) : (
          <Text style={styles.submitText}>Add Expense</Text>
        )}
      </TouchableOpacity>

      {/* Payer Selection Modal */}
      <Modal
        visible={showPayerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPayerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payer</Text>
            
            <FlatList
              data={members}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPayer(item.id);
                    setShowPayerModal(false);
                  }}
                >
                  <Icon 
                    name={selectedPayer === item.id ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={24} 
                    color="#D2B48C" 
                  />
                  <Text style={styles.modalOptionText}>
                    {item.username}
                  </Text>
                </TouchableOpacity>
              )}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: 'black',
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
  descriptionIcon: {
    marginRight: 10,
  },
  peopleIcon: {
    marginRight: 10,
  },
  memberIcon: {
    marginRight: 12,
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
  payerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#543A14',
    justifyContent: 'space-between',
  },
  payerText: {
    color: '#FFF0DC',
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 20,
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
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 15,
    color: '#FFF0DC',
  },
  splitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#543A14',
  },
  splitLabel: {
    color: '#FFF0DC',
    fontSize: 16,
  },
  splitAmount: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#543A14',
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
});